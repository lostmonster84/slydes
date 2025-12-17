import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface InstagramResponse {
  ok: boolean
  followers?: number
  handle?: string
  error?: string
}

/**
 * GET /api/social/instagram?username=wildtrax_scotland
 *
 * Validates and returns the Instagram handle.
 * We don't fetch follower counts - just store the handle for reference.
 */
export async function GET(request: NextRequest): Promise<NextResponse<InstagramResponse>> {
  const username = request.nextUrl.searchParams.get('username')

  if (!username) {
    return NextResponse.json({ ok: false, error: 'Username is required' }, { status: 400 })
  }

  // Clean the username (remove @ if present)
  const cleanUsername = username.replace(/^@/, '').trim().toLowerCase()

  if (!cleanUsername || !/^[\w.]+$/.test(cleanUsername)) {
    return NextResponse.json({ ok: false, error: 'Invalid username format' }, { status: 400 })
  }

  // Just return the validated handle - no follower scraping
  return NextResponse.json({
    ok: true,
    handle: cleanUsername,
  })
}

/**
 * POST /api/social/instagram
 *
 * Saves Instagram data to organization.
 * Body: { username: string, organizationId: string, followers?: number }
 *
 * If followers is provided (client-side fetch), saves directly.
 * Otherwise, attempts server-side fetch (may fail due to Instagram blocking).
 */
export async function POST(request: NextRequest): Promise<NextResponse<InstagramResponse>> {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: { username: string; organizationId: string; followers?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const { username, organizationId, followers: clientFollowers } = body

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

    // Save handle and optional follower count (user-provided)
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        instagram_handle: cleanUsername,
        instagram_followers: clientFollowers ?? null,
        instagram_updated_at: new Date().toISOString(),
      })
      .eq('id', organizationId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      ok: true,
      handle: cleanUsername,
    })
  } catch (error) {
    console.error('Instagram save error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to save Instagram data' },
      { status: 500 }
    )
  }
}
