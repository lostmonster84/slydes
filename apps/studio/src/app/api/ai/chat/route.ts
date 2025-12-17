import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import type { MomentumContext } from '../context/route'

/**
 * Momentum AI Chat API
 *
 * The brain of Momentum AI - handles conversations with full business context.
 * Three modes:
 * - Partner: Analytics, insights, orders, goals
 * - Creator: Copy generation, content suggestions
 * - Teacher: Education, tutorials, guidance
 */

const SLYDES_KNOWLEDGE_BASE = `
## How Slydes Works

Slydes is a mobile-first business presence platform. Users create "Slydes" - vertical, swipeable content experiences similar to TikTok or Instagram Stories, but for businesses.

### Key Concepts

**Home Slyde**: The main landing page for a business. Contains categories that link to individual Slydes.

**Slyde**: A single swipeable experience with multiple frames. Think of it as a mini-website in vertical format.

**Frame**: One screen within a Slyde. Users swipe up to see the next frame. Each frame can have:
- Background image or video
- Headline text
- Body text
- CTA button (call to action)

**Best Practices for Slydes:**

1. **Hook (Frame 1)**: Grab attention immediately
   - Use your best visual
   - Strong headline that creates curiosity
   - People decide to stay or leave in 2 seconds

2. **Keep it short**: 4-6 frames is ideal
   - Each frame should be scannable in 3 seconds
   - 10 words or less for headlines
   - People are swiping, not reading

3. **Strong CTA**: Make the action clear
   - Use action verbs: "Book", "Get", "Start", "Try"
   - Be specific: "Book your stay" > "Learn more"
   - Place CTA on final frame, consider repeating on Frame 3

4. **Video performs better**: When possible, use video backgrounds
   - Motion catches attention
   - Keep videos short (loop under 10 seconds)
   - Ensure auto-play works (muted by default)

5. **Mobile-first**: Everything must work on phones
   - Large tap targets
   - Readable text (16px minimum)
   - Vertical format only

### Common Issues and Fixes

**Low completion rate (<50%)**:
- Slyde might be too long - try removing frames
- Hook isn't strong enough - improve Frame 1
- Content isn't compelling - each frame needs value

**High drop-off at specific frame**:
- That frame is boring or confusing
- Consider removing or improving it
- Check if copy is too long

**Low CTA clicks**:
- CTA might be too vague ("Learn more")
- CTA might be too early (they're not convinced yet)
- Try more compelling copy

**Views but no engagement**:
- Content might not match audience expectations
- Check traffic source - are the right people seeing it?
- Consider A/B testing different hooks
`

function buildSystemPrompt(context: MomentumContext): string {
  return `You are Momentum AI, the business partner inside Slydes Studio.

## YOUR ROLE
You help ${context.organization.name} grow their business by:
- Explaining their analytics in plain English
- Generating content that matches their brand voice
- Teaching them how to use Slydes effectively
- Proactively suggesting improvements
- Celebrating wins and keeping them motivated

## YOUR PERSONALITY
- Friendly, supportive, never judgmental
- Celebrate wins, no matter how small
- Be specific - use their actual content and numbers
- Plain English - no marketing jargon
- If you don't know something, say so
- Keep responses concise but helpful

## THIS BUSINESS

**Organization**: ${context.organization.name}
**Industry**: ${context.profile.bio ? 'Based on their bio: ' + context.profile.bio : 'Not specified'}
**Plan**: ${context.organization.plan === 'pro' ? 'Pro (full access)' : 'Free tier'}
${context.profile.brandVoice ? `**Brand Voice**: ${context.profile.brandVoice}` : ''}

## THEIR SLYDES (${context.slydes.length} total)

${context.slydes.length === 0 ? 'No Slydes created yet.' : context.slydes.map(s => `
### ${s.title} (${s.published ? 'Published' : 'Draft'})
ID: ${s.publicId}
Frames: ${s.frames.length}
${s.frames.map(f => `- Frame ${f.index}: "${f.headline || '[No headline]'}"${f.ctaText ? ` | CTA: "${f.ctaText}"` : ''}`).join('\n')}
`).join('\n')}

## ANALYTICS (Last 30 days)

Total views: ${context.analytics.totalViews}
Total CTA clicks: ${context.analytics.totalClicks}
Average completion: ${context.analytics.avgCompletion}%

${context.analytics.bySlyde.length > 0 ? `
Performance by Slyde:
${context.analytics.bySlyde.map(s => `- **${s.slydeName}**: ${s.views} views, ${s.completion}% completion, ${s.ctaClicks} clicks, biggest drop at ${s.dropOffFrame} (${s.dropOffPct}%), trend: ${s.trend > 0 ? '+' : ''}${s.trend}%`).join('\n')}
` : 'No analytics data yet - they need to share their Slydes to start collecting data.'}

${context.orders ? `
## ORDERS

Pending: ${context.orders.pending}
${context.orders.pendingDetails.length > 0 ? `
Waiting to be fulfilled:
${context.orders.pendingDetails.map(o => `- ${o.customerName} (${o.customerEmail}): ${o.items} - £${o.total} - ${o.createdAt}`).join('\n')}
` : ''}
Recently fulfilled: ${context.orders.recentFulfilled}
` : ''}

${context.homeSlyde ? `
## HOME SLYDE STRUCTURE

Categories: ${context.homeSlyde.categories.length}
${context.homeSlyde.categories.map(c => `- ${c.name}: ${c.itemCount} items`).join('\n')}
Total items: ${context.homeSlyde.totalItems}
` : ''}

${context.faqs && context.faqs.length > 0 ? `
## FAQS (${context.faqs.length} total)

${context.faqs.slice(0, 5).map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}
${context.faqs.length > 5 ? `\n...and ${context.faqs.length - 5} more FAQs` : ''}
` : ''}

## WHAT YOU REMEMBER ABOUT THEM

${context.memory.brandVoice ? `Brand voice: ${context.memory.brandVoice}` : 'Brand voice: Not yet learned'}
${context.memory.goals && context.memory.goals.length > 0 ? `Goals: ${context.memory.goals.join(', ')}` : 'Goals: None set yet'}
${context.memory.notes && context.memory.notes.length > 0 ? `Notes: ${context.memory.notes.map(n => n.note).join('; ')}` : ''}

${SLYDES_KNOWLEDGE_BASE}

## RESPONSE GUIDELINES

1. **Be concise**: Get to the point quickly. Use short paragraphs.

2. **Use their data**: Reference specific Slydes, frames, and numbers.

3. **Offer actions**: When suggesting changes, be specific:
   - Instead of "improve your hook", say "Try: 'Wake up to mountain views' instead of 'Experience nature'"

4. **Teaching mode**: When they ask "what is X" or "how do I", explain clearly with examples.

5. **Creator mode**: When they ask you to write something, provide 2-3 options.

6. **Celebrate wins**: When metrics are up, acknowledge it!

7. **Be honest**: If something isn't working, tell them directly but kindly.

Remember: You're their partner in growing this business. Be helpful, specific, and encouraging.`
}

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse request
  let message: string
  let conversationId: string | undefined
  let orgSlug: string | undefined
  let history: Array<{ role: 'user' | 'assistant'; content: string }> = []

  try {
    const body = await request.json()
    message = body.message
    conversationId = body.conversationId
    orgSlug = body.org
    history = body.history || []
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    if (!orgSlug) {
      return NextResponse.json({ error: 'Organization slug is required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: 'Service unavailable', detail: (e as Error).message }, { status: 503 })
  }

  // Get organization by slug (passed from client)
  const { data: org, error: orgErr } = await admin
    .from('organizations')
    .select('id, name, slug, owner_id')
    .eq('slug', orgSlug)
    .maybeSingle()

  if (orgErr || !org) {
    return NextResponse.json({
      error: 'Organization not found',
      detail: orgErr?.message,
      slug: orgSlug
    }, { status: 404 })
  }

  // Verify user owns this org
  if (org.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Note: Free tier limit (3 messages/day) is handled client-side
  // Pro users get unlimited access

  // Fetch full context
  const contextUrl = new URL('/api/ai/context', request.url)
  contextUrl.searchParams.set('org', orgSlug)
  const contextResponse = await fetch(contextUrl.toString(), {
    headers: { cookie: request.headers.get('cookie') || '' },
  })

  if (!contextResponse.ok) {
    return NextResponse.json({ error: 'Failed to load business context' }, { status: 500 })
  }

  const { context } = await contextResponse.json() as { context: MomentumContext }

  // Build messages for Claude
  const systemPrompt = buildSystemPrompt(context)

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...history.slice(-10), // Keep last 10 messages for context
    { role: 'user', content: message },
  ]

  // Check Anthropic API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
  }

  try {
    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I encountered an issue generating a response.'

    // Save conversation to database (async, don't block response)
    saveConversation(admin, org.id as string, user.id, message, assistantMessage, conversationId).catch(console.error)

    return NextResponse.json({
      ok: true,
      response: assistantMessage,
      conversationId: conversationId || 'new',
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return NextResponse.json({
      error: 'Failed to generate response',
      detail: (err as Error).message,
    }, { status: 500 })
  }
}

async function saveConversation(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string,
  userId: string,
  userMessage: string,
  assistantMessage: string,
  existingConversationId?: string
) {
  const timestamp = new Date().toISOString()

  if (existingConversationId && existingConversationId !== 'new') {
    // Update existing conversation
    const { data: existing } = await admin
      .from('ai_conversations')
      .select('messages')
      .eq('id', existingConversationId)
      .single()

    if (existing) {
      const messages = (existing.messages as Array<unknown>) || []
      messages.push(
        { role: 'user', content: userMessage, timestamp },
        { role: 'assistant', content: assistantMessage, timestamp }
      )

      await admin
        .from('ai_conversations')
        .update({ messages })
        .eq('id', existingConversationId)
    }
  } else {
    // Create new conversation
    const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '')

    await admin
      .from('ai_conversations')
      .insert({
        organization_id: orgId,
        user_id: userId,
        title,
        messages: [
          { role: 'user', content: userMessage, timestamp },
          { role: 'assistant', content: assistantMessage, timestamp },
        ],
      })
  }
}
