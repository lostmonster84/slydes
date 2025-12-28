'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, List, RefreshCw, Download, Trash2, Mail } from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  first_name: string | null
  industry: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
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
  allSignups: WaitlistEntry[]
  dailySignups: Record<string, number>
}

// Industry display names
const INDUSTRY_LABELS: Record<string, string> = {
  property: 'Property (Sales & Lettings)',
  hospitality: 'Hospitality (Hotels, Holiday Lets, Glamping)',
  automotive: 'Automotive (Car Hire, Dealerships)',
  // Legacy values (keep for backward compatibility)
  restaurant: 'Restaurant / Hospitality',
  'real-estate': 'Real Estate',
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

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
    if (!data?.allSignups) return

    const headers = ['Email', 'First Name', 'Industry', 'Source', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Signed Up']
    const rows = data.allSignups.map((entry) => [
      entry.email,
      entry.first_name || '',
      entry.industry || '',
      entry.source || '',
      entry.utm_source || '',
      entry.utm_medium || '',
      entry.utm_campaign || '',
      new Date(entry.created_at).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const maxIndustryCount = data?.industryBreakdown[0]?.count || 1

  // Filter signups by search query
  const filteredSignups = data?.allSignups.filter(entry =>
    entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list' as const, label: 'All Signups', icon: List, count: data?.totalCount },
  ]

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Waitlist</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Manage waitlist signups and exports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-500 dark:text-[#98989d] hover:bg-gray-200 dark:hover:bg-[#48484a] hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Total on Waitlist</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{data?.totalCount ?? 0}</p>
              <p className="text-blue-400 text-sm mt-2 font-medium">people waiting</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">This Week</p>
              <p className="text-4xl font-bold text-green-400">+{data?.weekCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">new signups</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Today</p>
              <p className="text-4xl font-bold text-blue-400">+{data?.todayCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">new signups</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Industry Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Industry</h2>
              <div className="space-y-4">
                {data?.industryBreakdown.map((item, index) => (
                  <div key={item.industry}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {getIndustryLabel(item.industry)}
                      </span>
                      <span className="text-gray-400 dark:text-[#636366]">
                        {item.count} ({Math.round((item.count / (data?.totalCount || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-[#3a3a3c] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / maxIndustryCount) * 100}%` }}
                        transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}

                {(!data?.industryBreakdown || data.industryBreakdown.length === 0) && (
                  <p className="text-gray-400 dark:text-[#636366] text-sm">No signups yet</p>
                )}
              </div>
            </motion.div>

            {/* Recent Signups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Signups</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {data?.allSignups.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/10 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{entry.email}</p>
                      <p className="text-xs text-gray-500 dark:text-[#98989d]">
                        {entry.first_name && `${entry.first_name} · `}
                        {getIndustryLabel(entry.industry || 'Not specified')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-[#636366] ml-4 whitespace-nowrap">
                      {timeAgo(entry.created_at)}
                    </span>
                  </div>
                ))}

                {(!data?.allSignups || data.allSignups.length === 0) && (
                  <p className="text-gray-400 dark:text-[#636366] text-sm">No signups yet</p>
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
              className="mt-8 bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last 30 Days</h2>
              <div className="flex items-end gap-1 h-32">
                {Object.entries(data.dailySignups).map(([date, count]) => {
                  const maxDaily = Math.max(...Object.values(data.dailySignups))
                  const height = (count / maxDaily) * 100
                  return (
                    <div
                      key={date}
                      className="flex-1 bg-blue-500/40 hover:bg-blue-500 rounded-t transition-colors cursor-pointer group relative"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${date}: ${count} signups`}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1c1c1e] text-gray-900 dark:text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-gray-200 dark:border-white/10">
                        {date}: {count}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 dark:text-[#636366] mt-2 text-center">
                Hover over bars to see daily counts
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by email, name, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-[#3a3a3c] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-[#636366] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 dark:text-[#98989d] mb-4">
            {searchQuery
              ? `${filteredSignups.length} of ${data?.allSignups.length || 0} signups`
              : `${data?.allSignups.length || 0} total signups`
            }
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-[#98989d] border-b border-gray-200 dark:border-white/10">
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Industry</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium text-right">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignups.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-[#636366]" />
                        <span className="text-gray-900 dark:text-white text-sm">{entry.email}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500 dark:text-[#98989d]">
                      {entry.first_name || '—'}
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-[#3a3a3c] text-gray-500 dark:text-[#98989d]">
                        {getIndustryLabel(entry.industry || 'Not specified')}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-400 dark:text-[#636366]">
                      {entry.utm_source || entry.source || 'direct'}
                    </td>
                    <td className="py-3 text-sm text-gray-400 dark:text-[#636366] text-right">
                      {new Date(entry.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSignups.length === 0 && (
              <p className="text-gray-400 dark:text-[#636366] text-center py-8">
                {searchQuery ? 'No signups match your search' : 'No signups yet'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
