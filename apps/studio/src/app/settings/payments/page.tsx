'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react'

interface StripeAccountStatus {
  id: string
  chargesEnabled: boolean
  payoutsEnabled: boolean
  detailsSubmitted: boolean
  requiresAction: boolean
}

/**
 * Payments Settings Page Content
 */
function PaymentsSettingsContent() {
  const searchParams = useSearchParams()
  const justConnected = searchParams.get('connected') === 'true'

  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [accountStatus, setAccountStatus] = useState<StripeAccountStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock organization ID - in production, get from context/auth
  const organizationId = 'demo-org-id'
  const stripeAccountId = null // Would come from organization data

  // Check account status on mount
  useEffect(() => {
    async function checkStatus() {
      if (!stripeAccountId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/stripe/connect?accountId=${stripeAccountId}`)
        if (res.ok) {
          const data = await res.json()
          setAccountStatus(data)
        }
      } catch (err) {
        console.error('Failed to check account status:', err)
      }
      setLoading(false)
    }

    checkStatus()
  }, [stripeAccountId])

  // Handle connecting Stripe account
  const handleConnect = async () => {
    setConnecting(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          returnUrl: `${window.location.origin}/settings/payments?connected=true`,
          refreshUrl: `${window.location.origin}/settings/payments`,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create Connect account')
      }

      const data = await res.json()
      // Redirect to Stripe's hosted onboarding
      window.location.href = data.url
    } catch (err) {
      setError('Failed to connect Stripe account. Please try again.')
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    )
  }

  const isConnected = accountStatus?.chargesEnabled && accountStatus?.detailsSubmitted
  const needsMoreInfo = accountStatus && !accountStatus.chargesEnabled

  return (
    <div className="min-h-screen bg-[#1c1c1e] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Payments</h1>
        <p className="text-white/60 mb-8">
          Connect your Stripe account to receive payments from customers.
        </p>

        {/* Success message after connecting */}
        {justConnected && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-medium">Stripe connected successfully!</p>
              <p className="text-green-400/70 text-sm mt-1">
                You can now receive payments from customers.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stripe Connection Card */}
        <div className="bg-[#2c2c2e] rounded-2xl p-6 border border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg">Stripe Connect</h2>
              <p className="text-white/50 text-sm mt-1">
                Payments go directly to your Stripe account. Slydes takes 0% — you keep 100%.
              </p>

              {/* Status indicators */}
              {isConnected ? (
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-400 text-sm font-medium">Connected</span>
                </div>
              ) : needsMoreInfo ? (
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-yellow-400 text-sm font-medium">
                    Additional information required
                  </span>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="text-white/50 text-sm">Not connected</span>
                </div>
              )}

              {/* Action button */}
              <div className="mt-6">
                {isConnected ? (
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Open Stripe Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5851DB] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : needsMoreInfo ? (
                      'Complete Setup'
                    ) : (
                      'Connect with Stripe'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white/80 font-medium mb-2">How it works</h3>
          <ul className="space-y-2 text-white/50 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-white/30">1.</span>
              Connect your Stripe account (or create one for free)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/30">2.</span>
              Customers pay via your Slyde checkout
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/30">3.</span>
              Money goes directly to your Stripe account
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/30">4.</span>
              You keep 100% — Slydes takes no commission
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Payments Settings Page
 *
 * Allows sellers to:
 * 1. Connect their Stripe account (if not connected)
 * 2. View connection status
 * 3. Complete onboarding if incomplete
 * 4. See payment settings
 */
export default function PaymentsSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        </div>
      }
    >
      <PaymentsSettingsContent />
    </Suspense>
  )
}
