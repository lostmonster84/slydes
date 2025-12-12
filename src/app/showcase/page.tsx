'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Demo examples - showing what's possible with Slydes
const demoExamples = [
  {
    id: 'hospitality',
    title: 'Maison Lumière',
    label: 'Restaurant',
    variant: 'hospitality' as const,
    description: 'Video menus, chef recommendations, and instant table reservations.',
    color: 'from-amber-600 to-amber-800',
    isDemo: true,
  },
  {
    id: 'rentals',
    title: 'Villa Serenità',
    label: 'Vacation Rentals',
    variant: 'rentals' as const,
    description: 'Immersive property tours with direct booking integration.',
    color: 'from-emerald-600 to-emerald-800',
    isDemo: true,
  },
  {
    id: 'fitness',
    title: 'FORM Studio',
    label: 'Fitness',
    variant: 'fitness' as const,
    description: 'Class previews with live schedule and signups.',
    color: 'from-orange-600 to-orange-800',
    isDemo: true,
  },
  {
    id: 'automotive',
    title: 'Apex Motors',
    label: 'Car Hire',
    variant: 'automotive' as const,
    description: 'Premium video fleet showcase with reservations.',
    color: 'from-zinc-700 to-zinc-900',
    isDemo: true,
  },
]

// Real projects in development
const realProjects = [
  {
    id: 'wildtrax',
    title: 'WildTrax 4x4',
    label: 'Adventure Rentals',
    variant: 'wildtrax' as const,
    description: 'Land Rover Defender hire in the Scottish Highlands.',
    color: 'from-red-700 to-red-900',
    status: 'In Development',
    url: 'https://wildtrax.co.uk/m/camping',
  },
  {
    id: 'lunadomes',
    title: 'Luna Domes',
    label: 'Glamping',
    variant: 'lunadomes' as const,
    description: 'Luxury geodesic domes with private hot tubs in West Kent.',
    color: 'from-amber-700 to-rose-800',
    status: 'Coming Soon',
  },
  {
    id: 'extremetrailers',
    title: 'Extreme Trailers',
    label: 'Marine Equipment',
    variant: 'extremetrailers' as const,
    description: 'British-made boat and jet ski trailers.',
    color: 'from-cyan-700 to-blue-900',
    status: 'Coming Soon',
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
                See how real businesses use Slydes to turn mobile visitors into bookings and leads. Your industry can be next.
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
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  BETA
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leader-blue/10 text-leader-blue text-sm font-semibold">
                  Founder
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
                  <PhoneMockup variant="wildtrax" />
                </div>

                {/* Right - Content */}
                <div className="order-1 lg:order-2">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                      Rentals
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      +40% mobile bookings
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      Work in Progress
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">WildTrax 4x4</h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    WildTrax used Slydes to rebuild their mobile experience and increase bookings from phone visitors. 
                    Full-screen video backgrounds, instant booking CTAs, and a seamless swipe-to-explore interface.
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
                    View live Slyde (Beta)
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
        <section className="py-24 relative overflow-hidden bg-future-black">
          {/* Subtle blue glow - NOT a gradient, just atmospheric */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-leader-blue/20 rounded-full blur-[120px]" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leader-blue/20 text-white text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-electric-cyan rounded-full animate-pulse" />
                Founder Opportunity
              </span>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your industry isn&apos;t here yet.
                <br />
                <span className="text-electric-cyan">That means you could be first.</span>
              </h2>
              
              <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Founders do not just get Slydes early. They shape how we serve their market and become the showcase for their industry.
              </p>
              
              <Link href="/founding-member">
                <Button size="lg" className="animate-pulse-glow">
                  Become a Founder
                </Button>
              </Link>
              
              <p className="mt-8 text-gray-500 text-sm">
                Join 12 founding members already shaping Slydes
              </p>
            </motion.div>
          </div>
        </section>

        {/* Real Projects Section */}
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
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  🚀 Real Projects
                </span>
              </div>
              <h2 className="mb-4">Projects we&apos;re building</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real businesses using Slydes. These are actual client projects 
                currently in development.
              </p>
            </motion.div>

            {/* Real Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {realProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-green-300 hover:shadow-md transition-all"
                >
                  {/* Mini Phone Preview */}
                  <div className="p-4 flex justify-center bg-gradient-to-b from-gray-100 to-gray-50">
                    <div className="relative w-[100px] h-[180px] bg-gray-900 rounded-[1.5rem] p-1.5 shadow-lg transform group-hover:scale-105 transition-transform">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-900 rounded-b-lg z-10" />
                      <div className={`relative w-full h-full bg-gradient-to-b ${project.color} rounded-[1.25rem] overflow-hidden`}>
                        <div className="h-full w-full flex flex-col items-center justify-center p-2">
                          <span className="text-white text-[10px] font-bold text-center leading-tight">{project.title}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {project.label}
                      </span>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Examples Section */}
        <section className="py-16 bg-gray-50">
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
                  💡 Demo Examples
                </span>
              </div>
              <h2 className="mb-4">What&apos;s possible with Slydes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These demos show what Slydes can do for different industries. 
                <strong> Your industry can be next.</strong>
              </p>
            </motion.div>

            {/* Demo Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {demoExamples.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-amber-300 hover:shadow-md transition-all"
                >
                  {/* Mini Phone Preview */}
                  <div className="p-4 flex justify-center bg-gradient-to-b from-gray-100 to-gray-50">
                    <div className="relative w-[100px] h-[180px] bg-gray-900 rounded-[1.5rem] p-1.5 shadow-lg transform group-hover:scale-105 transition-transform">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-900 rounded-b-lg z-10" />
                      <div className={`relative w-full h-full bg-gradient-to-b ${demo.color} rounded-[1.25rem] overflow-hidden`}>
                        <div className="h-full w-full flex flex-col items-center justify-center p-2">
                          <span className="text-white text-[10px] font-bold text-center leading-tight">{demo.title}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {demo.label}
                      </span>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Demo
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{demo.title}</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">{demo.description}</p>
                  </div>
                </motion.div>
              ))}

              {/* YOUR BUSINESS CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-b from-leader-blue to-blue-700 rounded-2xl border border-leader-blue overflow-hidden hover:shadow-lg hover:shadow-leader-blue/25 transition-all cursor-pointer"
              >
                <Link href="/founding-member" className="block h-full">
                  {/* Mini Phone Preview */}
                  <div className="p-4 flex justify-center bg-gradient-to-b from-blue-600/50 to-transparent">
                    <div className="relative w-[100px] h-[180px] bg-white/10 backdrop-blur rounded-[1.5rem] p-1.5 shadow-lg transform group-hover:scale-105 transition-transform border-2 border-dashed border-white/40">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/20 rounded-b-lg z-10" />
                      <div className="relative w-full h-full bg-white/5 rounded-[1.25rem] overflow-hidden flex flex-col items-center justify-center">
                        <span className="text-white/90 text-[10px] font-bold text-center leading-tight">Your<br />Business</span>
                        <div className="mt-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/30 rounded-full" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                        Your Industry
                      </span>
                      <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">
                        Join
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-white">This could be you</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Be the first in your industry. Shape how Slydes serves your market.</p>
                  </div>
                </Link>
              </motion.div>
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
                    Become a Founder
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
