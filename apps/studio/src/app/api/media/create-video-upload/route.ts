import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/media/create-video-upload
 *
 * Creates a Cloudflare Stream direct upload URL.
 * Client uploads directly to Cloudflare, then calls /attach-to-frame with the stream UID.
 *
 * Body:
 * - maxDurationSeconds?: number (default 30, max 300 for 5min videos)
 *
 * Returns:
 * - uid: string (Cloudflare Stream video UID)
 * - uploadURL: string (TUS upload endpoint)
 */
export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  let body: { maxDurationSeconds?: number } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const maxDurationSeconds = Math.min(
    Math.max(1, Math.floor(body.maxDurationSeconds || 30)),
    300 // Max 5 minutes
  )

  // Get Cloudflare credentials from env (support both naming conventions)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_STREAM_TOKEN

  if (!accountId || !apiToken) {
    console.error('Missing Cloudflare credentials')
    return NextResponse.json(
      { error: 'Media uploads not configured' },
      { status: 500 }
    )
  }

  try {
    // Create direct upload URL via Cloudflare Stream API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds,
          expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
          requireSignedURLs: false, // Set to true for production
          allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'],
          creator: data.user.id,
          meta: {
            userId: data.user.id,
          },
        }),
      }
    )

    const text = await response.text()
    const result = (() => {
      try {
        return JSON.parse(text)
      } catch {
        return null
      }
    })()

    if (!response.ok || !result?.success) {
      const firstError = result?.errors?.[0]
      const message =
        (typeof firstError?.message === 'string' && firstError.message) ||
        (typeof result?.messages?.[0] === 'string' && result.messages[0]) ||
        (!response.ok ? `Cloudflare HTTP ${response.status}` : 'Cloudflare rejected the request')

      console.error('Cloudflare Stream error:', {
        status: response.status,
        errors: result?.errors,
        raw: text?.slice?.(0, 500),
      })

      return NextResponse.json(
        { error: `Failed to create upload URL: ${message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      uid: result.result.uid,
      uploadURL: result.result.uploadURL,
    })
  } catch (err) {
    console.error('Error creating video upload:', err)
    return NextResponse.json(
      { error: 'Failed to create upload URL: unexpected server error' },
      { status: 500 }
    )
  }
}
