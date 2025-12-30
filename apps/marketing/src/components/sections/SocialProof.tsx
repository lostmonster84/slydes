'use client'

import { motion } from 'framer-motion'
import { AnimatedSpotlight } from '@/components/ui/BackgroundAnimations'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

export function SocialProof() {
  return (
    <AnimatedSpotlight position="right">
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Simple stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">&lt;5 min</div>
            <p className="text-gray-600">from idea to live</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">68%</div>
            <p className="text-gray-600">average completion rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">Frame-level</div>
            <p className="text-gray-600">drop-off analytics</p>
          </div>
        </motion.div>

        {/* Real example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
                Case Study
              </div>
              <h3 className="text-2xl font-bold mb-4">
                From static menus to <span className="gradient-text">booked tables</span>.
              </h3>
              <p className="text-gray-600 mb-6">
                The Kitchen Table replaced their clunky website with a Slyde and turned browsers into diners. The atmosphere sells itself.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Full-screen experience tours on mobile</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">One-tap reservations and enquiries</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Built and live the same day</span>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                <div className="text-base font-semibold text-gray-900 mb-3">
                  &ldquo;Guests see the vibe before they book. Our reservations went up 35% the first month.&rdquo;
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">The Kitchen Table</span> • Restaurant & Bar
                </div>
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="relative flex justify-center">
              <PhoneMockup variant="hospitality" />
            </div>
          </div>
        </motion.div>
        </div>
      </section>
    </AnimatedSpotlight>
  )
}
