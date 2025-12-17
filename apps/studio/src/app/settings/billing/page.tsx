'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Sparkles, CreditCard, ExternalLink } from 'lucide-react'
import { PromoCodeInput } from '@/components/settings/PromoCodeInput'
import { useEffectivePlan } from '@/hooks/useEffectivePlan'
import { PLAN_CONFIG, type PlanTier } from '@/lib/plans'

function BillingPageContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const { plan: currentPlan, isVIP, isLoading, isPaid, profile } = useEffectivePlan()
  const [isAnnual, setIsAnnual] = useState(true)
  const [upgradeLoading, setUpgradeLoading] = useState<PlanTier | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const handleUpgrade = async (targetPlan: 'creator' | 'pro') => {
    setUpgradeLoading(targetPlan)
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan, annual: isAnnual }),
      })
      const { url, error } = await response.json()
      if (error) {
        console.error('Checkout error:', error)
        setUpgradeLoading(null)
        return
      }
      window.location.assign(url)
    } catch (err) {
      console.error('Failed to create checkout:', err)
      setUpgradeLoading(null)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' })
      const { url, error } = await response.json()
      if (error) {
        console.error('Portal error:', error)
        setPortalLoading(false)
        return
      }
      window.location.assign(url)
    } catch (err) {
      console.error('Failed to open portal:', err)
      setPortalLoading(false)
    }
  }

  const plans: { tier: PlanTier; highlight?: boolean }[] = [
    { tier: 'free' },
    { tier: 'creator', highlight: true },
    { tier: 'pro' },
  ]

  const getPlanPosition = (tier: PlanTier): number => {
    return tier === 'free' ? 0 : tier === 'creator' ? 1 : 2
  }

  const canUpgrade = (tier: PlanTier): boolean => {
    return getPlanPosition(tier) > getPlanPosition(currentPlan)
  }

  const annualSavings = (tier: 'creator' | 'pro'): number => {
    const config = PLAN_CONFIG[tier]
    return config.monthlyPrice * 12 - config.annualPrice
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Billing</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Cancel Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-green-400">Subscription activated! Welcome to {PLAN_CONFIG[currentPlan].label}.</p>
            </div>
          </div>
        )}
        {canceled && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-amber-400">Checkout cancelled. No charges were made.</p>
          </div>
        )}

        {/* VIP Status */}
        {isVIP && (
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <p className="font-medium text-amber-400">VIP Access Active</p>
                <p className="text-sm text-amber-400/70">You have full Pro features unlocked via promo code</p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Choose your plan</h2>
          <div className="flex items-center gap-3 p-1 bg-gray-100 dark:bg-white/5 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all ${
                !isAnnual ? 'bg-white text-black shadow-sm dark:bg-white dark:text-black' : 'text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all ${
                isAnnual ? 'bg-white text-black shadow-sm dark:bg-white dark:text-black' : 'text-gray-500 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs text-green-600">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {plans.map(({ tier, highlight }) => {
            const config = PLAN_CONFIG[tier]
            const isCurrent = currentPlan === tier && !isVIP
            const isVIPTier = isVIP && tier === 'pro'
            const price = isAnnual ? config.annualPrice : config.monthlyPrice
            const showUpgrade = canUpgrade(tier) && !isVIP

            return (
              <div
                key={tier}
                className={`relative p-6 rounded-2xl border ${
                  highlight
                    ? 'bg-gradient-to-br from-leader-blue/10 to-electric-cyan/10 border-leader-blue/30'
                    : isCurrent || isVIPTier
                    ? 'bg-white border-gray-300 dark:bg-white/5 dark:border-white/20'
                    : 'bg-white border-gray-200 dark:bg-white/5 dark:border-white/10'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-leader-blue to-electric-cyan text-white text-xs font-semibold rounded-full">
                    Popular
                  </div>
                )}
                {(isCurrent || isVIPTier) && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-gray-200 text-gray-700 dark:bg-white/20 dark:text-white text-xs font-semibold rounded-full">
                    {isVIPTier ? 'VIP' : 'Current'}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold">{config.label}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">£{price}</span>
                    <span className="text-gray-500 dark:text-white/60">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  {isAnnual && tier !== 'free' && (
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                      Save £{annualSavings(tier as 'creator' | 'pro')}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {config.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 dark:text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent || isVIPTier ? (
                  <div className="w-full py-2.5 px-4 bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white/60 text-center font-medium rounded-xl">
                    {isVIPTier ? 'Active via VIP' : 'Current plan'}
                  </div>
                ) : showUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(tier as 'creator' | 'pro')}
                    disabled={upgradeLoading !== null}
                    className={`w-full py-2.5 px-4 font-medium rounded-xl transition-all disabled:opacity-50 ${
                      highlight
                        ? 'bg-gradient-to-r from-leader-blue to-electric-cyan text-white hover:opacity-90'
                        : tier === 'pro'
                        ? 'bg-purple-600 text-white hover:bg-purple-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                    }`}
                  >
                    {upgradeLoading === tier ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Upgrade to ${config.label}`
                    )}
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-white/40 text-center font-medium rounded-xl">
                    {tier === 'free' ? 'Included' : 'Included in your plan'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Manage Subscription */}
        {isPaid && profile?.stripe_customer_id && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">Manage Subscription</h2>
            <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-500 dark:text-white/60" />
                  </div>
                  <div>
                    <p className="font-medium">Billing Portal</p>
                    <p className="text-sm text-gray-500 dark:text-white/60">Update payment method, view invoices, or cancel</p>
                  </div>
                </div>
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {portalLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Manage
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Promo Code Section */}
        {!isVIP && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-4">Have a promo code?</h2>
            <PromoCodeInput />
          </div>
        )}

        {/* Platform fees note */}
        <div className="mt-8 text-center text-gray-400 dark:text-white/40 text-sm">
          <p>Slydes takes 0% of your sales. Payments processed by Stripe.</p>
        </div>
      </main>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  )
}
