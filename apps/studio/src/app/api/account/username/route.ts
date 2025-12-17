import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Validate username format: lowercase, alphanumeric, hyphens, underscores, 3-30 chars
function isValidUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' }
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }

  if (username.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' }
  }

  // Must be lowercase, alphanumeric, hyphens, underscores
  // Cannot start or end with hyphen/underscore
  const regex = /^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]$/
  if (!regex.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores'
    }
  }

  // Reserved usernames
  const reserved = [
    'admin', 'api', 'app', 'auth', 'billing', 'blog', 'cdn',
    'dashboard', 'docs', 'help', 'login', 'logout', 'mail',
    'root', 'settings', 'signup', 'slydes', 'static', 'status',
    'support', 'terms', 'privacy', 'www', 'wildtrax'
  ]

  if (reserved.includes(username.toLowerCase())) {
    return { valid: false, error: 'This username is reserved' }
  }

  return { valid: true }
}

// GET - Check username availability
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')?.toLowerCase().trim()

  if (!username) {
    return NextResponse.json({ available: false, error: 'Username is required' }, { status: 400 })
  }

  // Validate format
  const validation = isValidUsername(username)
  if (!validation.valid) {
    return NextResponse.json({ available: false, error: validation.error }, { status: 400 })
  }

  // Check if available
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  return NextResponse.json({
    available: !existing,
    error: existing ? 'Username is already taken' : undefined
  })
}

// PUT - Update username
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const username = body.username?.toLowerCase().trim()

  // Validate format
  const validation = isValidUsername(username)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // Check if already taken by another user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username is already taken' }, { status: 400 })
  }

  // Update username
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating username:', updateError)
    return NextResponse.json({ error: 'Failed to update username' }, { status: 500 })
  }

  return NextResponse.json({ success: true, username })
}
