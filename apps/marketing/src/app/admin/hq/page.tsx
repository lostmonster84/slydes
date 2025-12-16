'use client'

import { useState, useEffect, useCallback } from 'react'
import { HealthBanner } from '../_components/HealthBanner'
import {
  IntegrationCard,
  StripeIcon,
  SupabaseIcon,
  CloudflareIcon,
  ResendIcon,
  AnalyticsIcon,
} from '../_components/IntegrationCard'
import {
  MetricCard,
  UsersIcon,
  BuildingIcon,
  LayersIcon,
  MailIcon,
} from '../_components/MetricCard'
import { InfoIcon } from '../_components/InfoTooltip'

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
    resend: IntegrationStatus
    analytics: IntegrationStatus
  }
}

type MetricsData = {
  timestamp: string
  waitlist: {
    total: number
    thisWeek: number
    today: number
  }
  users: {
    total: number
    byPlan: { plan: string; count: number }[]
  }
  organizations: {
    total: number
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
  }
}

export default function AdminOverviewPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch('/api/admin/health'),
        fetch('/api/admin/metrics'),
      ])

      if (!healthRes.ok || !metricsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [healthData, metricsData] = await Promise.all([
        healthRes.json(),
        metricsRes.json(),
      ])

      setHealth(healthData)
      setMetrics(metricsData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (error && !health) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-medium">{error}</p>
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
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-[#98989d]">System health and key metrics at a glance</p>
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

      {/* Key Metrics */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Key Metrics</h2>
          <InfoIcon tooltip="Quick snapshot of your most important numbers. Click through to Business or Revenue pages for details." light />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Waitlist"
            value={metrics?.waitlist.total ?? '-'}
            tooltip="People waiting to try Slydes. Your warmest leads for launch."
            trend={
              metrics?.waitlist.thisWeek
                ? { value: metrics.waitlist.thisWeek, label: 'this week' }
                : undefined
            }
            icon={<MailIcon />}
            color="blue"
          />
          <MetricCard
            label="Users"
            value={metrics?.users.total ?? '-'}
            tooltip="Registered accounts on the platform. Includes all tiers."
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
            icon={<BuildingIcon />}
          />
          <MetricCard
            label="Slydes"
            value={metrics?.content.totalSlydes ?? '-'}
            tooltip="Total Slydes created. Your core product usage metric."
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
            <h2 className="text-lg font-semibold text-white">Revenue</h2>
            <InfoIcon tooltip="Monthly Recurring Revenue from subscriptions. See Revenue page for full breakdown." light />
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
          <h2 className="text-lg font-semibold text-white">Integrations</h2>
          <InfoIcon tooltip="Status of external services Slydes depends on. Green = working, Yellow = warning, Red = down. Critical services affect core functionality." light />
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
                name="Resend"
                status={health.integrations.resend.status}
                message={health.integrations.resend.message}
                icon={<ResendIcon />}
                lastChecked={health.integrations.resend.lastChecked}
                tooltip="Email delivery. Sends transactional emails, waitlist confirmations, and notifications."
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
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#3a3a3c] rounded-lg" />
                    <div className="h-4 w-24 bg-[#3a3a3c] rounded" />
                  </div>
                  <div className="h-3 w-32 bg-[#3a3a3c] rounded" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
