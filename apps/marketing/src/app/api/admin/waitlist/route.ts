import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Simple auth check - verify cookie exists and is recent
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const timestamp = parseInt(decoded.split('-').pop() || '0')
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    return timestamp > sevenDaysAgo
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createSupabaseAdmin()

    // Get total count
    const { count: totalCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    // Get this week's signups
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { count: weekCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // Get today's signups
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: todayCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Get industry breakdown
    const { data: allEntries } = await supabase
      .from('waitlist')
      .select('industry')

    const industryBreakdown: Record<string, number> = {}
    allEntries?.forEach((entry) => {
      const industry = entry.industry || 'Not specified'
      industryBreakdown[industry] = (industryBreakdown[industry] || 0) + 1
    })

    // Sort by count descending
    const sortedIndustries = Object.entries(industryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([industry, count]) => ({ industry, count }))

    // Get all signups
    const { data: allSignups } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    // Get signups per day for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: last30Days } = await supabase
      .from('waitlist')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by day
    const dailySignups: Record<string, number> = {}
    last30Days?.forEach((entry) => {
      const date = new Date(entry.created_at).toISOString().split('T')[0]
      dailySignups[date] = (dailySignups[date] || 0) + 1
    })

    return NextResponse.json({
      totalCount: totalCount || 0,
      weekCount: weekCount || 0,
      todayCount: todayCount || 0,
      industryBreakdown: sortedIndustries,
      allSignups: allSignups || [],
      dailySignups,
    })
  } catch (error) {
    console.error('Admin waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

