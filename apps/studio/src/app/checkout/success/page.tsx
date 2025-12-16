'use client'

import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

/**
 * Checkout Success Page
 *
 * Shown after successful Stripe payment.
 * Clears the cart and shows confirmation.
 */
export default function CheckoutSuccessPage() {
  // Clear cart on mount
  useEffect(() => {
    // Clear localStorage cart
    try {
      localStorage.removeItem('slydes_cart')
      // Dispatch event to sync other tabs/components
      window.dispatchEvent(new CustomEvent('slydes-cart-update', { detail: [] }))
    } catch {
      // Ignore storage errors
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-white/60 mb-8">
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/preview"
            className="block w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Order info placeholder */}
        <p className="text-white/30 text-sm mt-8">
          Order confirmation will be sent to your email
        </p>
      </div>
    </div>
  )
}
