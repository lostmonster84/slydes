'use client'

import { useEffect, useState } from 'react'
import { type PlanTier } from '@/lib/plans'

const DEV_OVERRIDE_KEY = 'slydes_dev_plan_override'

/**
 * Dev-only control panel for testing plan tiers
 *
 * Only renders on localhost. Allows toggling between Free/Creator/Pro
 * to test feature gating without changing database.
 */
export function DevPanel() {
  const [isClient, setIsClient] = useState(false)
  const [override, setOverride] = useState<PlanTier | null>(null)

  // Only run on client
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem(DEV_OVERRIDE_KEY)
    if (stored === 'free' || stored === 'creator' || stored === 'pro') {
      setOverride(stored)
    }
  }, [])

  // Don't render on server or in production
  if (!isClient) return null
  if (typeof window === 'undefined') return null
  if (window.location.hostname !== 'localhost') return null

  const handleSetPlan = (plan: PlanTier) => {
    localStorage.setItem(DEV_OVERRIDE_KEY, plan)
    setOverride(plan)
    // Reload to apply change across all hooks
    window.location.reload()
  }

  const handleReset = () => {
    localStorage.removeItem(DEV_OVERRIDE_KEY)
    setOverride(null)
    window.location.reload()
  }

  return (
    <div className="mx-3 mb-3 p-3 rounded-lg border-2 border-dashed border-red-500/50 bg-red-50 dark:bg-red-500/10">
      <div className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">
        Dev Only
      </div>

      <div className="text-xs text-gray-600 dark:text-white/60 mb-2">
        Plan: <span className="font-semibold text-gray-900 dark:text-white">{override ?? 'Real'}</span>
      </div>

      <div className="flex gap-1 mb-2">
        {(['free', 'creator', 'pro'] as const).map((plan) => (
          <button
            key={plan}
            onClick={() => handleSetPlan(plan)}
            className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
              override === plan
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white'
            }`}
          >
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </button>
        ))}
      </div>

      {override && (
        <button
          onClick={handleReset}
          className="w-full px-2 py-1 text-[10px] font-medium text-red-500 hover:text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 rounded transition-colors"
        >
          Reset to Real
        </button>
      )}
    </div>
  )
}

/**
 * Get the dev override plan (for use in useEffectivePlan)
 * Returns null if no override or not on localhost
 */
export function getDevPlanOverride(): PlanTier | null {
  if (typeof window === 'undefined') return null
  if (window.location.hostname !== 'localhost') return null

  const stored = localStorage.getItem(DEV_OVERRIDE_KEY)
  if (stored === 'free' || stored === 'creator' || stored === 'pro') {
    return stored
  }
  return null
}
