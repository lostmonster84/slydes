import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

interface MetricsResponse {
  timestamp: string
  waitlist: {
    total: number
    thisWeek: number
    today: number
    industryBreakdown: { industry: string; count: number }[]
  }
  users: {
    total: number
    byPlan: { plan: string; count: number }[]
  }
  organizations: {
    total: number
    byType: { type: string; count: number }[]
  }
  content: {
    totalSlydes: number
    publishedSlydes: number
    totalFrames: number
  }
  revenue: {
    mrr: number
    proUsers: number
    creatorUsers: number
    totalOrders: number
    platformFees: number
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
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  try {
    // Run all queries in parallel
    const [
      waitlistTotal,
      waitlistWeek,
      waitlistToday,
      waitlistIndustry,
      usersTotal,
      usersByPlan,
      orgsTotal,
      orgsByType,
      slydesTotal,
      slydesPublished,
      framesTotal,
      ordersData,
    ] = await Promise.all([
      // Waitlist metrics
      supabase.from('waitlist').select('*', { count: 'exact', head: true }),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('waitlist').select('industry'),

      // User metrics
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('plan'),

      // Organization metrics
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      supabase.from('organizations').select('business_type'),

      // Content metrics
      supabase.from('slydes').select('*', { count: 'exact', head: true }),
      supabase.from('slydes').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('frames').select('*', { count: 'exact', head: true }),

      // Revenue metrics - get orders
      supabase.from('orders').select('platform_fee_cents, status'),
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
    // MRR = Pro users * $19 + Creator users * $9 (estimate)
    const mrr = proUsers * 19 + creatorUsers * 9

    // Platform fees from paid orders
    let platformFees = 0
    let totalOrders = 0
    if (ordersData.data) {
      ordersData.data.forEach((order) => {
        if (order.status === 'paid' || order.status === 'fulfilled') {
          totalOrders++
          platformFees += order.platform_fee_cents || 0
        }
      })
    }

    const response: MetricsResponse = {
      timestamp: now.toISOString(),
      waitlist: {
        total: waitlistTotal.count ?? 0,
        thisWeek: waitlistWeek.count ?? 0,
        today: waitlistToday.count ?? 0,
        industryBreakdown,
      },
      users: {
        total: usersTotal.count ?? 0,
        byPlan,
      },
      organizations: {
        total: orgsTotal.count ?? 0,
        byType,
      },
      content: {
        totalSlydes: slydesTotal.count ?? 0,
        publishedSlydes: slydesPublished.count ?? 0,
        totalFrames: framesTotal.count ?? 0,
      },
      revenue: {
        mrr,
        proUsers,
        creatorUsers,
        totalOrders,
        platformFees: platformFees / 100, // Convert cents to dollars/pounds
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
