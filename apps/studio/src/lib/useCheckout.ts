'use client'

import { useState, useCallback } from 'react'
import type { CartItem } from '@/lib/useCart'

interface CheckoutOptions {
  /** The seller's Stripe Connect account ID */
  connectedAccountId: string
  /** Cart items to checkout */
  items: CartItem[]
  /** Called when checkout starts */
  onCheckoutStart?: () => void
  /** Called on error */
  onError?: (error: string) => void
}

interface UseCheckoutResult {
  /** Start the checkout process */
  checkout: (options: CheckoutOptions) => Promise<void>
  /** Whether checkout is in progress */
  isLoading: boolean
  /** Error message if checkout failed */
  error: string | null
}

/**
 * useCheckout - Hook for initiating Stripe Checkout
 *
 * Creates a checkout session via our API and redirects to Stripe's hosted checkout.
 * Payment goes to the seller's connected account with platform fee deducted.
 */
export function useCheckout(): UseCheckoutResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = useCallback(async (options: CheckoutOptions) => {
    const { connectedAccountId, items, onCheckoutStart, onError } = options

    if (items.length === 0) {
      const err = 'Cart is empty'
      setError(err)
      onError?.(err)
      return
    }

    if (!connectedAccountId) {
      const err = 'Seller has not set up payments yet'
      setError(err)
      onError?.(err)
      return
    }

    setIsLoading(true)
    setError(null)
    onCheckoutStart?.()

    try {
      // Create checkout session via our API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          connectedAccountId,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: window.location.href,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { sessionId, url } = await response.json()

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
        return
      }

      throw new Error('No checkout URL returned')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed'
      setError(message)
      onError?.(message)
      setIsLoading(false)
    }
  }, [])

  return {
    checkout,
    isLoading,
    error,
  }
}

interface DemoCheckoutOptions {
  items: CartItem[]
}

interface UseDemoCheckoutResult {
  checkout: (options: DemoCheckoutOptions) => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * Demo checkout for testing without Stripe Connect
 * Uses the platform's own Stripe account
 */
export function useDemoCheckout(): UseDemoCheckoutResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = useCallback(async (options: DemoCheckoutOptions) => {
    const { items } = options

    if (items.length === 0) {
      setError('Cart is empty')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // For demo, create a simple checkout without Connect
      const response = await fetch('/api/stripe/demo-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: window.location.href,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed'
      setError(message)
      setIsLoading(false)
    }
  }, [])

  return {
    checkout,
    isLoading,
    error,
  }
}
