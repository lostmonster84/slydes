import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Email to receive HQ notifications
const HQ_NOTIFICATION_EMAIL = process.env.CONTACT_EMAIL || 'james@lostmonster.io'

/**
 * Messages API - HQ Admin
 *
 * GET: Retrieve all messages (with optional status filter)
 * POST: Add new message (from contact form, music help, etc.)
 * PATCH: Update message status
 */

interface Message {
  id: string
  type: 'general' | 'music_help' | 'contact' | 'support' | 'investor' | 'affiliate' | 'partner'
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

    // Send email notification to HQ
    try {
      const typeLabels: Record<string, string> = {
        music_help: '🎵 Music Help',
        contact: '📬 Contact Form',
        support: '🆘 Support',
        general: '💬 General',
        investor: '💰 Investor',
        affiliate: '🤝 Affiliate',
        partner: '🚀 Partner',
      }
      const typeLabel = typeLabels[newMessage.type] || newMessage.type

      await getResend().emails.send({
        from: 'Slydes HQ <hq@mail.slydes.io>',
        to: HQ_NOTIFICATION_EMAIL,
        replyTo: newMessage.user_email || undefined,
        subject: `[HQ] ${typeLabel}: ${newMessage.subject || 'New message'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Message in Slydes HQ</h1>
            </div>

            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="flex: 1;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Type</p>
                  <p style="margin: 0; font-size: 14px; color: #111827; font-weight: 500;">${typeLabel}</p>
                </div>
                <div style="flex: 1;">
                  <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                  <p style="margin: 0; font-size: 14px; color: #111827;">${newMessage.user_name || newMessage.user_email || 'Anonymous'}</p>
                </div>
              </div>

              ${newMessage.user_email ? `
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                <p style="margin: 0; font-size: 14px;"><a href="mailto:${newMessage.user_email}" style="color: #2563EB; text-decoration: none;">${newMessage.user_email}</a></p>
              </div>
              ` : ''}

              ${newMessage.subject ? `
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
                <p style="margin: 0; font-size: 14px; color: #111827;">${newMessage.subject}</p>
              </div>
              ` : ''}

              <div>
                <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 14px; color: #111827; white-space: pre-wrap;">${newMessage.message}</p>
                </div>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 16px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <a href="https://slydes.io/admin/messages" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">View in HQ</a>
            </div>
          </div>
        `,
        text: `New Message in Slydes HQ

Type: ${typeLabel}
From: ${newMessage.user_name || newMessage.user_email || 'Anonymous'}
${newMessage.user_email ? `Email: ${newMessage.user_email}` : ''}
${newMessage.subject ? `Subject: ${newMessage.subject}` : ''}

Message:
${newMessage.message}

---
View in HQ: https://slydes.io/admin/messages`,
      })
    } catch (emailErr) {
      // Don't fail the request if email notification fails
      console.error('Failed to send HQ notification email:', emailErr)
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
