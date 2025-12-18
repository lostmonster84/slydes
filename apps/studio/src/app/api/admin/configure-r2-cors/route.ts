import { NextResponse } from 'next/server'
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3'

/**
 * POST /api/admin/configure-r2-cors
 *
 * Configures CORS on the R2 bucket to allow audio playback from any origin.
 */
export async function POST(req: Request) {
  // Check admin auth
  const authHeader = req.headers.get('Authorization')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'slydes-audio'

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 })
  }

  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    // Configure CORS to allow audio playback from any origin
    await r2.send(new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedHeaders: ['*'],
            ExposeHeaders: ['Content-Length', 'Content-Type', 'Accept-Ranges'],
            MaxAgeSeconds: 86400, // Cache preflight for 24 hours
          },
        ],
      },
    }))

    // Verify it was set
    const corsResult = await r2.send(new GetBucketCorsCommand({ Bucket: bucketName }))

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

/**
 * GET /api/admin/configure-r2-cors
 *
 * Gets the current CORS configuration.
 */
export async function GET(req: Request) {
  // Check admin auth
  const authHeader = req.headers.get('Authorization')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'slydes-audio'

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 })
  }

  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    const corsResult = await r2.send(new GetBucketCorsCommand({ Bucket: bucketName }))
    return NextResponse.json({
      cors: corsResult.CORSRules || [],
    })
  } catch (err) {
    // NoSuchCORSConfiguration means no CORS is set
    if (err instanceof Error && err.name === 'NoSuchCORSConfiguration') {
      return NextResponse.json({ cors: [], message: 'No CORS configuration found' })
    }
    console.error('Error getting CORS:', err)
    return NextResponse.json(
      { error: 'Failed to get CORS', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
