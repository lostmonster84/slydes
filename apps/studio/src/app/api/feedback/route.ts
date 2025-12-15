import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  // Auth check - get user info for context
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  // Parse request body
  let body: {
    category?: string
    requestType?: string
    title: string
    description?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Validate required fields
  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  // Get user email if logged in
  const userEmail = authData?.user?.email || 'anonymous'
  const userId = authData?.user?.id || 'anonymous'

  // Get org info if available
  let orgName = 'Unknown'
  if (authData?.user?.id) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organizations(name)')
      .eq('user_id', authData.user.id)
      .single()

    if (membership?.organizations) {
      const org = membership.organizations as unknown as { name: string }
      orgName = org.name
    }
  }

  // Build email content
  const typeLabels: Record<string, string> = {
    feature: 'New Feature',
    improvement: 'Improvement',
    bug: 'Bug Report',
    ux: 'UX / Usability',
  }
  const typeLabel = typeLabels[body.requestType || 'feature'] || 'Feature'

  const categoryLabels: Record<string, string> = {
    editor: 'Editor / Studio',
    slydes: 'Slydes & Content',
    analytics: 'Analytics',
    brand: 'Brand & Design',
    inbox: 'Inbox & Enquiries',
    other: 'Other',
  }
  const categoryLabel = categoryLabels[body.category || ''] || 'Not specified'

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #06B6D4, #2563EB); padding: 24px; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">💡 ${typeLabel}</h1>
      </div>

      <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Category</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${categoryLabel}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">User</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Organization</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${orgName}</td>
          </tr>
        </table>
      </div>

      <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px;">${body.title}</h2>
        <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${body.description || '(No description provided)'}</p>
      </div>

      <div style="background: #f9fafb; padding: 16px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          User ID: ${userId}<br>
          Submitted: ${new Date().toISOString()}
        </p>
      </div>
    </div>
  `

  const textContent = `
${typeLabel} - Slydes Studio Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Category: ${categoryLabel}
User: ${userEmail}
Organization: ${orgName}

Title: ${body.title}

Description:
${body.description || '(No description provided)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User ID: ${userId}
Submitted: ${new Date().toISOString()}
  `.trim()

  try {
    const { error } = await resend.emails.send({
      from: 'Slydes Studio <feedback@mail.slydes.io>',
      to: ['james@slydes.io'],
      replyTo: userEmail !== 'anonymous' ? userEmail : undefined,
      subject: `[${typeLabel}] ${body.title}`,
      html: htmlContent,
      text: textContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error sending feedback:', err)
    return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 })
  }
}
