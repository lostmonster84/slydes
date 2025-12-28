import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Public endpoint - no auth required
// Used by forms (waitlist, onboarding, founding partner) to populate industry dropdowns

export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('vertical_defaults')
      .select('vertical_id, name, description, icon')
      .eq('enabled', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[Public Verticals API] Query error:', error)
      throw new Error(error.message || 'Failed to query verticals')
    }

    // Transform to format expected by forms
    const verticals = (data || []).map(v => ({
      id: v.vertical_id,
      value: v.vertical_id, // Some forms use 'value'
      name: v.name,
      label: v.name, // Some forms use 'label'
      description: v.description,
      icon: v.icon,
    }))

    return NextResponse.json({ verticals })
  } catch (error) {
    console.error('Public Verticals API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch verticals' },
      { status: 500 }
    )
  }
}
