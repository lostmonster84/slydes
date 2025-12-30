'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CheckIcon = () => (
  <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CrossIcon = () => (
  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-future-black mb-6">
                Simple pricing. <span className="gradient-text">No surprises.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-900 font-medium mb-4">
                Start free. Upgrade when you&apos;re ready.
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Slydes is currently in development. Pricing is set now so you know exactly what to expect when early access opens.
              </p>
              <p className="text-base text-gray-500 mt-4">
                No payment will be taken until the platform is live.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-4">
              {/* Free Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
              >
                <div className="inline-block px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full mb-4">
                  Try the format
                </div>
                <h2 className="text-2xl font-bold text-future-black mb-2">Free</h2>
                <p className="text-gray-600 mb-6">See how mobile attention behaves</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-future-black">£0</span>
                </div>

                <p className="text-gray-600 mb-8 text-sm">
                  Publish a real Slyde and experience the format firsthand.
                </p>

                <div className="space-y-4 mb-8">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Includes</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">1 published Slyde</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Full mobile experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Shareable public link</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Core creation tools</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">3 Momentum AI messages/day</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700 text-sm">Includes Slydes branding</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Does not include</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CrossIcon />
                      <span className="text-gray-500">Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CrossIcon />
                      <span className="text-gray-500">Multiple Slydes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CrossIcon />
                      <span className="text-gray-500">Brand customization</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Creator Tier - Most Popular (Dark Premium Style) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-future-black to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl relative"
              >
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-electric-cyan/20 rounded-full blur-3xl pointer-events-none" />

                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-electric-cyan text-future-black text-xs font-semibold rounded-full z-20">
                  Most Popular
                </div>

                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 text-xs font-semibold text-electric-cyan bg-electric-cyan/10 rounded-full mb-4">
                    For single businesses
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Creator</h2>
                  <p className="text-white/70 mb-6">For people who care about results</p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-electric-cyan">£25</span>
                    <span className="text-white/60">/ month</span>
                  </div>
                  <p className="text-sm text-white/50 mb-6">or £250/year (save 17%)</p>

                  <p className="text-white/70 mb-8 text-sm">
                    When Slydes becomes more than an experiment.
                  </p>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Everything in Free, plus</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Up to 10 published Slydes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">No Slydes watermark</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Brand customization</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <span className="text-white">Analytics:</span>
                          <ul className="text-white/60 text-sm mt-1 ml-1 space-y-1">
                            <li>• Views & swipe depth</li>
                            <li>• Completion rate</li>
                            <li>• CTA clicks</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Enquire & Book CTAs</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white">Lead notifications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pro Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
              >
                <div className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full mb-4">
                  For busy portfolios
                </div>
                <h2 className="text-2xl font-bold text-future-black mb-2">Pro</h2>
                <p className="text-gray-600 mb-6">More Slydes, deeper insights</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-future-black">£50</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">or £500/year (save 17%)</p>

                <p className="text-gray-600 mb-8 text-sm">
                  For businesses managing multiple locations or experiences.
                </p>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Everything in Creator, plus</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Up to 25 published Slydes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Custom domain</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Priority support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckIcon />
                      <div>
                        <span className="text-gray-700">Advanced analytics:</span>
                        <ul className="text-gray-600 text-sm mt-1 ml-1 space-y-1">
                          <li>• Frame-by-frame drop-off</li>
                          <li>• Traffic sources</li>
                          <li>• Enquiry tracking</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Unlimited Momentum AI</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Agency Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm"
              >
                <div className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full mb-4">
                  For large portfolios
                </div>
                <h2 className="text-2xl font-bold text-future-black mb-2">Agency</h2>
                <p className="text-gray-600 mb-6">No limits on your Slydes</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-future-black">£99</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">or £990/year (save 17%)</p>

                <p className="text-gray-600 mb-8 text-sm">
                  For agencies and businesses with 25+ experiences.
                </p>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Everything in Pro, plus</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700 font-semibold">Unlimited published Slydes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Scale without limits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Best value per Slyde</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Early Access CTA - Dark premium section per design system */}
        <section className="py-16 md:py-20 bg-future-black relative overflow-hidden">
          {/* Animated gradient glow */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-leader-blue rounded-full blur-[200px]"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Early access
              </h2>
              <p className="text-lg text-white/70 mb-4 max-w-xl mx-auto">
                Slydes will open early access in stages.
              </p>
              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                You can request access now. You will only be charged once the platform is live and you choose to upgrade.
              </p>

              <Link href="/#waitlist">
                <Button size="lg" className="!bg-white !text-future-black hover:!bg-white/90">
                  Request early access
                </Button>
              </Link>

              {/* Notes */}
              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70">No credit card required to request early access</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70">Viewing and sharing Slydes will always be free</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 text-electric-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70">Pricing will not change at launch</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Questions Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-future-black mb-6">
                Questions?
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                <strong>Curious?</strong> Start free and see how it works.
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <strong>Single business?</strong> Creator gives you everything you need.
              </p>
              <p className="text-lg text-gray-600 mb-2">
                <strong>Busy portfolio?</strong> Pro gives you room to grow.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                <strong>25+ experiences?</strong> Agency gives you unlimited.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#waitlist">
                  <Button size="lg">Request early access</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">Get in touch</Button>
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
