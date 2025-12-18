import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Messages API - HQ Admin
 *
 * GET: Retrieve all messages (with optional status filter)
 * POST: Add new message (from contact form, music help, etc.)
 * PATCH: Update message status
 */

interface Message {
  id: string
  type: 'general' | 'music_help' | 'contact' | 'support'
  subject: string | null
  message: string
  user_email: string | null
  user_name: string | null
  user_id: string | null
  org_name: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const supabase = createSupabaseAdmin()

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    return NextResponse.json({
      messages: data || [],
      unreadCount: unreadCount || 0,
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  } catch (err) {
    console.error('Error in messages GET:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const newMessage = {
      type: body.type || 'general',
      subject: body.subject?.trim() || null,
      message: body.message.trim(),
      user_email: body.userEmail || body.email || null,
      user_name: body.userName || body.name || null,
      user_id: body.userId || null,
      org_name: body.orgName || null,
      status: 'new',
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single()

    if (error) {
      console.error('Error inserting message:', error)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: data }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  } catch (err) {
    console.error('Error adding message:', err)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    const updates: Partial<Message> = {}
    if (body.status) updates.status = body.status

    const { data, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating message:', error)
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: data })
  } catch (err) {
    console.error('Error updating message:', err)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
