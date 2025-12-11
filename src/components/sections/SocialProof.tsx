'use client'

import { motion } from 'framer-motion'

export function SocialProof() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Simple stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10min</div>
            <p className="text-gray-600">Average build time</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">3x</div>
            <p className="text-gray-600">Higher engagement vs traditional sites</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">50+</div>
            <p className="text-gray-600">Founding members</p>
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
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-sm text-leader-blue font-semibold mb-4 uppercase tracking-wide">
                Case Study
              </div>
              <h3 className="text-2xl font-bold mb-4">
                WildTrax built their mobile experience in <span className="gradient-text">under an hour</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Instead of spending months on a custom mobile app, WildTrax used Slydes to create an immersive vehicle showcase that works on every phone.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Full-screen video vehicle tours</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">One-tap booking and inquiries</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Built and live same day</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-200">
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">WildTrax 4x4</div>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                "Our customers love the TikTok-style browsing. Way better than our old mobile site."
              </div>
              <div className="text-sm text-gray-600">
                Highland vehicle rental company
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
