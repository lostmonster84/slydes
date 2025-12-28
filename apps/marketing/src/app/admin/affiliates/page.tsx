'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, UserCheck, Target, DollarSign, Clock, CheckCircle, XCircle, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'

type Application = {
  id: string
  email: string
  name: string
  business_name: string | null
  instagram_handle: string | null
  tiktok_handle: string | null
  youtube_handle: string | null
  twitter_handle: string | null
  website: string | null
  audience_description: string | null
  why_partner: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

type Affiliate = {
  id: string
  email: string
  name: string
  referral_code: string
  commission_rate: number
  instagram_handle: string | null
  tiktok_handle: string | null
  status: 'active' | 'paused' | 'terminated'
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  total_referrals: number
  total_conversions: number
  created_at: string
}

type Referral = {
  id: string
  affiliate_id: string
  referred_email: string
  status: 'clicked' | 'signed_up' | 'converted' | 'churned'
  conversion_value: number | null
  commission_amount: number | null
  created_at: string
  affiliates?: { name: string; referral_code: string }
}

type Stats = {
  totalApplications: number
  pendingApplications: number
  activeAffiliates: number
  totalReferrals: number
  totalConversions: number
  totalEarnings: number
  pendingPayouts: number
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export default function AffiliatesAdminPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'active' | 'targeting' | 'earnings'>('applications')
  const [applications, setApplications] = useState<Application[]>([])
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/affiliates')
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch data')
      }
      setApplications(json.applications || [])
      setAffiliates(json.affiliates || [])
      setReferrals(json.referrals || [])
      setStats(json.stats || null)
    } catch (e) {
      console.error('Fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleApprove = async (applicationId: string) => {
    setProcessingId(applicationId)
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_application', applicationId }),
      })
      if (res.ok) {
        fetchData()
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (applicationId: string) => {
    setProcessingId(applicationId)
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_application', applicationId }),
      })
      if (res.ok) {
        fetchData()
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Delete this application permanently?')) return
    setProcessingId(applicationId)
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_application', applicationId }),
      })
      if (res.ok) {
        fetchData()
      }
    } finally {
      setProcessingId(null)
    }
  }

  const pendingApps = applications.filter(a => a.status === 'pending')
  const reviewedApps = applications.filter(a => a.status !== 'pending')

  const tabs = [
    { id: 'applications' as const, label: 'Applications', icon: Users, count: pendingApps.length },
    { id: 'active' as const, label: 'Active Affiliates', icon: UserCheck, count: affiliates.filter(a => a.status === 'active').length },
    { id: 'targeting' as const, label: 'Targeting', icon: Target },
    { id: 'earnings' as const, label: 'Earnings', icon: DollarSign },
  ]

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Affiliates</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Manage affiliate program</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-amber-500/30 p-5">
            <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Pending Applications</p>
            <p className="text-3xl font-bold text-amber-400">{stats.pendingApplications}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
            <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Active Affiliates</p>
            <p className="text-3xl font-bold text-green-400">{stats.activeAffiliates}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
            <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Total Conversions</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalConversions}</p>
          </div>
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-purple-500/30 p-5">
            <p className="text-gray-500 dark:text-[#98989d] text-sm mb-1">Pending Payouts</p>
            <p className="text-3xl font-bold text-purple-400">{formatCurrency(stats.pendingPayouts)}</p>
          </div>
        </div>
      )}

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
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pending Applications ({pendingApps.length})
            </h2>

            {pendingApps.length === 0 ? (
              <p className="text-gray-400 dark:text-[#636366] text-center py-8">No pending applications</p>
            ) : (
              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-gray-100 dark:bg-gray-50 dark:bg-[#3a3a3c]/50 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-gray-900 dark:text-white font-medium">{app.name}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        </div>
                        {app.business_name && (
                          <p className="text-sm text-cyan-400 mb-1">{app.business_name}</p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-[#98989d] mb-3">{app.email}</p>

                        {/* Social Profile Links */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.instagram_handle && (
                            <a
                              href={`https://instagram.com/${app.instagram_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-pink-400 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-orange-500/30 flex items-center gap-1.5 font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              @{app.instagram_handle}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                          {app.tiktok_handle && (
                            <a
                              href={`https://tiktok.com/@${app.tiktok_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-900 dark:text-white hover:bg-white/20 flex items-center gap-1.5 font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                              @{app.tiktok_handle}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                          {app.youtube_handle && (
                            <a
                              href={`https://youtube.com/@${app.youtube_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-1.5 font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                              @{app.youtube_handle}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                          {app.twitter_handle && (
                            <a
                              href={`https://x.com/${app.twitter_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-900 dark:text-white hover:bg-white/20 flex items-center gap-1.5 font-medium"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                              @{app.twitter_handle}
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                          {app.website && (
                            <a
                              href={app.website.startsWith('http') ? app.website : `https://${app.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-1.5 font-medium"
                            >
                              Website
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                        </div>

                        {app.audience_description && (
                          <p className="text-xs text-gray-400 dark:text-[#636366] mb-2">
                            <span className="text-gray-500 dark:text-[#98989d]">Audience:</span> {app.audience_description}
                          </p>
                        )}

                        {app.why_partner && (
                          <div className="bg-white dark:bg-[#2c2c2e] rounded-lg p-3 mt-2">
                            <p className="text-xs text-gray-500 dark:text-[#98989d] mb-1">Why they want to partner:</p>
                            <p className="text-sm text-gray-900 dark:text-white/80">{app.why_partner}</p>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 dark:text-[#636366] mt-2">Applied {timeAgo(app.created_at)}</p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={processingId === app.id}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          disabled={processingId === app.id}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewedApps.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 dark:text-[#98989d] mb-3">
                  Previously Reviewed ({reviewedApps.length})
                </h3>
                <div className="space-y-2">
                  {reviewedApps.slice(0, 20).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-100 dark:bg-[#3a3a3c]/30 rounded-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-900 dark:text-white">{app.name}</p>
                        {app.business_name && (
                          <p className="text-xs text-cyan-400">{app.business_name}</p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-[#636366]">{app.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.status === 'rejected' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              disabled={processingId === app.id}
                              className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs font-medium rounded flex items-center gap-1 disabled:opacity-50 transition-opacity"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              disabled={processingId === app.id}
                              className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium rounded flex items-center gap-1 disabled:opacity-50 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          app.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Affiliates Tab */}
        {activeTab === 'active' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Affiliates ({affiliates.filter(a => a.status === 'active').length})
            </h2>

            {affiliates.length === 0 ? (
              <p className="text-gray-400 dark:text-[#636366] text-center py-8">No affiliates yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 dark:text-[#98989d] border-b border-gray-200 dark:border-white/10">
                      <th className="pb-3 font-medium">Affiliate</th>
                      <th className="pb-3 font-medium">Referral Code</th>
                      <th className="pb-3 font-medium text-right">Referrals</th>
                      <th className="pb-3 font-medium text-right">Conversions</th>
                      <th className="pb-3 font-medium text-right">Earnings</th>
                      <th className="pb-3 font-medium text-right">Pending</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="border-b border-white/5">
                        <td className="py-3">
                          <p className="text-gray-900 dark:text-white font-medium">{affiliate.name}</p>
                          <p className="text-xs text-gray-400 dark:text-[#636366]">{affiliate.email}</p>
                        </td>
                        <td className="py-3">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-[#3a3a3c] rounded text-sm text-cyan-400">
                            {affiliate.referral_code}
                          </code>
                        </td>
                        <td className="py-3 text-right text-gray-900 dark:text-white">
                          {affiliate.total_referrals}
                        </td>
                        <td className="py-3 text-right text-gray-900 dark:text-white">
                          {affiliate.total_conversions}
                        </td>
                        <td className="py-3 text-right text-green-400 font-medium">
                          {formatCurrency(affiliate.total_earnings)}
                        </td>
                        <td className="py-3 text-right text-amber-400">
                          {formatCurrency(affiliate.pending_earnings)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            affiliate.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : affiliate.status === 'paused'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {affiliate.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Targeting Tab */}
        {activeTab === 'targeting' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Affiliate Targeting</h2>
            <p className="text-gray-500 dark:text-[#98989d] mb-4">
              High-follower organizations that could be potential affiliates.
            </p>
            <p className="text-gray-400 dark:text-[#636366] text-center py-8">
              View targeting data in the dedicated{' '}
              <a href="/admin/hq" className="text-blue-400 hover:underline">
                HQ Organizations
              </a>{' '}
              page.
            </p>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings & Payouts</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-100 dark:bg-gray-50 dark:bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-[#98989d] mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats?.totalEarnings || 0)}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-50 dark:bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-[#98989d] mb-1">Pending Payouts</p>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrency(stats?.pendingPayouts || 0)}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-50 dark:bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-[#98989d] mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(affiliates.reduce((sum, a) => sum + (a.paid_earnings || 0), 0))}
                </p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-500 dark:text-[#98989d] mb-3">Recent Referrals</h3>
            {referrals.length === 0 ? (
              <p className="text-gray-400 dark:text-[#636366] text-center py-8">No referrals yet</p>
            ) : (
              <div className="space-y-2">
                {referrals.slice(0, 20).map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-100 dark:bg-[#3a3a3c]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400 dark:text-[#636366]">
                        via <span className="text-cyan-400">{ref.affiliates?.referral_code}</span>
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white">{ref.referred_email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {ref.commission_amount && (
                        <span className="text-green-400 text-sm">
                          +{formatCurrency(ref.commission_amount)}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        ref.status === 'converted'
                          ? 'bg-green-500/20 text-green-400'
                          : ref.status === 'signed_up'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {ref.status}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-[#636366]">
                        {timeAgo(ref.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
