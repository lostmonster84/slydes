import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/dev/demos/[id]
 * Get a single demo by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  const { id } = await params

  try {
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('generated_demos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch demo:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: 'Demo not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('Error fetching demo:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch demo' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/dev/demos/[id]
 * Update a demo (status, notes, sent_to, etc.)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { status, notes, sent_to } = body

    const admin = createAdminClient()

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes
    if (sent_to !== undefined) {
      updates.sent_to = sent_to
      updates.sent_at = new Date().toISOString()
    }

    const { data, error } = await admin
      .from('generated_demos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update demo:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('Error updating demo:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to update demo' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dev/demos/[id]
 * Delete a demo
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  const { id } = await params

  try {
    const admin = createAdminClient()

    const { error } = await admin
      .from('generated_demos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete demo:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error deleting demo:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to delete demo' },
      { status: 500 }
    )
  }
}
