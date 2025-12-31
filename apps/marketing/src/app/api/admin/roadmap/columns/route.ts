import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Roadmap Columns API - HQ Admin
 *
 * GET: Retrieve all columns (ordered by position)
 * POST: Create a new column
 * PATCH: Update a column (label, description, icon, icon_color, position)
 * DELETE: Delete a column (only if no items in it)
 */

interface RoadmapColumn {
  id: string
  slug: string
  label: string
  description?: string
  icon: string
  icon_color: string
  position: number
  is_done_column: boolean
  created_at: string
  updated_at: string
}

// Map DB snake_case to camelCase for frontend
function toFrontend(column: RoadmapColumn) {
  return {
    id: column.id,
    slug: column.slug,
    label: column.label,
    description: column.description,
    icon: column.icon,
    iconColor: column.icon_color,
    position: column.position,
    isDoneColumn: column.is_done_column,
    createdAt: column.created_at,
    updatedAt: column.updated_at,
  }
}

// Convert a label to a URL-safe slug
function labelToSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('roadmap_columns')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching roadmap columns:', error)
      return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 })
    }

    const columns = (data || []).map(toFrontend)

    return NextResponse.json({ columns }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error in roadmap columns GET:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.label?.trim()) {
      return NextResponse.json({ error: 'Label is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    // Generate slug from label if not provided
    const slug = body.slug?.trim() || labelToSlug(body.label)

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('roadmap_columns')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A column with this slug already exists' }, { status: 400 })
    }

    // Get max position to append at the end
    const { data: maxPosData } = await supabase
      .from('roadmap_columns')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const nextPosition = (maxPosData?.position ?? -1) + 1

    const newColumn = {
      slug,
      label: body.label.trim(),
      description: body.description?.trim() || null,
      icon: body.icon || 'circle',
      icon_color: body.iconColor || 'text-gray-400',
      position: body.position ?? nextPosition,
      is_done_column: body.isDoneColumn ?? false,
    }

    const { data, error } = await supabase
      .from('roadmap_columns')
      .insert(newColumn)
      .select()
      .single()

    if (error) {
      console.error('Error inserting roadmap column:', error)
      return NextResponse.json({ error: 'Failed to add column' }, { status: 500 })
    }

    return NextResponse.json({ success: true, column: toFrontend(data) }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error adding roadmap column:', err)
    return NextResponse.json({ error: 'Failed to add column' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Column ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    // Build update object with only provided fields
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.label !== undefined) updates.label = body.label.trim()
    if (body.description !== undefined) updates.description = body.description?.trim() || null
    if (body.icon !== undefined) updates.icon = body.icon
    if (body.iconColor !== undefined) updates.icon_color = body.iconColor
    if (body.position !== undefined) updates.position = body.position
    if (body.isDoneColumn !== undefined) updates.is_done_column = body.isDoneColumn

    // If label changes and no slug provided, update slug too
    if (body.label !== undefined && body.slug === undefined) {
      const newSlug = labelToSlug(body.label)

      // Get current column to get old slug
      const { data: currentColumn } = await supabase
        .from('roadmap_columns')
        .select('slug')
        .eq('id', body.id)
        .single()

      if (currentColumn && currentColumn.slug !== newSlug) {
        // Check if new slug already exists (for a different column)
        const { data: existingSlug } = await supabase
          .from('roadmap_columns')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', body.id)
          .single()

        if (!existingSlug) {
          // Update the slug - this will cascade to roadmap_items due to ON UPDATE CASCADE
          updates.slug = newSlug
        }
      }
    }

    const { data, error } = await supabase
      .from('roadmap_columns')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating roadmap column:', error)
      return NextResponse.json({ error: 'Failed to update column' }, { status: 500 })
    }

    return NextResponse.json({ success: true, column: toFrontend(data) }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error updating roadmap column:', err)
    return NextResponse.json({ error: 'Failed to update column' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Column ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    // Get the column to find its slug
    const { data: column, error: columnError } = await supabase
      .from('roadmap_columns')
      .select('slug')
      .eq('id', id)
      .single()

    if (columnError || !column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 })
    }

    // Check if any items are using this column
    const { count, error: countError } = await supabase
      .from('roadmap_items')
      .select('*', { count: 'exact', head: true })
      .eq('status', column.slug)

    if (countError) {
      console.error('Error checking items:', countError)
      return NextResponse.json({ error: 'Failed to check column items' }, { status: 500 })
    }

    if (count && count > 0) {
      return NextResponse.json({
        error: `Cannot delete column with ${count} item(s). Move or delete items first.`
      }, { status: 400 })
    }

    // Delete the column
    const { error } = await supabase
      .from('roadmap_columns')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting roadmap column:', error)
      return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error deleting roadmap column:', err)
    return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
