import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/media/attach-to-frame
 *
 * Attaches uploaded media (video or image) to a frame.
 * Called after successful Cloudflare upload.
 *
 * Body:
 * - frameId: string (UUID of the frame)
 * - videoStreamUid?: string (Cloudflare Stream UID)
 * - imageId?: string (Cloudflare Images ID)
 * - imageVariant?: string (default 'public')
 *
 * Returns:
 * - success: boolean
 * - frame: updated frame data
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
    frameId: string
    videoStreamUid?: string
    imageId?: string
    imageVariant?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { frameId, videoStreamUid, imageId, imageVariant } = body

  if (!frameId) {
    return NextResponse.json({ error: 'frameId is required' }, { status: 400 })
  }

  if (!videoStreamUid && !imageId) {
    return NextResponse.json(
      { error: 'Either videoStreamUid or imageId is required' },
      { status: 400 }
    )
  }

  try {
    // First verify the user owns this frame (through slyde -> organization)
    const { data: frame, error: frameError } = await supabase
      .from('frames')
      .select(`
        id,
        slyde_id,
        slydes!inner (
          id,
          organization_id,
          organizations!inner (
            id,
            owner_id
          )
        )
      `)
      .eq('id', frameId)
      .single()

    if (frameError || !frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // Check ownership
    const orgOwnerId = (frame.slydes as any)?.organizations?.owner_id
    if (orgOwnerId !== authData.user.id) {
      // Also check org members
      const { data: membership } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', (frame.slydes as any)?.organization_id)
        .eq('user_id', authData.user.id)
        .single()

      if (!membership) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    // Build update payload
    const updates: Record<string, any> = {}

    if (videoStreamUid) {
      updates.video_stream_uid = videoStreamUid
      updates.video_status = 'processing' // Will be updated by webhook when ready
    }

    if (imageId) {
      updates.image_id = imageId
      updates.image_variant = imageVariant || 'public'
    }

    // Update the frame
    const { data: updatedFrame, error: updateError } = await supabase
      .from('frames')
      .update(updates)
      .eq('id', frameId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating frame:', updateError)
      return NextResponse.json(
        { error: 'Failed to attach media to frame' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      frame: updatedFrame,
    })
  } catch (err) {
    console.error('Error attaching media:', err)
    return NextResponse.json(
      { error: 'Failed to attach media' },
      { status: 500 }
    )
  }
}







