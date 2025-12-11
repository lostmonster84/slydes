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

        {/* CTA Section - Be First - ALIVE WITH ENERGY */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-leader-blue via-purple-600 to-electric-cyan" />
          
          {/* Animated mesh overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Floating orbs for depth */}
          <motion.div 
            className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Founding Member Opportunity
              </motion.span>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Your industry isn&apos;t here yet.
                <br />
                <span className="text-white/90">That means </span>
                <span className="text-yellow-300">you could be first.</span>
              </h2>
              
              <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Founding members don&apos;t just get Slydes early—they shape how we serve their 
                market. <span className="text-white font-semibold">Be the showcase for your industry.</span>
              </p>
              
              <Link href="/founding-member">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="bg-white text-leader-blue hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-2xl">
                    Become a Founding Member →
                  </Button>
                </motion.div>
              </Link>
              
              {/* Social proof nudge */}
              <motion.p 
                className="mt-6 text-white/60 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Join 12 founding members already shaping Slydes
              </motion.p>
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
