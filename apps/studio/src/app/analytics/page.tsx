'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown, TrendingUp, TrendingDown, Clock, MousePointer, Share2, MapPin, Info } from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import Link from 'next/link'
import { useDemoBusiness } from '@/lib/demoBusiness'
import { hasUnlockCode } from '@/lib/whitelist'

/**
 * Slydes HQ — Analytics (Forensics Lab)
 *
 * Purpose: Single-Slyde deep dive. Answer "Why is Frame 3 leaking?"
 *
 * Mental Model: Analytics = Microscope (vs Dashboard = Control Tower)
 * - Dashboard: "Am I winning? What should I do RIGHT NOW?"
 * - Analytics: "WHERE are people dropping off in THIS specific Slyde?"
 *
 * Key Design Decisions:
 * - Slyde selector at top (single-Slyde focus)
 * - No aggregate overview (Dashboard handles that)
 * - Frame-by-frame drop-off is THE chart
 * - Historical comparison for "is it getting better?"
 * - Deep-link support: ?slyde=camping
 */

type SlydeId = 'camping' | 'just-drive'

interface SlydeData {
  id: SlydeId
  name: string
  views: number
  viewsDelta: number
  completion: number
  completionDelta: number
  swipeDepth: number
  swipeDepthDelta: number
  ctaClicks: number
  ctaRate: number
  ctaRateDelta: number
  shares: number
  sharesDelta: number
  hearts: number
  avgTimePerFrame: number
  mostRevisitedFrame: string
  bestCta: { text: string; rate: number; frame: string }
  trafficSources: { source: string; pct: number }[]
  frames: { label: string; pct: number; drop: number }[]
  biggestDrop: { frame: string; drop: number }
  historical: {
    completion: { current: number; previous: number }
    dropFrame: { current: string; previous: string }
    ctaRate: { current: number; previous: number }
  }
}

function InfoButton({ label, description }: { label: string; description: string }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label={`${label}: ${description}`}
        className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-transparent text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white/35 dark:hover:text-white/70 dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#1c1c1e]"
      >
        <Info className="w-4 h-4" aria-hidden="true" />
      </button>

      {showTooltip && (
        <div className="absolute z-50 bottom-full right-0 mb-2 w-64 p-3 rounded-xl bg-[#2c2c2e] border border-white/10 shadow-xl animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-white/80 mb-1">{label}</div>
          <div className="text-xs text-white/60 leading-relaxed">{description}</div>
          <div className="absolute -bottom-1 right-3 w-2 h-2 bg-[#2c2c2e] border-r border-b border-white/10 transform rotate-45" />
        </div>
      )}
    </div>
  )
}

function HQAnalyticsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
  const [view, setView] = useState<'overview' | 'slyde'>('overview')
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [compare, setCompare] = useState(true)
  const [selectedSlyde, setSelectedSlyde] = useState<SlydeId>('camping')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const demoBusiness = useDemoBusiness()

  // Real analytics (fetched) — merges into mocked shape so UI stays stable.
  const [realGlobal, setRealGlobal] = useState<null | Partial<any>>(null)
  const [realSlyde, setRealSlyde] = useState<null | Partial<SlydeData>>(null)
  const [analyticsConfigured, setAnalyticsConfigured] = useState(true)

  // Deep-link support: ?slyde=camping
  useEffect(() => {
    const slydeParam = searchParams.get('slyde')
    if (slydeParam === 'camping' || slydeParam === 'just-drive') {
      setSelectedSlyde(slydeParam)
    }
  }, [searchParams])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_demo_plan')
      if (stored === 'free' || stored === 'creator') setPlan(stored)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_demo_plan', plan)
    } catch {
      // ignore
    }
  }, [plan])

  const isCreator = plan === 'creator' || hasUnlockCode()

  const slydesDataMock: Record<SlydeId, SlydeData> = useMemo(
    () => ({
      camping: {
        id: 'camping',
        name: 'Camping',
        views: 12432,
        viewsDelta: 18,
        completion: 62,
        completionDelta: 4,
        swipeDepth: 3.6,
        swipeDepthDelta: 3,
        ctaClicks: 1368,
        ctaRate: 11,
        ctaRateDelta: 2,
        shares: 384,
        sharesDelta: 12,
        hearts: 2400,
        avgTimePerFrame: 4.2,
        mostRevisitedFrame: 'Frame 5 (Proof)',
        bestCta: { text: 'Book now', rate: 11, frame: 'Frame 6 (Action)' },
        trafficSources: [
          { source: 'QR', pct: 42 },
          { source: 'Bio links', pct: 28 },
          { source: 'Direct', pct: 18 },
          { source: 'Ads', pct: 12 },
        ],
        frames: [
          { label: 'Frame 1 (Hook)', pct: 100, drop: 0 },
          { label: 'Frame 2 (How)', pct: 78, drop: 22 },
          { label: 'Frame 3 (What)', pct: 55, drop: 23 },
          { label: 'Frame 4 (Trust)', pct: 49, drop: 6 },
          { label: 'Frame 5 (Proof)', pct: 45, drop: 4 },
          { label: 'Frame 6 (Action)', pct: 40, drop: 5 },
        ],
        biggestDrop: { frame: 'Frame 3 (What)', drop: 23 },
        historical: {
          completion: { current: 62, previous: 58 },
          dropFrame: { current: 'Frame 3', previous: 'Frame 3' },
          ctaRate: { current: 11, previous: 9 },
        },
      },
      'just-drive': {
        id: 'just-drive',
        name: 'Just Drive',
        views: 6850,
        viewsDelta: -5,
        completion: 48,
        completionDelta: -2,
        swipeDepth: 2.9,
        swipeDepthDelta: -1,
        ctaClicks: 480,
        ctaRate: 7,
        ctaRateDelta: -1,
        shares: 190,
        sharesDelta: 8,
        hearts: 980,
        avgTimePerFrame: 3.8,
        mostRevisitedFrame: 'Frame 3 (Routes)',
        bestCta: { text: 'Check availability', rate: 7, frame: 'Frame 5 (Action)' },
        trafficSources: [
          { source: 'Bio links', pct: 38 },
          { source: 'Direct', pct: 32 },
          { source: 'QR', pct: 18 },
          { source: 'Referral', pct: 12 },
        ],
        frames: [
          { label: 'Frame 1 (Hook)', pct: 100, drop: 0 },
          { label: 'Frame 2 (How)', pct: 68, drop: 32 },
          { label: 'Frame 3 (Routes)', pct: 52, drop: 16 },
          { label: 'Frame 4 (Fleet)', pct: 46, drop: 6 },
          { label: 'Frame 5 (Action)', pct: 38, drop: 8 },
        ],
        biggestDrop: { frame: 'Frame 2 (How)', drop: 32 },
        historical: {
          completion: { current: 48, previous: 50 },
          dropFrame: { current: 'Frame 2', previous: 'Frame 2' },
          ctaRate: { current: 7, previous: 8 },
        },
      },
    }),
    []
  )

  // Fetch real analytics when Creator (demo uses business id as org slug)
  useEffect(() => {
    if (!isCreator) return
    if (!demoBusiness?.id) return
    const org = demoBusiness.id
    const run = async () => {
      try {
        const res = await fetch(`/api/analytics/overview?org=${encodeURIComponent(org)}&range=${encodeURIComponent(range)}`)
        if (res.status === 503) {
          setAnalyticsConfigured(false)
          return
        }
        if (!res.ok) return
        const json = await res.json()
        setAnalyticsConfigured(true)
        setRealGlobal(json?.global ?? null)
      } catch {
        // ignore
      }
    }
    run()
  }, [isCreator, demoBusiness.id, range])

  useEffect(() => {
    if (!isCreator) return
    if (!demoBusiness?.id) return
    const org = demoBusiness.id
    const run = async () => {
      try {
        const res = await fetch(
          `/api/analytics/slyde?org=${encodeURIComponent(org)}&slyde=${encodeURIComponent(selectedSlyde)}&range=${encodeURIComponent(range)}`
        )
        if (res.status === 503) {
          setAnalyticsConfigured(false)
          return
        }
        if (!res.ok) return
        const json = await res.json()
        setAnalyticsConfigured(true)
        setRealSlyde(json?.slyde ?? null)
      } catch {
        // ignore
      }
    }
    run()
  }, [isCreator, demoBusiness.id, selectedSlyde, range])

  const slydesData: Record<SlydeId, SlydeData> = useMemo(() => {
    const merged: Record<SlydeId, SlydeData> = { ...slydesDataMock }
    if (realSlyde && (realSlyde.id === 'camping' || realSlyde.id === 'just-drive')) {
      const id = realSlyde.id as SlydeId
      merged[id] = {
        ...merged[id],
        // map “views” to starts for now
        views: typeof (realSlyde as any).views === 'number' ? (realSlyde as any).views : merged[id].views,
        completion: typeof realSlyde.completion === 'number' ? realSlyde.completion : merged[id].completion,
        swipeDepth: typeof realSlyde.swipeDepth === 'number' ? realSlyde.swipeDepth : merged[id].swipeDepth,
        ctaClicks: typeof realSlyde.ctaClicks === 'number' ? realSlyde.ctaClicks : merged[id].ctaClicks,
        ctaRate: typeof realSlyde.ctaRate === 'number' ? realSlyde.ctaRate : merged[id].ctaRate,
        shares: typeof realSlyde.shares === 'number' ? realSlyde.shares : merged[id].shares,
        hearts: typeof realSlyde.hearts === 'number' ? realSlyde.hearts : merged[id].hearts,
        trafficSources: Array.isArray((realSlyde as any).trafficSources) ? ((realSlyde as any).trafficSources as any) : merged[id].trafficSources,
        frames: Array.isArray((realSlyde as any).frames) ? ((realSlyde as any).frames as any) : merged[id].frames,
        biggestDrop: (realSlyde as any).biggestDrop ? ((realSlyde as any).biggestDrop as any) : merged[id].biggestDrop,
        bestCta: (realSlyde as any).bestCta ? ((realSlyde as any).bestCta as any) : merged[id].bestCta,
      }
    }
    return merged
  }, [slydesDataMock, realSlyde])

  const currentSlyde = slydesData[selectedSlyde]
  const slydesList = Object.values(slydesData)

  // ═══════════════════════════════════════════════════════════════════
  // GLOBAL STATS — Aggregate across ALL Slydes (company-wide view)
  // This is the "geek mode" for Creators who want the full picture.
  // ═══════════════════════════════════════════════════════════════════
  const globalStatsMock = useMemo(() => {
    const totalStarts = 1240
    const totalSlydes = slydesList.length

    // TRAFFIC SOURCES — Where starts come from (aggregate)
    const sourceDistribution = [
      { key: 'QR', value: 520, pct: 42 },
      { key: 'Bio links', value: 280, pct: 23 },
      { key: 'Ads', value: 210, pct: 17 },
      { key: 'Direct', value: 160, pct: 13 },
      { key: 'Referral', value: 70, pct: 5 },
    ]

    // ENGAGEMENT — Global metrics
    const completionRate = 56
    const avgSwipeDepth = 72
    const bounceRate = 12
    const avgTimePerFrame = 4.2

    // DROP-OFF SHAPE — When people leave (aggregate across all Slydes)
    const dropoffShape = [
      {
        stage: 'Early',
        description: 'Frame 1–2',
        pct: 46,
        topContributors: [
          { slydeName: 'Camping', pctOfAllDropoffs: 28 },
          { slydeName: 'Just Drive', pctOfAllDropoffs: 18 },
        ],
      },
      {
        stage: 'Mid',
        description: 'Frame 3–4',
        pct: 38,
        topContributors: [
          { slydeName: 'Camping', pctOfAllDropoffs: 22 },
          { slydeName: 'Just Drive', pctOfAllDropoffs: 16 },
        ],
      },
      {
        stage: 'Late',
        description: 'Frame 5+',
        pct: 16,
        topContributors: [
          { slydeName: 'Camping', pctOfAllDropoffs: 9 },
          { slydeName: 'Just Drive', pctOfAllDropoffs: 7 },
        ],
      },
    ]

    // CTA PERFORMANCE — Aggregate clicks
    const totalClicks = 166
    const clickRate = Math.round((totalClicks / totalStarts) * 1000) / 10
    const clicksBySlyde = slydesList.map((s) => ({
      id: s.id,
      name: s.name,
      clicks: s.ctaClicks,
      rate: s.ctaRate,
    }))
    const bestCta = { text: 'Book now', clicks: 98, rate: 14.1, slydeName: 'Camping', frameLabel: 'Action (Frame 6)' }

    // Conversion by traffic source
    const conversionBySource = [
      { source: 'QR', rate: 18.2 },
      { source: 'Bio links', rate: 14.8 },
      { source: 'Direct', rate: 12.4 },
      { source: 'Ads', rate: 9.1 },
    ]

    // USER FLOW — Navigation patterns (global)
    const flowPatterns = {
      topEntrySlyde: 'Camping',
      topExitSlyde: 'Just Drive',
      avgFramesViewed: 4.3,
      mostSkippedPosition: 'Frame 4',
      mostRevisitedPosition: 'Frame 5',
      typicalPath: ['Profile', 'Camping', 'Availability'],
    }

    return {
      totalStarts,
      totalSlydes,
      sourceDistribution,
      completionRate,
      avgSwipeDepth,
      bounceRate,
      avgTimePerFrame,
      dropoffShape,
      dropoffContributorDefinition: '% of all drop-offs that happen in this stage AND in this Slyde',
      totalClicks,
      clickRate,
      clicksBySlyde,
      bestCta,
      conversionBySource,
      flowPatterns,
    }
  }, [slydesList])

  const globalStats = useMemo(() => {
    // Merge real values into the existing mocked shape.
    // This keeps all UI panels intact even if we only have partial data yet.
    return {
      ...globalStatsMock,
      ...(realGlobal ?? {}),
    }
  }, [globalStatsMock, realGlobal])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <HQSidebarConnected activePage="analytics" />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Analytics</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {view === 'overview' ? 'Company-wide stats • the full picture' : 'Single-Slyde deep dive • drop-off • actions'}
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div>
              <div className="relative">
                {/* Locked overlay (Free) — matches MVP-MONETISATION.md Prompt 2 */}
                {!isCreator && (
                  <div className="absolute inset-0 z-20 flex items-start justify-center pt-16">
                    <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden dark:border-white/10 dark:bg-[#2c2c2e]/95">
                      {/* Gradient accent */}
                      <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                      
                      <div className="p-8">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mb-5 dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-blue-500/20">
                          <svg className="w-7 h-7 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>

                        <div className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                          Analytics are available on Creator
                        </div>
                        <div className="text-gray-600 dark:text-white/70 mb-6">
                          See how people swipe, where they drop off, and what works.
                        </div>

                        {/* Pricing highlight */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">£25</span>
                            <span className="text-gray-500 dark:text-white/50">/month</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 dark:text-white/60">
                            Views • Swipe depth • Completion rate
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Link
                            href="/settings"
                            className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15 text-center"
                          >
                            Unlock analytics
                          </Link>
                          <button 
                            onClick={() => router.push('/')}
                            className="w-full py-3 px-5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          >
                            Continue without analytics
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content (blurred on Free) */}
                <div className={`space-y-6 ${!isCreator ? 'blur-[8px] opacity-60 pointer-events-none select-none' : ''}`}>
                  {/* View toggle - Apple-style segmented control */}
                  <div className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/10">
                    <button
                      onClick={() => setView('overview')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        view === 'overview'
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setView('slyde')}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        view === 'slyde'
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/50 hover:text-white/70'
                      }`}
                    >
                      Single Slyde
                    </button>
                  </div>

                  {/* Analytics not configured (dev) */}
                  {isCreator && !analyticsConfigured && (
                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                      <div className="p-6">
                        <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Setup required</div>
                        <div className="mt-1 text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                          Analytics backend isn’t configured yet.
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                          Add <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span>,
                          and run the new migration <span className="font-mono">003_create_slydes_analytics.sql</span>.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty state (Creator): no Slydes yet */}
                  {isCreator && !demoBusiness.hasSlydes && (
                    <div className="max-w-3xl">
                      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                        <div className="p-6">
                          <div className="text-sm text-gray-600 dark:text-white/60">
                            Analytics for <span className="font-semibold text-gray-900 dark:text-white">{demoBusiness.name}</span>
                          </div>
                          <div className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                            No Slydes yet — nothing to measure.
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                            Create a Slyde, publish it, then come back here for drop-off and CTA performance.
                          </div>
                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                              href="/"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                            >
                              Create your first Slyde
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                            <Link
                              href="/"
                              className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                            >
                              See examples
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty state (Creator): no analytics data yet */}
                  {isCreator && demoBusiness.hasSlydes && !demoBusiness.hasAnalyticsData && (
                    <div className="max-w-3xl">
                      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                        <div className="p-6">
                          <div className="text-sm text-gray-600 dark:text-white/60">
                            Analytics for <span className="font-semibold text-gray-900 dark:text-white">{demoBusiness.name}</span>
                          </div>
                          <div className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                            No data yet.
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                            Share your Slyde link and drive a little traffic. This page will populate once people start swiping.
                          </div>
                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                              href="/"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                            >
                              Go to Slydes
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                            <Link
                              href="/"
                              className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                            >
                              View example
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {demoBusiness.hasSlydes && demoBusiness.hasAnalyticsData && view === 'overview' && (
                    <div className="space-y-6">
                      {/* Overview header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                          <span className="text-xs font-semibold text-gray-500 dark:text-white/50">
                            Aggregate performance • Last {range} • {globalStats.totalSlydes} Slydes
                          </span>
                        </div>
                        {/* Time range toggle - Apple HIG */}
                        <div className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/10">
                          {(['7d', '30d', '90d'] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => setRange(r)}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                range === r
                                  ? 'bg-white/15 text-white shadow-sm'
                                  : 'text-white/50 hover:text-white/70'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Top metrics row — Global totals */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: 'Total starts',
                            value: globalStats.totalStarts.toLocaleString(),
                            sub: 'across all Slydes',
                            info: 'How many people opened any of your Slydes. Each person counts once per visit.',
                          },
                          {
                            label: 'Completion rate',
                            value: `${globalStats.completionRate}%`,
                            sub: `${globalStats.avgSwipeDepth}% avg depth`,
                            info: 'How many people swiped all the way to the end. Higher = your content is keeping them hooked.',
                          },
                          {
                            label: 'CTA clicks',
                            value: globalStats.totalClicks.toString(),
                            sub: `${globalStats.clickRate}% click rate`,
                            info: 'How many times people tapped your buttons (like "Book now" or "Learn more"). This is what drives action.',
                          },
                          {
                            label: 'Bounce rate',
                            value: `${globalStats.bounceRate}%`,
                            sub: `${globalStats.avgTimePerFrame}s per frame`,
                            info: 'People who left after seeing just the first frame. Lower is better - it means your hook is working.',
                          },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60 dark:from-[#2c2c2e] dark:to-[#3a3a3c] dark:border-white/10"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold text-gray-500 dark:text-white/50">{m.label}</div>
                              <InfoButton label={m.label} description={m.info} />
                            </div>
                            <div className="mt-1 font-mono text-2xl font-bold text-gray-900 dark:text-white">{m.value}</div>
                            <div className="text-xs text-gray-500 dark:text-white/40">{m.sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* Main 2x2 grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Traffic Sources */}
                        <div className="relative rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">Traffic sources</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">Where all {globalStats.totalStarts.toLocaleString()} starts come from</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {globalStats.sourceDistribution.map((s) => (
                              <div key={s.key} className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-white/80">{s.key}</span>
                                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{s.value.toLocaleString()}</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                                      style={{ width: `${s.pct}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="font-mono text-xs text-gray-500 dark:text-white/50 w-10 text-right">{s.pct}%</span>
                              </div>
                            ))}
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <InfoButton
                              label="Traffic sources"
                              description="Where your visitors come from. QR = scanned your code. Bio links = clicked from Instagram/TikTok. Direct = typed your URL."
                            />
                          </div>
                        </div>

                        {/* 2. Drop-off Shape */}
                        <div className="relative rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">Drop-off shape</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">When people leave (all Slydes combined)</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {globalStats.dropoffShape.map((d) => (
                              <div key={d.stage} className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{d.stage}</span>
                                        <span className="text-xs text-gray-500 dark:text-white/50 ml-2">({d.description})</span>
                                      </div>
                                      <span
                                        className={`font-mono text-sm font-bold ${
                                          d.pct > 40
                                            ? 'text-blue-700 dark:text-cyan-300'
                                            : d.pct > 25
                                              ? 'text-blue-600 dark:text-cyan-400'
                                              : 'text-gray-700 dark:text-white/70'
                                        }`}
                                      >
                                        {d.pct}%
                                      </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                        style={{ width: `${d.pct}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Top contributors */}
                                {d.topContributors && d.topContributors.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-white/50">Top contributors:</span>
                                    {d.topContributors.map((c) => (
                                      <span
                                        key={`${d.stage}-${c.slydeName}`}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium dark:bg-white/10 dark:text-white/70"
                                      >
                                        <span>{c.slydeName}</span>
                                        <span className="font-mono font-semibold">{c.pctOfAllDropoffs}%</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-white/50">
                            % of all drop-offs that occur at each stage
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <InfoButton
                              label="Drop-off shape"
                              description="Shows when people stop swiping. Early = left quickly. Mid = lost interest halfway. Late = almost made it! Focus on your biggest drop-off point."
                            />
                          </div>
                        </div>

                        {/* 3. CTA Performance */}
                        <div className="relative rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">CTA performance</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">Clicks by Slyde</div>
                            </div>
                          </div>

                          {/* Clicks by Slyde */}
                          <div className="space-y-2 mb-4">
                            {globalStats.clicksBySlyde.map((s) => (
                              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm text-gray-900 dark:text-white">{s.clicks} clicks</span>
                                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-500/20 dark:to-cyan-500/20 dark:text-cyan-300">
                                    {s.rate}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Best CTA */}
                          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                            <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Best performing CTA</div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  &ldquo;{globalStats.bestCta.text}&rdquo;
                                </div>
                                <div className="text-xs text-gray-600 dark:text-white/60">
                                  {globalStats.bestCta.slydeName} <span className="text-gray-400 dark:text-white/30 mx-1">•</span> {globalStats.bestCta.frameLabel}
                                </div>
                              </div>
                              <div className="shrink-0 font-mono text-sm text-blue-700 dark:text-cyan-300">
                                {globalStats.bestCta.clicks} clicks • {globalStats.bestCta.rate}%
                              </div>
                            </div>
                          </div>

                          {/* Conversion by source */}
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                            <div className="text-xs text-gray-500 dark:text-white/50 mb-2">Click rate by traffic source</div>
                            <div className="grid grid-cols-2 gap-2">
                              {globalStats.conversionBySource.map((c) => (
                                <div key={c.source} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-white/60">{c.source}</span>
                                  <span className="font-mono font-semibold text-gray-900 dark:text-white">{c.rate}%</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <InfoButton
                              label="CTA performance"
                              description="Your buttons are working! This shows which Slydes get the most taps. The 'best CTA' is your most effective call-to-action."
                            />
                          </div>
                        </div>

                        {/* 4. User Flow */}
                        <div className="relative rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">User flow</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">Navigation patterns across all sessions</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Top entry Slyde</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{globalStats.flowPatterns.topEntrySlyde}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Top exit Slyde</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{globalStats.flowPatterns.topExitSlyde}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Most skipped position</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{globalStats.flowPatterns.mostSkippedPosition}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Most revisited position</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{globalStats.flowPatterns.mostRevisitedPosition}</div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                            <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Avg frames per session</div>
                            <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">{globalStats.flowPatterns.avgFramesViewed}</div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                            <div className="text-xs text-gray-500 dark:text-white/50 mb-2">Typical journey</div>
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                              {globalStats.flowPatterns.typicalPath.map((step, i, arr) => (
                                <span key={step} className="flex items-center gap-2">
                                  <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium dark:bg-white/10 dark:text-white">{step}</span>
                                  {i < arr.length - 1 && <span className="text-gray-400 dark:text-white/30">→</span>}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <InfoButton
                              label="User flow"
                              description="How people move through your Slydes. Entry = where they start. Exit = where they leave. Skipped = frames they swipe past quickly."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer note */}
                      <div className="text-xs text-gray-400 dark:text-white/30">
                        Tip: Switch to Single Slyde for deep-dive forensics on drop-off and CTA performance.
                      </div>
                    </div>
                  )}

                  {demoBusiness.hasSlydes && demoBusiness.hasAnalyticsData && view === 'slyde' && (
                    <>
                  {/* Viewing selector (under header, above KPIs) */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600 dark:text-white/60">Viewing</div>
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold text-sm hover:border-gray-300 transition-colors shadow-sm dark:bg-[#2c2c2e] dark:border-white/10 dark:text-white dark:hover:border-white/20"
                          aria-label="Select Slyde"
                        >
                          <span className="truncate max-w-[220px]">{currentSlyde.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 dark:text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {dropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                            <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden z-20 dark:bg-[#2c2c2e] dark:border-white/10">
                              {slydesList.map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => {
                                    setSelectedSlyde(s.id)
                                    setDropdownOpen(false)
                                  }}
                                  className={`w-full px-4 py-3 text-left transition-colors ${
                                    selectedSlyde === s.id
                                      ? 'bg-blue-50 dark:bg-blue-500/10'
                                      : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div
                                        className={`font-semibold ${
                                          selectedSlyde === s.id ? 'text-blue-600 dark:text-cyan-300' : 'text-gray-900 dark:text-white'
                                        }`}
                                      >
                                        {s.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">
                                        {s.views.toLocaleString()} views
                                      </div>
                                    </div>
                                    {selectedSlyde === s.id && (
                                      <svg className="w-5 h-5 text-blue-500 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Time Range (moved out of header) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCompare((v) => !v)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                          compare
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/15 dark:text-cyan-300 dark:border-blue-500/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-[#2c2c2e] dark:text-white/60 dark:border-white/10 dark:hover:bg-white/5'
                        }`}
                        aria-pressed={compare}
                      >
                        Compare
                      </button>
                      <div className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/10">
                        {(['7d', '30d', '90d'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                              range === r
                                ? 'bg-white/15 text-white shadow-sm'
                                : 'text-white/50 hover:text-white/70'
                            }`}
                          >
                            {r.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ZONE 1: Single-Slyde Performance Summary */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'Views', value: currentSlyde.views.toLocaleString(), delta: currentSlyde.viewsDelta, sub: `Last ${range.toUpperCase()}` },
                      { label: 'Completion', value: `${currentSlyde.completion}%`, delta: currentSlyde.completionDelta, sub: 'Reached final frame' },
                      { label: 'Swipe depth', value: `${currentSlyde.swipeDepth.toFixed(1)} frames`, delta: currentSlyde.swipeDepthDelta, sub: 'Avg frames reached' },
                      { label: 'CTA clicks', value: currentSlyde.ctaClicks.toLocaleString(), delta: currentSlyde.ctaRateDelta, sub: `${currentSlyde.ctaRate}% click rate` },
                      { label: 'Shares', value: currentSlyde.shares.toString(), delta: currentSlyde.sharesDelta, sub: 'Sharing = belief' },
                      { label: 'Hearts', value: currentSlyde.hearts.toLocaleString(), delta: 0, sub: 'Interest signal' },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500 dark:text-white/50 font-semibold">{m.label}</div>
                          {compare && (
                            <div
                              className={`flex items-center gap-1 text-xs font-semibold ${
                                m.delta > 0 ? 'text-blue-700 dark:text-cyan-300' : m.delta < 0 ? 'text-gray-600 dark:text-white/60' : 'text-gray-400 dark:text-white/40'
                              }`}
                            >
                              {m.delta > 0 ? <TrendingUp className="w-3 h-3" /> : m.delta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                              {m.delta > 0 ? '+' : ''}
                              {m.delta === 0 ? '—' : `${Math.abs(m.delta)}%`}
                            </div>
                          )}
                        </div>
                        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{m.value}</div>
                        <div className="text-xs text-gray-500 dark:text-white/50 mt-1">{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* ZONE 2: The One Chart That Matters + Historical */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Drop-off Chart */}
                     <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="p-5 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-base font-display font-bold text-gray-900 dark:text-white">Where people leave</div>
                            <div className="text-xs text-gray-500 dark:text-white/50">Reach % by frame</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        {currentSlyde.frames.map((f) => {
                          const isBiggestDrop = f.label === currentSlyde.biggestDrop.frame
                          return (
                            <div key={f.label}>
                              <div className="flex items-center justify-between text-sm mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700 dark:text-white/80">{f.label}</span>
                                  {isBiggestDrop && (
                                     <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/15 dark:text-cyan-300 dark:border-blue-500/20">
                                       Biggest drop
                                     </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {f.drop > 0 && (
                                    <span
                                      className={`text-xs font-mono ${
                                        f.drop > 20
                                           ? 'text-gray-700 dark:text-white/70'
                                          : f.drop > 10
                                             ? 'text-gray-600 dark:text-white/60'
                                             : 'text-gray-400 dark:text-white/40'
                                      }`}
                                    >
                                      -{f.drop}%
                                    </span>
                                  )}
                                  <span className="font-mono font-semibold text-gray-900 dark:text-white w-12 text-right">{f.pct}%</span>
                                </div>
                              </div>
                              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden dark:bg-white/10">
                                <div
                                   className="h-full rounded-full transition-all bg-gradient-to-r from-blue-600 to-cyan-500"
                                  style={{ width: `${f.pct}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}

                        {/* Insight + Action Card */}
                         <div className="mt-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                   <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold dark:bg-blue-500/20 dark:text-cyan-300">
                                     <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
                                     Focus
                                   </span>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-white/70">
                                  <span className="font-semibold text-gray-900 dark:text-white">{currentSlyde.biggestDrop.frame}</span> is losing{' '}
                                   <span className="font-mono font-semibold text-gray-900 dark:text-white">{currentSlyde.biggestDrop.drop}%</span>{' '}
                                  of viewers. Shorten the copy and lead with the payoff.
                                </div>
                              </div>
                              <a
                                href="/"
                                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                              >
                                Edit frame
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Historical Comparison */}
                    <div className="col-span-12 lg:col-span-5 space-y-6">
                      {/* This Week vs Last Week */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                        <div className="p-5 border-b border-gray-200 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-base font-display font-bold text-gray-900 dark:text-white">This week vs last</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">Is it getting better?</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                          {/* Completion */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-white/60">Completion</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-gray-500 dark:text-white/50">
                                {currentSlyde.historical.completion.previous}%
                              </span>
                              <span className="text-gray-400 dark:text-white/30">→</span>
                              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                {currentSlyde.historical.completion.current}%
                              </span>
                              {currentSlyde.historical.completion.current > currentSlyde.historical.completion.previous ? (
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                  +{currentSlyde.historical.completion.current - currentSlyde.historical.completion.previous}%
                                </span>
                              ) : currentSlyde.historical.completion.current < currentSlyde.historical.completion.previous ? (
                                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                  {currentSlyde.historical.completion.current - currentSlyde.historical.completion.previous}%
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </div>
                          </div>
                          {/* Drop-off frame */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-white/60">Biggest leak</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-white/50">{currentSlyde.historical.dropFrame.previous}</span>
                              <span className="text-gray-400 dark:text-white/30">→</span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentSlyde.historical.dropFrame.current}</span>
                              {currentSlyde.historical.dropFrame.current === currentSlyde.historical.dropFrame.previous && (
                                 <span className="text-xs text-gray-500 dark:text-white/50">(same)</span>
                              )}
                            </div>
                          </div>
                          {/* CTA rate */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-white/60">CTA clicks</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-gray-500 dark:text-white/50">{currentSlyde.historical.ctaRate.previous}%</span>
                              <span className="text-gray-400 dark:text-white/30">→</span>
                              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                                {currentSlyde.historical.ctaRate.current}%
                              </span>
                              {currentSlyde.historical.ctaRate.current > currentSlyde.historical.ctaRate.previous ? (
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                  +{currentSlyde.historical.ctaRate.current - currentSlyde.historical.ctaRate.previous}%
                                </span>
                              ) : currentSlyde.historical.ctaRate.current < currentSlyde.historical.ctaRate.previous ? (
                                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                  {currentSlyde.historical.ctaRate.current - currentSlyde.historical.ctaRate.previous}%
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Engagement Details */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                        <div className="p-5 border-b border-gray-200 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-base font-display font-bold text-gray-900 dark:text-white">Engagement breakdown</div>
                              <div className="text-xs text-gray-500 dark:text-white/50">Deep metrics</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
                                <span className="text-xs text-gray-500 dark:text-white/50">Avg time/frame</span>
                              </div>
                              <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">{currentSlyde.avgTimePerFrame}s</div>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <Share2 className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
                                <span className="text-xs text-gray-500 dark:text-white/50">Most revisited</span>
                              </div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentSlyde.mostRevisitedFrame}</div>
                            </div>
                          </div>

                          {/* Best CTA */}
                          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                            <div className="flex items-center gap-2 mb-1">
                              <MousePointer className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                              <span className="text-xs text-blue-700 dark:text-cyan-300 font-semibold">Best CTA</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">"{currentSlyde.bestCta.text}"</div>
                                <div className="text-xs text-gray-500 dark:text-white/50">{currentSlyde.bestCta.frame}</div>
                              </div>
                              <div className="font-mono text-lg font-bold text-blue-700 dark:text-cyan-300">{currentSlyde.bestCta.rate}%</div>
                            </div>
                          </div>

                          {/* Traffic Sources */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
                              <span className="text-xs text-gray-500 dark:text-white/50 font-semibold">Traffic sources</span>
                            </div>
                            <div className="space-y-2">
                              {currentSlyde.trafficSources.map((t) => (
                                <div key={t.source} className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                                      style={{ width: `${t.pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-white/60 w-20">{t.source}</span>
                                  <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white w-8 text-right">{t.pct}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="text-xs text-gray-400 dark:text-white/30">
                    Tip: Switch to Overview for company-wide stats, or stay here for single-Slyde forensics.
                  </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}

export default function HQAnalyticsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e]" />}>
      <HQAnalyticsContent />
    </Suspense>
  )
}
