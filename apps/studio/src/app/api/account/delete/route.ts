import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { confirmUsername } = body

  // Get user's profile to verify username
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, email')
    .eq('id', user.id)
    .single()

  // Verify confirmation - must type username or email
  const confirmValue = confirmUsername?.toLowerCase().trim()
  const usernameMatch = profile?.username && confirmValue === profile.username.toLowerCase()
  const emailMatch = profile?.email && confirmValue === profile.email.toLowerCase()

  if (!usernameMatch && !emailMatch) {
    return NextResponse.json({
      error: 'Please type your username or email to confirm deletion'
    }, { status: 400 })
  }

  try {
    // Delete user's organizations first (cascades to slydes, frames, etc.)
    const { data: orgs } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('role', 'owner')

    if (orgs && orgs.length > 0) {
      for (const org of orgs) {
        await supabase
          .from('organizations')
          .delete()
          .eq('id', org.organization_id)
      }
    }

    // Delete profile (will cascade from auth.users deletion, but be explicit)
    await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // Delete the auth user using admin client
    const adminClient = createAdminClient()
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
