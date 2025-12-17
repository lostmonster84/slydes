import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Validate slug format: lowercase, alphanumeric, hyphens, 3-30 chars
function isValidSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: 'Slug is required' }
  }

  if (slug.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters' }
  }

  if (slug.length > 30) {
    return { valid: false, error: 'Slug must be 30 characters or less' }
  }

  // Must be lowercase, alphanumeric, hyphens only
  // Cannot start or end with hyphen
  const regex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/
  if (!regex.test(slug)) {
    return {
      valid: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  }

  // Reserved slugs
  const reserved = [
    'admin', 'api', 'app', 'auth', 'billing', 'blog', 'cdn',
    'dashboard', 'docs', 'help', 'login', 'logout', 'mail',
    'root', 'settings', 'signup', 'slydes', 'static', 'status',
    'support', 'terms', 'privacy', 'www', 'demo', 'test'
  ]

  if (reserved.includes(slug.toLowerCase())) {
    return { valid: false, error: 'This slug is reserved' }
  }

  return { valid: true }
}

// GET - Check slug availability
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')?.toLowerCase().trim()

  if (!slug) {
    return NextResponse.json({ available: false, error: 'Slug is required' }, { status: 400 })
  }

  // Validate format
  const validation = isValidSlug(slug)
  if (!validation.valid) {
    return NextResponse.json({ available: false, error: validation.error }, { status: 400 })
  }

  // Check if available
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .single()

  return NextResponse.json({
    available: !existing,
    error: existing ? 'This URL is already taken' : undefined
  })
}

// PUT - Update org slug
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's current org
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.current_organization_id) {
    return NextResponse.json({ error: 'No organization found' }, { status: 400 })
  }

  // Verify user owns the org
  const { data: org } = await supabase
    .from('organizations')
    .select('id, owner_id, slug')
    .eq('id', profile.current_organization_id)
    .single()

  if (!org || org.owner_id !== user.id) {
    return NextResponse.json({ error: 'You do not have permission to change this URL' }, { status: 403 })
  }

  const body = await request.json()
  const slug = body.slug?.toLowerCase().trim()

  // Validate format
  const validation = isValidSlug(slug)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // Check if already taken by another org
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .neq('id', org.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'This URL is already taken' }, { status: 400 })
  }

  // Update slug
  const { error: updateError } = await supabase
    .from('organizations')
    .update({ slug })
    .eq('id', org.id)

  if (updateError) {
    console.error('Error updating slug:', updateError)
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
