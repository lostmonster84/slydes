'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { PromoCodeInput } from '@/components/settings/PromoCodeInput'
import { hasUnlockCode } from '@/lib/whitelist'

export default function BillingPage() {
  const [isVIP, setIsVIP] = useState(false)

  useEffect(() => {
    setIsVIP(hasUnlockCode())
  }, [])

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with the basics',
      features: [
        '1 published Slyde',
        'Slydes.io branding',
        'Basic analytics',
        'Community support',
      ],
      current: !isVIP,
      cta: 'Current plan',
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Everything you need to grow',
      features: [
        'Unlimited Slydes',
        'Remove Slydes.io branding',
        'Advanced analytics',
        'Priority support',
        'Custom domain',
        'Team collaboration',
      ],
      current: false,
      cta: 'Upgrade to Pro',
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-future-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Billing</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Current Plan */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Plan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-full">
                    Recommended
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-white/60">{plan.period}</span>
                  </div>
                  <p className="text-sm text-white/60 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.current || isVIP ? (
                  <div className="w-full py-2.5 px-4 bg-white/10 text-white/60 text-center font-medium rounded-xl">
                    {isVIP && plan.highlight ? 'Active via VIP' : plan.current ? 'Current plan' : 'Current plan'}
                  </div>
                ) : (
                  <button
                    className={`w-full py-2.5 px-4 font-medium rounded-xl transition-colors ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Promo Code Section */}
        {!isVIP && (
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-lg font-semibold mb-4">Have a promo code?</h2>
            <PromoCodeInput />
          </div>
        )}
      </main>
    </div>
  )
}
