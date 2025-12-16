import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [storedPassword, timestamp] = decoded.split('-')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || storedPassword !== adminPassword) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

async function gatherAdminContext(): Promise<string> {
  const supabase = createSupabaseAdmin()
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(thisWeekStart.getDate() - 7)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Fetch all data in parallel
  const [
    profilesResult,
    orgsResult,
    slydesResult,
    waitlistResult,
  ] = await Promise.all([
    supabase.from('profiles').select('id, email, plan, subscription_status, created_at').order('created_at', { ascending: false }),
    supabase.from('organizations').select('id, name, slug, business_type, owner_id, created_at'),
    supabase.from('slydes').select('id, organization_id, published, created_at'),
    supabase.from('waitlist').select('id, email, created_at'),
  ])

  const profiles = profilesResult.data || []
  const orgs = orgsResult.data || []
  const slydes = slydesResult.data || []
  const waitlist = waitlistResult.data || []

  // Calculate metrics
  const proUsers = profiles.filter(p => p.plan === 'pro').length
  const creatorUsers = profiles.filter(p => p.plan === 'creator').length
  const freeUsers = profiles.filter(p => !p.plan || p.plan === 'free').length
  const mrr = (proUsers * 50) + (creatorUsers * 25)

  const newCustomersThisMonth = profiles.filter(p => new Date(p.created_at) >= thisMonthStart).length
  const newCustomersThisWeek = profiles.filter(p => new Date(p.created_at) >= thisWeekStart).length
  const newOrgsThisMonth = orgs.filter(o => new Date(o.created_at) >= thisMonthStart).length

  const publishedSlydes = slydes.filter(s => s.published).length
  const waitlistThisWeek = waitlist.filter(w => new Date(w.created_at) >= thisWeekStart).length
  const waitlistToday = waitlist.filter(w => new Date(w.created_at) >= todayStart).length

  // Get owner emails for orgs
  const ownerIds = [...new Set(orgs.map(o => o.owner_id))]
  const { data: ownerProfiles } = await supabase.from('profiles').select('id, email').in('id', ownerIds)
  const emailById = new Map((ownerProfiles || []).map(p => [p.id, p.email]))

  const context = `
Current date/time: ${now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}

=== CUSTOMERS ===
Total customers: ${profiles.length}
- Pro tier (£50/mo): ${proUsers}
- Creator tier (£25/mo): ${creatorUsers}
- Free tier: ${freeUsers}

New this month: ${newCustomersThisMonth}
New this week: ${newCustomersThisWeek}

Recent signups:
${profiles.slice(0, 5).map(u =>
  `- ${u.email} (${u.plan || 'free'}) - ${new Date(u.created_at).toLocaleDateString('en-GB')}`
).join('\n') || 'No recent signups'}

=== REVENUE ===
MRR: £${mrr}
ARR: £${mrr * 12}
Paying customers: ${proUsers + creatorUsers}

=== ORGANIZATIONS ===
Total organizations: ${orgs.length}
New this month: ${newOrgsThisMonth}

Organization list:
${orgs.slice(0, 10).map(o => {
  const orgSlydes = slydes.filter(s => s.organization_id === o.id)
  const published = orgSlydes.filter(s => s.published).length
  return `- ${o.name} (${o.slug}.slydes.io) - ${o.business_type || 'other'} - ${orgSlydes.length} slydes (${published} published) - Owner: ${emailById.get(o.owner_id) || 'Unknown'}`
}).join('\n') || 'No organizations'}

=== CONTENT ===
Total Slydes: ${slydes.length}
Published Slydes: ${publishedSlydes}

=== WAITLIST ===
Total on waitlist: ${waitlist.length}
New this week: ${waitlistThisWeek}
New today: ${waitlistToday}
`.trim()

  return context
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
  }

  let message: string
  try {
    const body = await request.json()
    message = body.message
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    // Gather all admin context
    const adminContext = await gatherAdminContext()

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are the AI assistant for Slydes HQ - James's admin dashboard for his SaaS business Slydes.io.

Slydes is a B2B platform that helps businesses create mobile-first, TikTok-style vertical scrolling websites. Think "Linktree meets TikTok for businesses."

Your role:
- Answer questions about the business data provided
- Give insights and recommendations based on the metrics
- Be concise but helpful - James is busy
- Use a friendly, professional tone
- When discussing money, use £ (GBP)
- If asked about something not in the data, say so honestly

Key context:
- This is early stage - just launched, building initial traction
- Goal: 100 paying customers in first 3 months
- Pricing: Free tier, Creator £25/mo, Pro £50/mo
- James is the founder and sole operator

Here's the current state of the business:

${adminContext}`,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const textContent = response.content.find(block => block.type === 'text')
    const reply = textContent && 'text' in textContent ? textContent.text : 'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
