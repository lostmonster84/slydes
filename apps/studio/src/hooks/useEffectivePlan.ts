'use client'

import { useProfile } from './useProfile'
import { hasUnlockCode } from '@/lib/whitelist'
import { hasAnalytics, hasInventory, hasCommerce, type PlanTier } from '@/lib/plans'
import { useEffect, useState } from 'react'

/**
 * Single source of truth for plan detection
 *
 * Priority:
 * 1. Active subscription status
 * 2. Promo/VIP code (localStorage)
 * 3. Database plan field
 *
 * Use this hook everywhere instead of scattered plan checks.
 */
export function useEffectivePlan() {
  const { profile, loading: profileLoading } = useProfile()
  const [isVIP, setIsVIP] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check VIP status after hydration
  useEffect(() => {
    setMounted(true)
    setIsVIP(hasUnlockCode())
  }, [])

  // Determine effective plan
  const effectivePlan: PlanTier = (() => {
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
