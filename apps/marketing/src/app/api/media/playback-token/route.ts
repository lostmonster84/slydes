import { NextResponse } from 'next/server'
import { mintCloudflareStreamPlaybackToken } from '@slydes/media'

function isSafeUid(uid: unknown): uid is string {
  return typeof uid === 'string' && /^[a-zA-Z0-9_-]{6,128}$/.test(uid)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!isSafeUid(uid)) {
    return NextResponse.json({ error: 'Invalid uid' }, { status: 400 })
  }

  const expiresInSeconds = 10 * 60
  const token = mintCloudflareStreamPlaybackToken({ videoUid: uid, expiresInSeconds })
  return NextResponse.json({ token, expiresInSeconds })
}
