import { NextResponse } from 'next/server'

function isSafeUid(uid: unknown): uid is string {
  return typeof uid === 'string' && /^[a-zA-Z0-9_-]{6,128}$/.test(uid)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!isSafeUid(uid)) return NextResponse.json({ error: 'Invalid uid' }, { status: 400 })

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_STREAM_TOKEN
  if (!accountId || !token) {
    return NextResponse.json({ error: 'Missing Cloudflare Stream credentials' }, { status: 503 })
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = (await res.json()) as any
  if (!res.ok || json?.success !== true) {
    const msg =
      json?.errors?.map((e: any) => e?.message).filter(Boolean).join('; ') ||
      `Cloudflare Stream status failed (status ${res.status})`
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  const readyToStream = Boolean(json?.result?.readyToStream)
  const state = (json?.result?.status?.state as string | undefined) ?? null
  return NextResponse.json({ uid, readyToStream, state })
}


