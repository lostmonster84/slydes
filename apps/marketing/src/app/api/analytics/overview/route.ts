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
  const range = searchParams.get('range')

  if (!org) return NextResponse.json({ error: 'Missing org' }, { status: 400 })

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

  // Load slydes (for names + total)
  const { data: slydes } = await supabase
    .from('slydes')
    .select('id, public_id, title')
    .eq('organization_id', orgId)

  const slydeNameById = new Map<string, string>()
  const slydePublicById = new Map<string, string>()
  for (const s of slydes ?? []) {
    slydeNameById.set(s.id as string, (s.title as string) || (s.public_id as string))
    slydePublicById.set(s.id as string, s.public_id as string)
  }

  // Load max frame index per slyde (for completion + depth)
  const { data: frameMaxRows } = await supabase
    .from('frames')
    .select('slyde_id, frame_index')
    .eq('organization_id', orgId)

  const maxIndexBySlydeId = new Map<string, number>()
  for (const r of frameMaxRows ?? []) {
    const sid = r.slyde_id as string
    const idx = Number(r.frame_index)
    const prev = maxIndexBySlydeId.get(sid) ?? 0
    if (idx > prev) maxIndexBySlydeId.set(sid, idx)
  }

  // Fetch recent events (bounded)
  const { data: events, error: eventsErr } = await supabase
    .from('analytics_events')
    .select('event_type, session_id, slyde_id, source, meta, occurred_at')
    .eq('organization_id', orgId)
    .gte('occurred_at', start.toISOString())
    .lt('occurred_at', end.toISOString())
    .order('occurred_at', { ascending: false })
    .limit(10000)

  if (eventsErr) return NextResponse.json({ error: 'Failed to load events' }, { status: 500 })

  const startsBySession = new Set<string>()
  const sourceCounts = new Map<string, number>()
  const ctaClicksBySlydeId = new Map<string, number>()
  const ctaClicksBySlydeFrame = new Map<string, number>() // slydeId:framePublicId
  const shareBySlydeId = new Map<string, number>()
  const heartBySlydeId = new Map<string, number>()

  // session+slyde max depth
  const maxDepthBySessionSlyde = new Map<string, number>() // `${sessionId}:${slydeId}` -> max frameIndex

  for (const e of events ?? []) {
    const type = e.event_type as string
    const sessionId = e.session_id as string
    const slydeId = e.slyde_id as string
    const meta = (e.meta ?? {}) as Record<string, unknown>

    if (type === 'sessionStart') {
      startsBySession.add(sessionId)
      const src = (e.source as string) || 'Direct'
      sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1)
    }

    if (type === 'frameView') {
      const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : Number(meta.frameIndex)
      if (Number.isFinite(idx)) {
        const key = `${sessionId}:${slydeId}`
        const prev = maxDepthBySessionSlyde.get(key) ?? 0
        if (idx > prev) maxDepthBySessionSlyde.set(key, idx)
      }
    }

    if (type === 'ctaClick') {
      ctaClicksBySlydeId.set(slydeId, (ctaClicksBySlydeId.get(slydeId) ?? 0) + 1)
      const framePublicId = typeof meta.framePublicId === 'string' ? meta.framePublicId : null
      if (framePublicId) {
        const k = `${slydeId}:${framePublicId}`
        ctaClicksBySlydeFrame.set(k, (ctaClicksBySlydeFrame.get(k) ?? 0) + 1)
      }
    }

    if (type === 'shareClick') {
      shareBySlydeId.set(slydeId, (shareBySlydeId.get(slydeId) ?? 0) + 1)
    }

    if (type === 'heartTap') {
      heartBySlydeId.set(slydeId, (heartBySlydeId.get(slydeId) ?? 0) + 1)
    }
  }

  const totalStarts = startsBySession.size
  const totalClicks = Array.from(ctaClicksBySlydeId.values()).reduce((a, b) => a + b, 0)

  // Completion + average depth are computed over session+slyde pairs that have any frameView
  let totalPairs = 0
  let completedPairs = 0
  let depthSum = 0
  let bouncePairs = 0

  // Drop-off stage buckets (based on % of flow completed)
  const stageBuckets = { Early: 0, Mid: 0, Late: 0 }

  for (const [key, maxDepth] of maxDepthBySessionSlyde.entries()) {
    const [, slydeId] = key.split(':')
    const maxIndex = maxIndexBySlydeId.get(slydeId) ?? 0
    if (maxIndex <= 0) continue
    totalPairs += 1
    depthSum += maxDepth
    if (maxDepth <= 1) bouncePairs += 1
    if (maxDepth >= maxIndex) completedPairs += 1

    const pct = maxDepth / maxIndex
    if (pct <= 0.4) stageBuckets.Early += 1
    else if (pct <= 0.8) stageBuckets.Mid += 1
    else stageBuckets.Late += 1
  }

  const completionRate = totalPairs > 0 ? safePct((completedPairs / totalPairs) * 100) : 0
  const avgSwipeDepth = totalPairs > 0 ? Math.round((depthSum / totalPairs) * 10) / 10 : 0
  const bounceRate = totalPairs > 0 ? safePct((bouncePairs / totalPairs) * 100) : 0
  const clickRate = totalStarts > 0 ? Math.round(((totalClicks / totalStarts) * 100) * 10) / 10 : 0

  // Traffic sources distribution
  const srcTotal = Array.from(sourceCounts.values()).reduce((a, b) => a + b, 0) || 1
  const srcOrder = ['QR', 'Bio links', 'Ads', 'Direct', 'Referral']
  const sourceDistribution = srcOrder
    .map((label) => {
      const value = sourceCounts.get(label) ?? 0
      return { key: label, value, pct: Math.round((value / srcTotal) * 100) }
    })
    .filter((x) => x.value > 0)

  // Clicks by slyde
  const clicksBySlyde = (slydes ?? []).map((s) => {
    const sid = s.id as string
    const clicks = ctaClicksBySlydeId.get(sid) ?? 0
    return {
      id: (s.public_id as string) ?? sid,
      name: (s.title as string) || (s.public_id as string),
      clicks,
      rate: totalStarts > 0 ? Math.round(((clicks / totalStarts) * 100) * 10) / 10 : 0,
    }
  })

  // Best CTA (by raw clicks)
  let best: { slydeId: string; framePublicId: string; clicks: number } | null = null
  for (const [k, clicks] of ctaClicksBySlydeFrame.entries()) {
    if (!best || clicks > best.clicks) {
      const [slydeId, framePublicId] = k.split(':')
      best = { slydeId, framePublicId, clicks }
    }
  }

  const bestCta = best
    ? {
        text: 'CTA',
        clicks: best.clicks,
        rate: totalStarts > 0 ? Math.round(((best.clicks / totalStarts) * 100) * 10) / 10 : 0,
        slydeName: slydeNameById.get(best.slydeId) ?? 'Slyde',
        frameLabel: `Frame ${best.framePublicId}`,
      }
    : { text: 'CTA', clicks: 0, rate: 0, slydeName: '—', frameLabel: '—' }

  const dropoffShape = (['Early', 'Mid', 'Late'] as const).map((stage) => {
    const count = stageBuckets[stage]
    const pct = totalPairs > 0 ? Math.round((count / totalPairs) * 100) : 0
    const description = stage === 'Early' ? 'Frame 1–2' : stage === 'Mid' ? 'Frame 3–4' : 'Frame 5+'
    return {
      stage,
      description,
      pct,
      topContributors: [],
    }
  })

  return NextResponse.json({
    ok: true,
    range: `${days}d`,
    org: { slug: orgRow.slug, name: orgRow.name },
    // Partial payload intended to merge with existing mocked UI object
    global: {
      totalStarts,
      totalSlydes: slydes?.length ?? 0,
      completionRate: Math.round(completionRate),
      avgSwipeDepth,
      bounceRate: Math.round(bounceRate),
      totalClicks,
      clickRate,
      sourceDistribution,
      dropoffShape,
      clicksBySlyde,
      bestCta,
    },
  })
}







