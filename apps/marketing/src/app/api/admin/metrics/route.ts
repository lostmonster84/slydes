import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getPeriodRanges, calculateTrend, TrendPeriod, TrendMetric, CustomDateRange } from '@/lib/dateUtils'

interface MetricsResponse {
  timestamp: string
  period: TrendPeriod
  periodLabel: string
  waitlist: {
    total: number
    trend: TrendMetric
    industryBreakdown: { industry: string; count: number }[]
  }
  users: {
    total: number
    trend: TrendMetric
    byPlan: { plan: string; count: number }[]
  }
  organizations: {
    total: number
    trend: TrendMetric
    byType: { type: string; count: number }[]
  }
  content: {
    totalSlydes: number
    publishedSlydes: number
    totalFrames: number
    slydesTrend: TrendMetric
  }
  revenue: {
    mrr: number
    proUsers: number
    creatorUsers: number
    totalOrders: number
    ordersTrend: TrendMetric
    platformFees: number
    platformFeesTrend: TrendMetric
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [storedPassword, timestamp] = decoded.split('-')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || storedPassword !== adminPassword) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdmin()
  const now = new Date()

  // Parse period from query string (default: wow)
  const periodParam = request.nextUrl.searchParams.get('period')
  const startDateParam = request.nextUrl.searchParams.get('startDate')
  const endDateParam = request.nextUrl.searchParams.get('endDate')

  // Determine period type
  let period: TrendPeriod
  let customRange: CustomDateRange | undefined

  if (periodParam === 'custom' && startDateParam && endDateParam) {
    period = 'custom'
    customRange = { startDate: startDateParam, endDate: endDateParam }
  } else if (periodParam === 'mom' || periodParam === 'yoy') {
    period = periodParam
  } else {
    period = 'wow'
  }

  const ranges = getPeriodRanges(period, now, customRange)

  try {
    // Run all queries in parallel for performance
    const [
      // Waitlist queries
      waitlistCurrent,
      waitlistPrevious,
      waitlistTotal,
      waitlistIndustry,

      // User queries
      usersCurrent,
      usersPrevious,
      usersTotal,
      usersByPlan,

      // Organization queries
      orgsCurrent,
      orgsPrevious,
      orgsTotal,
      orgsByType,

      // Slyde queries
      slydesCurrent,
      slydesPrevious,
      slydesTotal,
      slydesPublished,
      framesTotal,

      // Order queries (for revenue trend)
      ordersCurrent,
      ordersPrevious,
      ordersAll,
    ] = await Promise.all([
      // Waitlist - current period
      supabase.from('waitlist').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.current.start.toISOString())
        .lte('created_at', ranges.current.end.toISOString()),
      // Waitlist - previous period
      supabase.from('waitlist').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.previous.start.toISOString())
        .lte('created_at', ranges.previous.end.toISOString()),
      // Waitlist - total
      supabase.from('waitlist').select('*', { count: 'exact', head: true }),
      // Waitlist - industry breakdown
      supabase.from('waitlist').select('industry'),

      // Users - current period
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.current.start.toISOString())
        .lte('created_at', ranges.current.end.toISOString()),
      // Users - previous period
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.previous.start.toISOString())
        .lte('created_at', ranges.previous.end.toISOString()),
      // Users - total
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      // Users - plan breakdown
      supabase.from('profiles').select('plan'),

      // Organizations - current period
      supabase.from('organizations').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.current.start.toISOString())
        .lte('created_at', ranges.current.end.toISOString()),
      // Organizations - previous period
      supabase.from('organizations').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.previous.start.toISOString())
        .lte('created_at', ranges.previous.end.toISOString()),
      // Organizations - total
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      // Organizations - type breakdown
      supabase.from('organizations').select('business_type'),

      // Slydes - current period
      supabase.from('slydes').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.current.start.toISOString())
        .lte('created_at', ranges.current.end.toISOString()),
      // Slydes - previous period
      supabase.from('slydes').select('*', { count: 'exact', head: true })
        .gte('created_at', ranges.previous.start.toISOString())
        .lte('created_at', ranges.previous.end.toISOString()),
      // Slydes - total
      supabase.from('slydes').select('*', { count: 'exact', head: true }),
      // Slydes - published
      supabase.from('slydes').select('*', { count: 'exact', head: true }).eq('published', true),
      // Frames - total
      supabase.from('frames').select('*', { count: 'exact', head: true }),

      // Orders - current period
      supabase.from('orders').select('platform_fee_cents, status')
        .gte('created_at', ranges.current.start.toISOString())
        .lte('created_at', ranges.current.end.toISOString())
        .in('status', ['paid', 'fulfilled']),
      // Orders - previous period
      supabase.from('orders').select('platform_fee_cents, status')
        .gte('created_at', ranges.previous.start.toISOString())
        .lte('created_at', ranges.previous.end.toISOString())
        .in('status', ['paid', 'fulfilled']),
      // Orders - all
      supabase.from('orders').select('platform_fee_cents, status')
        .in('status', ['paid', 'fulfilled']),
    ])

    // Process industry breakdown
    const industryBreakdown: { industry: string; count: number }[] = []
    if (waitlistIndustry.data) {
      const industryCounts = new Map<string, number>()
      waitlistIndustry.data.forEach((row) => {
        const industry = row.industry || 'Not specified'
        industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1)
      })
      industryCounts.forEach((count, industry) => {
        industryBreakdown.push({ industry, count })
      })
      industryBreakdown.sort((a, b) => b.count - a.count)
    }

    // Process user plan breakdown
    const byPlan: { plan: string; count: number }[] = []
    let proUsers = 0
    let creatorUsers = 0
    if (usersByPlan.data) {
      const planCounts = new Map<string, number>()
      usersByPlan.data.forEach((row) => {
        const plan = row.plan || 'free'
        planCounts.set(plan, (planCounts.get(plan) || 0) + 1)
        if (plan === 'pro') proUsers++
        if (plan === 'creator') creatorUsers++
      })
      planCounts.forEach((count, plan) => {
        byPlan.push({ plan, count })
      })
    }

    // Process organization type breakdown
    const byType: { type: string; count: number }[] = []
    if (orgsByType.data) {
      const typeCounts = new Map<string, number>()
      orgsByType.data.forEach((row) => {
        const type = row.business_type || 'other'
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1)
      })
      typeCounts.forEach((count, type) => {
        byType.push({ type, count })
      })
      byType.sort((a, b) => b.count - a.count)
    }

    // Calculate revenue metrics
    const mrr = proUsers * 50 + creatorUsers * 25

    // Platform fees calculations
    const currentPlatformFees = (ordersCurrent.data || [])
      .reduce((sum, o) => sum + (o.platform_fee_cents || 0), 0) / 100
    const previousPlatformFees = (ordersPrevious.data || [])
      .reduce((sum, o) => sum + (o.platform_fee_cents || 0), 0) / 100
    const totalPlatformFees = (ordersAll.data || [])
      .reduce((sum, o) => sum + (o.platform_fee_cents || 0), 0) / 100

    const response: MetricsResponse = {
      timestamp: now.toISOString(),
      period,
      periodLabel: ranges.label,

      waitlist: {
        total: waitlistTotal.count ?? 0,
        trend: calculateTrend(waitlistCurrent.count ?? 0, waitlistPrevious.count ?? 0),
        industryBreakdown,
      },

      users: {
        total: usersTotal.count ?? 0,
        trend: calculateTrend(usersCurrent.count ?? 0, usersPrevious.count ?? 0),
        byPlan,
      },

      organizations: {
        total: orgsTotal.count ?? 0,
        trend: calculateTrend(orgsCurrent.count ?? 0, orgsPrevious.count ?? 0),
        byType,
      },

      content: {
        totalSlydes: slydesTotal.count ?? 0,
        publishedSlydes: slydesPublished.count ?? 0,
        totalFrames: framesTotal.count ?? 0,
        slydesTrend: calculateTrend(slydesCurrent.count ?? 0, slydesPrevious.count ?? 0),
      },

      revenue: {
        mrr,
        proUsers,
        creatorUsers,
        totalOrders: ordersAll.data?.length ?? 0,
        ordersTrend: calculateTrend(ordersCurrent.data?.length ?? 0, ordersPrevious.data?.length ?? 0),
        platformFees: totalPlatformFees,
        platformFeesTrend: calculateTrend(currentPlatformFees, previousPlatformFees),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
