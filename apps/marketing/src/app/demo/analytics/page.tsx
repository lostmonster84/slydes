'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// ============================================
// ANALYTICS DASHBOARD
// ============================================

// Shows key metrics for a published slyde flow
// Views, completion rates, hearts, CTA clicks

interface MetricCard {
  label: string
  value: string
  change: string
  changeType: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
}

interface SlydeMetric {
  id: number
  type: string
  icon: string
  title: string
  views: number
  dropoff: number
  avgTime: string
}

const OVERVIEW_METRICS: MetricCard[] = [
  {
    label: 'Total Views',
    value: '12,847',
    change: '+23%',
    changeType: 'up',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: 'Completion Rate',
    value: '68%',
    change: '+5%',
    changeType: 'up',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Hearts',
    value: '2,419',
    change: '+18%',
    changeType: 'up',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    label: 'CTA Clicks',
    value: '847',
    change: '+12%',
    changeType: 'up',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
]

const SLYDE_METRICS: SlydeMetric[] = [
  { id: 1, type: 'Hero', icon: '🎬', title: 'WildTrax 4x4', views: 12847, dropoff: 0, avgTime: '2.1s' },
  { id: 2, type: 'About', icon: '📖', title: 'The Experience', views: 11234, dropoff: 12, avgTime: '3.4s' },
  { id: 3, type: 'Showcase', icon: '✨', title: 'Land Rover Defender', views: 10102, dropoff: 10, avgTime: '4.2s' },
  { id: 4, type: 'Reviews', icon: '⭐', title: '209 Reviews', views: 9456, dropoff: 6, avgTime: '2.8s' },
  { id: 5, type: 'Location', icon: '📍', title: 'Scottish Highlands', views: 8934, dropoff: 5, avgTime: '2.3s' },
  { id: 6, type: 'CTA', icon: '🎯', title: 'Book Now', views: 8736, dropoff: 2, avgTime: '5.1s' },
]

// ============================================
// METRIC CARD COMPONENT
// ============================================

function MetricCardComponent({ metric }: { metric: MetricCard }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
          {metric.icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          metric.changeType === 'up' ? 'text-green-600' : 
          metric.changeType === 'down' ? 'text-red-600' : 
          'text-gray-400'
        }`}>
          {metric.changeType === 'up' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {metric.changeType === 'down' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {metric.change}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
      <div className="text-sm text-gray-500">{metric.label}</div>
    </div>
  )
}

// ============================================
// FUNNEL VISUALIZATION
// ============================================

function FunnelVisualization({ metrics }: { metrics: SlydeMetric[] }) {
  const maxViews = metrics[0].views
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">Swipe Depth Funnel</h3>
      <div className="space-y-3">
        {metrics.map((metric, i) => {
          const widthPercent = (metric.views / maxViews) * 100
          return (
            <div key={metric.id} className="flex items-center gap-4">
              <div className="w-8 text-center text-lg">{metric.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{metric.title}</span>
                  <span className="text-sm text-gray-500">{metric.views.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      i === metrics.length - 1 ? 'bg-red-600' : 'bg-gradient-to-r from-red-600 to-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
              </div>
              {metric.dropoff > 0 && (
                <div className="w-16 text-right text-xs text-red-500">-{metric.dropoff}%</div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">Overall Completion</div>
          <div className="text-lg font-bold text-gray-900">68%</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Avg. Session</div>
          <div className="text-lg font-bold text-gray-900">19.9s</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TIME CHART
// ============================================

function TimeChart() {
  const data = [
    { day: 'Mon', views: 1200 },
    { day: 'Tue', views: 1800 },
    { day: 'Wed', views: 2400 },
    { day: 'Thu', views: 2100 },
    { day: 'Fri', views: 2800 },
    { day: 'Sat', views: 3200 },
    { day: 'Sun', views: 2900 },
  ]
  const maxViews = Math.max(...data.map(d => d.views))
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Views Over Time</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-medium">7D</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium">30D</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium">All</button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item, i) => {
          const heightPercent = (item.views / maxViews) * 100
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-lg"
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
              <span className="text-xs text-gray-400">{item.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// PER-SLYDE TABLE
// ============================================

function SlydeTable({ metrics }: { metrics: SlydeMetric[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Per-Slyde Metrics</h3>
      </div>
      {/* Mobile: stacked cards (vertical-only, no horizontal scroll) */}
      <div className="md:hidden p-4 space-y-3">
        {metrics.map((metric, i) => (
          <div key={metric.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="text-2xl leading-none">{metric.icon}</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{metric.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{i + 1} • {metric.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Views</div>
                <div className="text-sm font-semibold text-gray-900">{metric.views.toLocaleString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-400">Drop-off</div>
                <div className={`text-sm font-semibold ${metric.dropoff > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {metric.dropoff > 0 ? `-${metric.dropoff}%` : '—'}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-400">Avg. Time</div>
                <div className="text-sm font-semibold text-gray-900">{metric.avgTime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Slyde</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Views</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Drop-off</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Avg. Time</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, i) => (
              <tr key={metric.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{metric.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{metric.title}</div>
                      <div className="text-xs text-gray-400">{i + 1} • {metric.type}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right px-4 py-3">
                  <span className="text-sm text-gray-900">{metric.views.toLocaleString()}</span>
                </td>
                <td className="text-right px-4 py-3">
                  {metric.dropoff > 0 ? (
                    <span className="text-sm text-red-500">-{metric.dropoff}%</span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="text-right px-4 py-3">
                  <span className="text-sm text-gray-500">{metric.avgTime}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// INSIGHTS PANEL
// ============================================

function InsightsPanel() {
  const insights = [
    { type: 'success', icon: '🎯', text: 'CTA slide has 5.1s avg. time — users are engaging with your offer' },
    { type: 'warning', icon: '⚠️', text: 'About slide has 12% drop-off — consider shortening the copy' },
    { type: 'tip', icon: '💡', text: 'Saturday is your best day — schedule social posts then' },
  ]
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border ${
              insight.type === 'success' ? 'bg-green-50 border-green-200' :
              insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
              'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{insight.icon}</span>
              <p className={`text-sm ${
                insight.type === 'success' ? 'text-green-700' :
                insight.type === 'warning' ? 'text-amber-700' :
                'text-blue-700'
              }`}>
                {insight.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <h1 className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:bg-[#2c2c2e] dark:border-white/10 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </header>

      {/* Flow selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg">
              🚗
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">WildTrax 4x4</h2>
              <p className="text-xs text-gray-500 dark:text-white/60">slydes.io/wildtrax • Published 14 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {OVERVIEW_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MetricCardComponent metric={metric} />
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <FunnelVisualization metrics={SLYDE_METRICS} />
          <TimeChart />
        </div>

        {/* Table + Insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SlydeTable metrics={SLYDE_METRICS} />
          </div>
          <div>
            <InsightsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

