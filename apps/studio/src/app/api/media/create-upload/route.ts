import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCloudflareStreamDirectUpload } from '@slydes/media'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any = null
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const maxDurationSecondsRaw = body?.maxDurationSeconds
  const maxDurationSeconds =
    typeof maxDurationSecondsRaw === 'number' && Number.isFinite(maxDurationSecondsRaw)
      ? Math.max(1, Math.floor(maxDurationSecondsRaw))
      : 30

  const result = await createCloudflareStreamDirectUpload({
    maxDurationSeconds,
    expirySeconds: 10 * 60,
    requireSignedURLs: true,
  })

  return NextResponse.json({
    uid: result.uid,
    uploadURL: result.uploadURL,
    expiry: result.expiry,
  })
}


