import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import crypto from 'crypto'

/**
 * POST /api/track
 * Records a page visit for analytics.
 * Privacy-friendly: only stores hashed fingerprint, not IP or personal data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer } = body

    if (!page) {
      return NextResponse.json({ error: 'Missing page' }, { status: 400 })
    }

    // Create a privacy-friendly visitor hash from IP + User Agent
    // This allows counting unique visitors without storing personal data
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Hash the combination - one-way, can't be reversed to identify the person
    const visitorHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}`)
      .digest('hex')
      .substring(0, 16) // Shortened hash is sufficient

    // Get country from Vercel's geo headers (if available)
    const country = request.headers.get('x-vercel-ip-country') || null

    const supabase = createSupabaseAdmin()

    await supabase.from('site_visits').insert({
      visitor_hash: visitorHash,
      page,
      referrer: referrer || null,
      country,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Track error:', error)
    // Don't fail the page load if tracking fails
    return NextResponse.json({ ok: false })
  }
}
