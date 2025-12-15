import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/media/video-status?uid=xxx
 *
 * Checks the status of a Cloudflare Stream video.
 * Used to poll for video readiness after upload.
 *
 * Query params:
 * - uid: string (Cloudflare Stream video UID)
 *
 * Returns:
 * - status: 'processing' | 'ready' | 'error'
 * - playback?: { hls: string, dash: string } (if ready)
 * - thumbnail?: string (if ready)
 */
export async function GET(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get UID from query params
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ error: 'uid is required' }, { status: 400 })
  }

  // Get Cloudflare credentials (support both naming conventions)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_STREAM_TOKEN

  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: 'Media service not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    )

    const result = await response.json()

    if (!result.success) {
      console.error('Cloudflare Stream status error:', result.errors)
      return NextResponse.json(
        { error: 'Failed to get video status' },
        { status: 500 }
      )
    }

    const video = result.result

    // Determine status
    let status: 'processing' | 'ready' | 'error' = 'processing'

    if (video.status?.state === 'ready') {
      status = 'ready'
    } else if (video.status?.state === 'error') {
      status = 'error'
    }

    const responseData: any = { status }

    if (status === 'ready') {
      responseData.playback = {
        hls: video.playback?.hls,
        dash: video.playback?.dash,
      }
      responseData.thumbnail = video.thumbnail
      responseData.duration = video.duration
      responseData.size = video.size
    }

    if (status === 'error') {
      responseData.errorMessage = video.status?.errorReasonText
    }

    return NextResponse.json(responseData)
  } catch (err) {
    console.error('Error checking video status:', err)
    return NextResponse.json(
      { error: 'Failed to check video status' },
      { status: 500 }
    )
  }
}
