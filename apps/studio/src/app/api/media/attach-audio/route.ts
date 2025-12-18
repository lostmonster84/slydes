import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/media/attach-audio
 *
 * Saves audio selection to organization.
 * Supports either custom upload (R2 key) or library selection (track ID).
 * These are mutually exclusive - setting one clears the other.
 *
 * Body:
 * - type: 'upload' | 'library' | 'none'
 * - r2Key?: string (for custom upload)
 * - libraryId?: string (for library selection)
 * - enabled?: boolean (default true)
 *
 * Returns:
 * - success: boolean
 * - organization: updated org data
 */
export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  let body: {
    type: 'upload' | 'library' | 'none'
    r2Key?: string
    libraryId?: string
    enabled?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { type, r2Key, libraryId, enabled = true } = body

  if (!type) {
    return NextResponse.json({ error: 'type is required' }, { status: 400 })
  }

  // Validate based on type
  if (type === 'upload' && !r2Key) {
    return NextResponse.json({ error: 'r2Key is required for upload type' }, { status: 400 })
  }
  if (type === 'library' && !libraryId) {
    return NextResponse.json({ error: 'libraryId is required for library type' }, { status: 400 })
  }

  try {
    // Get user's organization
    const { data: orgs, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', authData.user.id)
      .limit(1)

    if (orgError || !orgs || orgs.length === 0) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    const orgId = orgs[0].id

    // Prepare update - clear the other field when setting one
    const updates: Record<string, unknown> = {
      home_audio_enabled: enabled,
    }

    if (type === 'none') {
      // Clear both
      updates.home_audio_r2_key = null
      updates.home_audio_library_id = null
    } else if (type === 'upload') {
      updates.home_audio_r2_key = r2Key
      updates.home_audio_library_id = null // Clear library selection
    } else if (type === 'library') {
      updates.home_audio_library_id = libraryId
      updates.home_audio_r2_key = null // Clear custom upload
    }

    // Update organization
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating organization audio:', updateError)
      return NextResponse.json({ error: 'Failed to update audio settings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      organization: updatedOrg,
    })
  } catch (err) {
    console.error('Error attaching audio:', err)
    return NextResponse.json({ error: 'Failed to attach audio' }, { status: 500 })
  }
}
