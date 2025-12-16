import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import Stripe from 'stripe'
import { Resend } from 'resend'

type IntegrationStatus = {
  status: 'healthy' | 'warning' | 'error'
  message: string
  lastChecked: string
  details?: Record<string, unknown>
}

type HealthResponse = {
  timestamp: string
  overall: 'healthy' | 'degraded' | 'unhealthy'
  integrations: {
    stripe: IntegrationStatus
    supabase: IntegrationStatus
    cloudflareStream: IntegrationStatus
    cloudflareImages: IntegrationStatus
    resend: IntegrationStatus
    analytics: IntegrationStatus
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

    // Check if token is less than 7 days old
    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

async function checkStripe(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey) {
    return { status: 'error', message: 'Missing STRIPE_SECRET_KEY', lastChecked: now }
  }

  if (!webhookSecret) {
    return { status: 'warning', message: 'Missing webhook secret', lastChecked: now }
  }

  try {
    const stripe = new Stripe(secretKey)
    await stripe.balance.retrieve()
    return { status: 'healthy', message: 'Connected', lastChecked: now }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'API error', lastChecked: now }
  }
}

async function checkSupabase(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()

  try {
    const supabase = createSupabaseAdmin()
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return {
      status: 'healthy',
      message: `Connected (${count ?? 0} users)`,
      lastChecked: now,
      details: { userCount: count },
    }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'Connection error', lastChecked: now }
  }
}

async function checkCloudflareStream(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_STREAM_TOKEN

  if (!accountId || !token) {
    return { status: 'error', message: 'Missing Cloudflare config', lastChecked: now }
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?per_page=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const json = await res.json()

    if (!json.success) {
      throw new Error(json.errors?.[0]?.message || 'API error')
    }

    return { status: 'healthy', message: 'Connected', lastChecked: now }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'API error', lastChecked: now }
  }
}

async function checkCloudflareImages(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_IMAGES_TOKEN

  if (!accountId || !token) {
    return { status: 'warning', message: 'Not configured', lastChecked: now }
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2?per_page=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const json = await res.json()

    if (!json.success) {
      throw new Error(json.errors?.[0]?.message || 'API error')
    }

    return { status: 'healthy', message: 'Connected', lastChecked: now }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'API error', lastChecked: now }
  }
}

async function checkResend(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return { status: 'error', message: 'Missing RESEND_API_KEY', lastChecked: now }
  }

  try {
    const resend = new Resend(apiKey)
    const domains = await resend.domains.list()

    return {
      status: 'healthy',
      message: `Connected (${domains.data?.data?.length ?? 0} domains)`,
      lastChecked: now,
      details: { domainCount: domains.data?.data?.length ?? 0 },
    }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'API error', lastChecked: now }
  }
}

async function checkAnalytics(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()

  try {
    const supabase = createSupabaseAdmin()
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .gte('occurred_at', oneDayAgo)

    if (error) {
      // Table might not exist yet
      if (error.message.includes('does not exist')) {
        return { status: 'warning', message: 'Table not found', lastChecked: now }
      }
      throw error
    }

    const eventCount = count ?? 0
    return {
      status: eventCount > 0 ? 'healthy' : 'warning',
      message: `${eventCount} events (24h)`,
      lastChecked: now,
      details: { recentEvents: eventCount },
    }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'Query error', lastChecked: now }
  }
}

function calculateOverall(integrations: HealthResponse['integrations']): HealthResponse['overall'] {
  const statuses = Object.values(integrations).map((i) => i.status)

  // Critical integrations
  const criticalServices = ['stripe', 'supabase', 'cloudflareStream'] as const
  const criticalStatuses = criticalServices.map((s) => integrations[s].status)

  if (criticalStatuses.includes('error')) return 'unhealthy'
  if (statuses.includes('error')) return 'degraded'
  if (statuses.filter((s) => s === 'warning').length > 2) return 'degraded'
  return 'healthy'
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Run all checks in parallel
  const [stripe, supabase, cloudflareStream, cloudflareImages, resend, analytics] = await Promise.all([
    checkStripe(),
    checkSupabase(),
    checkCloudflareStream(),
    checkCloudflareImages(),
    checkResend(),
    checkAnalytics(),
  ])

  const integrations = {
    stripe,
    supabase,
    cloudflareStream,
    cloudflareImages,
    resend,
    analytics,
  }

  const response: HealthResponse = {
    timestamp: new Date().toISOString(),
    overall: calculateOverall(integrations),
    integrations,
  }

  return NextResponse.json(response)
}
