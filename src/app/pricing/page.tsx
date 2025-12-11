'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const genesisRemaining = 47
  const genesisTotalSpots = 50

  const tiers = [
    {
      name: 'Genesis Founder',
      price: '£499',
      priceAlt: '€599 / $629',
      spots: genesisTotalSpots,
      remaining: genesisRemaining,
      revenueShare: '25%',
      status: 'active',
      highlight: true,
      features: [
        { name: 'Direct access to James (daily Slack)', included: true, exclusive: true },
        { name: 'Personal onboarding call', included: true, exclusive: true },
        { name: 'Monthly founder calls', included: true, exclusive: true },
        { name: '"Built by" page (name + photo)', included: true, exclusive: true },
        { name: 'Invited to founder events', included: true, exclusive: true },
        { name: '25% revenue share forever', included: true },
        { name: 'Lifetime Pro access', included: true },
        { name: 'First access to everything', included: true },
        { name: 'Launch spotlight (featured)', included: true },
        { name: 'Private founders channel', included: true },
        { name: '30-day guarantee', included: true },
      ],
    },
    {
      name: 'Founding Member',
      price: '£999',
      priceAlt: '€1,149 / $1,249',
      spots: 75,
      remaining: 75,
      revenueShare: '20%',
      status: 'upcoming',
      highlight: false,
      features: [
        { name: 'Direct access to James', included: false },
        { name: 'Personal onboarding call', included: false },
        { name: 'Quarterly founder calls', included: true },
        { name: '"Built by" page (name only)', included: true },
        { name: 'Invited to founder events', included: false },
        { name: '20% revenue share forever', included: true },
        { name: 'Lifetime Pro access', included: true },
        { name: 'Second wave access', included: true },
        { name: 'Launch spotlight (mentioned)', included: true },
        { name: 'Private founders channel', included: true },
        { name: '30-day guarantee', included: true },
      ],
    },
    {
      name: 'Charter Member',
      price: '£1,499',
      priceAlt: '€1,749 / $1,899',
      spots: 100,
      remaining: 100,
      revenueShare: '15%',
      status: 'upcoming',
      highlight: false,
      features: [
        { name: 'Direct access to James', included: false },
        { name: 'Personal onboarding call', included: false },
        { name: 'Founder calls', included: false },
        { name: '"Built by" page', included: false },
        { name: 'Invited to founder events', included: false },
        { name: '15% revenue share forever', included: true },
        { name: 'Lifetime Pro access', included: true },
        { name: 'Third wave access', included: true },
        { name: 'Video onboarding guide', included: true },
        { name: 'Private founders channel', included: true },
        { name: '30-day guarantee', included: true },
      ],
    },
  ]

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-white via-blue-50/30 to-white min-h-screen">
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-leader-blue rounded-full animate-pulse" />
                Early bird pricing — Price goes UP as tiers sell out
              </span>
              <h1 className="mb-4">Founding Member Pricing</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three tiers. Released in stages. Early = cheapest. Early = most access.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl p-6 ${
                    tier.highlight 
                      ? 'bg-white border-2 border-leader-blue shadow-lg' 
                      : 'bg-gray-50 border border-gray-200'
                  } ${tier.status === 'upcoming' ? 'opacity-75' : ''}`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-leader-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                        AVAILABLE NOW
                      </span>
                    </div>
                  )}
                  
                  {tier.status === 'upcoming' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gray-300 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                        COMING SOON
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6 pt-2">
                    <h3 className={`text-xl font-semibold mb-2 ${tier.highlight ? 'text-leader-blue' : 'text-gray-900'}`}>
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-gray-500">one-time</span>
                    </div>
                    <p className="text-gray-500 text-sm">{tier.priceAlt}</p>
                    <p className={`text-sm mt-2 font-medium ${tier.highlight ? 'text-leader-blue' : 'text-gray-600'}`}>
                      {tier.revenueShare} revenue share
                    </p>
                  </div>

                  {/* Spots indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{tier.spots - tier.remaining} claimed</span>
                      <span className={tier.highlight ? 'text-leader-blue font-medium' : 'text-gray-500'}>{tier.remaining} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${tier.highlight ? 'bg-leader-blue' : 'bg-gray-400'}`}
                        style={{ width: `${((tier.spots - tier.remaining) / tier.spots) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start text-sm">
                        {feature.included ? (
                          <svg className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${feature.exclusive ? 'text-leader-blue' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={feature.included ? (feature.exclusive ? 'text-gray-900 font-medium' : 'text-gray-700') : 'text-gray-400'}>
                          {feature.name}
                          {feature.exclusive && <span className="text-xs text-leader-blue ml-1">✦</span>}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {tier.status === 'active' ? (
                    <Link href="/founding-member">
                      <Button size="lg" className="w-full">
                        Claim Genesis Spot
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
                      disabled
                    >
                      Opens when {index === 1 ? 'Genesis' : 'Founding'} sells out
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Total Raise */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
            >
              <p className="text-gray-500 text-sm mb-2">Total founding member spots</p>
              <p className="text-3xl font-bold mb-1">225 founders</p>
              <p className="text-gray-500 text-sm">After all tiers sell out, lifetime access is gone forever.</p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
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

            <div className="space-y-4">
              {[
                {
                  q: 'What does "lifetime" mean?',
                  a: 'Lifetime means as long as Slydes exists, you have Pro access. No monthly payments, ever.',
                },
                {
                  q: 'When will I get access?',
                  a: 'Genesis founders get early access first, before anyone else. We\'re targeting January 2026 for early access.',
                },
                {
                  q: 'How does revenue share work?',
                  a: 'You get a unique referral link. Anyone who signs up through your link and pays - you get your percentage of their subscription, forever. Genesis gets 25%, Founding gets 20%, Charter gets 15%.',
                },
                {
                  q: 'What if I\'m not satisfied?',
                  a: '30-day money-back guarantee. Full refund, no questions asked.',
                },
                {
                  q: 'Can I upgrade from Charter to Genesis?',
                  a: 'No. Genesis is first-come, first-served. Once it\'s gone, it\'s gone forever. The perks don\'t come back.',
                },
                {
                  q: 'What\'s the difference between tiers?',
                  a: 'Genesis is the inner circle - direct access to James, launch party invites, weekly calls, highest revenue share. Later tiers get less access and lower revenue share, but still lifetime Pro.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
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

        {/* Bottom CTA */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-leader-blue font-medium mb-4">Genesis is open now</p>
              <h2 className="mb-6">Ready to join the inner circle?</h2>
              <Link href="/founding-member">
                <Button size="lg">
                  Become a Genesis Founder — £499
                </Button>
              </Link>
              <p className="text-gray-500 text-sm mt-4">
                Only {genesisRemaining} of {genesisTotalSpots} spots remaining
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
