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
  instagram_handle: string | null
  instagram_followers: number | null
  tiktok_handle: string | null
  tiktok_followers: number | null
}

type OrganizationsData = {
  organizations: Organization[]
  stats: {
    total: number
    byType: Record<string, number>
    thisMonth: number
  }
}

function formatFollowers(count: number | null): string {
  if (!count) return '-'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toLocaleString()
}

function getTotalFollowers(org: Organization): number {
  return (org.instagram_followers || 0) + (org.tiktok_followers || 0)
}

// Get affiliate tier based on follower count
function getAffiliateTier(total: number): { label: string; color: string; bgColor: string; borderColor: string } {
  if (total >= 100000) return { label: 'Mega', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' }
  if (total >= 50000) return { label: 'Macro', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' }
  if (total >= 10000) return { label: 'Mid', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' }
  if (total >= 1000) return { label: 'Micro', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30' }
  return { label: 'Nano', color: 'text-[#98989d]', bgColor: 'bg-white/5', borderColor: 'border-white/10' }
}

export default function AffiliatesPage() {
  const [data, setData] = useState<OrganizationsData>({
    organizations: [],
    stats: { total: 0, byType: {}, thisMonth: 0 },
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'instagram' | 'tiktok' | 'total'>('total')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [tierFilter, setTierFilter] = useState<string>('all')
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
      console.error('Affiliates fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Only include organizations with at least one social handle
  const orgsWithSocial = data.organizations.filter(
    (org) => org.instagram_handle || org.tiktok_handle
  )

  // Filter and sort
  const filteredOrgs = orgsWithSocial
    .filter((org) => {
      if (tierFilter === 'all') return true
      const total = getTotalFollowers(org)
      const tier = getAffiliateTier(total)
      return tier.label.toLowerCase() === tierFilter.toLowerCase()
    })
    .filter(
      (org) =>
        searchQuery === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.instagram_handle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.tiktok_handle || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = 0
      let bVal = 0

      switch (sortBy) {
        case 'instagram':
          aVal = a.instagram_followers || 0
          bVal = b.instagram_followers || 0
          break
        case 'tiktok':
          aVal = a.tiktok_followers || 0
          bVal = b.tiktok_followers || 0
          break
        case 'total':
          aVal = getTotalFollowers(a)
          bVal = getTotalFollowers(b)
          break
      }

      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })

  // Calculate tier counts
  const tierCounts = {
    mega: orgsWithSocial.filter(o => getTotalFollowers(o) >= 100000).length,
    macro: orgsWithSocial.filter(o => getTotalFollowers(o) >= 50000 && getTotalFollowers(o) < 100000).length,
    mid: orgsWithSocial.filter(o => getTotalFollowers(o) >= 10000 && getTotalFollowers(o) < 50000).length,
    micro: orgsWithSocial.filter(o => getTotalFollowers(o) >= 1000 && getTotalFollowers(o) < 10000).length,
    nano: orgsWithSocial.filter(o => getTotalFollowers(o) < 1000).length,
  }

  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Slug', 'Tier', 'Instagram Handle', 'Instagram Followers', 'TikTok Handle', 'TikTok Followers', 'Total Followers', 'Email']
    const rows = filteredOrgs.map((org, idx) => {
      const tier = getAffiliateTier(getTotalFollowers(org))
      return [
        idx + 1,
        org.name,
        org.slug,
        tier.label,
        org.instagram_handle || '',
        org.instagram_followers || 0,
        org.tiktok_handle || '',
        org.tiktok_followers || 0,
        getTotalFollowers(org),
        org.owner_email,
      ]
    })

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slydes-affiliate-targets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Affiliate Targets</h1>
          <p className="text-[#98989d]">High-follower organizations for affiliate partnerships</p>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Total Reach</p>
          <p className="text-3xl font-bold text-white">
            {formatFollowers(orgsWithSocial.reduce((sum, o) => sum + getTotalFollowers(o), 0))}
          </p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-pink-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </p>
          <p className="text-3xl font-bold text-pink-400">
            {formatFollowers(orgsWithSocial.reduce((sum, o) => sum + (o.instagram_followers || 0), 0))}
          </p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            TikTok
          </p>
          <p className="text-3xl font-bold text-white">
            {formatFollowers(orgsWithSocial.reduce((sum, o) => sum + (o.tiktok_followers || 0), 0))}
          </p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-green-500/30 p-5">
          <p className="text-[#98989d] text-sm mb-1">With Socials</p>
          <p className="text-3xl font-bold text-green-400">{orgsWithSocial.length}</p>
        </div>
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-5">
          <p className="text-[#98989d] text-sm mb-1">Without Socials</p>
          <p className="text-3xl font-bold text-[#636366]">{data.organizations.length - orgsWithSocial.length}</p>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {[
          { key: 'mega', label: 'Mega (100K+)', count: tierCounts.mega, color: 'text-purple-400', border: 'border-purple-500/30' },
          { key: 'macro', label: 'Macro (50K+)', count: tierCounts.macro, color: 'text-blue-400', border: 'border-blue-500/30' },
          { key: 'mid', label: 'Mid (10K+)', count: tierCounts.mid, color: 'text-green-400', border: 'border-green-500/30' },
          { key: 'micro', label: 'Micro (1K+)', count: tierCounts.micro, color: 'text-amber-400', border: 'border-amber-500/30' },
          { key: 'nano', label: 'Nano (<1K)', count: tierCounts.nano, color: 'text-[#98989d]', border: 'border-white/10' },
        ].map((tier) => (
          <button
            key={tier.key}
            onClick={() => setTierFilter(tierFilter === tier.key ? 'all' : tier.key)}
            className={`bg-[#2c2c2e] rounded-xl border p-4 text-center transition-all ${
              tierFilter === tier.key ? `${tier.border} ring-2 ring-white/20` : 'border-white/10 hover:border-white/20'
            }`}
          >
            <p className="text-xs text-[#98989d] mb-1">{tier.label}</p>
            <p className={`text-2xl font-bold ${tier.color}`}>{tier.count}</p>
          </button>
        ))}
      </div>

      {/* Affiliates List */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Affiliate Leaderboard</h2>
            <InfoIcon
              tooltip="Organizations ranked by social reach. Higher followers = better affiliate potential."
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
                placeholder="Search name or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white placeholder-[#636366] text-sm w-64 focus:outline-none focus:border-white/20"
              />
            </div>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20"
            >
              <option value="total">Sort by Total</option>
              <option value="instagram">Sort by Instagram</option>
              <option value="tiktok">Sort by TikTok</option>
            </select>

            {/* Sort direction */}
            <button
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-white text-sm hover:bg-[#48484a] transition-colors flex items-center gap-2"
              title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDir === 'desc' ? 'High to Low' : 'Low to High'}
              <svg className="w-4 h-4 text-[#636366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Clear tier filter */}
            {tierFilter !== 'all' && (
              <button
                onClick={() => setTierFilter('all')}
                className="px-3 py-2 bg-[#3a3a3c] border border-white/10 rounded-lg text-[#98989d] text-sm hover:bg-[#48484a] hover:text-white transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredOrgs.map((org, index) => {
            const total = getTotalFollowers(org)
            const tier = getAffiliateTier(total)
            return (
              <div
                key={org.id}
                className="flex items-center justify-between py-3 px-4 bg-[#3a3a3c]/50 rounded-lg hover:bg-[#3a3a3c] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-amber-500/20 text-amber-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-amber-700/20 text-amber-600' :
                    'bg-white/5 text-[#636366]'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium">{org.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.bgColor} ${tier.color} border ${tier.borderColor}`}>
                        {tier.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#636366]">{org.owner_email}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6 ml-4">
                  {/* Instagram */}
                  <div className="flex items-center gap-2 min-w-[100px]">
                    {org.instagram_handle ? (
                      <a
                        href={`https://instagram.com/${org.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                        title={`@${org.instagram_handle}`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="text-sm font-medium">{formatFollowers(org.instagram_followers)}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-[#636366]">-</span>
                    )}
                  </div>

                  {/* TikTok */}
                  <div className="flex items-center gap-2 min-w-[100px]">
                    {org.tiktok_handle ? (
                      <a
                        href={`https://tiktok.com/@${org.tiktok_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        title={`@${org.tiktok_handle}`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <span className="text-sm font-medium">{formatFollowers(org.tiktok_followers)}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-[#636366]">-</span>
                    )}
                  </div>

                  {/* Total */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-sm text-white font-bold">{formatFollowers(total)}</p>
                    <p className="text-xs text-[#636366]">total</p>
                  </div>

                  {/* Visit Site */}
                  <a
                    href={`https://${org.slug}.slydes.io`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#636366] hover:text-white"
                    title="Visit site"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )
          })}

          {filteredOrgs.length === 0 && (
            <p className="text-[#636366] text-sm py-8 text-center">
              {searchQuery || tierFilter !== 'all'
                ? 'No affiliates match your filters'
                : 'No organizations with social accounts yet'}
            </p>
          )}
        </div>

        {/* Footer */}
        {filteredOrgs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-[#636366]">
              Showing {filteredOrgs.length} of {orgsWithSocial.length} potential affiliates
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
              Export affiliate list
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
