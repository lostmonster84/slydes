import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const supabase = await createClient()

    // Upsert to handle duplicate emails gracefully
    const { error } = await supabase
      .from('leads')
      .upsert(
        { email: email.toLowerCase().trim(), source: 'onboarding' },
        { onConflict: 'email', ignoreDuplicates: true }
      )

    if (error) {
      console.error('Error saving lead:', error)
      // Don't block the user even if save fails
      return NextResponse.json({ success: true, warning: 'Lead capture failed but continuing' })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    // Don't block the user even if something goes wrong
    return NextResponse.json({ success: true, warning: 'Lead capture failed but continuing' })
  }
}
