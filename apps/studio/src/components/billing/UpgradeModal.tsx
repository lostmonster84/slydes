'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, BarChart3, ShoppingBag, Zap } from 'lucide-react'
import { PLAN_CONFIG, getPlanFeatures, type PlanTier } from '@/lib/plans'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  targetTier: 'creator' | 'pro'
  feature: string // "Analytics", "Shop", etc.
}

const FEATURE_ICONS: Record<string, typeof Sparkles> = {
  Analytics: BarChart3,
  Shop: ShoppingBag,
  Commerce: ShoppingBag,
  Inventory: Sparkles,
}

/**
 * Premium SaaS-style upgrade modal
 *
 * Triggered from feature gates. Shows what the user is unlocking,
 * displays tier benefits, and flows to Stripe Checkout.
 */
export function UpgradeModal({ isOpen, onClose, targetTier, feature }: UpgradeModalProps) {
  const [isAnnual, setIsAnnual] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const config = PLAN_CONFIG[targetTier]
  const price = isAnnual ? config.annualPrice : config.monthlyPrice
  const features = getPlanFeatures(targetTier)
  const FeatureIcon = FEATURE_ICONS[feature] || Sparkles

  const annualSavings = config.monthlyPrice * 12 - config.annualPrice
  const savingsPercent = Math.round((annualSavings / (config.monthlyPrice * 12)) * 100)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: targetTier,
          annual: isAnnual,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error('Checkout error:', error)
        setIsLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error('Failed to create checkout:', err)
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                {/* Feature unlock badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20">
                    <FeatureIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Unlock</p>
                    <p className="text-white font-medium">{feature}</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  Upgrade to {config.label}
                </h2>
                <p className="text-white/60 text-sm">
                  Get access to {feature.toLowerCase()} and more powerful features.
                </p>
              </div>

              {/* Billing toggle */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-center gap-3 p-1 bg-white/5 rounded-full">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      !isAnnual
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      isAnnual
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Annual
                    <span className="ml-1.5 text-xs text-green-600">Save {savingsPercent}%</span>
                  </button>
                </div>
              </div>

              {/* Price display */}
              <div className="px-6 pb-4 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">£{price}</span>
                  <span className="text-white/50">/{isAnnual ? 'year' : 'month'}</span>
                </div>
                {isAnnual && (
                  <p className="text-green-400 text-sm mt-1">
                    Save £{annualSavings}/year
                  </p>
                )}
              </div>

              {/* Features list */}
              <div className="px-6 pb-6">
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-500/20">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-white/80 text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Upgrade to {config.label}
                    </>
                  )}
                </button>

                <p className="text-center text-white/40 text-xs mt-3">
                  Secure payment via Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
