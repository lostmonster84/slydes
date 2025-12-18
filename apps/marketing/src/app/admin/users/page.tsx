'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [filter, setFilter] = useState<'all' | 'onboarded' | 'pending'>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
      // Refresh user list
      fetchUsers()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
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
    if (filter === 'onboarded') return user.onboarding_completed
    if (filter === 'pending') return !user.onboarding_completed
    return true
  })

  const stats = {
    total: users.length,
    onboarded: users.filter(u => u.onboarding_completed).length,
    pending: users.filter(u => !u.onboarding_completed).length,
    confirmedEmail: users.filter(u => u.email_confirmed).length,
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-leader-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-[#98989d]">All Supabase auth users and their status</p>
        </div>
        <button
          onClick={fetchUsers}
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
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">Onboarded</p>
          <p className="text-3xl font-bold text-green-400">{stats.onboarded}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-amber-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">Pending Onboarding</p>
          <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">Email Confirmed</p>
          <p className="text-3xl font-bold text-blue-400">{stats.confirmedEmail}</p>
        </div>
      </div>

      {/* User List */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">User List</h2>
            <InfoIcon
              tooltip="Search by email, name, or company. Click actions to manage users."
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
                placeholder="Search email, name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white placeholder-[#636366] text-sm w-72 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {(['all', 'onboarded', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filter === f
                      ? f === 'onboarded'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : f === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/10 text-white border border-white/20'
                      : 'text-[#636366] hover:text-white hover:bg-[#3a3a3c]'
                  }`}
                >
                  {f === 'all' ? `All (${stats.total})` : f === 'onboarded' ? `Onboarded (${stats.onboarded})` : `Pending (${stats.pending})`}
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
              className="flex items-center justify-between py-3 px-4 bg-[#3a3a3c]/50 rounded-lg hover:bg-[#3a3a3c] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  {!user.email_confirmed && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                      unverified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#636366] mt-0.5">
                  {user.full_name && <span>{user.full_name}</span>}
                  {user.company_name && <span>• {user.company_name}</span>}
                  <span>• Joined {timeAgo(user.created_at)}</span>
                  {user.last_sign_in && <span>• Last login {timeAgo(user.last_sign_in)}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                {/* Onboarding status */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.onboarding_completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {user.onboarding_completed ? 'Onboarded' : 'Pending'}
                </span>

                {/* Actions dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                    disabled={actionLoading === user.id}
                    className="p-2 text-[#636366] hover:text-white hover:bg-[#48484a] rounded-lg transition-colors disabled:opacity-50"
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

                  {/* Dropdown menu */}
                  {openDropdown === user.id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[#3a3a3c] border border-white/10 rounded-lg shadow-xl z-20">
                        {user.onboarding_completed ? (
                          <button
                            onClick={() => {
                              setOpenDropdown(null)
                              handleAction(user.id, 'reset_onboarding')
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-amber-400 hover:bg-[#48484a] rounded-t-lg transition-colors"
                          >
                            Reset Onboarding
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setOpenDropdown(null)
                              handleAction(user.id, 'complete_onboarding')
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-green-400 hover:bg-[#48484a] rounded-t-lg transition-colors"
                          >
                            Mark Onboarded
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setOpenDropdown(null)
                            handleDelete(user.id, user.email)
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-[#48484a] rounded-b-lg transition-colors"
                        >
                          Delete User
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="text-[#636366] text-sm py-8 text-center">
              {searchQuery ? 'No users match your search' : 'No users yet'}
            </p>
          )}
        </div>

        {/* Footer */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-[#636366]">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
