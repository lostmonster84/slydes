import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/media/create-image-upload
 *
 * Creates a Cloudflare Images direct upload URL.
 * Client uploads directly to Cloudflare, then calls /attach-to-frame with the image ID.
 *
 * Returns:
 * - id: string (Cloudflare Images ID)
 * - uploadURL: string (direct upload endpoint)
 */
export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get Cloudflare credentials from env (support both naming conventions)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_IMAGES_TOKEN || process.env.CLOUDFLARE_STREAM_TOKEN

  if (!accountId || !apiToken) {
    console.error('Missing Cloudflare credentials')
    return NextResponse.json(
      { error: 'Media uploads not configured' },
      { status: 500 }
    )
  }

  try {
    // Create direct upload URL via Cloudflare Images API
    const formData = new FormData()
    formData.append('requireSignedURLs', 'false') // Set to true for production
    formData.append('metadata', JSON.stringify({
      userId: data.user.id,
      uploadedAt: new Date().toISOString(),
    }))

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
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

      console.error('Cloudflare Images error:', {
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
      id: result.result.id,
      uploadURL: result.result.uploadURL,
    })
  } catch (err) {
    console.error('Error creating image upload:', err)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}
