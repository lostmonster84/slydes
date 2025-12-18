import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Simple auth check
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

    // Get date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setDate(monthAgo.getDate() - 30)

    // Total unique visitors (all time) - need to fetch all hashes and count unique
    const { data: allVisitors } = await supabase
      .from('site_visits')
      .select('visitor_hash')
    const totalUnique = new Set(allVisitors?.map(v => v.visitor_hash) || []).size

    // Today's unique visitors
    const { data: todayData } = await supabase
      .from('site_visits')
      .select('visitor_hash')
      .gte('visited_at', today.toISOString())
    const todayUnique = new Set(todayData?.map(v => v.visitor_hash) || []).size

    // Yesterday's unique visitors
    const { data: yesterdayData } = await supabase
      .from('site_visits')
      .select('visitor_hash')
      .gte('visited_at', yesterday.toISOString())
      .lt('visited_at', today.toISOString())
    const yesterdayUnique = new Set(yesterdayData?.map(v => v.visitor_hash) || []).size

    // This week's unique visitors
    const { data: weekData } = await supabase
      .from('site_visits')
      .select('visitor_hash')
      .gte('visited_at', weekAgo.toISOString())
    const weekUnique = new Set(weekData?.map(v => v.visitor_hash) || []).size

    // Last 30 days unique visitors
    const { data: monthData } = await supabase
      .from('site_visits')
      .select('visitor_hash')
      .gte('visited_at', monthAgo.toISOString())
    const monthUnique = new Set(monthData?.map(v => v.visitor_hash) || []).size

    // Total page views (all time)
    const { count: totalPageViews } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true })

    // Top pages (last 30 days)
    const { data: pageData } = await supabase
      .from('site_visits')
      .select('page')
      .gte('visited_at', monthAgo.toISOString())

    const pageCounts: Record<string, number> = {}
    pageData?.forEach(p => {
      pageCounts[p.page] = (pageCounts[p.page] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // Top countries (last 30 days)
    const { data: countryData } = await supabase
      .from('site_visits')
      .select('country')
      .gte('visited_at', monthAgo.toISOString())
      .not('country', 'is', null)

    const countryCounts: Record<string, number> = {}
    countryData?.forEach(c => {
      if (c.country) {
        countryCounts[c.country] = (countryCounts[c.country] || 0) + 1
      }
    })
    const topCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, visits]) => ({ country, visits }))

    return NextResponse.json({
      uniqueVisitors: {
        total: totalUnique || 0,
        today: todayUnique,
        yesterday: yesterdayUnique,
        thisWeek: weekUnique,
        last30Days: monthUnique,
      },
      totalPageViews: totalPageViews || 0,
      topPages,
      topCountries,
    })
  } catch (error) {
    console.error('Site visits error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
