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
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Get unconverted leads count
    const { count: unconvertedCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .is('converted_at', null)

    // Get converted leads count
    const { count: convertedCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .not('converted_at', 'is', null)

    // Get this week's leads
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: weekCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // Get today's leads
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: todayCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Get all leads with user info if converted
    const { data: allLeads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    // Get leads per day for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: last30Days } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by day
    const dailyLeads: Record<string, number> = {}
    last30Days?.forEach((entry) => {
      const date = new Date(entry.created_at).toISOString().split('T')[0]
      dailyLeads[date] = (dailyLeads[date] || 0) + 1
    })

    // Calculate conversion rate
    const conversionRate = totalCount && totalCount > 0
      ? Math.round(((convertedCount || 0) / totalCount) * 100)
      : 0

    return NextResponse.json({
      totalCount: totalCount || 0,
      unconvertedCount: unconvertedCount || 0,
      convertedCount: convertedCount || 0,
      weekCount: weekCount || 0,
      todayCount: todayCount || 0,
      conversionRate,
      allLeads: allLeads || [],
      dailyLeads,
    })
  } catch (error) {
    console.error('Admin leads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
