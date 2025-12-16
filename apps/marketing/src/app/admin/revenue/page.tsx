'use client'

import { useState, useEffect, useCallback } from 'react'
import { MetricCard, CurrencyIcon, UsersIcon } from '../_components/MetricCard'
import { InfoIcon } from '../_components/InfoTooltip'

type RevenueData = {
  timestamp: string
  mrr: number
  arr: number
  subscribers: {
    total: number
    pro: number
    creator: number
    free: number
  }
  subscriptionGrowth: {
    thisMonth: number
    lastMonth: number
    growthRate: number
  }
  orders: {
    total: number
    thisMonth: number
    revenue: number
    platformFees: number
    gmv: number
  }
  recentSubscriptions: {
    id: string
    email: string
    plan: string
    status: string
    created_at: string
  }[]
  allUsers: {
    id: string
    email: string
    plan: string
    status: string
    created_at: string
  }[]
}

function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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

export default function RevenuePage() {
  const defaultData: RevenueData = {
    timestamp: new Date().toISOString(),
    mrr: 0,
    arr: 0,
    subscribers: { total: 0, pro: 0, creator: 0, free: 0 },
    subscriptionGrowth: { thisMonth: 0, lastMonth: 0, growthRate: 0 },
    orders: { total: 0, thisMonth: 0, revenue: 0, platformFees: 0, gmv: 0 },
    recentSubscriptions: [],
    allUsers: [],
  }

  const [data, setData] = useState<RevenueData>(defaultData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [userFilter, setUserFilter] = useState<'all' | 'pro' | 'creator' | 'free'>('all')

  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/revenue')
      const json = await res.json()
      if (!res.ok) {
        // Combine error and message for more context
        const errorMsg = json.message ? `${json.error}: ${json.message}` : json.error
        throw new Error(errorMsg || 'Failed to fetch revenue data')
      }
      setData(json)
      setHasLoaded(true)
    } catch (e) {
      console.error('Revenue fetch error:', e)
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setHasLoaded(true)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="p-8 max-w-7xl">
      {/* Header - Apple HIG */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Revenue</h1>
          <p className="text-[#98989d]">Subscriptions, MRR, and platform fees</p>
        </div>
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
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-green-100 text-sm font-medium">Monthly Recurring Revenue</p>
            <InfoIcon tooltip="MRR = Total monthly subscription revenue from all paying customers. Pro subscribers pay £50/mo, Creator subscribers pay £25/mo." light />
          </div>
          <p className="text-4xl font-bold text-white">{formatCurrency(data.mrr)}</p>
          <p className="text-green-200 text-sm mt-2">
            {data.subscribers.pro + data.subscribers.creator} active subscribers
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-blue-100 text-sm font-medium">Annual Run Rate</p>
            <InfoIcon tooltip="ARR = MRR × 12. This is your projected yearly revenue if current subscriptions continue unchanged. Useful for understanding your business trajectory." light />
          </div>
          <p className="text-4xl font-bold text-white">{formatCurrency(data.arr)}</p>
          <p className="text-blue-200 text-sm mt-2">projected yearly</p>
        </div>

        <MetricCard
          label="Platform Fees (Orders)"
          value={formatCurrency(data.orders.platformFees)}
          subtext={`${data.orders.total} total orders`}
          tooltip="Revenue earned from transaction fees on marketplace orders. Currently 0% - see fee projections below for potential revenue at different rates."
          icon={<CurrencyIcon />}
        />

        <MetricCard
          label="Total Subscribers"
          value={data.subscribers.total}
          subtext={`${data.subscribers.pro} Pro · ${data.subscribers.creator} Creator`}
          tooltip="Total users with accounts. Includes Free tier (£0), Creator (£25/mo), and Pro (£50/mo). Only Pro and Creator contribute to MRR."
          icon={<UsersIcon />}
          color="blue"
        />
      </div>

      {/* Subscription Breakdown - Apple HIG dark cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-white">Subscription Tiers</h2>
            <InfoIcon tooltip="Breakdown of users by subscription plan. Pro and Creator tiers generate recurring revenue. Free tier users may convert to paid over time." light />
          </div>

          <div className="space-y-4">
            {/* Pro */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium text-white">Pro</span>
                  <span className="text-[#98989d] text-sm ml-2">£50/mo</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{data.subscribers.pro}</span>
                  <span className="text-green-400 text-sm ml-2">
                    {formatCurrency(data.subscribers.pro * 50)}/mo
                  </span>
                </div>
              </div>
              <div className="h-3 bg-[#3a3a3c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(data.subscribers.pro / Math.max(data.subscribers.total, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Creator */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium text-white">Creator</span>
                  <span className="text-[#98989d] text-sm ml-2">£25/mo</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{data.subscribers.creator}</span>
                  <span className="text-blue-400 text-sm ml-2">
                    {formatCurrency(data.subscribers.creator * 25)}/mo
                  </span>
                </div>
              </div>
              <div className="h-3 bg-[#3a3a3c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(data.subscribers.creator / Math.max(data.subscribers.total, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Free */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium text-white">Free</span>
                  <span className="text-[#98989d] text-sm ml-2">£0/mo</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{data.subscribers.free}</span>
                  <span className="text-[#636366] text-sm ml-2">potential upgrades</span>
                </div>
              </div>
              <div className="h-3 bg-[#3a3a3c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#636366] rounded-full"
                  style={{
                    width: `${(data.subscribers.free / Math.max(data.subscribers.total, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Subscriptions</h2>
            <InfoIcon tooltip="Latest users who signed up with a paid plan. Shows their email, plan type, subscription status, and when they subscribed." light />
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {data.recentSubscriptions.length > 0 ? (
              data.recentSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">{sub.email}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          sub.plan === 'pro'
                            ? 'bg-green-500/20 text-green-400'
                            : sub.plan === 'creator'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-[#3a3a3c] text-[#98989d]'
                        }`}
                      >
                        {sub.plan}
                      </span>
                      <span
                        className={`text-xs ${
                          sub.status === 'active' ? 'text-green-400' : 'text-[#636366]'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#636366] ml-4 whitespace-nowrap">
                    {timeAgo(sub.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#636366] text-sm py-4 text-center">No subscriptions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Orders Section - Apple HIG dark */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-white">Commerce Overview</h2>
          <InfoIcon tooltip="Marketplace transaction metrics. GMV is the total value of all goods sold through the platform - the money flowing through Slydes storefronts." light />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-sm text-[#98989d]">Total Orders</p>
              <InfoIcon tooltip="All completed orders across all Slydes storefronts. Each order represents a successful purchase." light />
            </div>
            <p className="text-2xl font-bold text-white">{data.orders.total}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-sm text-[#98989d]">This Month</p>
              <InfoIcon tooltip="Orders placed in the current calendar month. Shows recent marketplace activity." light />
            </div>
            <p className="text-2xl font-bold text-white">{data.orders.thisMonth}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-sm text-[#98989d]">GMV (Total Volume)</p>
              <InfoIcon tooltip="Gross Merchandise Value - the total value of all goods sold. This is the money flowing through the platform, not your revenue." light />
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(data.orders.gmv)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-sm text-[#98989d]">Platform Fees (0%)</p>
              <InfoIcon tooltip="Revenue from transaction fees. Currently 0% - you can add a fee (1-10%) to generate revenue from marketplace transactions." light />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(data.orders.platformFees)}
            </p>
          </div>
        </div>
      </div>

      {/* All Customers */}
      <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">All Customers</h2>
            <InfoIcon tooltip="Complete list of all signed up users across all tiers. Filter by plan to see specific segments." light />
          </div>
          <div className="flex gap-2">
            {(['all', 'pro', 'creator', 'free'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setUserFilter(filter)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
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
                {filter === 'all' ? `All (${data.allUsers.length})` :
                 filter === 'pro' ? `Pro (${data.subscribers.pro})` :
                 filter === 'creator' ? `Creator (${data.subscribers.creator})` :
                 `Free (${data.subscribers.free})`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {data.allUsers
            .filter(user => userFilter === 'all' || user.plan === userFilter)
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 px-4 bg-[#3a3a3c]/50 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  <p className="text-xs text-[#636366]">
                    Joined {new Date(user.created_at).toLocaleDateString()}
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

          {data.allUsers.filter(user => userFilter === 'all' || user.plan === userFilter).length === 0 && (
            <p className="text-[#636366] text-sm py-8 text-center">No customers yet</p>
          )}
        </div>
      </div>

      {/* Fee Projections - only show if there's GMV */}
      {data.orders.gmv > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">Fee Projections</h2>
            <InfoIcon tooltip="Shows potential revenue if you added a platform fee to marketplace transactions. Common SaaS marketplaces charge 2-10%. This helps you model revenue scenarios." light />
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Based on {formatCurrency(data.orders.gmv)} GMV - what different fee rates would earn
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 5, 10].map((rate) => (
              <div key={rate} className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">{rate}% fee</p>
                <p className="text-xl font-bold">
                  {formatCurrency(data.orders.gmv * (rate / 100))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
