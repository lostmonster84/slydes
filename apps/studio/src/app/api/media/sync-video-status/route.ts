import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function isSafeUid(uid: unknown): uid is string {
  return typeof uid === 'string' && /^[a-zA-Z0-9_-]{6,128}$/.test(uid)
}

async function fetchStreamStatus(videoUid: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_STREAM_TOKEN
  if (!accountId || !token) throw new Error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_STREAM_TOKEN')

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoUid}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = (await res.json()) as any
  if (!res.ok || json?.success !== true) {
    const msg =
      json?.errors?.map((e: any) => e?.message).filter(Boolean).join('; ') ||
      `Cloudflare Stream status failed (status ${res.status})`
    throw new Error(msg)
  }

  const readyToStream = Boolean(json?.result?.readyToStream)
  const state = (json?.result?.status?.state as string | undefined) ?? null
  return { readyToStream, state }
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => null)) as any
  const frameId = typeof body?.frameId === 'string' ? body.frameId : null
  const videoUid = body?.videoUid

  if (!frameId) return NextResponse.json({ error: 'Missing frameId' }, { status: 400 })
  if (!isSafeUid(videoUid)) return NextResponse.json({ error: 'Invalid videoUid' }, { status: 400 })

  const { readyToStream, state } = await fetchStreamStatus(videoUid)
  const nextStatus = readyToStream || state === 'ready' ? 'ready' : state === 'error' ? 'failed' : 'processing'

  const { data: updated, error: updateErr } = await supabase
    .from('frames')
    .update({ video_status: nextStatus, video_status_updated_at: new Date().toISOString() })
    .eq('id', frameId)
    .select('id, video_status')
    .single()

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400 })

  return NextResponse.json({
    frameId: updated.id,
    videoStatus: updated.video_status,
    readyToStream,
    state,
  })
}




