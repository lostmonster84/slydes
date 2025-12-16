export type PlanTier = 'free' | 'creator' | 'pro'

/**
 * Plan Tiers (Canonical - matches PRICING-PAYMENTS.md)
 *
 * | Tier    | Monthly | Annual | Key Features                    |
 * |---------|---------|--------|---------------------------------|
 * | Free    | £0      | £0     | 1 Slyde, watermark              |
 * | Creator | £25     | £250   | Analytics, 10 Slydes, inventory |
 * | Pro     | £50     | £500   | Commerce, checkout, orders      |
 */

export const PLAN_CONFIG = {
  free: {
    label: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '1 published Slyde',
      'Full mobile experience',
      'Shareable public link',
      'Slydes watermark',
    ],
  },
  creator: {
    label: 'Creator',
    monthlyPrice: 25,
    annualPrice: 250,
    features: [
      'Up to 10 Slydes',
      'No watermark',
      'Basic analytics',
      'Inventory browsing',
      'Enquire / Book CTAs',
    ],
  },
  pro: {
    label: 'Pro',
    monthlyPrice: 50,
    annualPrice: 500,
    features: [
      'Everything in Creator',
      'Unlimited Slydes',
      'Buy Now & Cart',
      'Stripe Checkout',
      'Order management',
      'Priority support',
    ],
  },
} as const

export function getPlanLabel(plan: PlanTier): string {
  return PLAN_CONFIG[plan]?.label ?? 'Free'
}

export function getPlanPrice(plan: PlanTier, annual = false): number {
  const config = PLAN_CONFIG[plan]
  return annual ? config.annualPrice : config.monthlyPrice
}

export function getPlanFeatures(plan: PlanTier): readonly string[] {
  return PLAN_CONFIG[plan]?.features ?? []
}

// Feature gates
export function hasAnalytics(plan: PlanTier): boolean {
  return plan === 'creator' || plan === 'pro'
}

export function hasInventory(plan: PlanTier): boolean {
  return plan === 'creator' || plan === 'pro'
}

export function hasCommerce(plan: PlanTier): boolean {
  return plan === 'pro'
}

// Alias for backwards compatibility (remove later)
export function hasCart(plan: PlanTier): boolean {
  return hasCommerce(plan)
}

// Stripe Price IDs (set these after creating products in Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  creator_monthly: process.env.NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID ?? '',
  creator_annual: process.env.NEXT_PUBLIC_STRIPE_CREATOR_ANNUAL_PRICE_ID ?? '',
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ?? '',
  pro_annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID ?? '',
} as const

export function getStripePriceId(plan: 'creator' | 'pro', annual = false): string {
  const key = `${plan}_${annual ? 'annual' : 'monthly'}` as keyof typeof STRIPE_PRICE_IDS
  return STRIPE_PRICE_IDS[key]
}
