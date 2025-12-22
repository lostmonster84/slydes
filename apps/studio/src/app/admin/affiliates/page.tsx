'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { Instagram, Users, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react'
import type { Organization } from '@/hooks/useOrganization'

interface OrganizationWithFollowers extends Organization {
  instagram_handle: string | null
  instagram_followers: number | null
  instagram_updated_at: string | null
  tiktok_handle: string | null
  tiktok_followers: number | null
  tiktok_updated_at: string | null
}

/**
 * Admin Affiliates Page
 *
 * Shows all organizations sorted by social media follower count
 * for affiliate targeting purposes.
 */
export default function AdminAffiliatesPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithFollowers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'instagram' | 'tiktok' | 'total'>('total')
  const [refreshingId, setRefreshingId] = useState<string | null>(null)

  const supabase = createClient()

  const fetchOrganizations = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching organizations:', error)
    } else {
      setOrganizations(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  // Sort organizations by follower count
  const sortedOrganizations = [...organizations].sort((a, b) => {
    if (sortBy === 'instagram') {
      return (b.instagram_followers || 0) - (a.instagram_followers || 0)
    } else if (sortBy === 'tiktok') {
      return (b.tiktok_followers || 0) - (a.tiktok_followers || 0)
    } else {
      const totalA = (a.instagram_followers || 0) + (a.tiktok_followers || 0)
      const totalB = (b.instagram_followers || 0) + (b.tiktok_followers || 0)
      return totalB - totalA
    }
  })

  // Only show orgs with at least one social handle
  const orgsWithSocial = sortedOrganizations.filter(
    org => org.instagram_handle || org.tiktok_handle
  )

  // Refresh a single organization's follower counts
  const refreshFollowers = async (org: OrganizationWithFollowers) => {
    setRefreshingId(org.id)

    try {
      // Refresh Instagram if handle exists
      if (org.instagram_handle) {
        await fetch('/api/social/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: org.instagram_handle,
            organizationId: org.id,
          }),
        })
      }

      // Refresh TikTok if handle exists
      if (org.tiktok_handle) {
        await fetch('/api/social/tiktok', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: org.tiktok_handle,
            organizationId: org.id,
          }),
        })
      }

      // Refetch all orgs to get updated counts
      await fetchOrganizations()
    } catch (error) {
      console.error('Error refreshing followers:', error)
    }

    setRefreshingId(null)
  }

  const formatFollowers = (count: number | null) => {
    if (!count) return '-'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toLocaleString()
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })
  }

  const getTotalFollowers = (org: OrganizationWithFollowers) => {
    return (org.instagram_followers || 0) + (org.tiktok_followers || 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="affiliates" />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Affiliate Targets</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {orgsWithSocial.length} organizations with social accounts
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'instagram' | 'tiktok' | 'total')}
                className="px-3 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
              >
                <option value="total">Sort by Total</option>
                <option value="instagram">Sort by Instagram</option>
                <option value="tiktok">Sort by TikTok</option>
              </select>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
              </div>
            ) : orgsWithSocial.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Users className="w-12 h-12 text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-white/60 mb-2">
                  No social accounts found
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/40">
                  Organizations need to add their Instagram or TikTok handles
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-white/50 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Total Reach</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatFollowers(
                        orgsWithSocial.reduce((acc, org) => acc + getTotalFollowers(org), 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-pink-500 mb-1">
                      <Instagram className="w-4 h-4" />
                      <span className="text-xs font-medium">Instagram</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatFollowers(
                        orgsWithSocial.reduce((acc, org) => acc + (org.instagram_followers || 0), 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="text-xs font-medium">TikTok</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatFollowers(
                        orgsWithSocial.reduce((acc, org) => acc + (org.tiktok_followers || 0), 0)
                      )}
                    </p>
                  </div>
                </div>

                {/* Organizations List */}
                <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/10">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Organization</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Instagram</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">TikTok</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Updated</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {orgsWithSocial.map((org, index) => (
                        <tr
                          key={org.id}
                          className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{org.name}</p>
                                <p className="text-xs text-gray-500 dark:text-white/40">{org.slug}.slydes.io</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {org.instagram_handle ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatFollowers(org.instagram_followers)}
                                </span>
                                <a
                                  href={`https://instagram.com/${org.instagram_handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-pink-500 hover:text-pink-600"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-white/20">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {org.tiktok_handle ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formatFollowers(org.tiktok_followers)}
                                </span>
                                <a
                                  href={`https://tiktok.com/@${org.tiktok_handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-900 dark:text-white hover:text-gray-600"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-white/20">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatFollowers(getTotalFollowers(org))}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-xs text-gray-500 dark:text-white/40">
                              {formatDate(org.instagram_updated_at || org.tiktok_updated_at)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => refreshFollowers(org)}
                              disabled={refreshingId === org.id}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                              title="Refresh follower counts"
                            >
                              <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshingId === org.id ? 'animate-spin' : ''}`} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Organizations without social */}
                {organizations.length > orgsWithSocial.length && (
                  <p className="text-xs text-gray-500 dark:text-white/40 text-center pt-4">
                    + {organizations.length - orgsWithSocial.length} organizations without social accounts
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
