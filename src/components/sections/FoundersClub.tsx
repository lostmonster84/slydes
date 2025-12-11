'use client'

import { Button } from '@/components/ui/Button'
import { AnimatedAurora } from '@/components/ui/BackgroundAnimations'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function FoundersClub() {
  const spotsRemaining = 47
  const totalSpots = 50

  return (
    <section className="py-24 bg-future-black relative overflow-hidden">
      {/* Aurora northern lights effect */}
      <AnimatedAurora>
        <div className="absolute inset-0" />
      </AnimatedAurora>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Genesis Founders — Limited to {totalSpots}
            </div>
            
            <h2 className="text-white mb-4">The inner circle.<br /><span className="text-amber-400">The originals.</span></h2>
            <p className="text-gray-400 text-lg mb-8">
              50 founders. Direct access to me. 25% on every referral, forever.
              <br />
              <span className="text-gray-500">You&apos;re not buying software — you&apos;re joining the founding team.</span>
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: '🔑', title: 'Direct access to James', desc: 'Private Slack channel — I\'m there personally' },
                { icon: '💰', title: '25% revenue share forever', desc: 'Highest tier — earn on every referral' },
                { icon: '🎉', title: 'Launch party + team events', desc: 'You\'re invited to everything we do' },
                { icon: '📞', title: 'Weekly founder calls', desc: 'Direct input on what we build next' },
                { icon: '🏆', title: '"Built by" founders page', desc: 'Your name, photo, and business featured' },
              ].map((item, index) => (
                <motion.li 
                  key={item.title}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
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
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl p-8 border border-amber-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <p className="text-amber-400 text-sm font-medium mb-2">Genesis Founder — One-time payment</p>
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
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((totalSpots - spotsRemaining) / totalSpots) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>

            <Link href="/founding-member" className="block mb-6">
              <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold">
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
          Genesis is <span className="text-white">the only tier</span> with direct access to me. Once it&apos;s gone, it&apos;s <span className="text-amber-400">gone forever</span>.
        </motion.p>
      </div>
    </section>
  )
}
