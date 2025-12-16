'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MetricCard,
  UsersIcon,
  BuildingIcon,
  LayersIcon,
  CurrencyIcon,
  MailIcon,
} from '../_components/MetricCard'

type MetricsData = {
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

const INDUSTRY_LABELS: Record<string, string> = {
  restaurant: 'Restaurant / Hospitality',
  'real-estate': 'Real Estate',
  automotive: 'Automotive / Dealership',
  salon: 'Salon / Beauty',
  fitness: 'Fitness / Wellness',
  travel: 'Travel / Tourism',
  retail: 'Retail / E-commerce',
  professional: 'Professional Services',
  creative: 'Creative / Portfolio',
  rentals: 'Rentals',
  tours: 'Tours',
  accommodation: 'Accommodation',
  events: 'Events',
  other: 'Other',
  'Not specified': 'Not specified',
}

function getLabel(key: string, labels: Record<string, string>): string {
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
}

export default function BusinessPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchMetrics = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/metrics')
      if (res.ok) {
        const data = await res.json()
        setMetrics(data)
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchMetrics])

  const maxIndustryCount = metrics?.waitlist.industryBreakdown[0]?.count || 1
  const maxTypeCount = metrics?.organizations.byType[0]?.count || 1

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Metrics</h1>
          <p className="text-gray-500">Users, organizations, content, and revenue</p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={isRefreshing}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Waitlist Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MailIcon />
          Waitlist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Total Signups"
            value={metrics?.waitlist.total ?? '-'}
            color="blue"
          />
          <MetricCard
            label="This Week"
            value={metrics?.waitlist.thisWeek ?? '-'}
            trend={metrics?.waitlist.thisWeek ? { value: metrics.waitlist.thisWeek, label: 'new' } : undefined}
            color="green"
          />
          <MetricCard
            label="Today"
            value={metrics?.waitlist.today ?? '-'}
          />
        </div>

        {/* Industry Breakdown */}
        {metrics?.waitlist.industryBreakdown && metrics.waitlist.industryBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">By Industry</h3>
            <div className="space-y-3">
              {metrics.waitlist.industryBreakdown.slice(0, 8).map((item) => (
                <div key={item.industry}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{getLabel(item.industry, INDUSTRY_LABELS)}</span>
                    <span className="text-gray-500">
                      {item.count} ({Math.round((item.count / metrics.waitlist.total) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-leader-blue rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxIndustryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Users & Organizations */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UsersIcon />
          Users & Organizations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Total Users"
            value={metrics?.users.total ?? '-'}
            icon={<UsersIcon />}
          />
          <MetricCard
            label="Pro Users"
            value={metrics?.revenue.proUsers ?? '-'}
            color="green"
          />
          <MetricCard
            label="Creator Users"
            value={metrics?.revenue.creatorUsers ?? '-'}
            color="blue"
          />
          <MetricCard
            label="Organizations"
            value={metrics?.organizations.total ?? '-'}
            icon={<BuildingIcon />}
          />
        </div>

        {/* Plan Breakdown */}
        {metrics?.users.byPlan && metrics.users.byPlan.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Users by Plan</h3>
              <div className="space-y-3">
                {metrics.users.byPlan.map((item) => (
                  <div key={item.plan} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{item.plan}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {metrics.organizations.byType && metrics.organizations.byType.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Organizations by Type</h3>
                <div className="space-y-3">
                  {metrics.organizations.byType.slice(0, 6).map((item) => (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{getLabel(item.type, INDUSTRY_LABELS)}</span>
                        <span className="text-gray-500">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-electric-cyan rounded-full transition-all duration-500"
                          style={{ width: `${(item.count / maxTypeCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LayersIcon />
          Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Total Slydes"
            value={metrics?.content.totalSlydes ?? '-'}
            icon={<LayersIcon />}
          />
          <MetricCard
            label="Published"
            value={metrics?.content.publishedSlydes ?? '-'}
            subtext={
              metrics?.content.totalSlydes
                ? `${Math.round((metrics.content.publishedSlydes / metrics.content.totalSlydes) * 100)}% publish rate`
                : undefined
            }
            color="green"
          />
          <MetricCard
            label="Total Frames"
            value={metrics?.content.totalFrames ?? '-'}
            subtext={
              metrics?.content.totalSlydes
                ? `~${Math.round(metrics.content.totalFrames / Math.max(metrics.content.totalSlydes, 1))} per slyde`
                : undefined
            }
          />
        </div>
      </div>

      {/* Revenue */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CurrencyIcon />
          Revenue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="MRR (Estimated)"
            value={metrics?.revenue.mrr ? `$${metrics.revenue.mrr}` : '$0'}
            subtext={`${(metrics?.revenue.proUsers ?? 0) + (metrics?.revenue.creatorUsers ?? 0)} subscribers`}
            color="green"
          />
          <MetricCard
            label="Total Orders"
            value={metrics?.revenue.totalOrders ?? 0}
          />
          <MetricCard
            label="Platform Fees"
            value={metrics?.revenue.platformFees ? `$${metrics.revenue.platformFees.toFixed(2)}` : '$0'}
            subtext="5% of transactions"
          />
        </div>
      </div>
    </div>
  )
}
