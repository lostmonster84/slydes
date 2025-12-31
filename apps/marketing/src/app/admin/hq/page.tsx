'use client'

import { useState, useEffect, useCallback } from 'react'
import { HealthBanner } from '../_components/HealthBanner'
import {
  IntegrationCard,
  StripeIcon,
  SupabaseIcon,
  CloudflareIcon,
  ResendIcon,
  AnthropicIcon,
  AnalyticsIcon,
  R2Icon,
} from '../_components/IntegrationCard'
import {
  MetricCard,
  UsersIcon,
  BuildingIcon,
  LayersIcon,
  MailIcon,
} from '../_components/MetricCard'
import { InfoIcon } from '../_components/InfoTooltip'
import { PeriodSelector } from '../_components/PeriodSelector'
import { TrendPeriod, TrendMetric, getPeriodLabel, CustomDateRange } from '@/lib/dateUtils'

type IntegrationStatus = {
  status: 'healthy' | 'warning' | 'error'
  message: string
  lastChecked: string
  details?: Record<string, unknown>
}

type HealthData = {
  timestamp: string
  overall: 'healthy' | 'degraded' | 'unhealthy'
  integrations: {
    stripe: IntegrationStatus
    supabase: IntegrationStatus
    cloudflareStream: IntegrationStatus
    cloudflareImages: IntegrationStatus
    cloudflareR2: IntegrationStatus
    resend: IntegrationStatus
    anthropic: IntegrationStatus
    analytics: IntegrationStatus
  }
}

type MetricsData = {
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

type RevenueData = {
  subscribers: { total: number; pro: number; creator: number; free: number }
  mrr: number
  arr: number
  allUsers: { created_at: string }[]
}

type OrganizationsData = {
  organizations: { published_slydes: number }[]
  stats: { total: number; thisMonth: number }
}

type SiteVisitsData = {
  uniqueVisitors: {
    total: number
    today: number
    yesterday: number
    thisWeek: number
    last30Days: number
  }
  totalPageViews: number
  topPages: { page: string; views: number }[]
  topCountries: { country: string; visits: number }[]
}

export default function AdminOverviewPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [orgs, setOrgs] = useState<OrganizationsData | null>(null)
  const [siteVisits, setSiteVisits] = useState<SiteVisitsData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<TrendPeriod>('wow')
  const [customRange, setCustomRange] = useState<CustomDateRange | undefined>()

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    // Build metrics URL with period and optional custom range
    let metricsUrl = `/api/admin/metrics?period=${period}`
    if (period === 'custom' && customRange) {
      metricsUrl += `&startDate=${customRange.startDate}&endDate=${customRange.endDate}`
    }

    try {
      const [healthRes, metricsRes, revenueRes, orgsRes, siteVisitsRes] = await Promise.all([
        fetch('/api/admin/health'),
        fetch(metricsUrl),
        fetch('/api/admin/revenue'),
        fetch('/api/admin/organizations'),
        fetch('/api/admin/site-visits'),
      ])

      if (!healthRes.ok || !metricsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [healthData, metricsData, revenueData, orgsData, siteVisitsData] = await Promise.all([
        healthRes.json(),
        metricsRes.json(),
        revenueRes.ok ? revenueRes.json() : null,
        orgsRes.ok ? orgsRes.json() : null,
        siteVisitsRes.ok ? siteVisitsRes.json() : null,
      ])

      setHealth(healthData)
      setMetrics(metricsData)
      setRevenue(revenueData)
      setOrgs(orgsData)
      setSiteVisits(siteVisitsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsRefreshing(false)
    }
  }, [period, customRange])

  useEffect(() => {
    fetchData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Helper to format trend for MetricCard
  const formatTrend = (trend: TrendMetric | undefined) => {
    if (!trend) return undefined
    return {
      value: trend.changePercent,
      label: `% ${getPeriodLabel(period)}`
    }
  }

  if (error && !health) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
          <p className="text-gray-500 dark:text-[#98989d]">System health and key metrics at a glance</p>
        </div>
        <PeriodSelector
          value={period}
          onChange={(newPeriod, newCustomRange) => {
            setPeriod(newPeriod)
            setCustomRange(newCustomRange)
          }}
          periodLabel={metrics?.periodLabel}
          customRange={customRange}
        />
      </div>

      {/* Health Banner */}
      {health && (
        <div className="mb-8">
          <HealthBanner
            status={health.overall}
            lastUpdated={health.timestamp}
            onRefresh={fetchData}
            isRefreshing={isRefreshing}
          />
        </div>
      )}

      {/* Site Visitors */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Site Visitors</h2>
          <InfoIcon tooltip="Unique visitors to slydes.io. Based on anonymized fingerprints - no personal data stored." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Today"
            value={siteVisits?.uniqueVisitors.today ?? '-'}
            tooltip="Unique visitors today so far."
            subtext={siteVisits?.uniqueVisitors.yesterday !== undefined ? `${siteVisits.uniqueVisitors.yesterday} yesterday` : undefined}
          />
          <MetricCard
            label="This Week"
            value={siteVisits?.uniqueVisitors.thisWeek ?? '-'}
            tooltip="Unique visitors in the last 7 days."
          />
          <MetricCard
            label="Last 30 Days"
            value={siteVisits?.uniqueVisitors.last30Days ?? '-'}
            tooltip="Unique visitors in the last 30 days."
          />
          <MetricCard
            label="All Time"
            value={siteVisits?.uniqueVisitors.total ?? '-'}
            tooltip="Total unique visitors since tracking started."
            subtext={siteVisits?.totalPageViews ? `${siteVisits.totalPageViews} page views` : undefined}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Metrics</h2>
          <InfoIcon tooltip="Quick snapshot of your most important numbers. Click through to Business or Revenue pages for details." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Waitlist"
            value={metrics?.waitlist.total ?? '-'}
            tooltip="People waiting to try Slydes. Your warmest leads for launch."
            trend={formatTrend(metrics?.waitlist.trend)}
            icon={<MailIcon />}
            color="blue"
          />
          <MetricCard
            label="Users"
            value={metrics?.users.total ?? '-'}
            tooltip="Registered accounts on the platform. Includes all tiers."
            trend={formatTrend(metrics?.users.trend)}
            subtext={
              metrics?.revenue.proUsers
                ? `${metrics.revenue.proUsers} Pro, ${metrics.revenue.creatorUsers} Creator`
                : undefined
            }
            icon={<UsersIcon />}
          />
          <MetricCard
            label="Organizations"
            value={metrics?.organizations.total ?? '-'}
            tooltip="Business profiles created. Each can have multiple Slydes."
            trend={formatTrend(metrics?.organizations.trend)}
            icon={<BuildingIcon />}
          />
          <MetricCard
            label="Slydes"
            value={metrics?.content.totalSlydes ?? '-'}
            tooltip="Total Slydes created. Your core product usage metric."
            trend={formatTrend(metrics?.content.slydesTrend)}
            subtext={
              metrics?.content.publishedSlydes !== undefined
                ? `${metrics.content.publishedSlydes} published`
                : undefined
            }
            icon={<LayersIcon />}
          />
        </div>
      </div>

      {/* Revenue */}
      {metrics && metrics.revenue.mrr > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h2>
            <InfoIcon tooltip="Monthly Recurring Revenue from subscriptions. See Revenue page for full breakdown." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="MRR"
              value={`£${metrics.revenue.mrr}`}
              tooltip="Monthly Recurring Revenue. Pro (£50/mo) + Creator (£25/mo) subscriptions."
              subtext={`${metrics.revenue.proUsers + metrics.revenue.creatorUsers} subscribers`}
              color="green"
            />
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h2>
          <InfoIcon tooltip="Status of external services Slydes depends on. Green = working, Yellow = warning, Red = down. Critical services affect core functionality." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {health && (
            <>
              <IntegrationCard
                name="Stripe"
                status={health.integrations.stripe.status}
                message={health.integrations.stripe.message}
                icon={<StripeIcon />}
                lastChecked={health.integrations.stripe.lastChecked}
                tooltip="Payment processing. Handles subscriptions, one-time payments, and marketplace transactions."
                critical
              />
              <IntegrationCard
                name="Supabase"
                status={health.integrations.supabase.status}
                message={health.integrations.supabase.message}
                icon={<SupabaseIcon />}
                lastChecked={health.integrations.supabase.lastChecked}
                tooltip="Database and authentication. Stores all user data, content, and handles login."
                critical
              />
              <IntegrationCard
                name="Cloudflare Stream"
                status={health.integrations.cloudflareStream.status}
                message={health.integrations.cloudflareStream.message}
                icon={<CloudflareIcon />}
                lastChecked={health.integrations.cloudflareStream.lastChecked}
                tooltip="Video hosting and streaming. Powers all video content in Slydes."
                critical
              />
              <IntegrationCard
                name="Cloudflare Images"
                status={health.integrations.cloudflareImages.status}
                message={health.integrations.cloudflareImages.message}
                icon={<CloudflareIcon />}
                lastChecked={health.integrations.cloudflareImages.lastChecked}
                tooltip="Image hosting and optimization. Stores and serves images with automatic resizing."
              />
              <IntegrationCard
                name="Cloudflare R2"
                status={health.integrations.cloudflareR2.status}
                message={health.integrations.cloudflareR2.message}
                icon={<R2Icon />}
                lastChecked={health.integrations.cloudflareR2.lastChecked}
                tooltip="Object storage for audio files. Stores background music uploads."
              />
              <IntegrationCard
                name="Resend"
                status={health.integrations.resend.status}
                message={health.integrations.resend.message}
                icon={<ResendIcon />}
                lastChecked={health.integrations.resend.lastChecked}
                tooltip="Email delivery. Sends transactional emails, waitlist confirmations, and notifications."
              />
              <IntegrationCard
                name="Anthropic"
                status={health.integrations.anthropic.status}
                message={health.integrations.anthropic.message}
                icon={<AnthropicIcon />}
                lastChecked={health.integrations.anthropic.lastChecked}
                tooltip="AI assistant. Powers the Ask HQ chat for business insights."
              />
              <IntegrationCard
                name="Analytics"
                status={health.integrations.analytics.status}
                message={health.integrations.analytics.message}
                icon={<AnalyticsIcon />}
                lastChecked={health.integrations.analytics.lastChecked}
                tooltip="Internal analytics tracking. Monitors Slyde views, engagement, and user behavior."
              />
            </>
          )}

          {!health && (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-[#3a3a3c] rounded-lg" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-[#3a3a3c] rounded" />
                  </div>
                  <div className="h-3 w-32 bg-gray-200 dark:bg-[#3a3a3c] rounded" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
