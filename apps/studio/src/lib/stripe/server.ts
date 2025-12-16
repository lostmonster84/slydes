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
  // Stripe Connect
  get accounts() {
    return getStripe().accounts
  },
  get accountLinks() {
    return getStripe().accountLinks
  },
  // Subscriptions & Billing Portal
  get subscriptions() {
    return getStripe().subscriptions
  },
  get billingPortal() {
    return getStripe().billingPortal
  },
  get customers() {
    return getStripe().customers
  },
} as unknown as Stripe
