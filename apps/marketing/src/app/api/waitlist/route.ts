import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

// Slydes Waitlist Audience ID
const AUDIENCE_ID = '29817019-d28f-4bbe-8a64-3f4c64d6b8fc'

// Lazy init to avoid build-time errors when env var not set
const getResend = () => new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, firstName, industry, source, utmSource, utmMedium, utmCampaign } = data

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

    // 1. Save to Supabase (primary data store)
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingEntry) {
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the waitlist!',
        alreadyExists: true,
      })
    }

    const { error: supabaseError } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName || null,
        industry: industry || null,
        source: source || 'website',
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      })

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      // Don't fail completely - still try Resend
    }

    // 2. Also add to Resend Audience (for email campaigns)
    try {
      await getResend().contacts.create({
        email: email,
        firstName: firstName || undefined,
        lastName: industry || undefined, // Using lastName to store industry (Resend limitation)
        audienceId: AUDIENCE_ID,
      })
    } catch (resendError) {
      // Log but don't fail - Supabase is the source of truth
      console.error('Resend error (non-fatal):', resendError)
    }

    console.log('Waitlist signup:', { email, firstName, industry })

    // 3. Send notification email to you
    try {
      await getResend().emails.send({
        from: 'Slydes Waitlist <notifications@mail.slydes.io>',
        to: 'james@lostmonster.io',
        subject: `New waitlist signup: ${email}`,
        html: `
          <h2>New Waitlist Signup! 🎉</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>First Name:</strong> ${firstName || 'Not provided'}</p>
          <p><strong>Industry:</strong> ${industry || 'Not selected'}</p>
          <p><strong>Source:</strong> ${source || 'website'}</p>
          <hr />
          <p><a href="https://slydes.io/admin/waitlist">View all signups →</a></p>
        `,
      })
    } catch (emailError) {
      console.error('Notification email error (non-fatal):', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'You\'re on the list! We\'ll be in touch soon.',
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
