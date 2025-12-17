'use client'

import { useProfile } from './useProfile'
import { usePlan } from './usePlan'
import { hasUnlockCode } from '@/lib/whitelist'
import { hasAnalytics, hasInventory, hasCommerce, type PlanTier } from '@/lib/plans'
import { useEffect, useState } from 'react'

/**
 * Single source of truth for plan detection
 *
 * Priority:
 * 1. Dev override via usePlan context (localhost DevPanel)
 * 2. Promo/VIP code (localStorage)
 * 3. Database plan field
 * 4. Default to free
 *
 * Use this hook everywhere instead of scattered plan checks.
 */
export function useEffectivePlan() {
  const { profile, loading: profileLoading } = useProfile()
  const { plan: devPlan } = usePlan()
  const [isVIP, setIsVIP] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLocalhost, setIsLocalhost] = useState(false)

  // Check VIP status and localhost after hydration
  useEffect(() => {
    setMounted(true)
    setIsVIP(hasUnlockCode())
    setIsLocalhost(typeof window !== 'undefined' && window.location.hostname === 'localhost')
  }, [])

  // Determine effective plan
  const effectivePlan: PlanTier = (() => {
    // Dev override takes top priority (localhost only via DevPanel)
    // Note: devPlan is 'free' | 'creator', maps to PlanTier
    if (isLocalhost && devPlan) {
      // Map usePlan's 'creator' to the 3-tier system
      // DevPanel shows Free/Pro but internally 'creator' = Pro-level access for dev
      return devPlan as PlanTier
    }

    // VIP code gives Pro access
    if (isVIP) return 'pro'

    // Use profile plan (already has whitelist override applied)
    if (profile?.plan) return profile.plan

    // Default to free
    return 'free'
  })()

  // Check if subscription is active (vs cancelled/past_due)
  const isSubscriptionActive = profile?.subscription_status === 'active' || isVIP

  return {
    // Current state
    plan: effectivePlan,
    isVIP,
    isLoading: profileLoading || !mounted,
    isSubscriptionActive,

    // Feature checks
    canAccessAnalytics: hasAnalytics(effectivePlan),
    canAccessInventory: hasInventory(effectivePlan),
    canAccessCommerce: hasCommerce(effectivePlan),

    // Plan tier checks
    isFree: effectivePlan === 'free',
    isCreator: effectivePlan === 'creator',
    isPro: effectivePlan === 'pro',
    isPaid: effectivePlan !== 'free',

    // Profile data
    profile,
  }
}
