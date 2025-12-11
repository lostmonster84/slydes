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
      badge: '🥇',
      highlight: true,
      features: [
        { name: 'Direct access to James', included: true, exclusive: true },
        { name: 'Launch party + team events', included: true, exclusive: true },
        { name: 'Weekly founder calls', included: true, exclusive: true },
        { name: '"Built by" page (name + photo)', included: true, exclusive: true },
        { name: '1-on-1 onboarding with James', included: true, exclusive: true },
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
      badge: '🥈',
      highlight: false,
      features: [
        { name: 'Direct access to James', included: false },
        { name: 'Launch party + team events', included: false },
        { name: 'Monthly founder calls', included: true },
        { name: '"Built by" page (name only)', included: true },
        { name: '1-on-1 onboarding with team', included: true },
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
      badge: '🥉',
      highlight: false,
      features: [
        { name: 'Direct access to James', included: false },
        { name: 'Launch party + team events', included: false },
        { name: 'Quarterly founder calls', included: true },
        { name: '"Built by" page', included: false },
        { name: 'Video onboarding guide', included: true },
        { name: '15% revenue share forever', included: true },
        { name: 'Lifetime Pro access', included: true },
        { name: 'Third wave access', included: true },
        { name: 'Launch spotlight', included: false },
        { name: 'Private founders channel', included: true },
        { name: '30-day guarantee', included: true },
      ],
    },
  ]

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-future-black via-gray-900 to-future-black min-h-screen">
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Early bird pricing — Price goes UP as tiers sell out
              </div>
              <h1 className="text-white mb-4">Founding Member Pricing</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
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
                      ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-amber-500/50' 
                      : 'bg-gray-800/30 border border-gray-700/50'
                  } ${tier.status === 'upcoming' ? 'opacity-75' : ''}`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                        AVAILABLE NOW
                      </span>
                    </div>
                  )}
                  
                  {tier.status === 'upcoming' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                        COMING SOON
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6 pt-2">
                    <span className="text-2xl mb-2 block">{tier.badge}</span>
                    <h3 className={`text-xl font-semibold mb-2 ${tier.highlight ? 'text-amber-400' : 'text-white'}`}>
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-500">one-time</span>
                    </div>
                    <p className="text-gray-500 text-sm">{tier.priceAlt}</p>
                    <p className={`text-sm mt-2 ${tier.highlight ? 'text-amber-400' : 'text-leader-blue'}`}>
                      {tier.revenueShare} revenue share
                    </p>
                  </div>

                  {/* Spots indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{tier.spots - tier.remaining} claimed</span>
                      <span className={tier.highlight ? 'text-amber-400' : 'text-gray-400'}>{tier.remaining} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${tier.highlight ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gray-600'}`}
                        style={{ width: `${((tier.spots - tier.remaining) / tier.spots) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start text-sm">
                        {feature.included ? (
                          <svg className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${feature.exclusive ? 'text-amber-400' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={feature.included ? (feature.exclusive ? 'text-amber-400' : 'text-gray-300') : 'text-gray-600'}>
                          {feature.name}
                          {feature.exclusive && <span className="text-xs text-amber-500/70 ml-1">✦</span>}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {tier.status === 'active' ? (
                    <Link href="/founding-member">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
                      >
                        Claim Genesis Spot
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full bg-gray-700 text-gray-400 cursor-not-allowed"
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
              className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30"
            >
              <p className="text-gray-500 text-sm mb-2">Total founding member spots</p>
              <p className="text-3xl font-bold text-white mb-1">225 founders</p>
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
              <h2 className="text-white mb-4">Frequently asked questions</h2>
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
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="font-semibold mb-2 text-white">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
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
              <p className="text-amber-400 font-medium mb-4">Genesis is open now</p>
              <h2 className="text-white mb-6">Ready to join the inner circle?</h2>
              <Link href="/founding-member">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold">
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
