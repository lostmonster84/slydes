import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Momentum API - Powers the Dashboard with actionable insights
 *
 * This endpoint returns:
 * 1. Hero metrics (total CTA clicks, completion rate, trends)
 * 2. Ranked slydes by performance
 * 3. Coaching suggestions based on data
 * 4. Next action to take
 */

type CoachingSuggestion = {
  type: 'drop_off' | 'low_completion' | 'no_cta' | 'good_performance' | 'no_data'
  severity: 'critical' | 'warning' | 'info' | 'success'
  message: string
  action: string
  slydeName?: string
  frameLabel?: string
  metric?: number
}

function generateCoaching(
  slydeData: {
    name: string
    publicId: string
    completion: number
    completionDelta: number
    ctaClicks: number
    biggestDropFrame: string
    biggestDropPct: number
    totalFrames: number
  }[]
): CoachingSuggestion[] {
  const suggestions: CoachingSuggestion[] = []

  if (slydeData.length === 0) {
    return [{
      type: 'no_data',
      severity: 'info',
      message: 'No analytics data yet.',
      action: 'Share your Slydes to start collecting data.',
    }]
  }

  // Find worst performing slyde by drop-off
  const worstDropOff = slydeData
    .filter(s => s.biggestDropPct > 30)
    .sort((a, b) => b.biggestDropPct - a.biggestDropPct)[0]

  if (worstDropOff) {
    const suggestion = getDropOffSuggestion(worstDropOff.biggestDropFrame, worstDropOff.totalFrames)
    suggestions.push({
      type: 'drop_off',
      severity: worstDropOff.biggestDropPct > 50 ? 'critical' : 'warning',
      message: `${worstDropOff.name} is losing ${worstDropOff.biggestDropPct}% of viewers at ${worstDropOff.biggestDropFrame}.`,
      action: suggestion,
      slydeName: worstDropOff.name,
      frameLabel: worstDropOff.biggestDropFrame,
      metric: worstDropOff.biggestDropPct,
    })
  }

  // Find slyde with low completion but decent views
  const lowCompletion = slydeData
    .filter(s => s.completion < 40 && s.ctaClicks > 0)
    .sort((a, b) => a.completion - b.completion)[0]

  if (lowCompletion && (!worstDropOff || lowCompletion.publicId !== worstDropOff.publicId)) {
    suggestions.push({
      type: 'low_completion',
      severity: 'warning',
      message: `Only ${lowCompletion.completion}% of viewers finish ${lowCompletion.name}.`,
      action: 'Consider shortening the Slyde or making each frame more compelling.',
      slydeName: lowCompletion.name,
      metric: lowCompletion.completion,
    })
  }

  // Find improving slyde
  const improving = slydeData
    .filter(s => s.completionDelta > 5)
    .sort((a, b) => b.completionDelta - a.completionDelta)[0]

  if (improving) {
    suggestions.push({
      type: 'good_performance',
      severity: 'success',
      message: `${improving.name} completion is up ${improving.completionDelta}% - your changes are working!`,
      action: 'Keep iterating on what works.',
      slydeName: improving.name,
      metric: improving.completionDelta,
    })
  }

  // Find slyde with zero CTA clicks
  const noCta = slydeData.find(s => s.ctaClicks === 0 && s.completion > 20)
  if (noCta) {
    suggestions.push({
      type: 'no_cta',
      severity: 'warning',
      message: `${noCta.name} has viewers but no CTA clicks.`,
      action: 'Make your call-to-action clearer or more compelling.',
      slydeName: noCta.name,
    })
  }

  return suggestions.length > 0 ? suggestions : [{
    type: 'good_performance',
    severity: 'success',
    message: 'All Slydes performing well.',
    action: 'Keep sharing and building!',
  }]
}

function getDropOffSuggestion(frameLabel: string, totalFrames: number): string {
  const frameNum = parseInt(frameLabel.replace('Frame ', ''), 10)

  if (frameNum === 1) {
    return 'Your hook isn\'t landing. Try a stronger opening with immediate value.'
  }
  if (frameNum === 2) {
    return 'Viewers aren\'t hooked yet. Make frame 2 deliver on the promise of frame 1.'
  }
  if (frameNum === totalFrames) {
    return 'People are leaving before your CTA. Consider moving it earlier or making it more visible.'
  }
  if (frameNum <= Math.ceil(totalFrames / 2)) {
    return 'Shorten the copy and lead with the payoff. People want value fast.'
  }
  return 'This frame might be too long or not compelling enough. Try breaking it up or adding visual interest.'
}

function safePct(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

export async function GET(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const org = searchParams.get('org')
  const range = searchParams.get('range') || '7d'

  if (!org) return NextResponse.json({ error: 'Missing org' }, { status: 400 })

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: 'Analytics not configured', detail: (e as Error).message }, { status: 503 })
  }

  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const prevEnd = start
  const prevStart = new Date(prevEnd.getTime() - days * 24 * 60 * 60 * 1000)

  const { data: orgRow, error: orgErr } = await admin
    .from('organizations')
    .select('id, slug, name, owner_id')
    .eq('slug', org)
    .maybeSingle()

  if (orgErr || !orgRow) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  if (orgRow.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orgId = orgRow.id as string

  // Load all slydes
  const { data: slydes } = await admin
    .from('slydes')
    .select('id, public_id, title, published, updated_at')
    .eq('organization_id', orgId)

  if (!slydes || slydes.length === 0) {
    return NextResponse.json({
      ok: true,
      hasData: false,
      hero: { totalClicks: 0, clicksDelta: 0, avgCompletion: 0, completionDelta: 0 },
      rankedSlydes: [],
      coaching: [{ type: 'no_data', severity: 'info', message: 'Create and publish your first Slyde to start tracking.', action: 'Create a Slyde' }],
      nextAction: null,
      lastWin: null,
    })
  }

  const slydeIds = slydes.map(s => s.id as string)
  const slydeNameById = new Map(slydes.map(s => [s.id as string, (s.title as string) || (s.public_id as string)]))
  const slydePublicById = new Map(slydes.map(s => [s.id as string, s.public_id as string]))

  // Load frames for max index
  const { data: allFrames } = await admin
    .from('frames')
    .select('slyde_id, frame_index')
    .eq('organization_id', orgId)

  const maxIndexBySlydeId = new Map<string, number>()
  for (const f of allFrames ?? []) {
    const sid = f.slyde_id as string
    const idx = Number(f.frame_index)
    const prev = maxIndexBySlydeId.get(sid) ?? 0
    if (idx > prev) maxIndexBySlydeId.set(sid, idx)
  }

  // Fetch current period events
  const { data: events } = await admin
    .from('analytics_events')
    .select('event_type, session_id, slyde_id, meta')
    .eq('organization_id', orgId)
    .in('slyde_id', slydeIds)
    .gte('occurred_at', start.toISOString())
    .lt('occurred_at', end.toISOString())
    .limit(20000)

  // Fetch previous period events
  const { data: prevEvents } = await admin
    .from('analytics_events')
    .select('event_type, session_id, slyde_id, meta')
    .eq('organization_id', orgId)
    .in('slyde_id', slydeIds)
    .gte('occurred_at', prevStart.toISOString())
    .lt('occurred_at', prevEnd.toISOString())
    .limit(20000)

  // Process per-slyde metrics
  const statsBySlydeId = new Map<string, {
    sessions: Set<string>
    ctaClicks: number
    maxDepthBySession: Map<string, number>
  }>()

  const prevStatsBySlydeId = new Map<string, {
    sessions: Set<string>
    ctaClicks: number
    maxDepthBySession: Map<string, number>
  }>()

  // Initialize
  for (const sid of slydeIds) {
    statsBySlydeId.set(sid, { sessions: new Set(), ctaClicks: 0, maxDepthBySession: new Map() })
    prevStatsBySlydeId.set(sid, { sessions: new Set(), ctaClicks: 0, maxDepthBySession: new Map() })
  }

  // Process current events
  for (const e of events ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const slydeId = e.slyde_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>
    const stats = statsBySlydeId.get(slydeId)
    if (!stats) continue

    if (type === 'sessionStart') {
      stats.sessions.add(sessionId)
    }
    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = stats.maxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) stats.maxDepthBySession.set(sessionId, idx)
      }
    }
    if (type === 'ctaClick') {
      stats.ctaClicks += 1
    }
  }

  // Process previous events
  for (const e of prevEvents ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const slydeId = e.slyde_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>
    const stats = prevStatsBySlydeId.get(slydeId)
    if (!stats) continue

    if (type === 'sessionStart') {
      stats.sessions.add(sessionId)
    }
    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = stats.maxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) stats.maxDepthBySession.set(sessionId, idx)
      }
    }
    if (type === 'ctaClick') {
      stats.ctaClicks += 1
    }
  }

  // Calculate per-slyde completion and drop-off
  const slydeMetrics: {
    id: string
    publicId: string
    name: string
    completion: number
    completionDelta: number
    ctaClicks: number
    views: number
    biggestDropFrame: string
    biggestDropPct: number
    totalFrames: number
  }[] = []

  let totalCtaClicks = 0
  let prevTotalCtaClicks = 0
  let totalCompletion = 0
  let prevTotalCompletion = 0
  let completionCount = 0
  let prevCompletionCount = 0

  for (const sid of slydeIds) {
    const stats = statsBySlydeId.get(sid)!
    const prevStats = prevStatsBySlydeId.get(sid)!
    const maxIndex = maxIndexBySlydeId.get(sid) || 1
    const name = slydeNameById.get(sid) || 'Slyde'
    const publicId = slydePublicById.get(sid) || sid

    totalCtaClicks += stats.ctaClicks
    prevTotalCtaClicks += prevStats.ctaClicks

    // Current completion
    const depths = Array.from(stats.maxDepthBySession.values())
    const completions = depths.filter(d => d >= maxIndex).length
    const completion = depths.length > 0 ? safePct((completions / depths.length) * 100) : 0

    // Previous completion
    const prevDepths = Array.from(prevStats.maxDepthBySession.values())
    const prevCompletions = prevDepths.filter(d => d >= maxIndex).length
    const prevCompletion = prevDepths.length > 0 ? safePct((prevCompletions / prevDepths.length) * 100) : 0

    if (depths.length > 0) {
      totalCompletion += completion
      completionCount += 1
    }
    if (prevDepths.length > 0) {
      prevTotalCompletion += prevCompletion
      prevCompletionCount += 1
    }

    // Find biggest drop-off frame
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

    slydeMetrics.push({
      id: sid,
      publicId,
      name,
      completion: Math.round(completion),
      completionDelta: Math.round(completion - prevCompletion),
      ctaClicks: stats.ctaClicks,
      views: stats.sessions.size,
      biggestDropFrame,
      biggestDropPct,
      totalFrames: maxIndex,
    })
  }

  // Sort by impact (CTA clicks, then completion)
  const rankedSlydes = slydeMetrics
    .filter(s => s.views > 0)
    .sort((a, b) => {
      // Primary: CTA clicks
      if (b.ctaClicks !== a.ctaClicks) return b.ctaClicks - a.ctaClicks
      // Secondary: Completion rate
      return b.completion - a.completion
    })
    .map((s, idx) => ({
      rank: idx + 1,
      id: s.publicId,
      name: s.name,
      completion: s.completion,
      completionDelta: s.completionDelta,
      ctaClicks: s.ctaClicks,
      dropFrame: s.biggestDropFrame,
      dropPct: s.biggestDropPct,
    }))

  // Hero metrics
  const avgCompletion = completionCount > 0 ? Math.round(totalCompletion / completionCount) : 0
  const prevAvgCompletion = prevCompletionCount > 0 ? Math.round(prevTotalCompletion / prevCompletionCount) : 0
  const clicksDelta = prevTotalCtaClicks > 0 ? Math.round(((totalCtaClicks - prevTotalCtaClicks) / prevTotalCtaClicks) * 100) : 0

  // Generate coaching
  const coaching = generateCoaching(slydeMetrics.filter(s => s.views > 0))

  // Next action (first critical/warning suggestion)
  const nextAction = coaching.find(c => c.severity === 'critical' || c.severity === 'warning') || null

  // Last win (most recent improvement - find slyde with positive delta)
  const lastWin = slydeMetrics
    .filter(s => s.completionDelta > 0)
    .sort((a, b) => b.completionDelta - a.completionDelta)[0]

  return NextResponse.json({
    ok: true,
    hasData: rankedSlydes.length > 0,
    range: `${days}d`,
    hero: {
      totalClicks: totalCtaClicks,
      clicksDelta,
      avgCompletion,
      completionDelta: avgCompletion - prevAvgCompletion,
    },
    rankedSlydes,
    coaching,
    nextAction: nextAction ? {
      slydeName: nextAction.slydeName,
      frameLabel: nextAction.frameLabel,
      leakPct: nextAction.metric,
      suggestion: nextAction.action,
      actionLabel: 'Fix this',
    } : null,
    lastWin: lastWin ? {
      slydeName: lastWin.name,
      improvement: `Completion up ${lastWin.completionDelta}%`,
    } : null,
  })
}
