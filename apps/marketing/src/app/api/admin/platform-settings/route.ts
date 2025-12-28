import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

interface PlatformFeatures {
  onboardingPulse: boolean
}

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

// GET - Fetch platform settings
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('platform_settings')
      .select('key, value, updated_at')
      .eq('key', 'features')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[Platform Settings API] Query error:', error)
      throw new Error(error.message || 'Failed to query settings')
    }

    // Return defaults if no settings exist yet
    const features: PlatformFeatures = data?.value || { onboardingPulse: false }

    return NextResponse.json({
      features,
      updatedAt: data?.updated_at || null
    })
  } catch (error) {
    console.error('Platform Settings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
      { status: 500 }
    )
  }
}

// PUT - Update platform settings
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { features } = body as { features: Partial<PlatformFeatures> }

    if (!features || typeof features !== 'object') {
      return NextResponse.json({ error: 'Invalid features object' }, { status: 400 })
    }

    const supabase = createSupabaseAdmin()

    // Get current settings
    const { data: current } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'features')
      .single()

    // Merge with new values
    const newFeatures = {
      ...(current?.value || { onboardingPulse: false }),
      ...features
    }

    // Upsert the settings
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        key: 'features',
        value: newFeatures,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('[Platform Settings API] Update error:', error)
      throw new Error(error.message || 'Failed to update settings')
    }

    return NextResponse.json({
      success: true,
      features: newFeatures
    })
  } catch (error) {
    console.error('Platform Settings API error:', error)
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: 500 }
    )
  }
}
