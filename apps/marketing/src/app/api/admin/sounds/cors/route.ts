import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'

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

// POST - Configure CORS for audio playback
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const r2 = getR2Client()

    // Configure CORS to allow audio playback from any origin
    await r2.send(new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedHeaders: ['*'],
            ExposeHeaders: ['Content-Length', 'Content-Type', 'Accept-Ranges'],
            MaxAgeSeconds: 86400,
          },
        ],
      },
    }))

    // Verify it was set
    const corsResult = await r2.send(new GetBucketCorsCommand({ Bucket: BUCKET_NAME }))

    return NextResponse.json({
      success: true,
      message: 'CORS configured successfully',
      cors: corsResult.CORSRules,
    })
  } catch (err) {
    console.error('Error configuring CORS:', err)
    return NextResponse.json(
      { error: 'Failed to configure CORS', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET - Check current CORS config
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const r2 = getR2Client()
    const corsResult = await r2.send(new GetBucketCorsCommand({ Bucket: BUCKET_NAME }))
    return NextResponse.json({ cors: corsResult.CORSRules || [] })
  } catch (err) {
    if (err instanceof Error && err.name === 'NoSuchCORSConfiguration') {
      return NextResponse.json({ cors: [], message: 'No CORS configuration found' })
    }
    return NextResponse.json({ error: 'Failed to get CORS' }, { status: 500 })
  }
}
