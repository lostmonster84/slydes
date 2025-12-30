'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Demo businesses - Experience-first focus
const demos = [
  // Restaurants & Bars
  {
    id: 'restaurant',
    name: 'The Kitchen Table',
    variant: 'hospitality' as const,
    industry: 'Restaurants & Bars',
    location: 'Edinburgh, UK',
    description: 'Show the atmosphere, the food, the cocktails. Make them hungry before they book. One link that turns browsers into reservations.',
    color: 'from-amber-600 to-orange-700',
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    features: ['Video menu tours', 'Instant reservations', 'One link for Instagram bio + QR'],
    status: 'demo',
  },
  // Hotels & Stays
  {
    id: 'hospitality',
    name: 'Highland Retreat',
    variant: 'hospitality' as const,
    industry: 'Hotels & Stays',
    location: 'Scottish Highlands',
    description: 'Guests don\'t scroll galleries. They swipe stories. Show the feeling, the rooms, and the experience — then book direct.',
    color: 'from-emerald-600 to-emerald-800',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    features: ['Experience-first tours', 'Room & amenity highlights', 'Book direct CTA'],
    status: 'demo',
  },
  // Venues & Events
  {
    id: 'venue',
    name: 'The Grand Hall',
    variant: 'events' as const,
    industry: 'Venues & Events',
    location: 'London, UK',
    description: 'Weddings, parties, conferences — show the space in motion. Let them picture their event before they enquire.',
    color: 'from-purple-600 to-purple-800',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    features: ['Cinematic venue tours', 'Event space highlights', 'Instant enquiry forms'],
    status: 'demo',
  },
  // Adventures & Tours - LIVE
  {
    id: 'wildtrax',
    name: 'WildTrax 4x4',
    variant: 'wildtrax' as const,
    industry: 'Adventures & Tours',
    location: 'Scottish Highlands',
    description: 'Highland adventures transformed into a mobile-first experience. Land Rover Defenders, roof tents, NC500 adventures.',
    color: 'from-red-600 to-red-800',
    bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
    features: ['Action-packed previews', 'Tour & activity highlights', 'Book the adventure'],
    website: 'https://wildtrax.co.uk',
    status: 'live',
  },
]

// Future verticals (kept for /automotive, /fitness, etc.)
// const futureExamples = [
//   { id: 'automotive', name: 'Apex Motors', variant: 'automotive' as const, industry: 'Exotic Car Rentals', ... },
//   { id: 'fitness', name: 'FORM Studio', variant: 'fitness' as const, industry: 'Boutique Fitness', ... },
//   { id: 'experiences', name: 'Azure Charters', variant: 'experiences' as const, industry: 'Yacht Charters', ... },
//   { id: 'wellness', name: 'Velvet Spa', variant: 'wellness' as const, industry: 'Luxury Wellness', ... },
//   { id: 'events', name: 'The Glass House', variant: 'events' as const, industry: 'Event Venues', ... },
// ]

export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState('restaurant')
  
  const currentDemo = demos.find(d => d.id === activeDemo) || demos[0]

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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                INTERACTIVE EXAMPLES
              </span>
              <h1 className="mb-4">
                See Slydes <span className="gradient-text">in action</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Restaurants. Hotels. Venues. Adventures. See what YOUR experience could look like.
                <br />
                <span className="text-leader-blue font-semibold">Swipe, scroll, book.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Industry Tabs */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${activeDemo === demo.id
                      ? 'bg-future-black text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }
                  `}
                >
                  {demo.name}
                  {demo.status === 'live' && (
                    <span className="ml-2 w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Demo Showcase */}
        <section className={`py-20 transition-colors duration-500 ${currentDemo.bgColor}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Phone Mockup with REAL video */}
              <div className="flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <PhoneMockup variant={currentDemo.variant} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right - Details */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                      {currentDemo.status === 'live' ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                          TEMPLATE
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{currentDemo.industry}</span>
                    </div>

                    {/* Title & Location */}
                    <div>
                      <h2 className="text-4xl font-bold mb-2">{currentDemo.name}</h2>
                      <p className="text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {currentDemo.location}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {currentDemo.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3">
                      {currentDemo.features.map((feature, i) => (
                        <motion.li 
                          key={feature}
                          className="flex items-center text-gray-700"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                        >
                          <svg className="w-5 h-5 text-leader-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="pt-4 space-y-4">
                      {currentDemo.website && (
                        <a 
                          href={currentDemo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-leader-blue hover:text-blue-700 font-semibold transition-colors"
                        >
                          View live site
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes This Different */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="mb-4">What you're looking at</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                WildTrax is live. The rest are templates showing real Slydes technology applied to experience-first businesses.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-leader-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Real Video</h3>
                <p className="text-gray-600">
                  Auto-playing video backgrounds that capture attention and create emotion. No static images.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-leader-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">TikTok-Style UX</h3>
                <p className="text-gray-600">
                  Vertical scrolling, swipe navigation, and social-style interactions your customers already know.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-leader-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Conversion</h3>
                <p className="text-gray-600">
                  Every slyde has a purpose. CTAs, booking buttons, and contact options designed to convert.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-future-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-leader-blue/20 rounded-full blur-[120px]" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/20 text-white text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Founder Spots Available
              </span>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your business could look
                <br />
                <span className="text-cyan-400">this good</span>
              </h2>
              
              <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Founders get priority access, input on features, and lifetime pricing. 
                Limited spots available.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/founding-member">
                  <Button size="lg" className="animate-pulse-glow">
                    Become a Partner
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-gray-500 text-sm">
                Join 12 Founding Partners already earning with Slydes
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
