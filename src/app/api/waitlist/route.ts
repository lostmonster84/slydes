import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Slydes Waitlist Audience ID
const AUDIENCE_ID = '29817019-d28f-4bbe-8a64-3f4c64d6b8fc'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, firstName } = data

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Add contact to Resend Audience
    const { data: contact, error } = await getResend().contacts.create({
      email: email,
      firstName: firstName || undefined,
      audienceId: AUDIENCE_ID,
    })

    if (error) {
      console.error('Resend error:', error)
      
      // Handle duplicate email gracefully
      if (error.message?.includes('already exists')) {
        return NextResponse.json({
          success: true,
          message: 'You\'re already on the waitlist!',
          alreadyExists: true,
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Waitlist signup:', { email, firstName, contactId: contact?.id })

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      contactId: contact?.id,
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
