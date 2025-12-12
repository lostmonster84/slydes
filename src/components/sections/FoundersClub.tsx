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
      <section className="py-12 md:py-24 relative overflow-hidden">
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
              Founding Partners. Limited to {totalSpots}.
            </span>
            
            <h2 className="text-white mb-4">Build with us.<br /><span className="gradient-text">Grow with us.</span></h2>
            <p className="text-gray-400 text-lg mb-8">
              We&apos;re selecting 50 influencers and creators to become Founding Partners. 
              You bring the audience. We build your Slyde. Together, we grow.
              <br />
              <span className="text-gray-500">No payment required. Your audience is your contribution.</span>
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { title: 'Custom Slyde built for you', desc: 'White-glove build of your mobile experience, tailored to your brand' },
                { title: 'Lifetime Pro access', desc: 'Full access to Slydes Pro features, forever' },
                { title: 'Direct access to the founder', desc: 'Private Slack channel with James in the room every day' },
                { title: 'Featured in our showcase', desc: 'Your Slyde featured as an example of what\'s possible' },
                { title: 'Founding Partner status', desc: 'Recognition as one of the original 50 who built Slydes' },
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

          {/* Right - Application Card */}
          <motion.div 
            className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <p className="text-leader-blue text-sm font-medium mb-2">Founding Partner</p>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-5xl font-bold text-white">Free</span>
              </div>
              <p className="text-gray-500 text-sm">For selected partners</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{totalSpots - spotsRemaining} selected</span>
                <span className="text-white font-medium">{spotsRemaining} spots left</span>
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
              <Button size="lg" className="w-full">
                Apply to Partner
              </Button>
            </Link>

            {/* What we ask */}
            <div className="text-center mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <p className="text-gray-400 text-xs mb-2">What we ask in return:</p>
              <p className="text-gray-300 text-sm">Share your Slydes journey with your audience</p>
            </div>

            {/* Who we're looking for */}
            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex justify-center gap-4 text-gray-500 text-xs">
                <span>10k+ audience</span>
                <span>•</span>
                <span>Real business</span>
                <span>•</span>
                <span>Builder mindset</span>
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
          We review every application personally. <span className="text-white">Quality over quantity.</span>
        </motion.p>
        </div>
      </section>
    </AnimatedAurora>
  )
}
