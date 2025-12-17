'use client'

/**
 * usePlan - Single source of truth for plan state (dev/demo)
 *
 * This hook provides consistent plan state across the entire app.
 * DevPanel updates this, and all components read from it.
 *
 * Plan types (matches plans.ts):
 * - 'free': Free tier (1 Slyde, watermark)
 * - 'creator': Creator tier (10 Slydes, analytics, no watermark)
 * - 'pro': Pro tier (unlimited, commerce, checkout)
 *
 * Note: In production, this will be replaced with real subscription data.
 * For now, it's stored in localStorage for dev/demo purposes.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { PlanTier } from '@/lib/plans'

// Re-export PlanTier as PlanType for backwards compatibility
export type PlanType = PlanTier

interface PlanContextValue {
  plan: PlanType
  setPlan: (plan: PlanType) => void
  isFree: boolean
  isCreator: boolean
  isPro: boolean
  isPaid: boolean // creator or pro
}

const PlanContext = createContext<PlanContextValue | null>(null)

const STORAGE_KEY = 'slydes_demo_plan'

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanType>('pro')
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'free' || stored === 'creator' || stored === 'pro') {
        setPlanState(stored)
      }
    } catch {
      // Ignore localStorage errors
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage and update state
  const setPlan = useCallback((newPlan: PlanType) => {
    setPlanState(newPlan)
    try {
      window.localStorage.setItem(STORAGE_KEY, newPlan)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Derived state
  const isFree = plan === 'free'
  const isCreator = plan === 'creator'
  const isPro = plan === 'pro'
  const isPaid = plan !== 'free'

  // Don't render children until hydrated to prevent mismatch
  if (!hydrated) {
    return null
  }

  return (
    <PlanContext.Provider value={{ plan, setPlan, isFree, isCreator, isPro, isPaid }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext)

  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider')
  }

  return context
}
