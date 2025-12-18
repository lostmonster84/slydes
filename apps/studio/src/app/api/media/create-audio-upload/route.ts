import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * POST /api/media/create-audio-upload
 *
 * Creates a Cloudflare R2 presigned upload URL for audio files.
 * Client uploads directly to R2, then calls /attach-audio with the R2 key.
 *
 * Body:
 * - filename: string (original filename)
 * - contentType: string (e.g., 'audio/mpeg')
 *
 * Returns:
 * - key: string (R2 object key)
 * - uploadURL: string (presigned PUT URL)
 * - expiresAt: string (ISO timestamp)
 */
export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  let body: { filename?: string; contentType?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { filename, contentType } = body

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: 'filename and contentType are required' },
      { status: 400 }
    )
  }

  // Validate content type
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/wave', 'audio/x-wav']
  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: 'Invalid audio format. Supported: MP3, M4A, WAV' },
      { status: 400 }
    )
  }

  // Get R2 credentials from env
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'slydes-audio'

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('Missing R2 credentials')
    return NextResponse.json(
      { error: 'Audio uploads not configured' },
      { status: 500 }
    )
  }

  try {
    // Create R2 client
    const r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    // Generate unique key
    const ext = filename.split('.').pop()?.toLowerCase() || 'mp3'
    const key = `audio/${data.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Create presigned PUT URL
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Metadata: {
        userId: data.user.id,
        originalFilename: filename,
      },
    })

    const expiresIn = 30 * 60 // 30 minutes
    const uploadURL = await getSignedUrl(r2, command, { expiresIn })
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    return NextResponse.json({
      key,
      uploadURL,
      expiresAt,
    })
  } catch (err) {
    console.error('Error creating audio upload URL:', err)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}
