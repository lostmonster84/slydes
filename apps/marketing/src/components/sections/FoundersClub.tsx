'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function FoundersClub() {
  const spotsRemaining = 47
  const totalSpots = 50

  return (
    <section className="py-12 md:py-24 relative overflow-hidden bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
              Founding Partners. Limited to {totalSpots}.
            </span>
            
            <h2 className="text-gray-900 mb-4">Promote Slydes.<br /><span className="gradient-text">Earn 25% for life.</span></h2>
            <p className="text-gray-600 text-lg mb-4">
              We&apos;re selecting 50 influencers and creators to become Founding Partners. 
              You promote Slydes. You earn commission on every conversion. Simple.
            </p>
            <p className="text-leader-blue font-medium mb-8">
              25% of every subscriber you refer. Forever.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { title: '25% commission for life', desc: 'Earn £4.75/month per subscriber you refer. Recurring, not one-time.' },
                { title: 'Lifetime Pro access', desc: 'Full access to Slydes Pro features, free forever' },
                { title: 'Unique referral link + dashboard', desc: 'Track clicks, signups, conversions, and earnings in real-time' },
                { title: 'Direct access to the founder', desc: 'Private Slack channel with James in the room every day' },
                { title: 'Featured in our showcase', desc: 'Your Slyde featured as an example of what\'s possible' },
                { title: 'Monthly payouts', desc: 'Paid on the 1st via Stripe Connect or PayPal' },
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
                    <span className="text-gray-900 font-medium">{item.title}</span>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Earnings Card */}
          <motion.div 
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <p className="text-leader-blue text-sm font-medium mb-2">Founding Partner Commission</p>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl font-bold text-gray-900">25%</span>
                <span className="text-gray-500 ml-2">for life</span>
              </div>
              <p className="text-gray-500 text-sm">On every subscriber you refer</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{totalSpots - spotsRemaining} selected</span>
                <span className="text-gray-900 font-medium">{spotsRemaining} spots left</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-leader-blue"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((totalSpots - spotsRemaining) / totalSpots) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>

            <Link href="/affiliates" className="block mb-6">
              <Button size="lg" className="w-full">
                Apply to Partner
              </Button>
            </Link>

            {/* What we ask */}
            <div className="text-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs mb-2">What we ask:</p>
              <p className="text-gray-600 text-sm">Share your referral link &amp; post about Slydes quarterly</p>
            </div>

            {/* Who we're looking for */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs text-center mb-2">Perfect for creators in:</p>
              <div className="flex flex-wrap justify-center gap-2 text-gray-600 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded">Food & Dining</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Travel & Hotels</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Events & Venues</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Adventures</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Lifestyle</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          10K-500K followers. Engaged audiences. <span className="text-gray-900 font-medium">Quality over quantity.</span>
        </motion.p>
      </div>
    </section>
  )
}
