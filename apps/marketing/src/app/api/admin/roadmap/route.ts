import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Roadmap API - HQ Admin
 *
 * GET: Retrieve all roadmap items
 * POST: Add a new item (used by feature suggestions from Studio)
 *
 * Uses Supabase for persistence.
 */

interface RoadmapItem {
  id: string
  title: string
  description?: string
  status: 'triage' | 'planned' | 'in-progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  category?: string
  request_type?: string
  source: 'manual' | 'suggestion'
  user_email?: string
  org_name?: string
  created_at: string
}

// Map DB snake_case to camelCase for frontend
function toFrontend(item: RoadmapItem) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
    category: item.category,
    requestType: item.request_type,
    source: item.source,
    userEmail: item.user_email,
    orgName: item.org_name,
    createdAt: item.created_at,
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching roadmap items:', error)
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }

    const items = (data || []).map(toFrontend)

    return NextResponse.json({ items }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error in roadmap GET:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const newItem = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      status: 'triage', // Suggestions always start in triage
      priority: body.priority || 'medium',
      category: body.category || null,
      request_type: body.requestType || 'feature',
      source: body.source || 'suggestion',
      user_email: body.userEmail || null,
      org_name: body.orgName || null,
    }

    const { data, error } = await supabase
      .from('roadmap_items')
      .insert(newItem)
      .select()
      .single()

    if (error) {
      console.error('Error inserting roadmap item:', error)
      return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
    }

    return NextResponse.json({ success: true, item: toFrontend(data) }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (err) {
    console.error('Error adding roadmap item:', err)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
