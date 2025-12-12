import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    const correctPassword = process.env.INVESTOR_PAGE_PASSWORD

    if (!correctPassword) {
      console.error('INVESTOR_PAGE_PASSWORD not set in environment variables')
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Investor auth error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

