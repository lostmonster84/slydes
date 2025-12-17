import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/dev/demos
 * List all generated demos
 */
export async function GET() {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('generated_demos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch demos:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('Error fetching demos:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch demos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dev/demos
 * Save a new generated demo
 */
export async function POST(request: Request) {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { scrapedBusiness, generatedDemo } = body

    if (!scrapedBusiness || !generatedDemo) {
      return NextResponse.json(
        { ok: false, error: 'Missing required data' },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const { data, error } = await admin
      .from('generated_demos')
      .insert({
        source_url: scrapedBusiness.sourceUrl,
        business_name: generatedDemo.brand.name,
        business_tagline: generatedDemo.brand.tagline || null,
        business_location: generatedDemo.brand.location || null,
        business_industry: scrapedBusiness.industry || null,
        scraped_data: scrapedBusiness,
        generated_content: generatedDemo,
        quality: generatedDemo.quality,
        quality_notes: generatedDemo.qualityNotes || [],
        images_count: scrapedBusiness.heroImages.length + scrapedBusiness.galleryImages.length,
        videos_count: scrapedBusiness.youtubeVideos.length + scrapedBusiness.vimeoVideos.length,
        categories_count: generatedDemo.categorySlydes.length,
        frames_count: generatedDemo.categorySlydes.reduce(
          (sum: number, cat: any) => sum + cat.frames.length,
          0
        ),
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save demo:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    console.error('Error saving demo:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to save demo' },
      { status: 500 }
    )
  }
}
