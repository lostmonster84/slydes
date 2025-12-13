'use client'

import { useState, useEffect } from 'react'
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
  'restaurant': 'Restaurant / Hospitality',
  'real-estate': 'Real Estate',
  'automotive': 'Automotive / Dealership',
  'salon': 'Salon / Beauty',
  'fitness': 'Fitness / Wellness',
  'travel': 'Travel / Tourism',
  'retail': 'Retail / E-commerce',
  'professional': 'Professional Services',
  'creative': 'Creative / Portfolio',
  'other': 'Other',
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  // Check if already authenticated and fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/waitlist')
      if (response.ok) {
        const result = await response.json()
        setData(result)
        setIsAuthenticated(true)
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        fetchData()
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Something went wrong')
    }
  }

  const exportCSV = () => {
    if (!data?.recentSignups) return
    
    const headers = ['Email', 'First Name', 'Industry', 'Source', 'Signed Up']
    const rows = data.recentSignups.map(entry => [
      entry.email,
      entry.first_name || '',
      entry.industry || '',
      entry.source || '',
      new Date(entry.created_at).toISOString(),
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-leader-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-leader-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Slydes Admin</h1>
              <p className="text-gray-500">Enter password to access the dashboard</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none"
                autoFocus
              />
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full px-4 py-3 bg-leader-blue text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // Dashboard
  const maxIndustryCount = data?.industryBreakdown[0]?.count || 1

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Slydes Waitlist</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200"
            >
              Refresh
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 text-sm bg-leader-blue hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-gray-500 text-sm mb-1">Total on Waitlist</p>
            <p className="text-5xl font-bold text-gray-900">{data?.totalCount || 0}</p>
            <p className="text-leader-blue text-sm mt-2 font-medium">people waiting</p>
          </motion.div>

          {/* This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-gray-500 text-sm mb-1">This Week</p>
            <p className="text-5xl font-bold text-green-600">+{data?.weekCount || 0}</p>
            <p className="text-gray-500 text-sm mt-2">new signups</p>
          </motion.div>

          {/* Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <p className="text-gray-500 text-sm mb-1">Today</p>
            <p className="text-5xl font-bold text-leader-blue">+{data?.todayCount || 0}</p>
            <p className="text-gray-500 text-sm mt-2">new signups</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Industry Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">By Industry</h2>
            <div className="space-y-4">
              {data?.industryBreakdown.map((item, index) => (
                <div key={item.industry}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{getIndustryLabel(item.industry)}</span>
                    <span className="text-gray-500">{item.count} ({Math.round((item.count / (data?.totalCount || 1)) * 100)}%)</span>
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
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
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

        {/* Daily Signups Chart (Simple) */}
        {data?.dailySignups && Object.keys(data.dailySignups).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
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
      </main>
    </div>
  )
}
