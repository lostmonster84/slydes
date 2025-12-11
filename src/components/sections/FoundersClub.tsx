'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function FoundersClub() {
  const spotsRemaining = 47

  return (
    <section className="py-24 bg-future-black relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-leader-blue rounded-full blur-[200px] animate-gradient" />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-leader-blue font-semibold mb-4">Limited Availability</p>
            <h2 className="text-white mb-6">Become a Founding Member</h2>
            <p className="text-gray-400 text-lg mb-8">
              Help us build the future of mobile-first business sites. 
              Get lifetime access at a fraction of the regular price.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { title: 'Lifetime Pro access', desc: 'Worth $29/month forever' },
                { title: 'Priority support', desc: 'Direct access to the team' },
                { title: 'Shape the roadmap', desc: 'Your feedback drives development' },
                { title: 'Founding member badge', desc: 'Be recognized as an early supporter' },
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
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm mb-2">One-time payment</p>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-6xl font-bold text-white">$299</span>
              </div>
              <p className="text-gray-500 text-sm">
                Regular price after launch: $29/month
              </p>
            </div>

            <Link href="/founding-member" className="block mb-6">
              <Button size="lg" className="w-full animate-pulse-glow">
                Claim Your Spot
              </Button>
            </Link>

            {/* Spots Counter */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gray-700/50 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {spotsRemaining}/50 spots remaining
                </span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="flex justify-center gap-6 text-gray-500 text-xs">
                <span>Secure payment</span>
                <span>•</span>
                <span>Instant access</span>
                <span>•</span>
                <span>30-day refund</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
