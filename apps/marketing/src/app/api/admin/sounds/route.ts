import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, _Object } from '@aws-sdk/client-s3'

/**
 * Admin API for managing sounds in R2
 *
 * GET - List all sounds in the demo folder
 * POST - Upload a new sound file
 * DELETE - Remove a sound file
 */

// Simple auth check - verify cookie exists and is recent (matches other admin routes)
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const timestamp = parseInt(decoded.split('-').pop() || '0')
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    return timestamp > sevenDaysAgo
  } catch {
    return false
  }
}

// Get R2 client
function getR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 not configured')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'slydes-audio'
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-98abdd0a909a4a78b03fe6de579904ae.r2.dev'

// GET - List all sounds
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const r2 = getR2Client()

    const response = await r2.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: 'demo/',
      })
    )

    const sounds = (response.Contents || []).map((obj: _Object) => ({
      key: obj.Key,
      name: obj.Key?.replace('demo/', '') || '',
      size: obj.Size,
      lastModified: obj.LastModified?.toISOString(),
      url: `${R2_PUBLIC_URL}/${obj.Key}`,
    }))

    return NextResponse.json({ sounds })
  } catch (err) {
    console.error('Error listing sounds:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to list sounds: ${message}` }, { status: 500 })
  }
}

// POST - Upload a new sound
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const name = formData.get('name') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/wave', 'audio/x-wav']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid audio format. Supported: MP3, M4A, WAV' }, { status: 400 })
    }

    // Use provided name or generate from file
    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3'
    const safeName = (name || file.name.replace(`.${ext}`, ''))
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    const key = `demo/${safeName}.${ext}`

    const r2 = getR2Client()
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalFilename: file.name,
          uploadedAt: new Date().toISOString(),
        },
      })
    )

    const url = `${R2_PUBLIC_URL}/${key}`

    return NextResponse.json({
      success: true,
      key,
      url,
      name: safeName,
    })
  } catch (err) {
    console.error('Error uploading sound:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to upload sound: ${message}` }, { status: 500 })
  }
}

// DELETE - Remove a sound
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { key } = await request.json()

    if (!key || !key.startsWith('demo/')) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }

    const r2 = getR2Client()

    await r2.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting sound:', err)
    return NextResponse.json({ error: 'Failed to delete sound' }, { status: 500 })
  }
}
