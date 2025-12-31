'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, List, RefreshCw, Download, Mail, UserCheck, UserX } from 'lucide-react'

interface Lead {
  id: string
  email: string
  source: string | null
  created_at: string
  converted_at: string | null
  user_id: string | null
}

interface DashboardData {
  totalCount: number
  unconvertedCount: number
  convertedCount: number
  weekCount: number
  todayCount: number
  conversionRate: number
  allLeads: Lead[]
  dailyLeads: Record<string, number>
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

export default function AdminLeadsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unconverted' | 'converted'>('all')

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/leads')
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
    if (!data?.allLeads) return

    const headers = ['Email', 'Source', 'Status', 'Captured At', 'Converted At']
    const rows = data.allLeads.map((lead) => [
      lead.email,
      lead.source || 'onboarding',
      lead.converted_at ? 'Converted' : 'Pending',
      new Date(lead.created_at).toISOString(),
      lead.converted_at ? new Date(lead.converted_at).toISOString() : '',
    ])

    const csv = [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Filter leads by search and status
  const filteredLeads = data?.allLeads.filter(lead => {
    const matchesSearch = lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'converted' && lead.converted_at) ||
      (statusFilter === 'unconverted' && !lead.converted_at)
    return matchesSearch && matchesStatus
  }) || []

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list' as const, label: 'All Leads', icon: List, count: data?.totalCount },
  ]

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Onboarding email captures (pre-auth)</p>
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
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Total Leads</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{data?.totalCount ?? 0}</p>
              <p className="text-blue-400 text-sm mt-2 font-medium">emails captured</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Unconverted</p>
              <p className="text-4xl font-bold text-amber-400">{data?.unconvertedCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">need follow-up</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Converted</p>
              <p className="text-4xl font-bold text-green-400">{data?.convertedCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">signed up</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Conversion Rate</p>
              <p className="text-4xl font-bold text-purple-400">{data?.conversionRate ?? 0}%</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">lead → user</p>
            </motion.div>
          </div>

          {/* Week/Today Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">This Week</p>
              <p className="text-4xl font-bold text-green-400">+{data?.weekCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">new leads</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Today</p>
              <p className="text-4xl font-bold text-blue-400">+{data?.todayCount ?? 0}</p>
              <p className="text-gray-400 dark:text-[#636366] text-sm mt-2">new leads</p>
            </motion.div>
          </div>

          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data?.allLeads.slice(0, 20).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/10 last:border-0"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    {lead.converted_at ? (
                      <UserCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <UserX className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{lead.email}</p>
                      <p className="text-xs text-gray-500 dark:text-[#98989d]">
                        {lead.source || 'onboarding'}
                        {lead.converted_at && ' · Converted'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-[#636366] ml-4 whitespace-nowrap">
                    {timeAgo(lead.created_at)}
                  </span>
                </div>
              ))}

              {(!data?.allLeads || data.allLeads.length === 0) && (
                <p className="text-gray-400 dark:text-[#636366] text-sm">No leads captured yet</p>
              )}
            </div>
          </motion.div>

          {/* Daily Leads Chart */}
          {data?.dailyLeads && Object.keys(data.dailyLeads).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last 30 Days</h2>
              <div className="flex items-end gap-1 h-32">
                {Object.entries(data.dailyLeads).map(([date, count]) => {
                  const maxDaily = Math.max(...Object.values(data.dailyLeads))
                  const height = (count / maxDaily) * 100
                  return (
                    <div
                      key={date}
                      className="flex-1 bg-blue-500/40 hover:bg-blue-500 rounded-t transition-colors cursor-pointer group relative"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${date}: ${count} leads`}
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
          {/* Search + Filter */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#3a3a3c] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#636366] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              {(['all', 'unconverted', 'converted'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-500 dark:text-[#98989d] hover:bg-gray-200 dark:hover:bg-[#48484a]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 dark:text-[#98989d] mb-4">
            {searchQuery || statusFilter !== 'all'
              ? `${filteredLeads.length} of ${data?.allLeads.length || 0} leads`
              : `${data?.allLeads.length || 0} total leads`
            }
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-[#98989d] border-b border-gray-200 dark:border-white/10">
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Captured</th>
                  <th className="pb-3 font-medium text-right">Converted</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-[#636366]" />
                        <span className="text-gray-900 dark:text-white text-sm">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500 dark:text-[#98989d]">
                      {lead.source || 'onboarding'}
                    </td>
                    <td className="py-3">
                      {lead.converted_at ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          Converted
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-sm text-gray-400 dark:text-[#636366] text-right">
                      {new Date(lead.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 text-sm text-gray-400 dark:text-[#636366] text-right">
                      {lead.converted_at
                        ? new Date(lead.converted_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <p className="text-gray-400 dark:text-[#636366] text-center py-8">
                {searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads captured yet'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
