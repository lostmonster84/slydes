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
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
              <div className="space-y-3 mb-8">
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

              {/* Quote */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                <div className="text-base font-semibold text-gray-900 mb-3">
                  &ldquo;Our customers love the TikTok-style browsing. Way better than our old mobile site.&rdquo;
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">WildTrax 4x4</span> • Highland vehicle rental company
                </div>
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="relative flex justify-center">
              {/* Phone frame */}
              <div className="relative w-[280px] h-[570px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="relative w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden">
                  {/* WildTrax mobile preview - Full-screen vertical layout */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                    {/* Hero vehicle image placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/20 text-6xl">🚙</div>
                      </div>
                    </div>
                    
                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <div className="mb-6">
                        <div className="text-xs text-white/60 mb-1 uppercase tracking-wide">Available Now</div>
                        <h4 className="text-xl font-bold mb-2">Land Rover Defender</h4>
                        <p className="text-sm text-white/80 mb-4">Perfect for Highland adventures. Full off-road capability.</p>
                        
                        {/* Quick stats */}
                        <div className="flex gap-4 text-xs mb-6">
                          <div>
                            <div className="text-white/60">Seats</div>
                            <div className="font-semibold">5</div>
                          </div>
                          <div>
                            <div className="text-white/60">Per Day</div>
                            <div className="font-semibold">£150</div>
                          </div>
                          <div>
                            <div className="text-white/60">Type</div>
                            <div className="font-semibold">4x4</div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full bg-white text-gray-900 rounded-full py-3 px-6 font-semibold text-sm">
                          Book Now
                        </button>
                      </div>

                      {/* Swipe indicator */}
                      <div className="flex justify-center items-center gap-2 pt-4 border-t border-white/10">
                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span className="text-xs text-white/60">Swipe for more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
