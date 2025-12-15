import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

type AnalyticsEventInput = {
  eventType: 'sessionStart' | 'frameView' | 'ctaClick' | 'shareClick' | 'heartTap' | 'faqOpen'
  sessionId: string
  occurredAt?: string
  source?: string
  referrer?: string
  slydePublicId: string
  framePublicId?: string
  meta?: Record<string, unknown>
}

type IngestPayload = {
  organizationSlug: string
  events: AnalyticsEventInput[]
}

function isUuid(input: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input)
}

export async function POST(req: Request) {
  let payload: IngestPayload
  try {
    payload = (await req.json()) as IngestPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!payload?.organizationSlug || typeof payload.organizationSlug !== 'string') {
    return NextResponse.json({ error: 'Missing organizationSlug' }, { status: 400 })
  }
  if (!Array.isArray(payload.events) || payload.events.length === 0) {
    return NextResponse.json({ error: 'Missing events' }, { status: 400 })
  }
  if (payload.events.length > 200) {
    return NextResponse.json({ error: 'Too many events (max 200)' }, { status: 413 })
  }

  let supabase: ReturnType<typeof createSupabaseAdmin>
  try {
    supabase = createSupabaseAdmin()
  } catch (e) {
    return NextResponse.json(
      { error: 'Analytics not configured', detail: (e as Error).message },
      { status: 503 }
    )
  }

  // Resolve organization by slug
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', payload.organizationSlug)
    .maybeSingle()

  if (orgErr || !org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  // Resolve slydes and frames by public_id (to support numeric frame IDs + stable UUIDs)
  // Strategy:
  // - For each event, map (slydePublicId) -> slyde row
  // - If framePublicId exists, map -> frame row
  const slydePublicIds = Array.from(new Set(payload.events.map((e) => e.slydePublicId).filter(Boolean)))

  const { data: slydes, error: slydesErr } = await supabase
    .from('slydes')
    .select('id, public_id')
    .eq('organization_id', org.id)
    .in('public_id', slydePublicIds)

  if (slydesErr) {
    return NextResponse.json({ error: 'Failed to load slydes' }, { status: 500 })
  }

  const slydeIdByPublic = new Map<string, string>(slydes?.map((s) => [s.public_id as string, s.id as string]) ?? [])

  // If we don't have a slyde row yet, create it (best-effort).
  // In production, the publish flow should create slydes + frames, but this makes analytics resilient.
  const missingSlydes = slydePublicIds.filter((sid) => !slydeIdByPublic.has(sid))
  if (missingSlydes.length > 0) {
    const { error: upsertErr } = await supabase.from('slydes').upsert(
      missingSlydes.map((publicId) => ({
        organization_id: org.id,
        public_id: publicId,
        title: publicId,
        published: true,
      })),
      { onConflict: 'organization_id,public_id' }
    )
    if (upsertErr) return NextResponse.json({ error: 'Failed to create missing slydes' }, { status: 500 })

    const { data: slydes2, error: slydesErr2 } = await supabase
      .from('slydes')
      .select('id, public_id')
      .eq('organization_id', org.id)
      .in('public_id', slydePublicIds)
    if (slydesErr2) return NextResponse.json({ error: 'Failed to reload slydes' }, { status: 500 })
    slydeIdByPublic.clear()
    for (const s of slydes2 ?? []) slydeIdByPublic.set(s.public_id as string, s.id as string)
  }

  // Frames lookup (only for events that include framePublicId)
  const framePairs = payload.events
    .filter((e) => e.framePublicId)
    .map((e) => ({ slydePublicId: e.slydePublicId, framePublicId: e.framePublicId as string }))

  // Build a query per slyde to find frames; small batch, keep simple.
  const frameIdByKey = new Map<string, string>()
  for (const slydePublicId of new Set(framePairs.map((p) => p.slydePublicId))) {
    const slydeId = slydeIdByPublic.get(slydePublicId)!
    const framePublicIds = Array.from(
      new Set(framePairs.filter((p) => p.slydePublicId === slydePublicId).map((p) => p.framePublicId))
    )

    const { data: frames, error: framesErr } = await supabase
      .from('frames')
      .select('id, public_id')
      .eq('slyde_id', slydeId)
      .in('public_id', framePublicIds)

    if (framesErr) return NextResponse.json({ error: 'Failed to load frames' }, { status: 500 })

    for (const f of frames ?? []) {
      frameIdByKey.set(`${slydePublicId}:${f.public_id}`, f.id as string)
    }

    // Create missing frames (best-effort)
    const missingFrames = framePublicIds.filter((fid) => !frameIdByKey.has(`${slydePublicId}:${fid}`))
    if (missingFrames.length > 0) {
      // Try to infer frame_index + templateType from event meta
      const frameIndexByPublic = new Map<string, number>()
      const templateByPublic = new Map<string, string | null>()
      for (const ev of payload.events) {
        if (ev.slydePublicId !== slydePublicId) continue
        if (!ev.framePublicId) continue
        const meta = (ev.meta ?? {}) as Record<string, unknown>
        const idx = typeof meta.frameIndex === 'number' ? meta.frameIndex : undefined
        const tt = typeof meta.templateType === 'string' ? meta.templateType : null
        if (idx) frameIndexByPublic.set(ev.framePublicId, idx)
        if (tt) templateByPublic.set(ev.framePublicId, tt)
      }

      const { error: upsertFramesErr } = await supabase.from('frames').upsert(
        missingFrames.map((publicId) => ({
          organization_id: org.id,
          slyde_id: slydeId,
          public_id: publicId,
          frame_index: frameIndexByPublic.get(publicId) ?? 1,
          template_type: templateByPublic.get(publicId) ?? null,
          title: null,
        })),
        { onConflict: 'slyde_id,public_id' }
      )
      if (upsertFramesErr) return NextResponse.json({ error: 'Failed to create missing frames' }, { status: 500 })

      const { data: frames2, error: framesErr2 } = await supabase
        .from('frames')
        .select('id, public_id')
        .eq('slyde_id', slydeId)
        .in('public_id', framePublicIds)
      if (framesErr2) return NextResponse.json({ error: 'Failed to reload frames' }, { status: 500 })

      for (const f of frames2 ?? []) {
        frameIdByKey.set(`${slydePublicId}:${f.public_id}`, f.id as string)
      }
    }
  }

  // Build insert rows
  const rows = payload.events.map((e) => {
    if (!e.eventType) throw new Error('Missing eventType')
    if (!e.sessionId || typeof e.sessionId !== 'string') throw new Error('Missing sessionId')
    if (!isUuid(e.sessionId)) throw new Error('sessionId must be a UUID')
    if (!e.slydePublicId || typeof e.slydePublicId !== 'string') throw new Error('Missing slydePublicId')

    const slydeId = slydeIdByPublic.get(e.slydePublicId)
    if (!slydeId) throw new Error(`Unknown slydePublicId: ${e.slydePublicId}`)

    const frameId = e.framePublicId ? frameIdByKey.get(`${e.slydePublicId}:${e.framePublicId}`) : null

    return {
      organization_id: org.id,
      slyde_id: slydeId,
      frame_id: frameId,
      event_type: e.eventType,
      session_id: e.sessionId,
      occurred_at: e.occurredAt ?? new Date().toISOString(),
      source: e.source ?? null,
      referrer: e.referrer ?? null,
      meta: {
        ...((e.meta ?? {}) as Record<string, unknown>),
        slydePublicId: e.slydePublicId,
        framePublicId: e.framePublicId ?? null,
      },
    }
  })

  try {
    const { error } = await supabase.from('analytics_events').insert(rows)
    if (error) {
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, inserted: rows.length })
}


