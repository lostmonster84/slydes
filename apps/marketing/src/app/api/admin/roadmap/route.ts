import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Roadmap API - HQ Admin
 *
 * GET: Retrieve all roadmap items
 * POST: Add a new item (used by feature suggestions from Studio)
 *
 * For now, uses a simple JSON file for storage.
 * Can be migrated to Supabase later.
 */

// In-memory storage for development (will reset on server restart)
// TODO: Move to Supabase for persistence
let roadmapItems: RoadmapItem[] = []

interface RoadmapItem {
  id: string
  title: string
  description?: string
  status: 'triage' | 'planned' | 'in-progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  category?: string
  requestType?: string
  source: 'manual' | 'suggestion'
  userEmail?: string
  orgName?: string
  createdAt: string
}

// Simple auth check for admin routes
async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  return token?.value === process.env.ADMIN_PASSWORD
}

export async function GET() {
  // For GET, we allow cross-origin to let Studio fetch
  return NextResponse.json({ items: roadmapItems }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newItem: RoadmapItem = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
      status: 'triage', // Suggestions always start in triage
      priority: body.priority || 'medium',
      category: body.category || undefined,
      requestType: body.requestType || 'feature',
      source: body.source || 'suggestion',
      userEmail: body.userEmail || undefined,
      orgName: body.orgName || undefined,
      createdAt: new Date().toISOString(),
    }

    roadmapItems.unshift(newItem)

    return NextResponse.json({ success: true, item: newItem }, {
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
