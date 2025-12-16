import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'
import Stripe from 'stripe'
import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'

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
    anthropic: IntegrationStatus
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return { status: 'error', message: 'Missing Supabase config', lastChecked: now }
  }

  try {
    const supabase = createSupabaseAdmin()

    // Count users and organizations in parallel
    const [usersResult, orgsResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
    ])

    if (usersResult.error) throw usersResult.error

    const userCount = usersResult.count ?? 0
    const orgCount = orgsResult.error ? 0 : (orgsResult.count ?? 0)

    return {
      status: 'healthy',
      message: `Connected (${userCount} users, ${orgCount} orgs)`,
      lastChecked: now,
      details: { userCount, orgCount },
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

async function checkAnthropic(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return { status: 'warning', message: 'Not configured', lastChecked: now }
  }

  try {
    const client = new Anthropic({ apiKey })
    // Make a minimal API call to verify the key works
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'ping' }],
    })

    if (response.id) {
      return { status: 'healthy', message: 'Connected', lastChecked: now }
    }
    return { status: 'error', message: 'Invalid response', lastChecked: now }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'API error'
    if (message.includes('401') || message.includes('invalid')) {
      return { status: 'error', message: 'Invalid API key', lastChecked: now }
    }
    return { status: 'error', message, lastChecked: now }
  }
}

async function checkAnalytics(): Promise<IntegrationStatus> {
  const now = new Date().toISOString()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return { status: 'error', message: 'Supabase not configured', lastChecked: now }
  }

  try {
    const supabase = createSupabaseAdmin()

    // Check if the analytics_events table exists and is queryable
    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })

    if (error) {
      // Table doesn't exist
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return { status: 'error', message: 'Table not found - run migrations', lastChecked: now }
      }
      throw error
    }

    // Table exists and is queryable = integration is working
    const eventCount = count ?? 0
    return {
      status: 'healthy',
      message: `Connected (${eventCount} total events)`,
      lastChecked: now,
      details: { totalEvents: eventCount },
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

  try {
    // Run all checks in parallel
    const [stripe, supabase, cloudflareStream, cloudflareImages, resend, anthropic, analytics] = await Promise.all([
      checkStripe(),
      checkSupabase(),
      checkCloudflareStream(),
      checkCloudflareImages(),
      checkResend(),
      checkAnthropic(),
      checkAnalytics(),
    ])

    const integrations = {
      stripe,
      supabase,
      cloudflareStream,
      cloudflareImages,
      resend,
      anthropic,
      analytics,
    }

    const response: HealthResponse = {
      timestamp: new Date().toISOString(),
      overall: calculateOverall(integrations),
      integrations,
    }

    return NextResponse.json(response)
  } catch (e) {
    console.error('Health check error:', e)
    return NextResponse.json(
      { error: 'Health check failed', message: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
