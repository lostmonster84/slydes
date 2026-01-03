import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

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
  const { searchParams } = new URL(req.url)
  const org = searchParams.get('org')
  const slyde = searchParams.get('slyde')
  const range = searchParams.get('range')

  if (!org) return NextResponse.json({ error: 'Missing org' }, { status: 400 })
  if (!slyde) return NextResponse.json({ error: 'Missing slyde' }, { status: 400 })

  let supabase: ReturnType<typeof createSupabaseAdmin>
  try {
    supabase = createSupabaseAdmin()
  } catch (e) {
    return NextResponse.json({ error: 'Analytics not configured', detail: (e as Error).message }, { status: 503 })
  }

  const days = rangeToDays(range)
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)

  const { data: orgRow, error: orgErr } = await supabase
    .from('organizations')
    .select('id, slug, name')
    .eq('slug', org)
    .maybeSingle()

  if (orgErr || !orgRow) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  const orgId = orgRow.id as string

  // Resolve slyde by public_id (best-effort create if missing)
  const { data: slydeRow } = await supabase
    .from('slydes')
    .select('id, public_id, title')
    .eq('organization_id', orgId)
    .eq('public_id', slyde)
    .maybeSingle()

  let slydeId = slydeRow?.id as string | undefined
  if (!slydeId) {
    const { error: upsertErr } = await supabase.from('slydes').upsert(
      [{ organization_id: orgId, public_id: slyde, title: slyde, published: true }],
      { onConflict: 'organization_id,public_id' }
    )
    if (upsertErr) return NextResponse.json({ error: 'Failed to create slyde' }, { status: 500 })
    const { data: slydeRow2 } = await supabase
      .from('slydes')
      .select('id, public_id, title')
      .eq('organization_id', orgId)
      .eq('public_id', slyde)
      .maybeSingle()
    slydeId = slydeRow2?.id as string
  }

  if (!slydeId) return NextResponse.json({ error: 'Slyde not found' }, { status: 404 })

  // Frames for this slyde
  const { data: frames } = await supabase
    .from('frames')
    .select('public_id, frame_index, template_type')
    .eq('organization_id', orgId)
    .eq('slyde_id', slydeId)

  const maxIndex = (frames ?? []).reduce((m, f) => Math.max(m, Number(f.frame_index) || 0), 0) || 1

  // Events for this slyde (bounded)
  const { data: events, error: eventsErr } = await supabase
    .from('analytics_events')
    .select('event_type, session_id, source, meta, occurred_at')
    .eq('organization_id', orgId)
    .eq('slyde_id', slydeId)
    .gte('occurred_at', start.toISOString())
    .lt('occurred_at', end.toISOString())
    .order('occurred_at', { ascending: false })
    .limit(10000)

  if (eventsErr) return NextResponse.json({ error: 'Failed to load events' }, { status: 500 })

  const startsBySession = new Set<string>()
  const sourceCounts = new Map<string, number>()
  const maxDepthBySession = new Map<string, number>()
  const ctaClicks = new Map<string, number>() // framePublicId -> clicks
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

  const totalStarts = startsBySession.size
  const depths = Array.from(maxDepthBySession.values())
  const avgSwipeDepth = depths.length ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10 : 0
  const completions = depths.filter((d) => d >= maxIndex).length
  const completionRate = depths.length ? safePct((completions / depths.length) * 100) : 0
  const ctaRate = totalStarts ? safePct((totalCtaClicks / totalStarts) * 100) : 0

  // Frame reach curve based on maxDepthBySession
  const reachCounts: number[] = Array.from({ length: maxIndex }, () => 0)
  for (const d of depths) {
    for (let i = 1; i <= Math.min(d, maxIndex); i++) reachCounts[i - 1] += 1
  }

  const framesCurve = reachCounts.map((count, idx) => {
    const reachPct = totalStarts ? safePct((count / totalStarts) * 100) : 0
    const nextCount = reachCounts[idx + 1] ?? 0
    const dropPct = totalStarts ? safePct(((count - nextCount) / totalStarts) * 100) : 0
    return { label: `Frame ${idx + 1}`, pct: Math.round(reachPct), drop: Math.round(dropPct) }
  })

  // Biggest drop
  let biggestDrop = { frame: 'Frame 1', drop: 0 }
  for (const f of framesCurve) {
    if (f.drop > biggestDrop.drop) biggestDrop = { frame: f.label, drop: f.drop }
  }

  const srcTotal = Array.from(sourceCounts.values()).reduce((a, b) => a + b, 0) || 1
  const trafficSources = Array.from(sourceCounts.entries()).map(([source, value]) => ({
    source,
    pct: Math.round((value / srcTotal) * 100),
  }))

  // Best CTA frame
  let bestFrame = { frame: 'Frame 1', clicks: 0 }
  for (const [framePublicId, clicks] of ctaClicks.entries()) {
    if (clicks > bestFrame.clicks) bestFrame = { frame: `Frame ${framePublicId}`, clicks }
  }

  return NextResponse.json({
    ok: true,
    range: `${days}d`,
    org: { slug: orgRow.slug, name: orgRow.name },
    slyde: {
      id: slyde,
      name: (slydeRow?.title as string) || slyde,
      // map “views” -> starts for now
      views: totalStarts,
      completion: Math.round(completionRate),
      swipeDepth: avgSwipeDepth,
      ctaClicks: totalCtaClicks,
      ctaRate: Math.round(ctaRate * 10) / 10,
      shares: totalShares,
      hearts: totalHearts,
      trafficSources,
      frames: framesCurve,
      biggestDrop: { frame: biggestDrop.frame, drop: biggestDrop.drop },
      bestCta: { text: 'CTA', rate: Math.round(ctaRate * 10) / 10, frame: bestFrame.frame },
    },
  })
}









