'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ExtremeTrailersDemo() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
                🇬🇧 DEMO - MADE IN BRITAIN
              </span>
              <h1 className="mb-4">
                Extreme Trailers <span className="gradient-text">x Slydes</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Boat trailers meet mobile-first. How Slydes transforms traditional manufacturing businesses.
              </p>
            </motion.div>

            {/* Main Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
                {/* Left - Content */}
                <div className="order-2 lg:order-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold uppercase tracking-wide">
                      Manufacturing
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      Southampton
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">Extreme Trailers</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    100 years of marine experience. Southampton's finest boat trailers. 
                    From PWC & Jet Skis to custom bespoke builds—hot-dipped galvanised, 
                    built to last forever.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">8 trailer types showcased vertically</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Video-ready product demos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Premium brand suppliers featured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Multiple CTAs for phone/email/parts</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href="https://www.extreme-trailers.co.uk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
                    >
                      Visit Extreme Trailers website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right - Phone Mockup with Preview */}
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />
                    
                    {/* Screen content - Scrollable preview */}
                    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden">
                      <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
                        {/* Slide 1 - Hero */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 relative">
                          <div className="absolute inset-0 bg-cyan-500/10" />
                          <div className="relative z-10 space-y-4">
                            <div className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-white inline-block">
                              MADE IN BRITAIN 🇬🇧
                            </div>
                            <h2 className="text-3xl font-bold text-white leading-tight">
                              EXTREME<br/>
                              <span className="text-cyan-400">TRAILERS</span>
                            </h2>
                            <p className="text-sm text-gray-300">
                              100 years of marine experience
                            </p>
                            <div className="space-y-2 pt-4">
                              <div className="px-4 py-2 bg-cyan-500 text-white text-xs font-bold rounded-full">
                                CALL NOW
                              </div>
                              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">
                                GET A QUOTE
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Slide 2 - PWC */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
                          <div className="space-y-3">
                            <div className="text-xs bg-cyan-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-cyan-400/30 text-cyan-300 inline-block">
                              BEST SELLER
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                              PWC & Jet Ski<br/>
                              <span className="text-cyan-400">Trailers</span>
                            </h3>
                            <p className="text-xs text-gray-300">
                              The EXT750 - Our most popular
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-3">
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2">
                                <div className="text-lg font-bold text-cyan-400">750kg</div>
                                <div className="text-[10px] text-gray-400">Capacity</div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2">
                                <div className="text-lg font-bold text-cyan-400">AL-KO</div>
                                <div className="text-[10px] text-gray-400">Premium</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Slide 3 - Roller */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-white">
                              Superior Roller<br/>
                              <span className="text-indigo-400">Design</span>
                            </h3>
                            <p className="text-xs text-gray-300">
                              Non-marking wobble rollers
                            </p>
                            <div className="flex gap-1 justify-center pt-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500" />
                              <div className="w-6 h-6 rounded-full bg-red-500" />
                              <div className="w-6 h-6 rounded-full bg-yellow-500" />
                              <div className="w-6 h-6 rounded-full bg-green-500" />
                            </div>
                          </div>
                        </div>

                        {/* Slide 4 - Manufacturing */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-amber-950 via-orange-900 to-slate-900">
                          <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-white">
                              Built to Last<br/>
                              <span className="text-yellow-400">Forever</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-2 pt-3">
                              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
                                <div className="text-xl">⚡</div>
                                <div className="text-[9px] text-white font-bold">CNC Laser</div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
                                <div className="text-xl">🔥</div>
                                <div className="text-[9px] text-white font-bold">Galvanised</div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
                                <div className="text-xl">🎯</div>
                                <div className="text-[9px] text-white font-bold">Custom</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Slide 5 - Range */}
                        <div className="h-full snap-start flex flex-col items-center justify-center px-4 py-6 bg-slate-900 overflow-auto">
                          <h3 className="text-xl font-bold text-white mb-4">
                            Complete<br/>
                            <span className="text-blue-400">Trailer Range</span>
                          </h3>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🌊</div>
                              <div className="text-[8px] text-white font-bold">PWC</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🔄</div>
                              <div className="text-[8px] text-white font-bold">Roller</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🛶</div>
                              <div className="text-[8px] text-white font-bold">Bunked</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🎈</div>
                              <div className="text-[8px] text-white font-bold">Inflatable</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">⚓</div>
                              <div className="text-[8px] text-white font-bold">Fixed</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🚀</div>
                              <div className="text-[8px] text-white font-bold">Launcher</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">✨</div>
                              <div className="text-[8px] text-white font-bold">Stainless</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-lg">🛠️</div>
                              <div className="text-[8px] text-white font-bold">Custom</div>
                            </div>
                          </div>
                        </div>

                        {/* Slide 6 - Brands */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-cyan-950 to-slate-900">
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white">
                              Trusted By<br/>
                              <span className="text-cyan-400">The Best</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-2 text-[8px] text-white/80">
                              <div className="bg-white/5 rounded p-1">Yamaha</div>
                              <div className="bg-white/5 rounded p-1">Zodiac</div>
                              <div className="bg-white/5 rounded p-1">Seadoo</div>
                              <div className="bg-white/5 rounded p-1">Highfield</div>
                              <div className="bg-white/5 rounded p-1">Jeanneau</div>
                              <div className="bg-white/5 rounded p-1">Excel</div>
                            </div>
                          </div>
                        </div>

                        {/* Slide 7 - CTA */}
                        <div className="h-full snap-start flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-cyan-600 via-blue-700 to-slate-900">
                          <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">
                              Ready to Get<br/>
                              <span className="text-cyan-300">On The Water?</span>
                            </h3>
                            <div className="space-y-2">
                              <div className="px-6 py-2 bg-white text-cyan-700 text-xs font-bold rounded-full">
                                📞 CALL NOW
                              </div>
                              <div className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">
                                ✉️ EMAIL US
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-300">
                              📍 Southampton, SO14 5AH
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Why This Works for Manufacturing</h2>
              <p className="text-gray-600">
                Traditional businesses, modern mobile experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="text-4xl mb-3">📱</div>
                <h4 className="font-bold mb-2">Product-First</h4>
                <p className="text-sm text-gray-600">
                  Each trailer type gets its own full-screen showcase. No scrolling past what matters.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="text-4xl mb-3">🎬</div>
                <h4 className="font-bold mb-2">Video-Ready</h4>
                <p className="text-sm text-gray-600">
                  Replace static placeholders with actual product demos, launch/recovery footage, customer testimonials.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="text-4xl mb-3">📞</div>
                <h4 className="font-bold mb-2">Action-Focused</h4>
                <p className="text-sm text-gray-600">
                  Multiple CTAs throughout: call, email, browse parts, get custom quotes. Every slide converts.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4">Your business could look this good</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Whether you're manufacturing, services, or retail—Slydes makes any business mobile-first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/founding-member">
                  <Button size="lg">
                    Become a Partner
                  </Button>
                </Link>
                <Link href="/showcase">
                  <Button variant="secondary" size="lg">
                    See More Examples
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}




