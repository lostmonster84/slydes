'use client'

import { useEffect, useMemo, useState } from 'react'
import { HQSidebar } from '@/components/hq/HQSidebar'
import Link from 'next/link'
import { useDemoBusiness } from '@/lib/demoBusiness'

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
  const demoBusiness = useDemoBusiness()

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

  const isCreator = plan === 'creator'

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
        accent: 'from-blue-700 to-cyan-500',
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <HQSidebar 
          activePage="dashboard" 
          plan={plan} 
          onPlanChange={setPlan}
          slydeCount={demoBusiness.slydesCount}
          inboxCount={demoBusiness.enquiriesCount}
        />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Momentum • what matters now</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                Preview Profile
              </button>
              <Link
                href="/demo/editor-mockup?slyde=new"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
              >
                Create Slyde
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            {/* Dashboard v2.0: Momentum = launch pad, Stats = observatory */}
            <div className="max-w-6xl">
              {!demoBusiness.hasSlydes ? (
                <div className="max-w-3xl">
                  <div className="text-sm text-gray-600 dark:text-white/60">
                    Welcome to Slydes HQ, <span className="font-semibold text-gray-900 dark:text-white">{demoBusiness.name}</span>.
                  </div>

                  <div className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                    Publish your first Slyde to start momentum.
                  </div>

                  <div className="mt-6 relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <div className="p-6">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold dark:bg-blue-500/10 dark:text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
                        Next action
                      </div>
                      <div className="mt-3 text-xl font-display font-bold text-gray-900 dark:text-white">
                        Create your first Slyde
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                        Start with the starter flow (Hook → How → Trust → Proof → Action). Publish once it feels right.
                      </div>
                      <div className="mt-5 flex items-center gap-3">
                        <Link
                          href="/demo/editor-mockup?slyde=new"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                        >
                          Create your first Slyde
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        <Link
                          href="/demo/hq-mockup"
                          className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                          See examples
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-sm font-display font-bold text-gray-900 dark:text-white">What happens next</div>
                    <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-white/60">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-gray-500 dark:text-white/50 mt-0.5">1</span>
                        <span>Create a Slyde using the starter flow.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-gray-500 dark:text-white/50 mt-0.5">2</span>
                        <span>Publish it and share the link.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-gray-500 dark:text-white/50 mt-0.5">3</span>
                        <span>Come back here to see momentum and what to improve next.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Momentum content */}
                  <div className="mb-10">
                    <div className="space-y-8">
                        {/* ═══════════════════════════════════════════════════════════
                           MOMENTUM 3.0 — One visual anchor (hero), demoted action card
                           ═══════════════════════════════════════════════════════════ */}
                    {/* Hero: THE scoreboard — one number, one context line, last win badge */}
                    <div className="relative">
                      {/* Subtle animated gradient orb */}
                      <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl" />
                      
                      <div className="relative">
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                            {totalCtaClicks}
                          </span>
                          <span className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                            CTA clicks
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-base text-gray-600 dark:text-white/60">
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">↑ 6%</span>
                          <span>this week</span>
                          <span className="text-gray-300 dark:text-white/20">•</span>
                          <span>{rankedSlydes.reduce((sum, s) => sum + s.completionPct, 0) / rankedSlydes.length | 0}% avg completion</span>
                        </div>
                        {/* Last win badge — inline with hero */}
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            Last win: {progressAnchor.title} ({progressAnchor.detail})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Slydes Insight — coaching voice, not a card, just a helpful sentence */}
                    <div className="flex items-start gap-3 px-1">
                      <div className="shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                        <span className="font-semibold text-gray-900 dark:text-white">{rankedSlydes[0]?.name}</span> is your top performer, but <span className="font-semibold text-gray-900 dark:text-white">{nextImprovement.frameLabel}</span> is where most people leave. Shortening copy here usually helps — we'd start there.
                      </p>
                    </div>

                    {/* Action Card: Demoted — secondary, not spotlight */}
                    <div className="relative rounded-2xl bg-white border border-gray-200/80 overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                      {/* Thin top gradient accent */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold dark:bg-blue-500/10 dark:text-blue-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                                Next action
                              </span>
                            </div>
                            <div className="text-lg font-display font-bold text-gray-900 dark:text-white">
                              {nextImprovement.slydeName} → {nextImprovement.frameLabel} leaking <span className="text-blue-600 dark:text-cyan-400">{nextImprovement.leakPct}%</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500 dark:text-white/50">
                              {nextImprovement.suggestion} • Last touched {nextImprovement.lastChangeDays}d ago
                            </div>
                          </div>
                          <a
                            href={`/demo/editor-mockup?slyde=camping`}
                            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                          >
                            <span>Fix</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Ranked Slydes: Simplified — one metric, one action */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-white/50">
                          Your Slydes
                        </h3>
                        <span className="text-xs text-gray-400 dark:text-white/40">
                          Ranked by drop-off impact
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {rankedSlydes.map((s, idx) => {
                          const isTop = idx === 0
                          return (
                            <div
                              key={s.name}
                              className={`group relative rounded-2xl p-5 transition-all hover:-translate-y-0.5 ${
                                isTop
                                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20'
                                  : 'bg-white border border-gray-200/60 hover:border-gray-300 dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-white/20'
                              }`}
                            >
                              {/* Grid layout for perfect alignment */}
                              <div className="grid grid-cols-[auto_1fr_100px_60px_80px_auto] items-center gap-4">
                                {/* Rank */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                                  isTop
                                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
                                    : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70'
                                }`}>
                                  {idx + 1}
                                </div>
                                
                                {/* Name + Drop-off */}
                                <div className="min-w-0">
                                  <div className="font-display font-bold text-lg text-gray-900 dark:text-white truncate">
                                    {s.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-white/50">
                                    Drop-off at <span className="font-mono font-semibold text-gray-700 dark:text-white/70">{s.drop}</span>
                                  </div>
                                </div>
                                
                                {/* Completion — fixed width column */}
                                <div className="text-right">
                                  <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                                    {s.completionPct}%
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-white/50">completion</div>
                                </div>
                                
                                {/* Delta — fixed width column */}
                                <div className="text-right">
                                  <div className={`font-mono text-base font-semibold ${
                                    s.completionDelta > 0
                                      ? 'text-blue-700 dark:text-cyan-300'
                                      : s.completionDelta < 0
                                        ? 'text-gray-600 dark:text-white/60'
                                        : 'text-gray-400 dark:text-white/40'
                                  }`}>
                                    {s.completionDelta > 0 ? `↑+${s.completionDelta}%` : s.completionDelta < 0 ? `↓${Math.abs(s.completionDelta)}%` : '→'}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-white/50">trend</div>
                                </div>
                                
                                {/* CTA clicks — fixed width column */}
                                <div className="text-right">
                                  <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                                    {s.ctaClicks}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-white/50">clicks</div>
                                </div>
                                
                                {/* Action */}
                                <a
                                  href={`/demo/editor-mockup?slyde=${encodeURIComponent(s.id)}`}
                                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors text-center ${
                                    isTop
                                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                                      : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90'
                                  }`}
                                >
                                  {isTop ? 'Fix' : 'Edit'}
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                      </div>
                  </div>
                </>
              )}

              {/* Old momentum content removed — now integrated above */}
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


