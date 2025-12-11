'use client'

import { Button } from '@/components/ui/Button'
import { AnimatedAurora } from '@/components/ui/BackgroundAnimations'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function FoundersClub() {
  const spotsRemaining = 47
  const totalSpots = 50

  return (
    <AnimatedAurora>
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leader-blue/20 text-white text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Genesis Founders. Limited to {totalSpots}.
            </span>
            
            <h2 className="text-white mb-4">The inner circle.<br /><span className="gradient-text">The originals.</span></h2>
            <p className="text-gray-400 text-lg mb-8">
              50 founders. Direct access to me. 25% on every referral, forever. Lifetime Pro access included.
              <br />
              <span className="text-gray-500">You are not just buying software. You are joining the founding team.</span>
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { title: 'Direct access to the founder', desc: 'Private Slack channel with James (founder) in the room every day' },
                { title: '25% revenue share forever', desc: 'Highest tier. Earn on every referral for as long as they stay' },
                { title: 'Monthly founder calls', desc: 'Group calls to shape what we build next' },
                { title: 'Personal onboarding call', desc: '1-on-1 setup with the founder' },
                { title: '"Built by" founders page', desc: 'Your name, photo, and business featured' },
              ].map((item, index) => (
                <motion.li 
                  key={item.title}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Pricing Card */}
          <motion.div 
            className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <p className="text-leader-blue text-sm font-medium mb-2">Genesis Founder. One-time payment.</p>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-6xl font-bold text-white">£499</span>
              </div>
              <p className="text-gray-500 text-sm">€599 / $629 USD</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{totalSpots - spotsRemaining} claimed</span>
                <span className="text-white font-medium">{spotsRemaining} remaining</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-leader-blue"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((totalSpots - spotsRemaining) / totalSpots) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>

            <Link href="/founding-member" className="block mb-6">
              <Button size="lg" className="w-full animate-pulse-glow">
                Become a Genesis Founder
              </Button>
            </Link>

            {/* Future pricing note */}
            <div className="text-center mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <p className="text-gray-500 text-xs mb-2">After Genesis sells out:</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-gray-400">Founding: <span className="text-white">£999</span></span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">Charter: <span className="text-white">£1,499</span></span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex justify-center gap-6 text-gray-500 text-xs">
                <span>Secure payment</span>
                <span>•</span>
                <span>30-day refund</span>
                <span>•</span>
                <span>Lifetime access</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom urgency message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Genesis is <span className="text-white">the only tier</span> with direct access to me. Once it&apos;s gone, it&apos;s <span className="text-leader-blue">gone forever</span>.
        </motion.p>
        </div>
      </section>
    </AnimatedAurora>
  )
}
