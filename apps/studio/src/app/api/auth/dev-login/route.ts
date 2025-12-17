import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Dev credentials - only works on localhost
const DEV_EMAIL = 'james@lostmonster.io'
const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'dev-slydes-2025!'

/**
 * Dev Login API Route
 *
 * This route allows instant login on localhost without OAuth or magic links.
 * ONLY works in development (localhost).
 *
 * Two modes:
 * 1. With SUPABASE_SERVICE_ROLE_KEY: Auto-generates magic link token (preferred)
 * 2. Without: Falls back to password auth (requires password setup in Supabase)
 */
export async function POST(request: Request) {
  // Security: Only allow on localhost
  const host = request.headers.get('host') || ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')

  if (!isLocalhost) {
    return NextResponse.json(
      { error: 'Dev login only available on localhost' },
      { status: 403 }
    )
  }

  // Try service role method first (preferred - no password needed)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = createAdminClient()

      // Generate a magic link for the dev user
      const { data, error } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: DEV_EMAIL,
      })

      if (error) {
        console.error('Admin generateLink error:', error)
        // Fall through to password method
      } else if (data?.properties?.hashed_token) {
        // Exchange the token for a session using the regular client
        const supabase = await createClient()
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: data.properties.hashed_token,
          type: 'magiclink',
        })

        if (!verifyError) {
          return NextResponse.json({
            success: true,
            method: 'service_role',
            email: DEV_EMAIL,
          })
        }
        console.error('Verify OTP error:', verifyError)
      }
    } catch (err) {
      console.error('Service role method failed:', err)
      // Fall through to password method
    }
  }

  // Fallback: Password method
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return NextResponse.json(
        {
          error: 'Dev login not configured',
          hint: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local (get it from Supabase dashboard → Settings → API)',
          alternative: `Or set password for ${DEV_EMAIL} in Supabase Authentication → Users`
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    method: 'password',
    user: {
      id: data.user?.id,
      email: data.user?.email,
    }
  })
}
