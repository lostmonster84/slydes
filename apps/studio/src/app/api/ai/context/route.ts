import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * Momentum AI Context API
 *
 * Gathers all business data for the AI to use as context:
 * - Organization profile
 * - All Slydes and Frames
 * - Analytics data
 * - Orders
 * - FAQs
 * - Home Slyde structure
 * - AI Memory (learned preferences)
 */

export interface MomentumContext {
  organization: {
    id: string
    name: string
    slug: string
    industry?: string
    plan: 'free' | 'pro'
    createdAt: string
  }
  profile: {
    bio?: string
    location?: string
    contactEmail?: string
    socialLinks?: Record<string, string>
    brandVoice?: string
  }
  slydes: Array<{
    id: string
    publicId: string
    title: string
    description?: string
    published: boolean
    createdAt: string
    updatedAt: string
    frames: Array<{
      id: string
      index: number
      headline?: string
      body?: string
      ctaText?: string
      ctaLink?: string
      templateType?: string
    }>
  }>
  analytics: {
    totalViews: number
    totalClicks: number
    avgCompletion: number
    bySlyde: Array<{
      slydeId: string
      slydeName: string
      views: number
      completion: number
      ctaClicks: number
      dropOffFrame: string
      dropOffPct: number
      trend: number
    }>
  }
  orders?: {
    pending: number
    pendingDetails: Array<{
      id: string
      customerName: string
      customerEmail: string
      items: string
      total: number
      createdAt: string
    }>
    recentFulfilled: number
  }
  homeSlyde?: {
    categories: Array<{
      id: string
      name: string
      itemCount: number
    }>
    totalItems: number
  }
  faqs?: Array<{
    id: string
    question: string
    answer: string
  }>
  memory: {
    brandVoice?: string
    goals?: string[]
    preferences?: Record<string, unknown>
    notes?: Array<{ date: string; note: string }>
  }
}

export async function GET(request: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get org slug from query param
  const { searchParams } = new URL(request.url)
  const orgSlug = searchParams.get('org')

  if (!orgSlug) {
    return NextResponse.json({ error: 'Organization slug is required' }, { status: 400 })
  }

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: 'Service unavailable', detail: (e as Error).message }, { status: 503 })
  }

  // Get organization by slug
  const { data: org, error: orgErr } = await admin
    .from('organizations')
    .select('*')
    .eq('slug', orgSlug)
    .maybeSingle()

  if (orgErr || !org) {
    return NextResponse.json({ error: 'Organization not found', slug: orgSlug }, { status: 404 })
  }

  // Verify user owns this org
  if (org.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orgId = org.id as string

  // Determine plan (check subscription)
  // Note: stripe_subscription_id column may not exist yet - default to free
  let plan: 'free' | 'pro' = 'free'
  const orgRecord = org as Record<string, unknown>
  if (orgRecord.stripe_subscription_id && orgRecord.subscription_status === 'active') {
    plan = 'pro'
  }

  // Fetch all data in parallel for speed
  const [
    slydesResult,
    framesResult,
    analyticsResult,
    ordersResult,
    faqsResult,
    listsResult,
    memoryResult,
  ] = await Promise.all([
    // Slydes
    admin
      .from('slydes')
      .select('id, public_id, title, description, published, created_at, updated_at')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false }),

    // Frames
    admin
      .from('frames')
      .select('id, slyde_id, frame_index, title, body, cta_text, cta_link, template_type')
      .eq('organization_id', orgId)
      .order('frame_index', { ascending: true }),

    // Analytics (last 30 days)
    fetchAnalytics(admin, orgId),

    // Orders
    admin
      .from('orders')
      .select('id, customer_name, customer_email, items, total_amount, status, created_at')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(50),

    // FAQs
    admin
      .from('faqs')
      .select('id, question, answer')
      .eq('organization_id', orgId)
      .limit(50),

    // Lists (for Home Slyde structure)
    admin
      .from('lists')
      .select('id, name, item_count')
      .eq('organization_id', orgId),

    // AI Memory
    admin
      .from('ai_memory')
      .select('brand_voice, goals, preferences, notes')
      .eq('organization_id', orgId)
      .maybeSingle(),
  ])

  // Build slydes with frames
  const slydes = (slydesResult.data ?? []).map(slyde => {
    const slydeFrames = (framesResult.data ?? [])
      .filter(f => f.slyde_id === slyde.id)
      .map(f => ({
        id: f.id as string,
        index: f.frame_index as number,
        headline: f.title as string | undefined,
        body: f.body as string | undefined,
        ctaText: f.cta_text as string | undefined,
        ctaLink: f.cta_link as string | undefined,
        templateType: f.template_type as string | undefined,
      }))

    return {
      id: slyde.id as string,
      publicId: slyde.public_id as string,
      title: slyde.title as string,
      description: slyde.description as string | undefined,
      published: slyde.published as boolean,
      createdAt: slyde.created_at as string,
      updatedAt: slyde.updated_at as string,
      frames: slydeFrames,
    }
  })

  // Build orders
  const pendingOrders = (ordersResult.data ?? []).filter(o => o.status === 'pending')
  const fulfilledOrders = (ordersResult.data ?? []).filter(o => o.status === 'fulfilled')

  const orders = {
    pending: pendingOrders.length,
    pendingDetails: pendingOrders.slice(0, 10).map(o => ({
      id: o.id as string,
      customerName: o.customer_name as string,
      customerEmail: o.customer_email as string,
      items: o.items as string,
      total: o.total_amount as number,
      createdAt: o.created_at as string,
    })),
    recentFulfilled: fulfilledOrders.length,
  }

  // Build Home Slyde structure
  const homeSlyde = {
    categories: (listsResult.data ?? []).map(l => ({
      id: l.id as string,
      name: l.name as string,
      itemCount: (l.item_count as number) || 0,
    })),
    totalItems: (listsResult.data ?? []).reduce((sum, l) => sum + ((l.item_count as number) || 0), 0),
  }

  // Build FAQs
  const faqs = (faqsResult.data ?? []).map(f => ({
    id: f.id as string,
    question: f.question as string,
    answer: f.answer as string,
  }))

  // Build memory
  const memoryData = memoryResult.data
  const memory = {
    brandVoice: memoryData?.brand_voice as string | undefined,
    goals: (memoryData?.goals as string[]) || [],
    preferences: (memoryData?.preferences as Record<string, unknown>) || {},
    notes: (memoryData?.notes as Array<{ date: string; note: string }>) || [],
  }

  // Build context
  const context: MomentumContext = {
    organization: {
      id: orgId,
      name: org.name as string,
      slug: org.slug as string,
      industry: org.industry as string | undefined,
      plan,
      createdAt: org.created_at as string,
    },
    profile: {
      bio: org.bio as string | undefined,
      location: org.location as string | undefined,
      contactEmail: org.contact_email as string | undefined,
      brandVoice: memory.brandVoice,
    },
    slydes,
    analytics: analyticsResult,
    orders: orders.pending > 0 || orders.recentFulfilled > 0 ? orders : undefined,
    homeSlyde: homeSlyde.categories.length > 0 ? homeSlyde : undefined,
    faqs: faqs.length > 0 ? faqs : undefined,
    memory,
  }

  return NextResponse.json({ ok: true, context })
}

// Helper to fetch analytics (reuse logic from momentum API)
async function fetchAnalytics(
  admin: ReturnType<typeof createAdminClient>,
  orgId: string
): Promise<MomentumContext['analytics']> {
  const days = 30
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const prevEnd = start
  const prevStart = new Date(prevEnd.getTime() - days * 24 * 60 * 60 * 1000)

  // Get slydes
  const { data: slydes } = await admin
    .from('slydes')
    .select('id, public_id, title')
    .eq('organization_id', orgId)

  if (!slydes || slydes.length === 0) {
    return { totalViews: 0, totalClicks: 0, avgCompletion: 0, bySlyde: [] }
  }

  const slydeIds = slydes.map(s => s.id as string)
  const slydeNameById = new Map(slydes.map(s => [s.id as string, (s.title || s.public_id) as string]))

  // Get max frame index per slyde
  const { data: frames } = await admin
    .from('frames')
    .select('slyde_id, frame_index')
    .eq('organization_id', orgId)

  const maxIndexBySlydeId = new Map<string, number>()
  for (const f of frames ?? []) {
    const sid = f.slyde_id as string
    const idx = Number(f.frame_index)
    const prev = maxIndexBySlydeId.get(sid) ?? 0
    if (idx > prev) maxIndexBySlydeId.set(sid, idx)
  }

  // Get current period events
  const { data: events } = await admin
    .from('analytics_events')
    .select('event_type, session_id, slyde_id, meta')
    .eq('organization_id', orgId)
    .in('slyde_id', slydeIds)
    .gte('occurred_at', start.toISOString())
    .lt('occurred_at', end.toISOString())
    .limit(20000)

  // Get previous period events
  const { data: prevEvents } = await admin
    .from('analytics_events')
    .select('event_type, session_id, slyde_id, meta')
    .eq('organization_id', orgId)
    .in('slyde_id', slydeIds)
    .gte('occurred_at', prevStart.toISOString())
    .lt('occurred_at', prevEnd.toISOString())
    .limit(20000)

  // Process stats per slyde
  const statsBySlydeId = new Map<string, {
    sessions: Set<string>
    ctaClicks: number
    maxDepthBySession: Map<string, number>
  }>()

  const prevStatsBySlydeId = new Map<string, {
    sessions: Set<string>
    maxDepthBySession: Map<string, number>
  }>()

  for (const sid of slydeIds) {
    statsBySlydeId.set(sid, { sessions: new Set(), ctaClicks: 0, maxDepthBySession: new Map() })
    prevStatsBySlydeId.set(sid, { sessions: new Set(), maxDepthBySession: new Map() })
  }

  // Current period
  for (const e of events ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const slydeId = e.slyde_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>
    const stats = statsBySlydeId.get(slydeId)
    if (!stats) continue

    if (type === 'sessionStart') stats.sessions.add(sessionId)
    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = stats.maxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) stats.maxDepthBySession.set(sessionId, idx)
      }
    }
    if (type === 'ctaClick') stats.ctaClicks += 1
  }

  // Previous period
  for (const e of prevEvents ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const slydeId = e.slyde_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>
    const stats = prevStatsBySlydeId.get(slydeId)
    if (!stats) continue

    if (type === 'sessionStart') stats.sessions.add(sessionId)
    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = stats.maxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) stats.maxDepthBySession.set(sessionId, idx)
      }
    }
  }

  // Calculate metrics
  let totalViews = 0
  let totalClicks = 0
  let totalCompletion = 0
  let completionCount = 0

  const bySlyde: MomentumContext['analytics']['bySlyde'] = []

  for (const sid of slydeIds) {
    const stats = statsBySlydeId.get(sid)!
    const prevStats = prevStatsBySlydeId.get(sid)!
    const maxIndex = maxIndexBySlydeId.get(sid) || 1

    const views = stats.sessions.size
    const prevViews = prevStats.sessions.size
    totalViews += views
    totalClicks += stats.ctaClicks

    // Completion
    const depths = Array.from(stats.maxDepthBySession.values())
    const completions = depths.filter(d => d >= maxIndex).length
    const completion = depths.length > 0 ? Math.round((completions / depths.length) * 100) : 0

    const prevDepths = Array.from(prevStats.maxDepthBySession.values())
    const prevCompletions = prevDepths.filter(d => d >= maxIndex).length
    const prevCompletion = prevDepths.length > 0 ? Math.round((prevCompletions / prevDepths.length) * 100) : 0

    if (depths.length > 0) {
      totalCompletion += completion
      completionCount += 1
    }

    // Trend
    const trend = prevViews > 0 ? Math.round(((views - prevViews) / prevViews) * 100) : 0

    // Drop-off analysis
    const reachCounts: number[] = Array.from({ length: maxIndex }, () => 0)
    for (const d of depths) {
      for (let i = 1; i <= Math.min(d, maxIndex); i++) reachCounts[i - 1] += 1
    }

    let biggestDropFrame = 'Frame 1'
    let biggestDropPct = 0
    for (let i = 0; i < reachCounts.length - 1; i++) {
      const drop = reachCounts[i] > 0 ? ((reachCounts[i] - reachCounts[i + 1]) / reachCounts[i]) * 100 : 0
      if (drop > biggestDropPct) {
        biggestDropPct = Math.round(drop)
        biggestDropFrame = `Frame ${i + 1}`
      }
    }

    if (views > 0) {
      bySlyde.push({
        slydeId: sid,
        slydeName: slydeNameById.get(sid) || 'Slyde',
        views,
        completion,
        ctaClicks: stats.ctaClicks,
        dropOffFrame: biggestDropFrame,
        dropOffPct: biggestDropPct,
        trend,
      })
    }
  }

  // Sort by views descending
  bySlyde.sort((a, b) => b.views - a.views)

  return {
    totalViews,
    totalClicks,
    avgCompletion: completionCount > 0 ? Math.round(totalCompletion / completionCount) : 0,
    bySlyde,
  }
}
