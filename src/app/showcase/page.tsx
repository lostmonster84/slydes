'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Coming soon industries - match IndustrySelector from home page
const comingSoonIndustries = [
  {
    id: 'hospitality',
    title: 'Maison Lumière',
    label: 'Hospitality',
    variant: 'hospitality' as const,
    description: 'Video menus, chef recommendations, and instant table reservations.',
    color: 'from-amber-600 to-amber-800',
  },
  {
    id: 'experiences',
    title: 'Azure Charters',
    label: 'Experiences',
    variant: 'experiences' as const,
    description: 'Cinematic adventure showcases with instant booking.',
    color: 'from-sky-600 to-sky-800',
  },
  {
    id: 'wellness',
    title: 'Velvet Spa',
    label: 'Wellness',
    variant: 'wellness' as const,
    description: 'Luxury treatment showcases with online booking.',
    color: 'from-purple-600 to-purple-800',
  },
  {
    id: 'realestate',
    title: 'Prestige Estates',
    label: 'Real Estate',
    variant: 'realestate' as const,
    description: 'Video property tours with instant scheduling.',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'events',
    title: 'The Glass House',
    label: 'Events',
    variant: 'events' as const,
    description: 'Venue showcases with availability and quotes.',
    color: 'from-rose-600 to-rose-800',
  },
  {
    id: 'fitness',
    title: 'FORM Studio',
    label: 'Fitness',
    variant: 'fitness' as const,
    description: 'Class previews with live schedule and signups.',
    color: 'from-orange-600 to-orange-800',
  },
  {
    id: 'automotive',
    title: 'Apex Motors',
    label: 'Automotive',
    variant: 'automotive' as const,
    description: 'Premium video fleet showcase with reservations.',
    color: 'from-zinc-700 to-zinc-900',
  },
]

export default function ShowcasePage() {
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
              <h1 className="mb-4">
                See Slydes <span className="gradient-text">in action</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real businesses transforming their mobile presence. Your industry could be next.
              </p>
            </motion.div>
          </div>
        </section>

        {/* LIVE NOW Section - WildTrax Featured */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  LIVE NOW
                </span>
              </div>
              <h2 className="text-2xl font-bold">Featured Showcase</h2>
            </motion.div>

            {/* Featured WildTrax Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
                {/* Left - Phone Mockup */}
                <div className="flex justify-center order-2 lg:order-1">
                  <PhoneMockup variant="rentals" />
                </div>

                {/* Right - Content */}
                <div className="order-1 lg:order-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                      Rentals
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      +40% mobile bookings
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">WildTrax 4x4</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Highland vehicle rentals and guided tours transformed their mobile experience. 
                    Full-screen video backgrounds, instant booking CTAs, and a seamless 
                    swipe-to-explore interface.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Full-screen vehicle showcase videos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">TikTok-style vertical scrolling</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-leader-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Built and live in one day</span>
                    </div>
                  </div>

                  <a 
                    href="https://wildtrax.co.uk/m/camping" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-leader-blue hover:text-blue-700 font-semibold transition-colors"
                  >
                    View live Slyde
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Be First */}
        <section className="py-20 bg-gradient-to-br from-future-black via-gray-900 to-future-black">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/20 text-electric-cyan text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                Founding Member Opportunity
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your industry isn&apos;t here yet.
                <br />
                <span className="gradient-text">That means you could be first.</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Founding members don&apos;t just get Slydes early—they shape how we serve their 
                market. Be the showcase for your industry.
              </p>
              
              <Link href="/founding-member">
                <Button size="lg" className="animate-pulse-glow">
                  Become a Founding Member
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                  🚀 COMING SOON
                </span>
              </div>
              <h2 className="mb-4">Industries we&apos;re building for</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These industries are next on our roadmap. Founding members in these 
                spaces will shape how Slydes serves their market.
              </p>
            </motion.div>

            {/* Industry Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comingSoonIndustries.map((industry, index) => (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-leader-blue/30 hover:shadow-md transition-all"
                >
                  {/* Mini Phone Preview */}
                  <div className="p-4 flex justify-center bg-gradient-to-b from-gray-100 to-gray-50">
                    <div className="relative w-[100px] h-[180px] bg-gray-900 rounded-[1.5rem] p-1.5 shadow-lg transform group-hover:scale-105 transition-transform">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-900 rounded-b-lg z-10" />
                      <div className={`relative w-full h-full bg-gradient-to-b ${industry.color} rounded-[1.25rem] overflow-hidden`}>
                        <div className="h-full w-full flex flex-col items-center justify-center p-2">
                          <span className="text-white text-[10px] font-bold text-center leading-tight">{industry.title}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {industry.label}
                      </span>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{industry.title}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{industry.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4">Ready to transform your mobile presence?</h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Join our founding members and create mobile experiences that 
                customers actually use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/founding-member">
                  <Button size="lg">
                    Become a Founding Member
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
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
