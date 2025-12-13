import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// Email to receive contact form submissions
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'james@lostmonster.io'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, subject, message } = data

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Format subject line
    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      sales: 'Sales & Pricing',
      support: 'Support',
      partnership: 'Partnership',
      press: 'Press & Media',
      other: 'Other',
    }
    const subjectLine = subject 
      ? `[Slydes Contact] ${subjectLabels[subject] || subject}`
      : '[Slydes Contact] New Message'

    // Send email via Resend
    const { error } = await getResend().emails.send({
      from: 'Slydes Contact Form <contact@mail.slydes.io>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: subjectLine,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">${name || 'Not provided'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
              <p style="margin: 0; font-size: 16px; color: #111827;"><a href="mailto:${email}" style="color: #2563EB; text-decoration: none;">${email}</a></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
              <p style="margin: 0; font-size: 16px; color: #111827;">${subjectLabels[subject] || subject || 'Not specified'}</p>
            </div>
            
            <div style="margin-bottom: 0;">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
              <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 16px; color: #111827; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            This message was sent from the Slydes contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${name || 'Not provided'}
Email: ${email}
Subject: ${subjectLabels[subject] || subject || 'Not specified'}

Message:
${message}

---
This message was sent from the Slydes contact form.
      `.trim(),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Contact form submission:', { name, email, subject })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

