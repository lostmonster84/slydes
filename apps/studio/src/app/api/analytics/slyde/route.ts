import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

function rangeToDays(range: string | null) {
  if (range === '7d') return 7
  if (range === '90d') return 90
  return 30
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
  const slyde = searchParams.get('slyde')
  const range = searchParams.get('range')

  if (!org) return NextResponse.json({ error: 'Missing org' }, { status: 400 })
  if (!slyde) return NextResponse.json({ error: 'Missing slyde' }, { status: 400 })

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (e) {
    return NextResponse.json({ error: 'Analytics not configured', detail: (e as Error).message }, { status: 503 })
  }

  const days = rangeToDays(range)
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)

  // Previous period for comparison
  const prevEnd = start
  const prevStart = new Date(prevEnd.getTime() - days * 24 * 60 * 60 * 1000)

  const { data: orgRow, error: orgErr } = await admin
    .from('organizations')
    .select('id, slug, name, owner_id')
    .eq('slug', org)
    .maybeSingle()

  if (orgErr || !orgRow) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  // Verify user owns this org
  if (orgRow.owner_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orgId = orgRow.id as string

  // Resolve slyde
  const { data: slydeRow } = await admin
    .from('slydes')
    .select('id, public_id, title')
    .eq('organization_id', orgId)
    .eq('public_id', slyde)
    .maybeSingle()

  if (!slydeRow) return NextResponse.json({ error: 'Slyde not found' }, { status: 404 })
  const slydeId = slydeRow.id as string

  // Frames for this slyde
  const { data: frames } = await admin
    .from('frames')
    .select('public_id, frame_index, template_type, title')
    .eq('organization_id', orgId)
    .eq('slyde_id', slydeId)
    .order('frame_index', { ascending: true })

  const maxIndex = (frames ?? []).reduce((m, f) => Math.max(m, Number(f.frame_index) || 0), 0) || 1

  // Events for this slyde (current period)
  const { data: events, error: eventsErr } = await admin
    .from('analytics_events')
    .select('event_type, session_id, source, meta, occurred_at')
    .eq('organization_id', orgId)
    .eq('slyde_id', slydeId)
    .gte('occurred_at', start.toISOString())
    .lt('occurred_at', end.toISOString())
    .order('occurred_at', { ascending: false })
    .limit(10000)

  if (eventsErr) return NextResponse.json({ error: 'Failed to load events' }, { status: 500 })

  // Previous period events
  const { data: prevEvents } = await admin
    .from('analytics_events')
    .select('event_type, session_id, meta')
    .eq('organization_id', orgId)
    .eq('slyde_id', slydeId)
    .gte('occurred_at', prevStart.toISOString())
    .lt('occurred_at', prevEnd.toISOString())
    .order('occurred_at', { ascending: false })
    .limit(10000)

  // Process current period
  const startsBySession = new Set<string>()
  const sourceCounts = new Map<string, number>()
  const maxDepthBySession = new Map<string, number>()
  const ctaClicks = new Map<string, number>()
  let totalCtaClicks = 0
  let totalShares = 0
  let totalHearts = 0

  for (const e of events ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>

    if (type === 'sessionStart') {
      startsBySession.add(sessionId)
      const src = (e.source as string) || 'Direct'
      sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1)
    }

    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = maxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) maxDepthBySession.set(sessionId, idx)
      }
    }

    if (type === 'ctaClick') {
      totalCtaClicks += 1
      const framePublicId = typeof meta.framePublicId === 'string' ? meta.framePublicId : null
      if (framePublicId) ctaClicks.set(framePublicId, (ctaClicks.get(framePublicId) ?? 0) + 1)
    }

    if (type === 'shareClick') totalShares += 1
    if (type === 'heartTap') totalHearts += 1
  }

  // Process previous period
  const prevStartsBySession = new Set<string>()
  const prevMaxDepthBySession = new Map<string, number>()
  let prevTotalCtaClicks = 0

  for (const e of prevEvents ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>

    if (type === 'sessionStart') {
      prevStartsBySession.add(sessionId)
    }

    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const prev = prevMaxDepthBySession.get(sessionId) ?? 0
        if (idx > prev) prevMaxDepthBySession.set(sessionId, idx)
      }
    }

    if (type === 'ctaClick') {
      prevTotalCtaClicks += 1
    }
  }

  const totalStarts = startsBySession.size
  const prevTotalStarts = prevStartsBySession.size
  const depths = Array.from(maxDepthBySession.values())
  const prevDepths = Array.from(prevMaxDepthBySession.values())

  const avgSwipeDepth = depths.length ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10 : 0
  const completions = depths.filter((d) => d >= maxIndex).length
  const completionRate = depths.length ? safePct((completions / depths.length) * 100) : 0

  const prevCompletions = prevDepths.filter((d) => d >= maxIndex).length
  const prevCompletionRate = prevDepths.length ? safePct((prevCompletions / prevDepths.length) * 100) : 0

  const ctaRate = totalStarts ? safePct((totalCtaClicks / totalStarts) * 100) : 0

  // Calculate deltas
  const viewsDelta = prevTotalStarts > 0 ? Math.round(((totalStarts - prevTotalStarts) / prevTotalStarts) * 100) : 0
  const completionDelta = Math.round(completionRate - prevCompletionRate)
  const clicksDelta = prevTotalCtaClicks > 0 ? Math.round(((totalCtaClicks - prevTotalCtaClicks) / prevTotalCtaClicks) * 100) : 0

  // Frame reach curve with drop-off analysis
  const reachCounts: number[] = Array.from({ length: maxIndex }, () => 0)
  for (const d of depths) {
    for (let i = 1; i <= Math.min(d, maxIndex); i++) reachCounts[i - 1] += 1
  }

  const framesCurve = reachCounts.map((count, idx) => {
    const reachPct = totalStarts ? safePct((count / totalStarts) * 100) : 0
    const nextCount = reachCounts[idx + 1] ?? 0
    const dropPct = count > 0 ? safePct(((count - nextCount) / count) * 100) : 0
    const frameData = frames?.find(f => Number(f.frame_index) === idx + 1)
    return {
      label: `Frame ${idx + 1}`,
      title: frameData?.title || null,
      templateType: frameData?.template_type || null,
      pct: Math.round(reachPct),
      drop: Math.round(dropPct),
      views: count,
      ctaClicks: ctaClicks.get(String(idx + 1)) ?? 0,
    }
  })

  // Find biggest drop-off frame
  let biggestDrop = { frame: 'Frame 1', frameIndex: 1, drop: 0 }
  for (let i = 0; i < framesCurve.length; i++) {
    const f = framesCurve[i]
    if (f.drop > biggestDrop.drop) {
      biggestDrop = { frame: f.label, frameIndex: i + 1, drop: f.drop }
    }
  }

  const srcTotal = Array.from(sourceCounts.values()).reduce((a, b) => a + b, 0) || 1
  const trafficSources = Array.from(sourceCounts.entries()).map(([source, value]) => ({
    source,
    pct: Math.round((value / srcTotal) * 100),
    count: value,
  }))

  // Best CTA frame
  let bestFrame = { frame: 'Frame 1', frameIndex: 1, clicks: 0 }
  for (const [framePublicId, clicks] of ctaClicks.entries()) {
    if (clicks > bestFrame.clicks) {
      const idx = parseInt(framePublicId, 10) || 1
      bestFrame = { frame: `Frame ${framePublicId}`, frameIndex: idx, clicks }
    }
  }

  return NextResponse.json({
    ok: true,
    range: `${days}d`,
    org: { slug: orgRow.slug, name: orgRow.name },
    slyde: {
      id: slyde,
      name: (slydeRow?.title as string) || slyde,
      views: totalStarts,
      viewsDelta,
      completion: Math.round(completionRate),
      completionDelta,
      swipeDepth: avgSwipeDepth,
      ctaClicks: totalCtaClicks,
      clicksDelta,
      ctaRate: Math.round(ctaRate * 10) / 10,
      shares: totalShares,
      hearts: totalHearts,
      trafficSources,
      frames: framesCurve,
      biggestDrop,
      bestCta: { text: 'CTA', rate: Math.round(ctaRate * 10) / 10, frame: bestFrame.frame, frameIndex: bestFrame.frameIndex },
      totalFrames: maxIndex,
    },
  })
}
