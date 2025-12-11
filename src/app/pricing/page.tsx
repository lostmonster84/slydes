'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const spotsRemaining = 47

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-leader-blue font-semibold mb-4">Limited Time Offer</p>
              <h1 className="mb-4">Founding Member Pricing</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help us build the future of mobile-first business sites. 
                Get lifetime access at a fraction of the regular price.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Founding Member Card - Featured */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-future-black rounded-2xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-leader-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Founding Member</h3>
                <p className="text-gray-400 mb-6">Lifetime access, one-time payment</p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold">$299</span>
                  <span className="text-gray-400">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited Slydes</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All frame types</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Remove Slydes branding</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Roadmap input</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-leader-blue mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Founding member badge</span>
                  </li>
                </ul>

                <Link href="/founding-member">
                  <Button size="lg" className="w-full bg-white text-future-black hover:bg-gray-100">
                    Claim Your Spot
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-400">
                      {spotsRemaining}/50 spots remaining
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Regular Pricing Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-400">Regular Pricing</h3>
                <p className="text-gray-400 mb-6">After founding member spots are filled</p>
                
                <div className="space-y-6 mb-8">
                  {/* Free */}
                  <div className="pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-400">$0</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">Free tier: 1 Slyde, 10 frames, Slydes branding</p>
                  </div>

                  {/* Pro */}
                  <div className="pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-400">$29</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">Pro: Unlimited Slydes, custom domain, no branding</p>
                  </div>

                  {/* Agency */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-400">$99</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">Agency: Team access, white-label, client management</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">
                    Save money by becoming a founding member today.
                    <br />
                    <span className="font-medium text-gray-700">$299 one-time vs $348/year</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="mb-4">Frequently asked questions</h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  q: 'What does "lifetime" mean?',
                  a: 'Lifetime means as long as Slydes exists, you have Pro access. No monthly payments, ever.',
                },
                {
                  q: 'When will I get access?',
                  a: 'We\'re launching in January 2026. As a founding member, you\'ll get early access before the public launch.',
                },
                {
                  q: 'What if I\'m not satisfied?',
                  a: '30-day money-back guarantee. If Slydes isn\'t for you, we\'ll refund your purchase, no questions asked.',
                },
                {
                  q: 'Can I upgrade later?',
                  a: 'Founding member is our best deal. After the 50 spots are filled, you\'ll only be able to subscribe monthly.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
