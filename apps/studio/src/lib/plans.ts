export type PlanTier = 'free' | 'pro' | 'enterprise'

/**
 * Canonical meaning (for UI copy):
 * - free: Free
 * - pro: Creator (inventory/listings unlocked)
 * - enterprise: Commerce (cart/checkout unlocked)
 *
 * We keep DB values as free/pro/enterprise for now to avoid churn.
 */
export function getPlanLabel(plan: PlanTier): string {
  if (plan === 'pro') return 'Creator'
  if (plan === 'enterprise') return 'Commerce'
  return 'Free'
}

export function hasInventory(plan: PlanTier): boolean {
  return plan === 'pro' || plan === 'enterprise'
}

export function hasCart(plan: PlanTier): boolean {
  return plan === 'enterprise'
}


