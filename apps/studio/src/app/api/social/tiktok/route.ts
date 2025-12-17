import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface TikTokResponse {
  ok: boolean
  followers?: number
  handle?: string
  error?: string
}

/**
 * GET /api/social/tiktok?username=wildtrax_scotland
 *
 * Fetches TikTok follower count from a public profile.
 * Scrapes the public page - no API key required.
 */
export async function GET(request: NextRequest): Promise<NextResponse<TikTokResponse>> {
  const username = request.nextUrl.searchParams.get('username')

  if (!username) {
    return NextResponse.json({ ok: false, error: 'Username is required' }, { status: 400 })
  }

  // Clean the username (remove @ if present)
  const cleanUsername = username.replace(/^@/, '').trim().toLowerCase()

  if (!cleanUsername || !/^[\w.]+$/.test(cleanUsername)) {
    return NextResponse.json({ ok: false, error: 'Invalid username format' }, { status: 400 })
  }

  try {
    const followers = await fetchTikTokFollowers(cleanUsername)

    return NextResponse.json({
      ok: true,
      followers,
      handle: cleanUsername,
    })
  } catch (error) {
    console.error('TikTok fetch error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to fetch TikTok data' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/social/tiktok
 *
 * Fetches TikTok followers and saves to organization.
 * Body: { username: string, organizationId: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse<TikTokResponse>> {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: { username: string; organizationId: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { username, organizationId } = body

  if (!username || !organizationId) {
    return NextResponse.json({ ok: false, error: 'Username and organizationId are required' }, { status: 400 })
  }

  // Clean the username
  const cleanUsername = username.replace(/^@/, '').trim().toLowerCase()

  if (!cleanUsername || !/^[\w.]+$/.test(cleanUsername)) {
    return NextResponse.json({ ok: false, error: 'Invalid username format' }, { status: 400 })
  }

  try {
    // Verify user owns the organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, owner_id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ ok: false, error: 'Organization not found' }, { status: 404 })
    }

    if (org.owner_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch follower count
    const followers = await fetchTikTokFollowers(cleanUsername)

    // Update organization with the data
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        tiktok_handle: cleanUsername,
        tiktok_followers: followers,
        tiktok_updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      ok: true,
      followers,
      handle: cleanUsername,
    })
  } catch (error) {
    console.error('TikTok fetch error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to fetch TikTok data' },
      { status: 500 }
    )
  }
}

/**
 * Fetches follower count from TikTok public profile
 */
async function fetchTikTokFollowers(username: string): Promise<number> {
  const url = `https://www.tiktok.com/@${username}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('TikTok account not found')
    }
    throw new Error(`TikTok returned status ${response.status}`)
  }

  const html = await response.text()

  // TikTok embeds user data in a script tag as JSON
  // Look for the __UNIVERSAL_DATA_FOR_REHYDRATION__ or similar

  // Method 1: Look for follower count in the JSON data
  const followerMatch = html.match(/"followerCount"\s*:\s*(\d+)/)
  if (followerMatch) {
    return parseInt(followerMatch[1], 10)
  }

  // Method 2: Look in stats object
  const statsMatch = html.match(/"stats"\s*:\s*{[^}]*"followerCount"\s*:\s*(\d+)/)
  if (statsMatch) {
    return parseInt(statsMatch[1], 10)
  }

  // Method 3: Look for the count in different format
  const altMatch = html.match(/followers['"]\s*:\s*['"]?(\d+(?:\.\d+)?[KMB]?)['"]?/i)
  if (altMatch) {
    return parseFollowerCount(altMatch[1])
  }

  // Method 4: Check meta tags
  const metaMatch = html.match(/content=['"](\d+(?:\.\d+)?[KMB]?)\s*Followers/i)
  if (metaMatch) {
    return parseFollowerCount(metaMatch[1])
  }

  // Method 5: Look in the SIGI_STATE data
  const sigiMatch = html.match(/"fans"\s*:\s*(\d+)/)
  if (sigiMatch) {
    return parseInt(sigiMatch[1], 10)
  }

  throw new Error('Could not extract follower count from TikTok profile')
}

/**
 * Parses follower count strings like "1.5K", "2M", "500"
 */
function parseFollowerCount(str: string): number {
  const num = parseFloat(str.replace(/[KMB]/i, ''))
  const suffix = str.slice(-1).toUpperCase()

  switch (suffix) {
    case 'K':
      return Math.round(num * 1000)
    case 'M':
      return Math.round(num * 1000000)
    case 'B':
      return Math.round(num * 1000000000)
    default:
      return Math.round(num)
  }
}
