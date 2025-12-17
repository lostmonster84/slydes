import { NextResponse } from 'next/server'
import { scrapeBusiness, isValidUrl } from '@/lib/scraper'
import type { ScrapeBusinessRequest, ScrapeBusinessResponse } from '@/types/generator'

/**
 * POST /api/dev/scrape-business
 *
 * Scrapes a business website and returns structured data.
 * DEV ONLY - Only works in development mode.
 */
export async function POST(request: Request): Promise<NextResponse<ScrapeBusinessResponse>> {
  // Dev-only check
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  // Parse request body
  let body: ScrapeBusinessRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Validate URL
  const { url } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'URL is required' },
      { status: 400 }
    )
  }

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or blocked URL. Please provide a valid business website URL.' },
      { status: 400 }
    )
  }

  try {
    // Scrape the business website
    const scrapedData = await scrapeBusiness(url)

    return NextResponse.json({
      ok: true,
      data: scrapedData,
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to scrape website',
      },
      { status: 500 }
    )
  }
}
