'use client'

import { useEffect, useState } from 'react'
import { hasUnlockCode } from '@/lib/whitelist'
import { getPlanLabel, type PlanTier } from '@/lib/plans'

interface PlanBadgeProps {
  dbPlan: PlanTier | null | undefined
}

export function PlanBadge({ dbPlan }: PlanBadgeProps) {
  const [isVIP, setIsVIP] = useState(false)

  useEffect(() => {
    setIsVIP(hasUnlockCode())
  }, [])

  // VIP (promo code) takes priority
  if (isVIP) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30">
        VIP
      </span>
    )
  }

  // Otherwise show DB plan
  const plan = dbPlan ?? 'free'

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
      plan === 'pro'
        ? 'bg-purple-500/20 text-purple-400'
        : plan === 'creator'
        ? 'bg-leader-blue/20 text-leader-blue'
        : 'bg-white/10 text-white/60'
    }`}>
      {getPlanLabel(plan)}
    </span>
  )
}
