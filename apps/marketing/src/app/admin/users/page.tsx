'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { InfoIcon } from '../_components/InfoTooltip'

type User = {
  id: string
  email: string
  full_name: string
  company_name: string
  onboarding_completed: boolean
  email_confirmed: boolean
  created_at: string
  last_sign_in: string | null
  provider: string
  plan: 'free' | 'creator' | 'pro' | 'agency'
  subscription_status: string | null
}

function timeAgo(dateString: string | null): string {
  if (!dateString) return 'never'
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'free' | 'creator' | 'pro' | 'agency'>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const fetchUsers = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}`)
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.message || json.error || 'Failed to fetch users')
      }
      setUsers(json.users || [])
    } catch (e) {
      console.error('Users fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAction = async (userId: string, action: string) => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Action failed')
      if (json.message) {
        alert(json.message)
      }
      fetchUsers()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleOpenDropdown = (userId: string) => {
    if (openDropdown === userId) {
      setOpenDropdown(null)
      setDropdownPos(null)
      return
    }
    const btn = buttonRefs.current.get(userId)
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setOpenDropdown(userId)
  }

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return

    setActionLoading(userId)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Delete failed')
      fetchUsers()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = filter === 'all' || user.plan === filter
    return matchesSearch && matchesTier
  })

  const stats = {
    total: users.length,
    free: users.filter(u => u.plan === 'free').length,
    creator: users.filter(u => u.plan === 'creator').length,
    pro: users.filter(u => u.plan === 'pro').length,
    agency: users.filter(u => u.plan === 'agency').length,
  }

  const paying = stats.creator + stats.pro + stats.agency

  const exportCSV = () => {
    const headers = ['Email', 'Name', 'Company', 'Plan', 'Status', 'Onboarded', 'Joined']
    const rows = filteredUsers.map((user) => [
      user.email,
      user.full_name || '',
      user.company_name || '',
      user.plan,
      user.subscription_status || 'n/a',
      user.onboarding_completed ? 'Yes' : 'No',
      new Date(user.created_at).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-users-${filter}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-leader-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 dark:text-[#98989d]">All authenticated users and their subscription tiers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            disabled={isRefreshing}
            className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={filteredUsers.length === 0}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-purple-500/30 p-5">
          <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Agency</p>
          <p className="text-3xl font-bold text-purple-400">{stats.agency}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">£99/mo</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
          <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Pro</p>
          <p className="text-3xl font-bold text-green-400">{stats.pro}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">£50/mo</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
          <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Creator</p>
          <p className="text-3xl font-bold text-blue-400">{stats.creator}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">£25/mo</p>
        </div>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Free</p>
          <p className="text-3xl font-bold text-gray-500 dark:text-[#98989d]">{stats.free}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">{paying > 0 ? `${Math.round((paying / stats.total) * 100)}% paying` : 'potential upgrades'}</p>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User List</h2>
            <InfoIcon
              tooltip="Search by email, name, or company. Filter by tier. Click actions to manage users."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#636366]"
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
                placeholder="Search email, name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#3a3a3c] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#636366] text-sm w-72 focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {(['all', 'agency', 'pro', 'creator', 'free'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filter === f
                      ? f === 'agency'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : f === 'pro'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : f === 'creator'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : f === 'free'
                        ? 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-500 dark:text-[#98989d] border border-gray-200 dark:border-white/10'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20'
                      : 'text-gray-400 dark:text-[#636366] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a3c]'
                  }`}
                >
                  {f === 'all' ? `All (${stats.total})` :
                   f === 'agency' ? `Agency (${stats.agency})` :
                   f === 'pro' ? `Pro (${stats.pro})` :
                   f === 'creator' ? `Creator (${stats.creator})` :
                   `Free (${stats.free})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User rows */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-[#3a3a3c]/50 rounded-lg hover:bg-gray-200 dark:hover:bg-[#3a3a3c] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{user.email}</p>
                  {!user.email_confirmed && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                      unverified
                    </span>
                  )}
                  {!user.onboarding_completed && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-500/20 text-gray-400 rounded">
                      pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-[#636366] mt-0.5">
                  {user.full_name && <span>{user.full_name}</span>}
                  {user.company_name && <span>• {user.company_name}</span>}
                  <span>• Joined {timeAgo(user.created_at)}</span>
                  {user.last_sign_in && <span>• Last login {timeAgo(user.last_sign_in)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                {/* Plan badge */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.plan === 'agency'
                      ? 'bg-purple-500/20 text-purple-400'
                      : user.plan === 'pro'
                      ? 'bg-green-500/20 text-green-400'
                      : user.plan === 'creator'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-100 dark:bg-[#3a3a3c] text-gray-500 dark:text-[#98989d]'
                  }`}
                >
                  {user.plan}
                </span>

                {/* Subscription status for paying users */}
                {user.plan !== 'free' && user.subscription_status && (
                  <span
                    className={`text-xs ${
                      user.subscription_status === 'active' ? 'text-green-400' : 'text-gray-400 dark:text-[#636366]'
                    }`}
                  >
                    {user.subscription_status}
                  </span>
                )}

                {/* Actions button */}
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current.set(user.id, el)
                  }}
                  onClick={() => handleOpenDropdown(user.id)}
                  disabled={actionLoading === user.id}
                  className="p-2 text-gray-400 dark:text-[#636366] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#48484a] rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading === user.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="text-gray-400 dark:text-[#636366] text-sm py-8 text-center">
              {searchQuery ? 'No users match your search' : 'No users yet'}
            </p>
          )}
        </div>

        {/* Footer */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-[#636366]">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <button
              onClick={exportCSV}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export {filter !== 'all' ? filter : ''} users
            </button>
          </div>
        )}
      </div>

      {/* Fixed dropdown menu - rendered outside scroll container */}
      {openDropdown && dropdownPos && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpenDropdown(null)
              setDropdownPos(null)
            }}
          />
          <div
            className="fixed w-48 bg-gray-100 dark:bg-[#3a3a3c] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl z-50"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
          >
            {users.find(u => u.id === openDropdown)?.onboarding_completed ? (
              <button
                onClick={() => {
                  const userId = openDropdown
                  setOpenDropdown(null)
                  setDropdownPos(null)
                  handleAction(userId, 'reset_onboarding')
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-amber-400 hover:bg-gray-200 dark:hover:bg-[#48484a] rounded-t-lg transition-colors"
              >
                Reset Onboarding
              </button>
            ) : (
              <button
                onClick={() => {
                  const userId = openDropdown
                  setOpenDropdown(null)
                  setDropdownPos(null)
                  handleAction(userId, 'complete_onboarding')
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-gray-200 dark:hover:bg-[#48484a] rounded-t-lg transition-colors"
              >
                Mark Onboarded
              </button>
            )}
            <button
              onClick={() => {
                const userId = openDropdown
                setOpenDropdown(null)
                setDropdownPos(null)
                handleAction(userId, 'send_password_reset')
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-blue-400 hover:bg-gray-200 dark:hover:bg-[#48484a] transition-colors"
            >
              Send Password Reset
            </button>
            <button
              onClick={() => {
                const user = users.find(u => u.id === openDropdown)
                if (user) {
                  setOpenDropdown(null)
                  setDropdownPos(null)
                  handleDelete(user.id, user.email)
                }
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-200 dark:hover:bg-[#48484a] rounded-b-lg transition-colors"
            >
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  )
}
