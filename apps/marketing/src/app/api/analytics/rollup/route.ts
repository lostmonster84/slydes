import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Analytics rollup endpoint.
 *
 * GET: Called by Vercel cron daily at 3am UTC to roll up yesterday's events.
 * POST: Manual trigger for dev/debugging (with ?day=YYYY-MM-DD).
 */

// Vercel cron calls GET - roll up yesterday's data
export async function GET(req: Request) {
  // Verify cron secret (Vercel sets this header for cron jobs)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Allow if: (1) valid cron secret OR (2) running locally (no CRON_SECRET set)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Roll up yesterday
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const day = yesterday.toISOString().split('T')[0] // YYYY-MM-DD

  let supabase: ReturnType<typeof createSupabaseAdmin>
  try {
    supabase = createSupabaseAdmin()
  } catch (e) {
    return NextResponse.json({ error: 'Analytics not configured', detail: (e as Error).message }, { status: 503 })
  }

  const { error } = await supabase.rpc('rollup_analytics_day', { target_day: day })
  if (error) return NextResponse.json({ error: 'Rollup failed', detail: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, day, source: 'cron' })
}

// Manual trigger for dev/debugging
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get('day') // YYYY-MM-DD

  if (!day) return NextResponse.json({ error: 'Missing day (YYYY-MM-DD)' }, { status: 400 })

  let supabase: ReturnType<typeof createSupabaseAdmin>
  try {
    supabase = createSupabaseAdmin()
  } catch (e) {
    return NextResponse.json({ error: 'Analytics not configured', detail: (e as Error).message }, { status: 503 })
  }

  const { error } = await supabase.rpc('rollup_analytics_day', { target_day: day })
  if (error) return NextResponse.json({ error: 'Rollup failed', detail: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, day, source: 'manual' })
}

