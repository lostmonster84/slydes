import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * Dev-only rollup trigger.
 *
 * Calls public.rollup_analytics_day(target_day) to populate daily rollups.
 * In production, this should run on a schedule (cron).
 */
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

  return NextResponse.json({ ok: true, day })
}








