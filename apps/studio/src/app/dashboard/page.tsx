'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw, Sparkles, BarChart3, PenLine, Target, Zap } from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useSlydes, useOrganization, useMomentum } from '@/hooks'
import { usePlan } from '@/hooks/usePlan'
import { useMomentumAI } from '@/components/momentum-ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Slydes HQ — Dashboard (Momentum)
 *
 * Purpose: Dashboard v2.0 (Momentum-first, REAL DATA)
 * "Is this getting better, and what should I do next?"
 *
 * Now powered by real analytics data from /api/analytics/momentum
 * - Hero metrics from actual CTA clicks and completion rates
 * - Coaching suggestions generated from data patterns
 * - No AI required - just math on real numbers
 */

export default function HQDashboardPage() {
  const router = useRouter()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { slydes, isLoading: slydesLoading } = useSlydes()
  const { organization } = useOrganization()
  const { data: momentum, isLoading: momentumLoading, refetch, range, setRange } = useMomentum()
  const { plan, isFree, isPro } = usePlan()
  const { open: openMomentumAI, hideTrigger, showTrigger } = useMomentumAI()

  // Hide floating Momentum bubble on this page (it's built-in here)
  useEffect(() => {
    hideTrigger()
    return () => showTrigger()
  }, [hideTrigger, showTrigger])

  const hasSlydes = slydes.length > 0
  const hasData = momentum?.hasData ?? false

  // Handle Create Slyde click — gate for Free users with existing Slydes
  const handleCreateSlyde = () => {
    if (isFree && hasSlydes) {
      setShowUpgradeModal(true)
    } else {
      router.push('/')
    }
  }

  const isLoading = slydesLoading || momentumLoading

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <HQSidebarConnected activePage="dashboard" />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Momentum • what matters now</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Time range selector */}
              {hasData && (
                <div className="flex items-center gap-1 mr-2">
                  {(['7d', '30d', '90d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        range === r
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                          : 'text-gray-500 hover:bg-gray-100 dark:text-white/50 dark:hover:bg-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                  <button
                    onClick={() => refetch()}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60 transition-colors ml-1"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${momentumLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
              <button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                Preview Profile
              </button>
              <button
                onClick={handleCreateSlyde}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
              >
                Create Slyde
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl">
              {/* Loading state */}
              {isLoading && !momentum && (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
              )}

              {/* Empty state - No Slydes */}
              {!isLoading && !hasSlydes && (
                <div className="max-w-3xl">
                  <div className="text-sm text-gray-600 dark:text-white/60">
                    Welcome to Slydes HQ, <span className="font-semibold text-gray-900 dark:text-white">{organization?.name || 'there'}</span>.
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
                          href="/"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                        >
                          Create your first Slyde
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        <Link
                          href="/slydes"
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
              )}

              {/* Has Slydes but no analytics data yet */}
              {!isLoading && hasSlydes && !hasData && (
                <div className="max-w-3xl">
                  <div className="text-sm text-gray-600 dark:text-white/60">
                    Your Slydes are ready, <span className="font-semibold text-gray-900 dark:text-white">{organization?.name || 'there'}</span>.
                  </div>

                  <div className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                    Share your Slydes to start tracking.
                  </div>

                  <div className="mt-6 relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <div className="p-6">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold dark:bg-blue-500/10 dark:text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
                        Next action
                      </div>
                      <div className="mt-3 text-xl font-display font-bold text-gray-900 dark:text-white">
                        Get your first views
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                        Share your Slyde link on social, add it to your bio, or put a QR code in your shop. Once people start viewing, you'll see real data here.
                      </div>
                      <div className="mt-5 flex items-center gap-3">
                        <Link
                          href="/slydes"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                        >
                          View your Slydes
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Real Momentum Data */}
              {!isLoading && hasSlydes && hasData && momentum && (
                <div className="mb-10">
                  <div className="space-y-8">
                    {/* ATTENTION: Hero Metric — THE number that matters */}
                    <div className="relative">
                      <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl" />

                      <div className="relative">
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                            {momentum.hero.totalClicks}
                          </span>
                          <span className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                            CTA clicks
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                          {momentum.hero.clicksDelta !== 0 && (
                            <span className={`font-mono font-semibold ${
                              momentum.hero.clicksDelta > 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}>
                              {momentum.hero.clicksDelta > 0 ? '↑' : '↓'} {Math.abs(momentum.hero.clicksDelta)}%
                            </span>
                          )}
                          <span>this {range === '7d' ? 'week' : range === '30d' ? 'month' : 'quarter'}</span>
                          <span className="text-gray-300 dark:text-white/20">•</span>
                          <span>{momentum.hero.avgCompletion}% completion</span>
                          {momentum.hero.completionDelta !== 0 && (
                            <span className={`font-mono text-xs ${
                              momentum.hero.completionDelta > 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}>
                              ({momentum.hero.completionDelta > 0 ? '+' : ''}{momentum.hero.completionDelta}%)
                            </span>
                          )}
                        </div>

                        {/* Last win badge */}
                        {momentum.lastWin && (
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                              {momentum.lastWin.slydeName}: {momentum.lastWin.improvement}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INTEREST: Coaching insight — immediately after hero */}
                    {momentum.coaching.length > 0 && momentum.coaching[0].type !== 'no_data' && (
                      <div className="flex items-start gap-3 px-1">
                        <div className="shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-blue-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                          {momentum.coaching[0].message}{' '}
                          <span className="text-gray-900 dark:text-white font-medium">{momentum.coaching[0].action}</span>
                        </p>
                      </div>
                    )}

                    {/* DESIRE: Next Action Card — specific, actionable */}
                    {momentum.nextAction && (
                      <div className="relative rounded-2xl bg-white border border-gray-200/80 overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
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
                                {momentum.nextAction.slydeName}
                                {momentum.nextAction.frameLabel && (
                                  <> → {momentum.nextAction.frameLabel}</>
                                )}
                                {momentum.nextAction.leakPct && (
                                  <> leaking <span className="text-blue-600 dark:text-cyan-400">{momentum.nextAction.leakPct}%</span></>
                                )}
                              </div>
                              <div className="mt-1 text-sm text-gray-500 dark:text-white/50">
                                {momentum.nextAction.suggestion}
                              </div>
                            </div>
                            <Link
                              href={`/?slyde=${encodeURIComponent(momentum.rankedSlydes[0]?.id || '')}`}
                              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                              <span>Fix</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ACTION: Momentum AI — the "what's next" after data story */}
                    {/* Shows for free users with upsell, hidden for Pro (they have the floating button) */}
                    {isFree && (
                      <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-blue-200/60 overflow-hidden dark:from-blue-500/10 dark:via-[#2c2c2e] dark:to-cyan-500/10 dark:border-blue-500/20">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative p-6">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                                Momentum AI
                              </h3>
                              <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                                Your AI business partner — knows your Slydes, explains your analytics, and helps you write better copy.
                              </p>

                              {/* Quick action chips */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  onClick={openMomentumAI}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border border-gray-200/80 hover:border-blue-300 hover:bg-white transition-all text-sm text-gray-700 dark:bg-white/5 dark:border-white/10 dark:hover:border-blue-500/30 dark:text-white/80"
                                >
                                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  How's my week?
                                </button>
                                <button
                                  onClick={openMomentumAI}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border border-gray-200/80 hover:border-blue-300 hover:bg-white transition-all text-sm text-gray-700 dark:bg-white/5 dark:border-white/10 dark:hover:border-blue-500/30 dark:text-white/80"
                                >
                                  <PenLine className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                  Help me write copy
                                </button>
                                <button
                                  onClick={openMomentumAI}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 border border-gray-200/80 hover:border-blue-300 hover:bg-white transition-all text-sm text-gray-700 dark:bg-white/5 dark:border-white/10 dark:hover:border-blue-500/30 dark:text-white/80"
                                >
                                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  What should I focus on?
                                </button>
                              </div>
                            </div>

                            {/* CTA */}
                            <button
                              onClick={openMomentumAI}
                              className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                              Try it →
                            </button>
                          </div>

                          {/* Free tier indicator */}
                          <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-white/50">
                              3 free messages per day • Upgrade to Pro for unlimited
                            </span>
                            <Link
                              href="/settings/billing"
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                            >
                              See plans →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ranked Slydes - Real data */}
                    {momentum.rankedSlydes.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-white/50">
                            Your Slydes
                          </h3>
                          <span className="text-xs text-gray-400 dark:text-white/40">
                            Ranked by CTA clicks
                          </span>
                        </div>

                        <div className="space-y-3">
                          {momentum.rankedSlydes.map((s, idx) => {
                            const isTop = idx === 0
                            return (
                              <div
                                key={s.id}
                                className={`group relative rounded-2xl p-5 transition-all hover:-translate-y-0.5 ${
                                  isTop
                                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20'
                                    : 'bg-white border border-gray-200/60 hover:border-gray-300 dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-white/20'
                                }`}
                              >
                                <div className="grid grid-cols-[auto_1fr_100px_60px_80px_auto] items-center gap-4">
                                  {/* Rank */}
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                                    isTop
                                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
                                      : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70'
                                  }`}>
                                    {s.rank}
                                  </div>

                                  {/* Name + Drop-off */}
                                  <div className="min-w-0">
                                    <div className="font-display font-bold text-lg text-gray-900 dark:text-white truncate">
                                      {s.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-white/50">
                                      Drop-off at <span className="font-mono font-semibold text-gray-700 dark:text-white/70">{s.dropFrame}</span>
                                      {s.dropPct > 0 && <span className="text-red-500 ml-1">({s.dropPct}%)</span>}
                                    </div>
                                  </div>

                                  {/* Completion */}
                                  <div className="text-right">
                                    <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                                      {s.completion}%
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-white/50">completion</div>
                                  </div>

                                  {/* Delta */}
                                  <div className="text-right">
                                    <div className={`font-mono text-base font-semibold ${
                                      s.completionDelta > 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : s.completionDelta < 0
                                          ? 'text-red-500 dark:text-red-400'
                                          : 'text-gray-400 dark:text-white/40'
                                    }`}>
                                      {s.completionDelta > 0 ? `↑+${s.completionDelta}%` : s.completionDelta < 0 ? `↓${Math.abs(s.completionDelta)}%` : '→'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-white/50">trend</div>
                                  </div>

                                  {/* CTA clicks */}
                                  <div className="text-right">
                                    <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
                                      {s.ctaClicks}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-white/50">clicks</div>
                                  </div>

                                  {/* Action */}
                                  <Link
                                    href={`/?slyde=${encodeURIComponent(s.id)}`}
                                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors text-center ${
                                      isTop
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90'
                                    }`}
                                  >
                                    {isTop && s.dropPct > 30 ? 'Fix' : 'Edit'}
                                  </Link>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-[#2c2c2e] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
            >
              <X className="w-5 h-5 text-gray-400 dark:text-white/40" />
            </button>

            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mb-6 dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-blue-500/20">
                <svg className="w-8 h-8 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>

              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Ready for more?
              </h2>
              <p className="text-gray-600 dark:text-white/70 mb-6">
                You can publish one Slyde for free.<br />
                Upgrade to Creator to publish up to 10.
              </p>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-gray-900 dark:text-white">£25</span>
                  <span className="text-gray-500 dark:text-white/50">/month</span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                  Up to 10 Slydes • Analytics • No watermark
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/settings/billing"
                  className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15 text-center"
                >
                  Upgrade to Pro
                </Link>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 px-5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Maybe later
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-white/50 mt-4">
                Have a promo code?{' '}
                <Link href="/settings/billing" className="text-blue-500 hover:underline">
                  Enter it here
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Momentum AI is now provided globally via MomentumAIProvider */}
    </div>
  )
}
