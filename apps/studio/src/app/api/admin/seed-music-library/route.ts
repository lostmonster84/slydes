import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

/**
 * POST /api/admin/seed-music-library
 *
 * Admin-only route to seed the music library with royalty-free tracks.
 * Downloads tracks from source URLs and uploads to R2.
 *
 * Query params:
 * - force: boolean (re-upload even if exists)
 */

// Royalty-free music sources (direct download URLs)
// Using tracks from various CC0/royalty-free sources
const MUSIC_SOURCES: { id: string; title: string; sourceUrl: string }[] = [
  // Upbeat - Using bensound.com royalty-free tracks (attribution required in production)
  {
    id: 'upbeat-01',
    title: 'Good Vibes',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
  },
  {
    id: 'upbeat-02',
    title: 'Fresh Start',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
  },
  {
    id: 'upbeat-03',
    title: 'Rise & Shine',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
  },

  // Chill
  {
    id: 'chill-01',
    title: 'Mellow Afternoon',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-littleidea.mp3',
  },
  {
    id: 'chill-02',
    title: 'Easy Going',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3',
  },
  {
    id: 'chill-03',
    title: 'Laid Back',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-cute.mp3',
  },

  // Energetic
  {
    id: 'energetic-01',
    title: 'Full Throttle',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-actionable.mp3',
  },
  {
    id: 'energetic-02',
    title: 'Power Move',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-energy.mp3',
  },
  {
    id: 'energetic-03',
    title: 'Game On',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-funkysuspense.mp3',
  },

  // Ambient
  {
    id: 'ambient-01',
    title: 'Peaceful Mind',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
  },
  {
    id: 'ambient-02',
    title: 'Drift Away',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
  },
  {
    id: 'ambient-03',
    title: 'Soft Focus',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
  },

  // Cinematic
  {
    id: 'cinematic-01',
    title: 'Epic Journey',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-epic.mp3',
  },
  {
    id: 'cinematic-02',
    title: 'Grand Vision',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-evolution.mp3',
  },
  {
    id: 'cinematic-03',
    title: 'The Reveal',
    sourceUrl: 'https://www.bensound.com/bensound-music/bensound-scifi.mp3',
  },
]

export async function POST(req: Request) {
  // Check admin auth (simple password for now)
  const authHeader = req.headers.get('Authorization')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const force = url.searchParams.get('force') === 'true'

  // Get R2 credentials
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

  const results: { id: string; status: 'uploaded' | 'exists' | 'error'; error?: string }[] = []

  for (const track of MUSIC_SOURCES) {
    const key = `library/${track.id}.mp3`

    try {
      // Check if already exists (unless force)
      if (!force) {
        try {
          await r2.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }))
          results.push({ id: track.id, status: 'exists' })
          continue
        } catch {
          // Doesn't exist, continue to upload
        }
      }

      // Download from source
      console.log(`Downloading ${track.title} from ${track.sourceUrl}...`)
      const response = await fetch(track.sourceUrl)

      if (!response.ok) {
        results.push({ id: track.id, status: 'error', error: `Download failed: ${response.status}` })
        continue
      }

      const audioBuffer = await response.arrayBuffer()
      console.log(`Downloaded ${track.title}: ${audioBuffer.byteLength} bytes`)

      // Upload to R2
      await r2.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(audioBuffer),
        ContentType: 'audio/mpeg',
        Metadata: {
          title: track.title,
          source: 'bensound.com',
          license: 'royalty-free-with-attribution',
        },
      }))

      results.push({ id: track.id, status: 'uploaded' })
      console.log(`Uploaded ${track.title} to R2`)
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      results.push({ id: track.id, status: 'error', error })
      console.error(`Error processing ${track.title}:`, error)
    }
  }

  const uploaded = results.filter(r => r.status === 'uploaded').length
  const exists = results.filter(r => r.status === 'exists').length
  const errors = results.filter(r => r.status === 'error').length

  return NextResponse.json({
    summary: { uploaded, exists, errors, total: MUSIC_SOURCES.length },
    results,
  })
}
