'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Slydes HQ — Dashboard (Picture)
 *
 * Purpose: Dashboard v1.3 (Momentum-first)
 * “Is this getting better, and what should I do next?”
 * Must stay aligned with MVP docs:
 * - Free vs Creator only (PAY-TIERS.md)
 * - Analytics locked on Free (MVP-MONETISATION.md prompt 2)
 * - Behaviour-based measurement (views, swipe depth, completion) and no vanity dashboards
 * - Enquiries do NOT live on the Dashboard — they belong on Inbox.
 */

export default function HQDashboardPage() {
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
  const [lens, setLens] = useState<'momentum' | 'stats'>('momentum')
  const [momentumStyle, setMomentumStyle] = useState<'classic' | 'v2'>('v2')

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
      const stored = window.localStorage.getItem('slydes_demo_dashboard_lens')
      if (stored === 'momentum' || stored === 'stats') setLens(stored)
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

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_demo_dashboard_lens', lens)
    } catch {
      // ignore
    }
  }, [lens])

  const isCreator = plan === 'creator'
  const planLabel = useMemo(() => (isCreator ? 'Creator' : 'Free'), [isCreator])

  const nextImprovement = useMemo(
    () => ({
      slydeName: 'Camping',
      frameLabel: 'Frame 3',
      leakPct: 42,
      lastChangeDays: 3,
      suggestion: 'Shorten the copy and lead with the payoff.',
      actionLabel: 'Improve this Slyde',
    }),
    []
  )

  const rankedSlydes = useMemo(
    () => [
      {
        id: 'camping' as const,
        name: 'Camping',
        completionPct: 68,
        completionDelta: 4,
        ctaClicks: 98,
        drop: 'Frame 3',
        accent: 'from-blue-600 to-cyan-500',
        frameTitle: 'Wake Up Here',
        frameSubtitle: 'Somewhere unreal',
      },
      {
        id: 'just-drive' as const,
        name: 'Just Drive',
        completionPct: 61,
        completionDelta: -2,
        ctaClicks: 58,
        drop: 'Frame 2',
        accent: 'from-indigo-600 to-blue-500',
        frameTitle: 'Just Drive',
        frameSubtitle: 'Day hire, no tent',
      },
    ],
    []
  )

  // Dashboard v1.3: momentum header + one dominant next improvement
  const totalCtaClicks = useMemo(() => rankedSlydes.reduce((acc, s) => acc + s.ctaClicks, 0), [rankedSlydes])
  const momentum = useMemo(
    () => ({
      leading: `${totalCtaClicks} CTA clicks this week — completion`,
      highlight: 'up 6%',
      trailing: 'since your last change.',
    }),
    [totalCtaClicks]
  )

  const progressAnchor = useMemo(
    () => ({
      title: 'Last improvement shipped',
      detail: 'Camping — copy shortened on Frame 3 (2 days ago)',
    }),
    []
  )

  const statsMode = useMemo(() => {
    const totalStarts = 1240
    const startsBySource = [
      { key: 'QR', value: 520 },
      { key: 'Bio links', value: 280 },
      { key: 'Ads', value: 210 },
      { key: 'Direct', value: 160 },
      { key: 'Referral', value: 70 },
    ]
    const completionRate = 56
    const avgSwipeDepth = 72
    const dropoffConcentration = [
      { key: 'Early', value: 46 },
      { key: 'Mid', value: 38 },
      { key: 'Late', value: 16 },
    ]
    const topByCompletion = rankedSlydes
      .slice()
      .sort((a, b) => b.completionPct - a.completionPct)
      .slice(0, 3)
      .map((s) => ({ id: s.id, name: s.name, completionPct: s.completionPct }))

    const totalClicks = totalCtaClicks
    const clickRate = Math.round((totalClicks / totalStarts) * 1000) / 10 // one decimal
    const clicksBySlyde = rankedSlydes.map((s) => ({ id: s.id, name: s.name, clicks: s.ctaClicks }))
    const bestCta = { text: 'Book now', slydeName: 'Camping' }

    const flowShape = {
      entry: 'Camping',
      exit: 'Just Drive',
      skipped: 'Frame 4 (Trust)',
      revisited: 'Frame 5 (Proof)',
      typicalPath: 'Profile → Camping → Availability',
    }

    const sourceDistribution = startsBySource.map((s) => ({
      ...s,
      pct: Math.round((s.value / totalStarts) * 100),
    }))

    return {
      attentionIn: { totalStarts, startsBySource: sourceDistribution },
      attentionThrough: { avgSwipeDepth, completionRate, topByCompletion, dropoffConcentration },
      attentionTaken: { totalClicks, clicksBySlyde, clickRate, bestCta },
      flowShape,
    }
  }, [rankedSlydes, totalCtaClicks])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar (same as HQ Slydes) */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col dark:bg-[#2c2c2e] dark:border-white/10">
          <div className="p-5 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Slydes</div>
                <div className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">HQ</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {/* Dashboard - Active */}
            <a
              href="/demo/hq-dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-900 cursor-pointer relative dark:bg-white/10 dark:text-white"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </a>

            {/* Slydes */}
            <a
              href="/demo/hq-mockup"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">Slydes</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">2</span>
            </a>

            {/* Analytics */}
            <a
              href="/demo/hq-analytics"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3v18h18M7 14l3-3 4 4 6-8"
                />
              </svg>
              <span className="text-sm font-medium">Analytics</span>
              {!isCreator && (
                <span className="ml-auto text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">
                  Locked
                </span>
              )}
            </a>

            {/* Inbox */}
            <a
              href="/demo/hq-inbox"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">Inbox</span>
              <span className="ml-auto text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full dark:bg-amber-500/15 dark:text-amber-300">
                3 new
              </span>
            </a>

            {/* Brand */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span className="text-sm font-medium">Brand</span>
            </div>

            {/* Settings */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </div>
          </nav>

          {/* Plan Card (demo: we can toggle, real app would lock behind billing) */}
          <div className="p-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-gray-200 shadow-sm dark:from-blue-600/12 dark:via-white/5 dark:to-cyan-600/12 dark:border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-1 dark:text-blue-300">Plan</div>
                  <div className="text-base font-bold text-gray-900 dark:text-white">{planLabel}</div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-white/60">
                    {isCreator ? 'Up to 10 Slydes • analytics • no watermark' : '1 published Slyde • watermark • no analytics'}
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-white/10">
                  <button
                    onClick={() => setPlan('free')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      !isCreator ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    } dark:${!isCreator ? 'bg-[#2c2c2e] text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setPlan('creator')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isCreator ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    } dark:${isCreator ? 'bg-[#2c2c2e] text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    Creator
                  </button>
                </div>
              </div>

              {!isCreator && (
                <>
                  <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-white/10">
                    <div className="h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                  </div>
                  <button className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm">
                    Upgrade to Creator (£25/mo)
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer dark:hover:bg-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                W
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate dark:text-white">WildTrax</div>
                <div className="text-xs text-gray-500 truncate dark:text-white/50">slydes.io/wildtrax</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Momentum-first • what matters now</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Lens toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 border border-gray-200/70 dark:bg-white/10 dark:border-white/10">
                <button
                  onClick={() => setLens('momentum')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    lens === 'momentum' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  } dark:${lens === 'momentum' ? 'bg-[#2c2c2e] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Momentum
                </button>
                <button
                  onClick={() => setLens('stats')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    lens === 'stats' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  } dark:${lens === 'stats' ? 'bg-[#2c2c2e] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Stats
                </button>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                Preview Profile
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15">
                Create Slyde
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            {/* Dashboard v1.3: momentum-first, single vertical narrative */}
            <div className="max-w-5xl">
              {/* 1) Momentum header (hero) */}
              <div className="mb-10">
                {lens === 'momentum' ? (
                  <>
                    <div className="text-5xl md:text-6xl font-bold font-display tracking-tight text-gray-900 dark:text-white leading-[1.05]">
                      <span className="text-gray-900 dark:text-white">{momentum.leading} </span>
                      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{momentum.highlight}</span>{' '}
                      <span className="text-gray-900 dark:text-white">{momentum.trailing}</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 dark:text-white/55">Keep it moving.</div>
                  </>
                ) : (
                  /* Stats Mode: Clean 2×2 grid with consistent internal structure */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card style helper */}
                    {/* 1. Attention In */}
                    <div className="rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Attention In</div>
                          <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">Where traffic comes from</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-3xl font-semibold text-gray-900 dark:text-white">{statsMode.attentionIn.totalStarts.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-white/50">total starts</div>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10 space-y-2.5">
                        {statsMode.attentionIn.startsBySource.map((s) => (
                          <div key={s.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-white/70">{s.key}</span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{s.value} <span className="text-gray-400 dark:text-white/40">({s.pct}%)</span></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Attention Through */}
                    <div className="rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Attention Through</div>
                          <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">How well attention holds</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-3xl font-semibold text-gray-900 dark:text-white">{statsMode.attentionThrough.completionRate}%</div>
                          <div className="text-xs text-gray-500 dark:text-white/50">completion</div>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600 dark:text-white/70">Avg swipe depth</span>
                          <span className="font-mono text-sm text-gray-900 dark:text-white">{statsMode.attentionThrough.avgSwipeDepth}%</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">Drop-off</div>
                        <div className="space-y-2">
                          {statsMode.attentionThrough.dropoffConcentration.map((d) => (
                            <div key={d.key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-white/70">{d.key}</span>
                              <span className="font-mono text-sm text-gray-900 dark:text-white">{d.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 3. Attention Taken */}
                    <div className="rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Attention Taken</div>
                          <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">Actions people take</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-3xl font-semibold text-gray-900 dark:text-white">{statsMode.attentionTaken.totalClicks}</div>
                          <div className="text-xs text-gray-500 dark:text-white/50">CTA clicks</div>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600 dark:text-white/70">Click rate</span>
                          <span className="font-mono text-sm text-gray-900 dark:text-white">{statsMode.attentionTaken.clickRate}%</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">By Slyde</div>
                        <div className="space-y-2">
                          {statsMode.attentionTaken.clicksBySlyde.map((s) => (
                            <div key={s.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-white/70">{s.name}</span>
                              <span className="font-mono text-sm text-gray-900 dark:text-white">{s.clicks}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 4. Flow Shape */}
                    <div className="rounded-2xl bg-white border border-gray-200/60 p-6 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Flow Shape</div>
                          <div className="text-xs text-gray-500 dark:text-white/50 mt-0.5">How the system is used</div>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10 space-y-2.5">
                        {[
                          { label: 'Most common entry', value: statsMode.flowShape.entry },
                          { label: 'Most common exit', value: statsMode.flowShape.exit },
                          { label: 'Most skipped', value: statsMode.flowShape.skipped },
                          { label: 'Most revisited', value: statsMode.flowShape.revisited },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-white/70">{r.label}</span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{r.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                        <div className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider mb-1">Typical path</div>
                        <div className="text-sm text-gray-900 dark:text-white">{statsMode.flowShape.typicalPath}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {lens === 'momentum' && (
                <>
                  {/* 2) Primary focus card (dominant) */}
                  <div className="mb-10">
                <div className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider font-semibold">Next improvement</div>
                <div className="mt-3 relative overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(17,24,39,0.08)] border border-gray-100 dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white to-transparent pointer-events-none dark:from-blue-500/10 dark:via-white/0 dark:to-transparent" />
                  <div className="relative p-8">
                    <div className="text-2xl md:text-3xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                      {nextImprovement.slydeName} is leaking attention at {nextImprovement.frameLabel}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                      {nextImprovement.leakPct}% of viewers leave here. • Last change: {nextImprovement.lastChangeDays} days ago.
                    </div>
                    <div className="mt-2 text-sm text-gray-800 dark:text-white/70">{nextImprovement.suggestion}</div>
                    <div className="mt-6">
                      <button className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 shadow-sm dark:bg-white dark:text-gray-900 dark:hover:bg-white/90">
                        {nextImprovement.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3) Ranked Slydes (with direction) */}
              <div className="mb-10">
                <div className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider font-semibold">What to improve next</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-white/60">Ranked by impact. Open one and ship a fix.</div>

                <div className="mt-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="divide-y divide-gray-100 dark:divide-white/10">
                    {rankedSlydes.map((s) => {
                      const delta = s.completionDelta
                      const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→'
                      const deltaAbs = Math.abs(delta)
                      const deltaTone =
                        delta > 0
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : delta < 0
                            ? 'text-rose-700 dark:text-rose-300'
                            : 'text-gray-500 dark:text-white/50'

                      const chipBase =
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-gray-100 text-gray-900 border border-gray-200/70 dark:bg-white/10 dark:text-white dark:border-white/10'

                      return (
                        <div
                          key={s.name}
                          className="p-6 flex items-center gap-6 hover:bg-gray-50/70 transition-colors dark:hover:bg-white/5"
                        >
                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-3">
                              <div className="flex items-baseline gap-2 min-w-0">
                                <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-br ${s.accent} shrink-0`} />
                                <div className="text-lg font-bold font-display tracking-tight text-gray-900 dark:text-white truncate">
                                  {s.name}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-white/50 truncate">
                                Drop-off {s.drop}
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {/* Completion chip */}
                              <div className={chipBase}>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60">
                                  Completion
                                </span>
                                <span className="font-mono font-semibold">{s.completionPct}%</span>
                                <span className={`font-mono text-xs font-semibold ${deltaTone}`}>
                                  {delta === 0 ? `${arrow}` : `${arrow} ${delta > 0 ? '+' : '−'}${deltaAbs}%`}
                                </span>
                              </div>

                              {/* CTA chip */}
                              <div className={chipBase}>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60">
                                  CTA clicks
                                </span>
                                <span className="font-mono font-semibold">{s.ctaClicks}</span>
                              </div>

                              {/* Drop-off chip */}
                              <div className={chipBase}>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60">
                                  Drop-off
                                </span>
                                <span className="font-mono font-semibold">{s.drop}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action rail */}
                          <div className="shrink-0">
                            <div className="flex items-center gap-2">
                              <a
                                href={`/demo/editor-mockup?slyde=${encodeURIComponent(s.id)}`}
                                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 shadow-sm dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                              >
                                Edit
                              </a>
                              <a
                                href={`/demo-slyde?slyde=${encodeURIComponent(s.id)}`}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 border border-gray-200/70 shadow-sm dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/15"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 4) Progress anchor (quiet confirmation) */}
              <div className="text-sm text-gray-500 dark:text-white/50">
                <div className="font-semibold text-gray-700 dark:text-white/65 uppercase tracking-wider text-xs">{progressAnchor.title}</div>
                <div className="mt-1">{progressAnchor.detail}</div>
              </div>
                </>
              )}
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


