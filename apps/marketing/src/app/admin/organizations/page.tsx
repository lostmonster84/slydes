'use client'

import { useState, useEffect, useCallback } from 'react'
import { InfoIcon } from '../_components/InfoTooltip'

type Organization = {
  id: string
  name: string
  slug: string
  business_type: string | null
  website: string | null
  owner_email: string
  created_at: string
  slydes_count: number
  published_slydes: number
}

type OrganizationsData = {
  organizations: Organization[]
  stats: {
    total: number
    byType: Record<string, number>
    thisMonth: number
  }
}

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  rentals: 'Rentals',
  tours: 'Tours',
  accommodation: 'Accommodation',
  restaurant: 'Restaurant',
  retail: 'Retail',
  fitness: 'Fitness',
  salon: 'Salon',
  events: 'Events',
  real_estate: 'Real Estate',
  automotive: 'Automotive',
  other: 'Other',
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

export default function OrganizationsPage() {
  const [data, setData] = useState<OrganizationsData>({
    organizations: [],
    stats: { total: 0, byType: {}, thisMonth: 0 },
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/organizations')
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.message || json.error || 'Failed to fetch organizations')
      }
      setData({
        organizations: json.organizations || [],
        stats: json.stats || { total: 0, byType: {}, thisMonth: 0 },
      })
    } catch (e) {
      console.error('Organizations fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredOrgs = data.organizations
    .filter((org) => typeFilter === 'all' || (org.business_type || 'other') === typeFilter)
    .filter(
      (org) =>
        searchQuery === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.owner_email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const exportCSV = () => {
    const headers = ['Name', 'Slug', 'Type', 'Owner', 'Slydes', 'Published', 'Created']
    const rows = filteredOrgs.map((org) => [
      org.name,
      org.slug,
      org.business_type || 'other',
      org.owner_email,
      org.slydes_count,
      org.published_slydes,
      new Date(org.created_at).toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-organizations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Get unique business types for filter
  const businessTypes = Object.keys(data.stats.byType).sort()

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Organizations</h1>
          <p className="text-[#98989d]">All businesses using Slydes</p>
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
            disabled={filteredOrgs.length === 0}
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
          <p className="text-[#98989d] text-sm mb-1">Total Organizations</p>
          <p className="text-3xl font-bold text-white">{data.stats.total}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">New This Month</p>
          <p className="text-3xl font-bold text-green-400">{data.stats.thisMonth}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-blue-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">With Published Slydes</p>
          <p className="text-3xl font-bold text-blue-400">
            {data.organizations.filter((o) => o.published_slydes > 0).length}
          </p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Total Slydes</p>
          <p className="text-3xl font-bold text-[#98989d]">
            {data.organizations.reduce((sum, o) => sum + o.slydes_count, 0)}
          </p>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">All Organizations</h2>
            <InfoIcon
              tooltip="Businesses registered on Slydes. Click the slug to visit their live site."
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
                placeholder="Search name, slug, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white placeholder-[#636366] text-sm w-72 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Type filter */}
            {businessTypes.length > 0 && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20"
              >
                <option value="all">All Types ({data.stats.total})</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {BUSINESS_TYPE_LABELS[type] || type} ({data.stats.byType[type]})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Organization List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between py-3 px-4 bg-[#3a3a3c]/50 rounded-lg hover:bg-[#3a3a3c] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">{org.name}</p>
                  <a
                    href={`https://${org.slug}.slydes.io`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {org.slug}.slydes.io
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
                <p className="text-xs text-[#636366]">
                  {org.owner_email} · Created {timeAgo(org.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                {/* Type badge */}
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#3a3a3c] text-[#98989d] border border-white/10">
                  {BUSINESS_TYPE_LABELS[org.business_type || 'other'] || org.business_type || 'Other'}
                </span>
                {/* Slydes count */}
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{org.slydes_count} slydes</p>
                  <p className="text-xs text-[#636366]">{org.published_slydes} published</p>
                </div>
              </div>
            </div>
          ))}

          {filteredOrgs.length === 0 && (
            <p className="text-[#636366] text-sm py-8 text-center">
              {searchQuery || typeFilter !== 'all'
                ? 'No organizations match your filters'
                : 'No organizations yet'}
            </p>
          )}
        </div>

        {/* Footer with count */}
        {filteredOrgs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-[#636366]">
              Showing {filteredOrgs.length} of {data.organizations.length} organizations
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
              Export organizations
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
