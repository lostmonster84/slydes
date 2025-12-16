'use client'

import { useState, useEffect, useCallback } from 'react'
import { InfoIcon } from '../_components/InfoTooltip'

type User = {
  id: string
  email: string
  plan: string
  status: string
  created_at: string
}

type CustomersData = {
  allUsers: User[]
  subscribers: {
    total: number
    pro: number
    creator: number
    free: number
  }
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

export default function CustomersPage() {
  const [data, setData] = useState<CustomersData>({
    allUsers: [],
    subscribers: { total: 0, pro: 0, creator: 0, free: 0 },
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'creator' | 'free'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/revenue')
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.message || json.error || 'Failed to fetch customers')
      }
      setData({
        allUsers: json.allUsers || [],
        subscribers: json.subscribers || { total: 0, pro: 0, creator: 0, free: 0 },
      })
    } catch (e) {
      console.error('Customers fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredUsers = data.allUsers
    .filter((user) => userFilter === 'all' || user.plan === userFilter)
    .filter(
      (user) =>
        searchQuery === '' ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const exportCSV = () => {
    const headers = ['Email', 'Plan', 'Status', 'Joined']
    const rows = filteredUsers.map((user) => [
      user.email,
      user.plan,
      user.status,
      new Date(user.created_at).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const filterLabel = userFilter === 'all' ? 'all' : userFilter
    a.download = `slydes-customers-${filterLabel}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customers</h1>
          <p className="text-[#98989d]">All signed up users across all tiers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="px-4 py-2 text-sm font-medium bg-[#3a3a3c] text-white border border-white/10 rounded-lg hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
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
            disabled={filteredUsers.length === 0}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-white">{data.subscribers.total}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">Pro</p>
          <p className="text-3xl font-bold text-green-400">{data.subscribers.pro}</p>
          <p className="text-xs text-[#636366] mt-1">£50/mo each</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">Creator</p>
          <p className="text-3xl font-bold text-blue-400">{data.subscribers.creator}</p>
          <p className="text-xs text-[#636366] mt-1">£25/mo each</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Free</p>
          <p className="text-3xl font-bold text-[#98989d]">{data.subscribers.free}</p>
          <p className="text-xs text-[#636366] mt-1">potential upgrades</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Customer List</h2>
            <InfoIcon
              tooltip="All users who have signed up. Filter by plan or search by email. Export to CSV for email campaigns or analysis."
              light
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636366]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white placeholder-[#636366] text-sm w-64 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {(['all', 'pro', 'creator', 'free'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUserFilter(filter)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    userFilter === filter
                      ? filter === 'pro'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : filter === 'creator'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : filter === 'free'
                        ? 'bg-[#3a3a3c] text-[#98989d] border border-white/10'
                        : 'bg-white/10 text-white border border-white/20'
                      : 'text-[#636366] hover:text-white hover:bg-[#3a3a3c]'
                  }`}
                >
                  {filter === 'all'
                    ? `All (${data.allUsers.length})`
                    : filter === 'pro'
                    ? `Pro (${data.subscribers.pro})`
                    : filter === 'creator'
                    ? `Creator (${data.subscribers.creator})`
                    : `Free (${data.subscribers.free})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 px-4 bg-[#3a3a3c]/50 rounded-lg hover:bg-[#3a3a3c] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">{user.email}</p>
                <p className="text-xs text-[#636366]">
                  Joined {new Date(user.created_at).toLocaleDateString()} ({timeAgo(user.created_at)})
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.plan === 'pro'
                      ? 'bg-green-500/20 text-green-400'
                      : user.plan === 'creator'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-[#3a3a3c] text-[#98989d]'
                  }`}
                >
                  {user.plan}
                </span>
                {user.plan !== 'free' && (
                  <span
                    className={`text-xs ${
                      user.status === 'active' ? 'text-green-400' : 'text-[#636366]'
                    }`}
                  >
                    {user.status}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="text-[#636366] text-sm py-8 text-center">
              {searchQuery ? 'No customers match your search' : 'No customers yet'}
            </p>
          )}
        </div>

        {/* Footer with count */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-[#636366]">
              Showing {filteredUsers.length} of {data.allUsers.length} customers
            </p>
            <button
              onClick={exportCSV}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export {userFilter !== 'all' ? userFilter : ''} customers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
