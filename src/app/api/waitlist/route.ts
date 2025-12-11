import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, company, useCase, updates } = data

    // Validate required fields
    if (!name || !email || !useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Integrate with Resend for email sending
    // TODO: Store in database or Airtable/Notion
    
    // For now, log to console (in production, send email and store data)
    console.log('Waitlist signup:', { name, email, company, useCase, updates })

    // Simulate success response
    return NextResponse.json({
      success: true,
      position: Math.floor(Math.random() * 250) + 1, // Random position for now
      message: 'Successfully joined waitlist',
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

