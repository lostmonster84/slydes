'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface WaitlistEntry {
  id: string
  email: string
  first_name: string | null
  industry: string | null
  source: string | null
  created_at: string
}

interface IndustryCount {
  industry: string
  count: number
}

interface DashboardData {
  totalCount: number
  weekCount: number
  todayCount: number
  industryBreakdown: IndustryCount[]
  recentSignups: WaitlistEntry[]
  dailySignups: Record<string, number>
}

// Industry display names
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
  other: 'Other',
  'Not specified': 'Not specified',
}

function getIndustryLabel(industry: string): string {
  return INDUSTRY_LABELS[industry] || industry
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function AdminWaitlistPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/waitlist')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const exportCSV = () => {
    if (!data?.recentSignups) return

    const headers = ['Email', 'First Name', 'Industry', 'Source', 'Signed Up']
    const rows = data.recentSignups.map((entry) => [
      entry.email,
      entry.first_name || '',
      entry.industry || '',
      entry.source || '',
      new Date(entry.created_at).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const maxIndustryCount = data?.industryBreakdown[0]?.count || 1

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
          <p className="text-gray-500">Manage waitlist signups and exports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
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
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm font-medium bg-leader-blue hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <p className="text-gray-500 text-sm mb-1">Total on Waitlist</p>
          <p className="text-4xl font-bold text-gray-900">{data?.totalCount ?? '-'}</p>
          <p className="text-leader-blue text-sm mt-2 font-medium">people waiting</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <p className="text-gray-500 text-sm mb-1">This Week</p>
          <p className="text-4xl font-bold text-green-600">+{data?.weekCount ?? 0}</p>
          <p className="text-gray-500 text-sm mt-2">new signups</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <p className="text-gray-500 text-sm mb-1">Today</p>
          <p className="text-4xl font-bold text-leader-blue">+{data?.todayCount ?? 0}</p>
          <p className="text-gray-500 text-sm mt-2">new signups</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">By Industry</h2>
          <div className="space-y-4">
            {data?.industryBreakdown.map((item, index) => (
              <div key={item.industry}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">
                    {getIndustryLabel(item.industry)}
                  </span>
                  <span className="text-gray-500">
                    {item.count} ({Math.round((item.count / (data?.totalCount || 1)) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxIndustryCount) * 100}%` }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                    className="h-full bg-leader-blue rounded-full"
                  />
                </div>
              </div>
            ))}

            {(!data?.industryBreakdown || data.industryBreakdown.length === 0) && (
              <p className="text-gray-400 text-sm">No signups yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Signups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {data?.recentSignups.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900 font-medium truncate">{entry.email}</p>
                  <p className="text-xs text-gray-500">
                    {entry.first_name && `${entry.first_name} · `}
                    {getIndustryLabel(entry.industry || 'Not specified')}
                  </p>
                </div>
                <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                  {timeAgo(entry.created_at)}
                </span>
              </div>
            ))}

            {(!data?.recentSignups || data.recentSignups.length === 0) && (
              <p className="text-gray-400 text-sm">No signups yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Daily Signups Chart */}
      {data?.dailySignups && Object.keys(data.dailySignups).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last 30 Days</h2>
          <div className="flex items-end gap-1 h-32">
            {Object.entries(data.dailySignups).map(([date, count]) => {
              const maxDaily = Math.max(...Object.values(data.dailySignups))
              const height = (count / maxDaily) * 100
              return (
                <div
                  key={date}
                  className="flex-1 bg-leader-blue/40 hover:bg-leader-blue rounded-t transition-colors cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${date}: ${count} signups`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {date}: {count}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Hover over bars to see daily counts
          </p>
        </motion.div>
      )}
    </div>
  )
}
