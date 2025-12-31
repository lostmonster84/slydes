import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [storedPassword, timestamp] = decoded.split('-')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || storedPassword !== adminPassword) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

// GET - List all auth users with optional search
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase() || ''

  try {
    const supabase = createSupabaseAdmin()

    // Get all auth users using admin API
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (authError) {
      console.error('[Users API] Auth list error:', authError)
      throw authError
    }

    // Get all profiles for additional data (including subscription fields)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, company_name, onboarding_completed, created_at, plan, subscription_status')

    if (profilesError) {
      console.error('[Users API] Profiles error:', profilesError)
    }

    // Create a map of profiles by ID
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

    // Combine auth users with profile data
    let users = authUsers.users.map(user => {
      const profile = profileMap.get(user.id)
      return {
        id: user.id,
        email: user.email || '',
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        company_name: profile?.company_name || '',
        onboarding_completed: profile?.onboarding_completed || false,
        email_confirmed: !!user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        provider: user.app_metadata?.provider || 'email',
        plan: profile?.plan || 'free',
        subscription_status: profile?.subscription_status || null,
      }
    })

    // Filter by search if provided
    if (search) {
      users = users.filter(user =>
        user.email.toLowerCase().includes(search) ||
        user.full_name?.toLowerCase().includes(search) ||
        user.company_name?.toLowerCase().includes(search)
      )
    }

    // Sort by created_at desc
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      users,
      total: users.length,
    })
  } catch (error) {
    console.error('[Users API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  try {
    const supabase = createSupabaseAdmin()

    // Delete from auth (this will cascade delete profile due to FK)
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('[Users API] Delete error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Users API] Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Reset onboarding for a user (useful for testing)
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { userId, action } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    if (action === 'reset_onboarding') {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', userId)

      if (error) throw error
      return NextResponse.json({ success: true, message: 'Onboarding reset' })
    }

    if (action === 'complete_onboarding') {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)

      if (error) throw error
      return NextResponse.json({ success: true, message: 'Onboarding marked complete' })
    }

    if (action === 'send_password_reset') {
      // Get user email first
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
      if (userError || !userData.user?.email) {
        throw new Error('Could not find user email')
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(userData.user.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_STUDIO_URL || 'https://studio.slydes.io'}/auth/callback`,
      })

      if (error) throw error
      return NextResponse.json({ success: true, message: `Password reset email sent to ${userData.user.email}` })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('[Users API] Action error:', error)
    return NextResponse.json(
      { error: 'Action failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
