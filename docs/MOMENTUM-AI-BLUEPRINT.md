# Momentum AI — The Complete Blueprint

> **"Your right-hand business partner inside Slydes"**
>
> Created: December 17, 2024
> Status: Architecture & Planning

---

## Executive Summary

Momentum AI is not a chatbot. It's a **business co-pilot** that lives inside Slydes Studio, knows everything about your business, and helps you grow. It combines three capabilities into one interface:

1. **Business Partner** — Analytics, insights, proactive alerts
2. **Content Creator** — Copy, ideas, suggestions
3. **Teacher** — Onboarding, education, guidance

**One interface. Knows your entire business. Always available.**

---

## Table of Contents

1. [The Vision](#the-vision)
2. [Core Capabilities](#core-capabilities)
3. [Data Sources & Context](#data-sources--context)
4. [System Architecture](#system-architecture)
5. [AI Modes](#ai-modes)
6. [User Interface](#user-interface)
7. [Conversation Examples](#conversation-examples)
8. [Pricing Strategy](#pricing-strategy)
9. [Technical Implementation](#technical-implementation)
10. [Rollout Plan](#rollout-plan)

---

## The Vision

### The Problem

Small business owners using Slydes face multiple challenges:
- "I don't know what's working"
- "I don't know how to improve"
- "I don't have time to learn marketing"
- "I can't afford a marketing consultant"
- "I'm stuck and don't know what to do next"

### The Solution

Momentum AI is their **always-on business partner** that:
- Knows their entire business (profile, content, analytics, orders)
- Proactively surfaces what needs attention
- Generates content that matches their brand voice
- Teaches them best practices without feeling like homework
- Celebrates wins and keeps them motivated

### The Feeling

When a user talks to Momentum AI, they should feel like they're talking to:
- A smart marketing friend who knows their business inside out
- Someone who's always got their back
- A partner who's invested in their success
- A teacher who never judges and always helps

**Not a robot. Not generic AI. A partner who KNOWS them.**

---

## Core Capabilities

### 1. Business Intelligence (Partner Mode)

**What it does:**
- Surfaces analytics insights in plain English
- Identifies problems before they become critical
- Tracks progress toward goals
- Manages orders and tasks
- Compares performance over time

**Example interactions:**
```
User: "How's my week?"

Momentum AI: "Good week! 234 views across all Slydes, up 12%
from last week. Your Camping slyde is killing it — 89 views
and 7 CTA clicks.

One thing: your Just Drive slyde dropped 15%. Looks like the
new Frame 2 isn't landing. The old version had 62% completion,
now it's 47%. Want to try reverting?

Also, you have 2 orders from yesterday that need fulfilling."
```

**Capabilities:**
- [ ] Daily/weekly performance summaries
- [ ] Trend detection (up/down patterns)
- [ ] Problem identification (drops, issues)
- [ ] Order and task management
- [ ] Goal tracking and accountability
- [ ] Proactive alerts (without being asked)

---

### 2. Content Creation (Creator Mode)

**What it does:**
- Generates copy that matches their brand voice
- Suggests improvements to existing content
- Creates full Slyde drafts from prompts
- Optimizes CTAs for conversion
- Provides photo/video guidance

**Example interactions:**
```
User: "Write me a better headline for Frame 1 of Camping"

Momentum AI: "Your current headline is 'Experience Nature Like
Never Before' — it's a bit generic.

Based on your audience (couples seeking adventure) and what
performs well in your industry, here are 3 options:

1. 'Wake up to mountain views. Just the two of you.'
2. 'No wifi. No worries. No one around for miles.'
3. 'Your morning coffee view: endless peaks.'

Option 1 is my top pick — it's specific and romantic.

[Apply to Frame 1] [Show more options]"
```

**Capabilities:**
- [ ] Headline and copy generation
- [ ] CTA optimization
- [ ] Full Slyde drafts from prompts
- [ ] A/B test suggestions
- [ ] Brand voice learning and matching
- [ ] Industry-specific best practices
- [ ] Photo/video feedback and suggestions

---

### 3. Education & Guidance (Teacher Mode)

**What it does:**
- Explains Slydes concepts in simple terms
- Provides interactive tutorials
- Shows contextual help when stuck
- Walks through tasks step-by-step
- Answers "how do I...?" questions

**Example interactions:**
```
User: "What's a good hook?"

Momentum AI: "A hook is Frame 1 — the first thing people see.
You have about 2 seconds to grab attention before they swipe
away.

**Great hooks usually:**
- Show your best visual (the view, the product, the result)
- Create curiosity ('What happens next?')
- Promise value ('Save 50%', 'In 3 easy steps')

**For adventure rentals like yours, top hooks are:**
- The stunning view they'll wake up to
- Someone actually IN the experience
- A surprising/unexpected shot

Your Camping slyde uses a static landscape — try a shot with
people in it. Want me to show you examples that work?"
```

**Capabilities:**
- [ ] Concept explanations (frames, slydes, CTAs, etc.)
- [ ] Interactive tutorials with visual guidance
- [ ] Contextual help (detects when stuck)
- [ ] Step-by-step walkthroughs
- [ ] Best practices by industry
- [ ] Example galleries
- [ ] Video tutorials (future)

---

### 4. Proactive Intelligence

**What it does:**
- Doesn't wait to be asked — surfaces important info
- Daily pulse when they open the app
- Alerts on significant changes
- Reminds about unfulfilled tasks
- Celebrates wins

**Example proactive messages:**
```
[On app open]
"Good morning! Quick pulse: 47 views yesterday, your Camping
slyde had its best day ever (23 views). You have 1 order to
fulfil from last night. Ready to crush it today?"

[Detecting a problem]
"Heads up: Your Just Drive completion rate dropped from 62%
to 41% since you edited Frame 2 yesterday. Might be worth
reverting. Want me to show you the comparison?"

[Celebrating a win]
"🎉 Your Camping slyde just hit 500 views! That's a milestone.
Based on its performance, you should create more camping
content. Want me to draft a 'Glamping' slyde?"

[Reminder]
"You mentioned you wanted to focus on email signups this week.
You've had 12 views on your signup CTA but 0 clicks. The copy
might be the issue — want me to suggest alternatives?"
```

**Capabilities:**
- [ ] Daily pulse on app open
- [ ] Significant change alerts
- [ ] Unfulfilled order reminders
- [ ] Win celebrations
- [ ] Goal check-ins
- [ ] Scheduled reminders

---

## Data Sources & Context

### What Momentum AI Knows About Each Business

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOMENTUM AI CONTEXT                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │    ORGANIZATION     │    │       PROFILE       │            │
│  ├─────────────────────┤    ├─────────────────────┤            │
│  │ • Name              │    │ • Bio/About         │            │
│  │ • Industry          │    │ • Brand voice       │            │
│  │ • Domain            │    │ • Contact info      │            │
│  │ • Created date      │    │ • Social links      │            │
│  │ • Plan (Free/Pro)   │    │ • Location          │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │       SLYDES        │    │       FRAMES        │            │
│  ├─────────────────────┤    ├─────────────────────┤            │
│  │ • All slydes        │    │ • All frame content │            │
│  │ • Titles            │    │ • Headlines         │            │
│  │ • Descriptions      │    │ • Body copy         │            │
│  │ • Published status  │    │ • CTA text/links    │            │
│  │ • Created/updated   │    │ • Media (images)    │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │     ANALYTICS       │    │       ORDERS        │            │
│  ├─────────────────────┤    ├─────────────────────┤            │
│  │ • Views per slyde   │    │ • Pending orders    │            │
│  │ • Completion rates  │    │ • Order history     │            │
│  │ • CTA clicks        │    │ • Customer info     │            │
│  │ • Drop-off frames   │    │ • Fulfillment status│            │
│  │ • Traffic sources   │    │ • Revenue (if shop) │            │
│  │ • Trends over time  │    └─────────────────────┘            │
│  └─────────────────────┘                                       │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │    HOME SLYDE       │    │     KNOWLEDGE       │            │
│  ├─────────────────────┤    ├─────────────────────┤            │
│  │ • Categories        │    │ • FAQs              │            │
│  │ • Items per category│    │ • Products/Services │            │
│  │ • Pricing           │    │ • Business hours    │            │
│  │ • Inventory         │    │ • Policies          │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │      MEMORY         │    │     SLYDES KB       │            │
│  ├─────────────────────┤    ├─────────────────────┤            │
│  │ • Past conversations│    │ • How Slydes works  │            │
│  │ • User preferences  │    │ • Best practices    │            │
│  │ • Stated goals      │    │ • Feature docs      │            │
│  │ • Brand voice notes │    │ • Industry tips     │            │
│  │ • Reminders set     │    │ • Tutorial content  │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Context Gathering API

```typescript
// /api/ai/context — Gathers all business context for AI

interface MomentumContext {
  // Organization
  organization: {
    id: string
    name: string
    slug: string
    industry?: string
    plan: 'free' | 'pro'
    createdAt: string
  }

  // Profile
  profile: {
    bio?: string
    location?: string
    contactEmail?: string
    socialLinks?: Record<string, string>
    brandVoice?: string // Learned over time
  }

  // Content
  slydes: Array<{
    id: string
    publicId: string
    title: string
    published: boolean
    frames: Array<{
      index: number
      headline?: string
      body?: string
      ctaText?: string
      ctaLink?: string
      templateType: string
    }>
  }>

  // Analytics (last 30 days)
  analytics: {
    totalViews: number
    totalClicks: number
    avgCompletion: number
    bySlyde: Array<{
      slydeId: string
      views: number
      completion: number
      ctaClicks: number
      dropOffFrame: string
      trend: number // % change
    }>
    recentChanges: Array<{
      slydeId: string
      what: string
      when: string
      impactOnMetrics?: string
    }>
  }

  // Orders (if shop enabled)
  orders?: {
    pending: number
    pendingDetails: Array<{
      id: string
      customerName: string
      items: string[]
      total: number
      createdAt: string
    }>
    recentFulfilled: number
  }

  // Home Slyde structure
  homeSlyde?: {
    categories: Array<{
      name: string
      itemCount: number
    }>
    totalItems: number
  }

  // FAQs
  faqs?: Array<{
    question: string
    answer: string
  }>

  // Memory (persisted preferences)
  memory: {
    brandVoice?: string
    goals?: string[]
    preferences?: Record<string, string>
    lastConversation?: string
  }
}
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Chat Interface                         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  [Momentum AI thinking...]                         │  │  │
│  │  │                                                    │  │  │
│  │  │  "Your Camping slyde is doing great! 89 views     │  │  │
│  │  │  this week, up 23% from last week..."             │  │  │
│  │  │                                                    │  │  │
│  │  │  [Apply suggestion] [Show me more]                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ Type a message...                          [Send] │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  Quick actions: [How's my week?] [Help me write copy]   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Studio)                         │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │  /api/ai/chat       │    │  /api/ai/context    │            │
│  │                     │    │                     │            │
│  │  • Handles messages │    │  • Gathers all      │            │
│  │  • Manages session  │    │    business data    │            │
│  │  • Streams response │    │  • Builds context   │            │
│  └──────────┬──────────┘    └──────────┬──────────┘            │
│             │                          │                        │
│             └────────────┬─────────────┘                        │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Context Builder                         │  │
│  │                                                          │  │
│  │  Combines: Organization + Profile + Slydes + Analytics   │  │
│  │           + Orders + FAQs + Memory + Slydes KB          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLAUDE API                                 │
│                                                                 │
│  Model: claude-sonnet-4-20250514 (or claude-3-5-sonnet)        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    System Prompt                          │  │
│  │                                                          │  │
│  │  You are Momentum AI, a business partner inside Slydes.  │  │
│  │                                                          │  │
│  │  BUSINESS CONTEXT:                                       │  │
│  │  {organization details}                                  │  │
│  │  {all slydes and frames}                                │  │
│  │  {analytics data}                                        │  │
│  │  {orders if any}                                         │  │
│  │  {user memory/preferences}                               │  │
│  │                                                          │  │
│  │  SLYDES KNOWLEDGE BASE:                                  │  │
│  │  {how slydes works}                                      │  │
│  │  {best practices}                                        │  │
│  │  {feature documentation}                                 │  │
│  │                                                          │  │
│  │  PERSONALITY:                                            │  │
│  │  - Friendly, supportive, never judgmental               │  │
│  │  - Proactive with suggestions                           │  │
│  │  - Celebrates wins                                       │  │
│  │  - Speaks in plain English, not jargon                  │  │
│  │  - Remembers past conversations                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (Supabase)                      │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │organizations│ │  slydes  │ │  frames   │ │ analytics │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │  orders   │ │   faqs    │ │   lists   │ │ai_memory  │       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Modes

Momentum AI automatically detects what mode to use based on the query:

### Mode Detection Logic

```typescript
function detectMode(message: string): 'partner' | 'creator' | 'teacher' {
  const lowered = message.toLowerCase()

  // Teacher mode triggers
  if (
    lowered.includes('what is') ||
    lowered.includes('how do i') ||
    lowered.includes('how does') ||
    lowered.includes('show me how') ||
    lowered.includes('explain') ||
    lowered.includes('teach me') ||
    lowered.includes('tutorial')
  ) {
    return 'teacher'
  }

  // Creator mode triggers
  if (
    lowered.includes('write') ||
    lowered.includes('create') ||
    lowered.includes('draft') ||
    lowered.includes('suggest copy') ||
    lowered.includes('headline') ||
    lowered.includes('improve this') ||
    lowered.includes('make it better')
  ) {
    return 'creator'
  }

  // Default to partner mode
  return 'partner'
}
```

### Mode-Specific Behaviors

| Mode | Tone | Actions | Examples |
|------|------|---------|----------|
| **Partner** | Supportive consultant | Show data, surface issues, suggest actions | "How's my week?", "What should I focus on?" |
| **Creator** | Creative collaborator | Generate content, offer alternatives, apply changes | "Write me a headline", "Improve this copy" |
| **Teacher** | Patient guide | Explain concepts, show examples, walk through | "What's a CTA?", "How do I add a frame?" |

---

## User Interface

### Primary UI: Chat Panel

The chat interface slides out from the right side of the Dashboard (or any page in Studio).

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              STUDIO                                      │
├──────────────────────────────────────────────┬───────────────────────────┤
│                                              │                           │
│                                              │    ASK MOMENTUM           │
│                                              │    ─────────────          │
│         [Dashboard / Editor / etc]           │                           │
│                                              │    [Avatar] Momentum AI   │
│                                              │                           │
│                                              │    "Good morning! Your    │
│                                              │    Camping slyde is up    │
│                                              │    12% this week. You     │
│                                              │    have 2 orders to       │
│                                              │    fulfil.                │
│                                              │                           │
│                                              │    What would you like    │
│                                              │    to work on today?"     │
│                                              │                           │
│                                              │    ───────────────────    │
│                                              │                           │
│                                              │    [You]                  │
│                                              │    "Help me write better  │
│                                              │    copy for Frame 3"      │
│                                              │                           │
│                                              │    ───────────────────    │
│                                              │                           │
│                                              │    [Momentum AI]          │
│                                              │    "Sure! Your current    │
│                                              │    copy is..."            │
│                                              │                           │
│                                              │    [Apply] [Alternatives] │
│                                              │                           │
│                                              ├───────────────────────────┤
│                                              │ ┌───────────────────────┐ │
│                                              │ │ Type a message...     │ │
│                                              │ └───────────────────────┘ │
│                                              │                           │
│                                              │ [📎] [🎤] [Send]          │
│                                              │                           │
├──────────────────────────────────────────────┴───────────────────────────┤
│  [Momentum] [Studio] [Slydes] [Analytics] [Settings]                     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Trigger: Chat Bubble

Always visible in bottom-right corner:

```
                                        ┌─────────────────┐
                                        │  💬 Ask Momentum │
                                        │      ●          │  <- Blue dot = new message
                                        └─────────────────┘
```

### Quick Actions

Pre-filled prompts for common tasks:

```
┌─────────────────────────────────────────────────────────────┐
│  Quick actions                                              │
│                                                             │
│  [How's my week?]  [Help me write copy]  [Show my orders]  │
│                                                             │
│  [What should I focus on?]  [Teach me about hooks]         │
└─────────────────────────────────────────────────────────────┘
```

### Action Buttons in Responses

AI responses can include actionable buttons:

```
┌─────────────────────────────────────────────────────────────┐
│  Here's a better headline for Frame 3:                      │
│                                                             │
│  "Wake up to mountain views. Just the two of you."         │
│                                                             │
│  [✓ Apply to Frame 3]  [↻ Show alternatives]  [✎ Edit]     │
└─────────────────────────────────────────────────────────────┘
```

### Proactive Daily Pulse

On app open (once per day):

```
┌─────────────────────────────────────────────────────────────┐
│  ☀️ Good morning!                                           │
│                                                             │
│  Quick pulse:                                               │
│  • 47 views yesterday (↑ 12%)                              │
│  • 3 CTA clicks                                            │
│  • 2 orders to fulfil                                       │
│                                                             │
│  Your Camping slyde had its best day ever! 🎉              │
│                                                             │
│  [See details]  [Let's improve something]  [Dismiss]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Conversation Examples

### Example 1: Weekly Check-in

```
User: How's my week?

Momentum AI: Good week overall! Here's the rundown:

📊 Views: 234 total (↑ 12% from last week)
✅ Completion: 58% average (↑ 3%)
🎯 CTA clicks: 14 (↓ 2 from last week)
📦 Orders: 3 new, 1 still pending

Top performer: Camping (89 views, 67% completion)
Needs attention: Just Drive (dropped 15% since Frame 2 edit)

Your Camping slyde is crushing it. The Just Drive drop is
probably that Frame 2 change — want to compare before/after?
```

### Example 2: Content Help

```
User: Help me write a better headline for my Camping slyde

Momentum AI: Let's make that hook irresistible!

Your current headline: "Experience Nature Like Never Before"

This is pretty generic — doesn't tell people what makes YOUR
camping experience special. Based on your photos (mountain
views, couples, cozy setup), here are options:

1. "Wake up to mountain views. Just the two of you."
   → Personal, romantic, specific

2. "No wifi. No worries. No one around for miles."
   → Appeals to escape/disconnect desire

3. "Your morning coffee view: endless peaks."
   → Sensory, creates mental image

My pick: #1 — it's specific to your offering and speaks
directly to couples.

[Apply #1] [Apply #2] [Apply #3] [More options]
```

### Example 3: Teaching

```
User: What makes a good CTA?

Momentum AI: Great question! A CTA (Call to Action) is the
button that tells people what to do next.

Good CTAs have 3 things:

1. **Action verb first**: Start with what they'll DO
   ✓ "Book your adventure"
   ✗ "Click here"

2. **Specific outcome**: What they get
   ✓ "Get your free guide"
   ✗ "Submit"

3. **Urgency (optional)**: Why now
   ✓ "Book now — only 3 spots left"
   ✓ "Start your free trial"

For your Camping slyde, your CTA is "Learn More" — that's
pretty weak. Try:

• "Book your escape"
• "Check availability"
• "See what's included"

Want me to update it?
```

### Example 4: Proactive Alert

```
[Momentum AI initiates — user didn't ask]

Momentum AI: Hey! Quick heads up 👋

Your Just Drive slyde completion dropped from 62% to 41%
since you edited Frame 2 yesterday.

Before: "Hit the road. No destination needed."
After: "Explore the Scottish Highlands by 4x4"

The new version is more descriptive but less emotional.
People seem to respond better to the feeling of freedom.

Options:
• [Revert to original]
• [Try a hybrid: "Hit the road. The Highlands are waiting."]
• [Keep current — I'll check again in a few days]
```

### Example 5: Order Management

```
User: What orders do I have?

Momentum AI: You have 2 orders waiting:

1. **Sarah M.** — Camping experience (2 nights)
   Ordered: Yesterday at 3:42pm
   Dates: Dec 20-22
   Total: £340
   → [Mark fulfilled] [Email customer]

2. **James K.** — Day hire (Just Drive)
   Ordered: 2 days ago
   Date: Dec 18
   Total: £180
   → [Mark fulfilled] [Email customer]

Sarah's booking is coming up in 3 days — might want to
send a confirmation with details.

Want me to draft a confirmation email?
```

### Example 6: Goal Tracking

```
User: How am I doing on my goals?

Momentum AI: Let's check your December goals:

🎯 100 bookings this month
   Progress: 34 / 100 (34%)
   Pace needed: 5.5/day
   Current pace: 2.8/day
   Status: ⚠️ Behind — need to boost

🎯 Launch Glamping slyde
   Status: ✅ Done! (Launched Dec 12)

🎯 60% avg completion rate
   Progress: 58% (↑ from 52% last month)
   Status: 🔥 Almost there!

For the bookings goal, you're about 2x behind pace. Ideas:
• Your Camping slyde converts well — share it more
• Your CTA click rate is low — let's optimize CTAs
• Consider a limited-time offer to create urgency

Want to brainstorm a December push?
```

---

## Pricing Strategy

### The Decision: Pro Only

**Momentum AI is a Pro-tier exclusive feature.**

Why:
1. **Cost** — AI API calls cost money; needs to be on a paid tier
2. **Value** — This is THE feature that makes Pro worth it
3. **Differentiation** — Free tier gets math-based Momentum, Pro gets AI partner
4. **Retention** — Once they use Momentum AI, they can't go back

### Tier Comparison

| Feature | Free | Pro (£19/mo) |
|---------|------|--------------|
| **Momentum Dashboard** | ✓ | ✓ |
| Math-based insights | ✓ | ✓ |
| "Frame 3 is dropping" | ✓ | ✓ |
| Basic coaching tips | ✓ | ✓ |
| **Momentum AI** | ✗ | ✓ |
| AI chat partner | ✗ | ✓ |
| Content generation | ✗ | ✓ |
| Proactive alerts | ✗ | ✓ |
| Order management AI | ✗ | ✓ |
| Teaching/tutorials | ✗ | ✓ |
| Business memory | ✗ | ✓ |
| One-click actions | ✗ | ✓ |

### Free Tier Teaser

Free users see Momentum AI but can't use it:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💬 Ask Momentum                                            │
│                                                             │
│  [Blurred chat preview]                                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │   Momentum AI                                         │ │
│  │   Your AI business partner                            │ │
│  │                                                       │ │
│  │   • Get personalized content suggestions              │ │
│  │   • Understand your analytics in plain English        │ │
│  │   • Learn best practices with guided tutorials        │ │
│  │   • One-click improvements to your Slydes             │ │
│  │                                                       │ │
│  │   [🚀 Upgrade to Pro — £19/month]                     │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Usage Limits (if needed)

If costs become an issue, consider:
- 50 AI messages per month on Pro
- Unlimited on a higher tier
- Per-message pricing for overages

For now: **Unlimited on Pro** (monitor costs, adjust later)

---

## Technical Implementation

### Database Schema Additions

```sql
-- AI conversation memory
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Store last N messages for context window
);

-- AI memory (persistent preferences)
CREATE TABLE ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) UNIQUE,
  brand_voice TEXT,
  goals JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI action log (for one-click actions)
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  action_type TEXT NOT NULL, -- 'apply_copy', 'revert_frame', etc.
  target_type TEXT NOT NULL, -- 'frame', 'slyde', etc.
  target_id UUID NOT NULL,
  before_value JSONB,
  after_value JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### API Endpoints

```typescript
// /api/ai/context
// Gathers all business context
GET /api/ai/context
→ Returns: MomentumContext (full business data)

// /api/ai/chat
// Main chat endpoint
POST /api/ai/chat
Body: { message: string, conversationId?: string }
→ Returns: { response: string, actions?: Action[], conversationId: string }

// /api/ai/action
// Execute one-click actions
POST /api/ai/action
Body: { actionType: string, targetType: string, targetId: string, value: any }
→ Returns: { success: boolean, before: any, after: any }

// /api/ai/memory
// Update persistent memory
POST /api/ai/memory
Body: { brandVoice?: string, goals?: string[], preferences?: Record<string, any> }
→ Returns: { success: boolean }

// /api/ai/pulse
// Get daily pulse summary
GET /api/ai/pulse
→ Returns: { summary: string, highlights: string[], actions: Action[] }
```

### System Prompt Structure

```typescript
const buildSystemPrompt = (context: MomentumContext) => `
You are Momentum AI, a business partner inside Slydes Studio.

## YOUR ROLE
You help ${context.organization.name} grow their business by:
- Explaining analytics in plain English
- Generating content that matches their brand
- Teaching them how to use Slydes effectively
- Proactively suggesting improvements
- Celebrating wins and keeping them motivated

## THIS BUSINESS
Name: ${context.organization.name}
Industry: ${context.profile.industry || 'Not specified'}
Plan: ${context.organization.plan}
Bio: ${context.profile.bio || 'Not set'}

## THEIR SLYDES
${context.slydes.map(s => `
### ${s.title} (${s.published ? 'Published' : 'Draft'})
${s.frames.map((f, i) => `
Frame ${i + 1}: ${f.headline || '[No headline]'}
${f.body || ''}
CTA: ${f.ctaText || '[No CTA]'} → ${f.ctaLink || '[No link]'}
`).join('\n')}
`).join('\n')}

## ANALYTICS (Last 30 days)
Total views: ${context.analytics.totalViews}
Total CTA clicks: ${context.analytics.totalClicks}
Avg completion: ${context.analytics.avgCompletion}%

By Slyde:
${context.analytics.bySlyde.map(s => `
- ${s.slydeId}: ${s.views} views, ${s.completion}% completion, ${s.ctaClicks} clicks, drop at ${s.dropOffFrame} (${s.trend > 0 ? '+' : ''}${s.trend}%)
`).join('')}

${context.orders ? `
## ORDERS
Pending: ${context.orders.pending}
${context.orders.pendingDetails.map(o => `
- ${o.customerName}: ${o.items.join(', ')} (£${o.total}) - ${o.createdAt}
`).join('')}
` : ''}

## MEMORY (What you remember about them)
Brand voice: ${context.memory.brandVoice || 'Not yet learned'}
Goals: ${context.memory.goals?.join(', ') || 'None set'}
Preferences: ${JSON.stringify(context.memory.preferences || {})}

## SLYDES KNOWLEDGE BASE
[Include relevant documentation about how Slydes works, best practices, etc.]

## YOUR PERSONALITY
- Friendly and supportive, never judgmental
- Celebrate wins, no matter how small
- Be specific — use their actual content and numbers
- Proactive — suggest things before they ask
- Plain English — no marketing jargon
- Remember past conversations and preferences
- If you don't know something, say so

## ACTIONS YOU CAN TAKE
When suggesting changes, you can offer action buttons:
- [Apply to Frame X] — Update copy/CTA
- [Revert] — Undo a recent change
- [Show alternatives] — Generate more options
- [Mark fulfilled] — Complete an order

Format these as: [action_type:target:value]
Example: [apply_copy:frame_123:New headline here]
`
```

---

## Rollout Plan

### Phase 1: Foundation (Week 1-2)
- [ ] Create `/api/ai/context` endpoint
- [ ] Create `/api/ai/chat` endpoint
- [ ] Build basic chat UI component
- [ ] Implement Pro tier gating
- [ ] Write system prompt v1

### Phase 2: Core Features (Week 3-4)
- [ ] Partner mode (analytics insights)
- [ ] Creator mode (copy generation)
- [ ] Teacher mode (education/tutorials)
- [ ] Action buttons (apply changes)
- [ ] Conversation history

### Phase 3: Memory & Proactive (Week 5-6)
- [ ] Business memory system
- [ ] Daily pulse feature
- [ ] Proactive alerts
- [ ] Goal tracking

### Phase 4: Polish & Launch (Week 7-8)
- [ ] UI refinement
- [ ] Response quality tuning
- [ ] Usage analytics
- [ ] Documentation
- [ ] Beta testing with select users

---

## Success Metrics

How we know Momentum AI is working:

### Engagement
- % of Pro users who use Momentum AI weekly
- Messages per user per week
- Session duration with AI

### Value
- Actions taken from AI suggestions
- Content changes applied
- Orders fulfilled via AI

### Retention
- Churn rate: Pro users with AI vs without
- Upgrade rate: Free users who upgrade after seeing AI teaser

### Quality
- User satisfaction (thumbs up/down on responses)
- Suggestion acceptance rate
- Revert rate (did they undo AI changes?)

---

## Open Questions

1. **Conversation history** — How long do we keep it? Full history vs last N messages?

2. **Action safety** — What actions can AI take directly vs require confirmation?

3. **Multi-language** — Do we need to support non-English businesses?

4. **Voice input** — Priority for v1 or future?

5. **Cost management** — Do we need usage caps on Pro?

6. **Aggregate insights** — Can we use anonymized data to provide industry benchmarks?

---

## Conclusion

Momentum AI transforms Slydes from a tool into a **partner**.

It's not about features — it's about the feeling:

> "I have someone in my corner who knows my business and helps me grow."

That's worth paying for. That's worth staying for.

**Let's build it.** 🚀

---

*Document created: December 17, 2024*
*Status: Ready for implementation*
