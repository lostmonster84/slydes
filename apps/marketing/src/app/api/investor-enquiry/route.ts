import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'james@lostmonster.io'

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Send notification email
    const { error } = await getResend().emails.send({
      from: 'Slydes Investors <investors@mail.slydes.io>',
      to: CONTACT_EMAIL,
      subject: `Investor Enquiry: ${name}${company ? ` (${company})` : ''}`,
      html: `
        <h2>New Investor Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company/Fund:</strong> ${company}</p>` : ''}
        ${message ? `<p><strong>Message:</strong></p><p>${message}</p>` : ''}
        <hr />
        <p style="color: #666; font-size: 12px;">
          Reply to this email or send them the investor page password if you'd like to share materials.
        </p>
      `,
      replyTo: email,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send enquiry. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll review your request and be in touch within 48 hours.",
    })
  } catch (error) {
    console.error('Investor enquiry error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

