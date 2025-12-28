import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Public endpoint for onboarding - fetches enabled verticals
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('vertical_defaults')
      .select('vertical_id, name, description, icon')
      .eq('enabled', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[Studio Verticals API] Query error:', error)
      throw new Error(error.message || 'Failed to query verticals')
    }

    // Transform to format expected by onboarding
    const verticals = (data || []).map(v => ({
      id: v.vertical_id,
      label: v.name,
      icon: v.icon || '✨',
      description: v.description,
    }))

    return NextResponse.json({ verticals })
  } catch (error) {
    console.error('Studio Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verticals' },
      { status: 500 }
    )
  }
}
