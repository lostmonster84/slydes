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
                Pricing
              </h1>
              <p className="text-xl md:text-2xl text-gray-900 font-medium mb-4">
                Simple pricing. No surprises.
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
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Free Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm"
              >
                <div className="inline-block px-3 py-1 text-xs font-semibold text-leader-blue bg-blue-50 rounded-full mb-4">
                  Launching with
                </div>
                <h2 className="text-2xl font-bold text-future-black mb-2">Free</h2>
                <p className="text-gray-600 mb-6">Try the format</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-future-black">£0</span>
                </div>

                <p className="text-gray-600 mb-8">
                  The free plan lets you publish a real Slyde and experience how mobile attention behaves.
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
                      <span className="text-gray-700">Slydes watermark</span>
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
                      <span className="text-gray-500">Advanced media limits</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Creator Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 md:p-10 border-2 border-leader-blue shadow-lg relative"
              >
                <div className="inline-block px-3 py-1 text-xs font-semibold text-leader-blue bg-blue-50 rounded-full mb-4">
                  Launching with
                </div>
                <h2 className="text-2xl font-bold text-future-black mb-2">Creator</h2>
                <p className="text-gray-600 mb-6">For people who care about results</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-leader-blue">£25</span>
                  <span className="text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">or £250/year (save 17%)</p>

                <p className="text-gray-600 mb-8">
                  When Slydes becomes more than an experiment.
                </p>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Includes</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Up to 10 published Slydes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">No Slydes watermark</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Increased video and media limits</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckIcon />
                      <div>
                        <span className="text-gray-700">Basic analytics:</span>
                        <ul className="text-gray-600 text-sm mt-1 ml-1 space-y-1">
                          <li>• views</li>
                          <li>• swipe depth</li>
                          <li>• completion rate</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">Faster publishing workflows</span>
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
                If you&apos;re curious, start with early access.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                If attention matters, Creator will be the right plan.
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
