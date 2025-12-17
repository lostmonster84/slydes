'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, UserCheck, Target, DollarSign, Clock, CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react'

type Application = {
  id: string
  email: string
  name: string
  instagram_handle: string | null
  tiktok_handle: string | null
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
          <h1 className="text-2xl font-semibold text-white">Affiliates</h1>
          <p className="text-[#98989d]">Manage affiliate program</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-[#3a3a3c] text-white border border-white/10 rounded-lg hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
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
          <div className="bg-[#2c2c2e] rounded-xl border border-amber-500/30 p-5">
            <p className="text-[#98989d] text-sm mb-1">Pending Applications</p>
            <p className="text-3xl font-bold text-amber-400">{stats.pendingApplications}</p>
          </div>
          <div className="bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
            <p className="text-[#98989d] text-sm mb-1">Active Affiliates</p>
            <p className="text-3xl font-bold text-green-400">{stats.activeAffiliates}</p>
          </div>
          <div className="bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
            <p className="text-[#98989d] text-sm mb-1">Total Conversions</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalConversions}</p>
          </div>
          <div className="bg-[#2c2c2e] rounded-xl border border-purple-500/30 p-5">
            <p className="text-[#98989d] text-sm mb-1">Pending Payouts</p>
            <p className="text-3xl font-bold text-purple-400">{formatCurrency(stats.pendingPayouts)}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-[#3a3a3c] text-[#98989d] hover:bg-[#48484a] hover:text-white'
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
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Pending Applications ({pendingApps.length})
            </h2>

            {pendingApps.length === 0 ? (
              <p className="text-[#636366] text-center py-8">No pending applications</p>
            ) : (
              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#3a3a3c]/50 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-white font-medium">{app.name}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-[#98989d] mb-2">{app.email}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.instagram_handle && (
                            <a
                              href={`https://instagram.com/${app.instagram_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 flex items-center gap-1"
                            >
                              @{app.instagram_handle}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {app.tiktok_handle && (
                            <a
                              href={`https://tiktok.com/@${app.tiktok_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center gap-1"
                            >
                              @{app.tiktok_handle}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {app.website && !app.instagram_handle && !app.tiktok_handle && (
                            <a
                              href={app.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-1"
                            >
                              Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {app.audience_description && (
                          <p className="text-xs text-[#636366] mb-2">
                            <span className="text-[#98989d]">Audience:</span> {app.audience_description}
                          </p>
                        )}

                        {app.why_partner && (
                          <div className="bg-[#2c2c2e] rounded-lg p-3 mt-2">
                            <p className="text-xs text-[#98989d] mb-1">Why they want to partner:</p>
                            <p className="text-sm text-white/80">{app.why_partner}</p>
                          </div>
                        )}

                        <p className="text-xs text-[#636366] mt-2">Applied {timeAgo(app.created_at)}</p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(app.id)}
                          disabled={processingId === app.id}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
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
                <h3 className="text-sm font-medium text-[#98989d] mb-3">
                  Previously Reviewed ({reviewedApps.length})
                </h3>
                <div className="space-y-2">
                  {reviewedApps.slice(0, 10).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between py-2 px-3 bg-[#3a3a3c]/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-white">{app.name}</p>
                        <p className="text-xs text-[#636366]">{app.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        app.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {app.status}
                      </span>
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
            <h2 className="text-lg font-semibold text-white mb-4">
              Active Affiliates ({affiliates.filter(a => a.status === 'active').length})
            </h2>

            {affiliates.length === 0 ? (
              <p className="text-[#636366] text-center py-8">No affiliates yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-[#98989d] border-b border-white/10">
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
                          <p className="text-white font-medium">{affiliate.name}</p>
                          <p className="text-xs text-[#636366]">{affiliate.email}</p>
                        </td>
                        <td className="py-3">
                          <code className="px-2 py-1 bg-[#3a3a3c] rounded text-sm text-cyan-400">
                            {affiliate.referral_code}
                          </code>
                        </td>
                        <td className="py-3 text-right text-white">
                          {affiliate.total_referrals}
                        </td>
                        <td className="py-3 text-right text-white">
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
            <h2 className="text-lg font-semibold text-white mb-4">Affiliate Targeting</h2>
            <p className="text-[#98989d] mb-4">
              High-follower organizations that could be potential affiliates.
            </p>
            <p className="text-[#636366] text-center py-8">
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
            <h2 className="text-lg font-semibold text-white mb-4">Earnings & Payouts</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-[#98989d] mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats?.totalEarnings || 0)}
                </p>
              </div>
              <div className="bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-[#98989d] mb-1">Pending Payouts</p>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrency(stats?.pendingPayouts || 0)}
                </p>
              </div>
              <div className="bg-[#3a3a3c]/50 rounded-lg p-4">
                <p className="text-sm text-[#98989d] mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(affiliates.reduce((sum, a) => sum + (a.paid_earnings || 0), 0))}
                </p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-[#98989d] mb-3">Recent Referrals</h3>
            {referrals.length === 0 ? (
              <p className="text-[#636366] text-center py-8">No referrals yet</p>
            ) : (
              <div className="space-y-2">
                {referrals.slice(0, 20).map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between py-2 px-3 bg-[#3a3a3c]/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#636366]">
                        via <span className="text-cyan-400">{ref.affiliates?.referral_code}</span>
                      </span>
                      <p className="text-sm text-white">{ref.referred_email}</p>
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
                      <span className="text-xs text-[#636366]">
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
