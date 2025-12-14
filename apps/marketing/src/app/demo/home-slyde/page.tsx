'use client'

import Link from 'next/link'
import { HomeSlydeDemo } from './components/HomeSlydeDemo'

/**
 * Home Slyde Full Flow Demo
 *
 * Demonstrates the canonical Slydes navigation model:
 * 1. Home Slyde (single slide) → tap category
 * 2. Category Child Slyde (curated immersion) → "View all" CTA
 * 3. Inventory Grid (earned, not default) → tap item
 * 4. Item Slyde (deep immersion)
 *
 * Core principle: "Immersion always leads. Lists are earned, not default."
 */
export default function HomeSlydeFlowPage() {
  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      {/* Header */}
      <header className="bg-[#0A0E27] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-white/40 hover:text-white/60 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-white/20" />
          <h1 className="font-semibold text-white">Home Slyde Flow</h1>
        </div>
        <div className="text-sm text-white/60">Full navigation demo</div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Phone Preview */}
          <div className="flex justify-center lg:justify-end">
            <HomeSlydeDemo />
          </div>

          {/* Info Panel */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Current Level Indicator */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-4">
                Navigation Hierarchy
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">1</div>
                  <div>
                    <div className="text-sm font-medium text-white">Home Slyde</div>
                    <div className="text-xs text-white/50">Single slide decision surface</div>
                  </div>
                </div>
                <div className="ml-4 w-px h-4 bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm font-bold">2</div>
                  <div>
                    <div className="text-sm font-medium text-white/70">Category Slyde</div>
                    <div className="text-xs text-white/40">Curated immersive experience</div>
                  </div>
                </div>
                <div className="ml-4 w-px h-4 bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm font-bold">3</div>
                  <div>
                    <div className="text-sm font-medium text-white/70">Inventory Grid</div>
                    <div className="text-xs text-white/40">Earned via "View all" CTA</div>
                  </div>
                </div>
                <div className="ml-4 w-px h-4 bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm font-bold">4</div>
                  <div>
                    <div className="text-sm font-medium text-white/70">Item Slyde</div>
                    <div className="text-xs text-white/40">Deep item immersion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Principle */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Core Principle</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                "Immersion always leads. Lists are earned, not default."
              </p>
              <p className="text-white/50 text-xs mt-3">
                Users must go through the Category Slyde before seeing any grid. No shortcuts.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-white/80 mb-3">How to Navigate</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Tap a category to enter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Swipe up/down or click to navigate frames</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Look for "View All" to access the grid</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Tap any item card for deep immersion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>Use back button or breadcrumb to navigate up</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
