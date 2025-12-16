import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

interface RevenueResponse {
  timestamp: string
  mrr: number
  arr: number
  subscribers: {
    total: number
    pro: number
    creator: number
    free: number
  }
  subscriptionGrowth: {
    thisMonth: number
    lastMonth: number
    growthRate: number
  }
  orders: {
    total: number
    thisMonth: number
    revenue: number
    platformFees: number
    gmv: number // Gross Merchandise Value - total transaction volume
  }
  recentSubscriptions: {
    id: string
    email: string
    plan: string
    status: string
    created_at: string
  }[]
  allUsers: {
    id: string
    email: string
    plan: string
    status: string
    created_at: string
  }[]
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const supabase = createSupabaseAdmin()
    console.log('[Revenue API] Supabase client created successfully')
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

    // Get all profiles with plan info
    // First try with all columns, fall back to basic if columns don't exist
    let profiles: { id: string; email?: string; plan?: string; subscription_status?: string; created_at: string }[] | null = null
    let profilesError = null

    const { data: fullProfiles, error: fullError } = await supabase
      .from('profiles')
      .select('id, email, plan, subscription_status, created_at')
      .order('created_at', { ascending: false })

    if (fullError) {
      console.log('[Revenue API] Full query failed, trying basic query:', fullError.message)
      // If columns don't exist, try a simpler query
      const { data: basicProfiles, error: basicError } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })

      if (basicError) {
        console.error('[Revenue API] Basic profiles query also failed:', basicError)
        profilesError = basicError
      } else {
        profiles = basicProfiles?.map(p => ({ ...p, plan: 'free', subscription_status: 'inactive' })) || []
      }
    } else {
      profiles = fullProfiles
    }

    if (profilesError) {
      console.error('[Revenue API] Profiles query error:', profilesError)
      throw profilesError
    }
    console.log('[Revenue API] Found', profiles?.length || 0, 'profiles')

    // Count subscribers by plan
    let proCount = 0
    let creatorCount = 0
    let freeCount = 0
    let thisMonthSubs = 0
    let lastMonthSubs = 0

    const recentSubscriptions: RevenueResponse['recentSubscriptions'] = []
    const allUsers: RevenueResponse['allUsers'] = []

    profiles?.forEach((profile) => {
      const plan = profile.plan || 'free'
      const status = profile.subscription_status || 'inactive'
      const createdAt = new Date(profile.created_at)

      // Add to all users list
      allUsers.push({
        id: profile.id,
        email: profile.email || 'Unknown',
        plan,
        status,
        created_at: profile.created_at,
      })

      if (plan === 'pro') {
        proCount++
        if (status === 'active') {
          recentSubscriptions.push({
            id: profile.id,
            email: profile.email || 'Unknown',
            plan: 'pro',
            status,
            created_at: profile.created_at,
          })
        }
      } else if (plan === 'creator') {
        creatorCount++
        if (status === 'active') {
          recentSubscriptions.push({
            id: profile.id,
            email: profile.email || 'Unknown',
            plan: 'creator',
            status,
            created_at: profile.created_at,
          })
        }
      } else {
        freeCount++
      }

      // Count growth
      if (createdAt >= new Date(thisMonthStart)) {
        thisMonthSubs++
      } else if (createdAt >= new Date(lastMonthStart) && createdAt <= new Date(lastMonthEnd)) {
        lastMonthSubs++
      }
    })

    // Calculate MRR (Pro = £50, Creator = £25)
    const mrr = proCount * 50 + creatorCount * 25
    const arr = mrr * 12

    // Growth rate
    const growthRate = lastMonthSubs > 0 ? ((thisMonthSubs - lastMonthSubs) / lastMonthSubs) * 100 : 0

    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, subtotal_cents, platform_fee_cents, status, created_at')
      .in('status', ['paid', 'fulfilled'])

    if (ordersError && !ordersError.message.includes('does not exist')) {
      throw ordersError
    }

    let totalOrders = 0
    let thisMonthOrders = 0
    let totalRevenue = 0
    let totalPlatformFees = 0
    let gmv = 0 // Total transaction volume

    orders?.forEach((order) => {
      totalOrders++
      const orderValue = (order.subtotal_cents || 0) / 100
      totalRevenue += orderValue
      totalPlatformFees += (order.platform_fee_cents || 0) / 100
      gmv += orderValue // Track all money flowing through

      if (new Date(order.created_at) >= new Date(thisMonthStart)) {
        thisMonthOrders++
      }
    })

    const response: RevenueResponse = {
      timestamp: now.toISOString(),
      mrr,
      arr,
      subscribers: {
        total: proCount + creatorCount + freeCount,
        pro: proCount,
        creator: creatorCount,
        free: freeCount,
      },
      subscriptionGrowth: {
        thisMonth: thisMonthSubs,
        lastMonth: lastMonthSubs,
        growthRate: Math.round(growthRate * 10) / 10,
      },
      orders: {
        total: totalOrders,
        thisMonth: thisMonthOrders,
        revenue: totalRevenue,
        platformFees: totalPlatformFees,
        gmv,
      },
      recentSubscriptions: recentSubscriptions.slice(0, 10),
      allUsers,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
