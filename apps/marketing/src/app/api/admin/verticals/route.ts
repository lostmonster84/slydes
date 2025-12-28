import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

interface Vertical {
  vertical_id: string
  name: string
  description?: string
  icon?: string
  display_order?: number
  enabled?: boolean
  features_enabled: {
    lists: boolean
    shop: boolean
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [storedPassword, timestamp] = decoded.split('-')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || storedPassword !== adminPassword) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

// GET - Fetch all verticals with full metadata
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('vertical_defaults')
      .select('vertical_id, name, description, icon, display_order, enabled, features_enabled')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[Verticals API] Query error:', error)
      throw new Error(error.message || 'Failed to query verticals')
    }

    // Return both formats for backwards compatibility
    const defaults: Record<string, { lists: boolean; shop: boolean }> = {}
    for (const row of data || []) {
      defaults[row.vertical_id] = row.features_enabled as { lists: boolean; shop: boolean }
    }

    return NextResponse.json({
      verticals: data || [],
      defaults // backwards compatibility
    })
  } catch (error) {
    console.error('Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verticals' },
      { status: 500 }
    )
  }
}

// POST - Create a new vertical
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as Vertical

    if (!body.vertical_id || !body.name) {
      return NextResponse.json(
        { error: 'Missing vertical_id or name' },
        { status: 400 }
      )
    }

    // Validate vertical_id format (lowercase, alphanumeric, hyphens)
    if (!/^[a-z0-9-]+$/.test(body.vertical_id)) {
      return NextResponse.json(
        { error: 'Invalid vertical_id format. Use lowercase letters, numbers, and hyphens only.' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()

    // Check if vertical already exists
    const { data: existing } = await supabase
      .from('vertical_defaults')
      .select('vertical_id')
      .eq('vertical_id', body.vertical_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A vertical with this ID already exists' },
        { status: 409 }
      )
    }

    // Get max display_order for new vertical
    const { data: maxOrder } = await supabase
      .from('vertical_defaults')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const newOrder = (maxOrder?.display_order || 0) + 1

    const { data, error } = await supabase
      .from('vertical_defaults')
      .insert({
        vertical_id: body.vertical_id,
        name: body.name,
        description: body.description || null,
        icon: body.icon || '✨',
        display_order: body.display_order ?? newOrder,
        enabled: body.enabled ?? true,
        features_enabled: body.features_enabled || { lists: false, shop: false },
      })
      .select()
      .single()

    if (error) {
      console.error('[Verticals API] Insert error:', error)
      throw new Error(error.message || 'Failed to create vertical')
    }

    return NextResponse.json({ vertical: data })
  } catch (error) {
    console.error('Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to create vertical' },
      { status: 500 }
    )
  }
}

// PUT - Update a vertical (metadata and/or features)
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as Partial<Vertical> & { vertical_id: string }

    if (!body.vertical_id) {
      return NextResponse.json(
        { error: 'Missing vertical_id' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.icon !== undefined) updates.icon = body.icon
    if (body.display_order !== undefined) updates.display_order = body.display_order
    if (body.enabled !== undefined) updates.enabled = body.enabled
    if (body.features_enabled !== undefined) updates.features_enabled = body.features_enabled

    const { data, error } = await supabase
      .from('vertical_defaults')
      .update(updates)
      .eq('vertical_id', body.vertical_id)
      .select()
      .single()

    if (error) {
      console.error('[Verticals API] Update error:', error)
      // Check if it's a "no rows" error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vertical not found' },
          { status: 404 }
        )
      }
      throw new Error(error.message || 'Failed to update vertical')
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Vertical not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ vertical: data, success: true })
  } catch (error) {
    console.error('Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to update vertical' },
      { status: 500 }
    )
  }
}

// DELETE - Disable a vertical (soft delete)
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const verticalId = searchParams.get('id')

    if (!verticalId) {
      return NextResponse.json(
        { error: 'Missing vertical id' },
        { status: 400 }
      )
    }

    // Don't allow deleting 'other' - it's the fallback
    if (verticalId === 'other') {
      return NextResponse.json(
        { error: 'Cannot delete the "Other" vertical - it serves as the default fallback' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdmin()

    // Soft delete by setting enabled = false
    const { error } = await supabase
      .from('vertical_defaults')
      .update({ enabled: false, updated_at: new Date().toISOString() })
      .eq('vertical_id', verticalId)

    if (error) {
      console.error('[Verticals API] Delete error:', error)
      throw new Error(error.message || 'Failed to disable vertical')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to disable vertical' },
      { status: 500 }
    )
  }
}
