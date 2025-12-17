'use client'

/**
 * usePlan - Single source of truth for plan state
 *
 * This hook provides consistent plan state across the entire app.
 * DevPanel updates this, and all components read from it.
 *
 * Plan types:
 * - 'free': Free tier (limited features, 3 AI messages/day)
 * - 'creator': Pro tier (full access, unlimited AI)
 *
 * Note: In production, this will be replaced with real subscription data.
 * For now, it's stored in localStorage for dev/demo purposes.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type PlanType = 'free' | 'creator'

interface PlanContextValue {
  plan: PlanType
  setPlan: (plan: PlanType) => void
  isPro: boolean
  isFree: boolean
}

const PlanContext = createContext<PlanContextValue | null>(null)

const STORAGE_KEY = 'slydes_demo_plan'

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanType>('creator')
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'free' || stored === 'creator') {
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
  const isPro = plan === 'creator'
  const isFree = plan === 'free'

  // Don't render children until hydrated to prevent mismatch
  if (!hydrated) {
    return null
  }

  return (
    <PlanContext.Provider value={{ plan, setPlan, isPro, isFree }}>
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
