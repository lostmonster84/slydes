'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ============================================
// INDUSTRY TEMPLATE DEFINITIONS
// ============================================

interface Slyde {
  type: string
  icon: string
  title: string
  subtitle: string
  ctaText?: string
  gradient: string
}

interface IndustryTemplate {
  id: string
  name: string
  icon: string
  description: string
  color: string
  slydes: Slyde[]
}

const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Fine dining, casual eateries, cafés',
    color: 'from-orange-600 to-red-700',
    slydes: [
      { type: 'Hero', icon: '🎬', title: 'La Maison', subtitle: 'French cuisine, Edinburgh', gradient: 'from-amber-900 to-black' },
      { type: 'About', icon: '📖', title: 'Our Story', subtitle: 'Family recipes, modern twist. Locally sourced.', gradient: 'from-stone-800 to-black' },
      { type: 'Showcase', icon: '✨', title: 'Signature Dishes', subtitle: 'Tasting menu • 7 courses', gradient: 'from-red-900 to-black' },
      { type: 'Reviews', icon: '⭐', title: '4.9 Stars', subtitle: '"Best meal in Edinburgh" — TimeOut', gradient: 'from-yellow-900 to-black' },
      { type: 'Location', icon: '📍', title: 'Old Town', subtitle: 'Royal Mile • Private parking', gradient: 'from-blue-900 to-black' },
      { type: 'CTA', icon: '🎯', title: 'Reserve Your Table', subtitle: 'From £85pp • Dress code: Smart', ctaText: 'Book Now', gradient: 'from-red-800 to-black' },
    ],
  },
  {
    id: 'hotel',
    name: 'Hotel / Rental',
    icon: '🏨',
    description: 'Hotels, B&Bs, vacation rentals',
    color: 'from-blue-600 to-indigo-700',
    slydes: [
      { type: 'Hero', icon: '🎬', title: 'Highland Lodge', subtitle: 'Luxury in the wilderness', gradient: 'from-emerald-900 to-black' },
      { type: 'About', icon: '📖', title: 'Escape the City', subtitle: 'Hot tub • Log fire • Mountain views', gradient: 'from-slate-800 to-black' },
      { type: 'Showcase', icon: '✨', title: 'The Suite', subtitle: 'King bed • Panoramic windows', gradient: 'from-amber-900 to-black' },
      { type: 'Reviews', icon: '⭐', title: '312 Reviews', subtitle: '"Magical experience" — Sarah M.', gradient: 'from-yellow-900 to-black' },
      { type: 'Location', icon: '📍', title: 'Cairngorms', subtitle: '1 hour from Inverness • Ski nearby', gradient: 'from-teal-900 to-black' },
      { type: 'CTA', icon: '🎯', title: 'Your Escape Awaits', subtitle: 'From £195/night • Free cancellation', ctaText: 'Check Availability', gradient: 'from-blue-900 to-black' },
    ],
  },
  {
    id: 'vehicle',
    name: 'Vehicle Rental',
    icon: '🚗',
    description: '4x4s, campervans, luxury cars',
    color: 'from-green-600 to-emerald-700',
    slydes: [
      { type: 'Hero', icon: '🎬', title: 'WildTrax 4x4', subtitle: 'Scottish Highlands', gradient: 'from-stone-800 to-black' },
      { type: 'About', icon: '📖', title: 'The Experience', subtitle: 'Wake up anywhere. Cook under stars.', gradient: 'from-amber-900 to-black' },
      { type: 'Showcase', icon: '✨', title: 'Land Rover Defender', subtitle: 'Roof tent • Full kit • Ready for anything', gradient: 'from-green-900 to-black' },
      { type: 'Reviews', icon: '⭐', title: '209 Reviews', subtitle: '"Best adventure ever!" — James K.', gradient: 'from-yellow-900 to-black' },
      { type: 'Location', icon: '📍', title: 'Pickup: Glasgow', subtitle: 'Airport collection available', gradient: 'from-blue-900 to-black' },
      { type: 'CTA', icon: '🎯', title: 'Start Your Adventure', subtitle: 'From £149/night • Unlimited miles', ctaText: 'Book Now', gradient: 'from-red-900 to-black' },
    ],
  },
  {
    id: 'salon',
    name: 'Salon / Spa',
    icon: '💆',
    description: 'Hair salons, spas, wellness centers',
    color: 'from-pink-600 to-rose-700',
    slydes: [
      { type: 'Hero', icon: '🎬', title: 'Glow Studio', subtitle: 'Hair • Nails • Beauty', gradient: 'from-pink-900 to-black' },
      { type: 'About', icon: '📖', title: 'Your Sanctuary', subtitle: 'Award-winning stylists. Premium products.', gradient: 'from-rose-900 to-black' },
      { type: 'Showcase', icon: '✨', title: 'Signature Treatments', subtitle: 'Balayage • Extensions • Facials', gradient: 'from-purple-900 to-black' },
      { type: 'Reviews', icon: '⭐', title: '4.8 Stars', subtitle: '"Finally found my salon!" — Emma L.', gradient: 'from-yellow-900 to-black' },
      { type: 'Location', icon: '📍', title: 'West End', subtitle: 'Free parking • Late appointments', gradient: 'from-indigo-900 to-black' },
      { type: 'CTA', icon: '🎯', title: 'Treat Yourself', subtitle: 'New clients: 20% off first visit', ctaText: 'Book Appointment', gradient: 'from-pink-800 to-black' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness Studio',
    icon: '💪',
    description: 'Gyms, yoga studios, personal training',
    color: 'from-red-600 to-orange-700',
    slydes: [
      { type: 'Hero', icon: '🎬', title: 'FORGE', subtitle: 'Strength • Conditioning', gradient: 'from-red-900 to-black' },
      { type: 'About', icon: '📖', title: 'Transform', subtitle: 'Expert coaches. Real results. Community.', gradient: 'from-stone-800 to-black' },
      { type: 'Showcase', icon: '✨', title: 'Our Space', subtitle: 'Olympic lifting • Recovery zone • Classes', gradient: 'from-zinc-800 to-black' },
      { type: 'Reviews', icon: '⭐', title: '156 Members', subtitle: '"Changed my life" — Mike T.', gradient: 'from-yellow-900 to-black' },
      { type: 'Location', icon: '📍', title: 'City Centre', subtitle: '24/7 access • Showers • Lockers', gradient: 'from-blue-900 to-black' },
      { type: 'CTA', icon: '🎯', title: 'Start Your Journey', subtitle: 'First week free • No contract', ctaText: 'Get Started', gradient: 'from-red-800 to-black' },
    ],
  },
]

// ============================================
// MINI PHONE COMPONENT
// ============================================

function MiniPhone({ slyde, isActive }: { slyde: Slyde; isActive: boolean }) {
  return (
    <div className={`w-[80px] h-[160px] rounded-[1rem] p-0.5 transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-b from-red-500 to-red-700 shadow-lg shadow-red-500/30 scale-110' 
        : 'bg-gradient-to-b from-gray-700 to-gray-800'
    }`}>
      <div className="w-full h-full bg-gray-900 rounded-[0.875rem] overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${slyde.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="text-[8px] font-bold text-white truncate">{slyde.title}</div>
          <div className="text-[6px] text-white/60 truncate">{slyde.subtitle}</div>
        </div>
        <div className="absolute top-1 left-1 text-[10px]">{slyde.icon}</div>
      </div>
    </div>
  )
}

// ============================================
// LARGE PHONE PREVIEW
// ============================================

function LargePhonePreview({ slyde }: { slyde: Slyde }) {
  return (
    <div className="w-[240px] h-[480px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] p-1.5 shadow-2xl shadow-black/50">
      <div className="w-full h-full bg-gray-900 rounded-[1.75rem] overflow-hidden relative">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${slyde.gradient}`} />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        
        {/* Type badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
          <span className="text-sm">{slyde.icon}</span>
          <span className="text-[10px] text-white/80 font-medium">{slyde.type}</span>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            key={slyde.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-1">{slyde.title}</h3>
            <p className="text-sm text-white/70 mb-3">{slyde.subtitle}</p>
            {slyde.ctaText && (
              <button className="w-full bg-red-600 text-white py-2.5 rounded-full font-semibold text-sm">
                {slyde.ctaText}
              </button>
            )}
          </motion.div>
        </div>
        
        {/* Side actions */}
        <div className="absolute right-3 bottom-28 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        </div>
        
        {/* Swipe indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-8 h-1 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function IndustryTemplatesPage() {
  const [activeIndustry, setActiveIndustry] = useState<string>('restaurant')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  
  const industry = INDUSTRY_TEMPLATES.find(i => i.id === activeIndustry)!
  const activeSlyde = industry.slydes[activeSlideIndex]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <h1 className="font-semibold text-gray-900 dark:text-white">Industry Templates</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-white/60">5 industries • Complete flows</div>
      </header>

      {/* Industry Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {INDUSTRY_TEMPLATES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => { setActiveIndustry(ind.id); setActiveSlideIndex(0); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeIndustry === ind.id
                    ? `bg-gradient-to-r ${ind.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{ind.icon}</span>
                <span>{ind.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Description */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 dark:bg-[#1c1c1e] dark:border-white/10">
        <p className="text-center text-gray-500 dark:text-white/60 text-sm">{industry.description}</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Flow Preview (vertical-only, no horizontal scroll) */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Flow (6 slydes)</h2>
              </div>
              <div className="grid gap-3 max-w-3xl mx-auto">
                {industry.slydes.map((slyde, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlideIndex(i)}
                    className={`w-full rounded-2xl p-3 border transition-all ${
                      i === activeSlideIndex
                        ? 'border-red-300 bg-red-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-7 text-center">
                        <div className={`text-xs font-semibold ${i === activeSlideIndex ? 'text-red-600' : 'text-gray-400'}`}>{i + 1}</div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{slyde.icon}</span>
                          <span className="text-sm font-semibold text-gray-900">{slyde.type}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{slyde.title}</div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="scale-75 origin-right">
                          <MiniPhone slyde={slyde} isActive={i === activeSlideIndex} />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Large Preview + Details */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Phone */}
              <div className="flex justify-center lg:justify-end">
                <LargePhonePreview slyde={activeSlyde} />
              </div>
              
              {/* Details */}
              <div className="lg:max-w-md">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  {/* Slide info */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                      {activeSlyde.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Slide {activeSlideIndex + 1} of {industry.slydes.length}</div>
                      <h3 className="font-bold text-gray-900 text-lg">{activeSlyde.type}</h3>
                    </div>
                  </div>
                  
                  {/* Content fields */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">Title</div>
                      <div className="text-gray-900 font-semibold">{activeSlyde.title}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">Subtitle</div>
                      <div className="text-gray-700">{activeSlyde.subtitle}</div>
                    </div>
                    {activeSlyde.ctaText && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">CTA Button</div>
                        <div className="text-red-600 font-semibold">{activeSlyde.ctaText}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                      disabled={activeSlideIndex === 0}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveSlideIndex(Math.min(industry.slydes.length - 1, activeSlideIndex + 1))}
                      disabled={activeSlideIndex === industry.slydes.length - 1}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Use Template Button */}
                <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20">
                  Use This Template
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* All Industries Summary */}
      <div className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-gray-400 text-sm font-semibold uppercase tracking-wide mb-8">
            All Industry Templates
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {INDUSTRY_TEMPLATES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => { setActiveIndustry(ind.id); setActiveSlideIndex(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`bg-gray-50 hover:bg-gray-100 border rounded-xl p-4 text-center transition-all ${
                  activeIndustry === ind.id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="text-3xl mb-2">{ind.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{ind.name}</div>
                <div className="text-xs text-gray-500 mt-1">{ind.slydes.length} slydes</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

