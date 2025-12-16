import Stripe from 'stripe'

/**
 * Server-side Stripe client (lazy initialization)
 * Used for creating checkout sessions, managing Connect accounts, etc.
 */
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

// For backwards compatibility - will be lazy on first access
export const stripe = {
  get webhooks() {
    return getStripe().webhooks
  },
  get checkout() {
    return getStripe().checkout
  },
  get paymentIntents() {
    return getStripe().paymentIntents
  },
} as unknown as Stripe

/**
 * Platform fee percentage (5%)
 * This is what Slydes takes from each transaction
 */
export const PLATFORM_FEE_PERCENT = 5

/**
 * Calculate platform fee in cents
 */
export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100))
}
