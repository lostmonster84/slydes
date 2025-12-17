import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/dev/demos/[id]/load
 * Returns the demo data in a format ready to load into localStorage
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  const { id } = await params

  try {
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('generated_demos')
      .select('generated_content, scraped_data')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch demo:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ ok: false, error: 'Demo not found' }, { status: 404 })
    }

    // Return the generated content for client-side loading
    return NextResponse.json({
      ok: true,
      generatedDemo: data.generated_content,
      scrapedBusiness: data.scraped_data,
    })
  } catch (err) {
    console.error('Error loading demo:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to load demo' },
      { status: 500 }
    )
  }
}
