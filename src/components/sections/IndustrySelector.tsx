'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

// Only industries with unique video content - honest demos
const industries = [
  {
    id: 'hospitality',
    label: 'Restaurant',
    title: 'Maison Lumière',
    variant: 'hospitality' as const,
    description: 'Your menu comes alive. Video previews of signature dishes, chef\'s recommendations, and instant reservations—a digital experience as refined as your cuisine.',
    features: ['Video menu previews', 'Table reservations', 'Chef\'s specials & pairings'],
  },
  {
    id: 'rentals',
    label: 'Vacation Rentals',
    title: 'Villa Serenità',
    variant: 'rentals' as const,
    description: 'Let guests experience your property before they book. Immersive video tours, real reviews, and seamless reservation—all in one stunning mobile experience.',
    features: ['Virtual property tours', 'Direct booking integration', 'Guest reviews & ratings'],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    title: 'FORM Studio',
    variant: 'fitness' as const,
    description: 'Boutique fitness thrives on community and energy. Capture your vibe with video, showcase classes, and let members book in seconds.',
    features: ['Class previews', 'Live schedule', 'Membership signup'],
  },
  {
    id: 'automotive',
    label: 'Car Hire',
    title: 'Apex Motors',
    variant: 'automotive' as const,
    description: 'Exotic cars deserve exotic presentation. Video walkarounds, engine sounds, and instant reservations—the premium experience your clients expect.',
    features: ['Video fleet showcase', 'Instant reservations', 'Concierge service'],
  },
  {
    id: 'wildtrax',
    label: 'Adventure',
    title: 'WildTrax 4x4',
    variant: 'wildtrax' as const,
    description: 'Real Land Rover Defenders, real Scottish adventures. This is an actual Slydes project we\'re building—see the future of mobile-first business sites.',
    features: ['Full-screen video showcase', 'Instant booking', 'Real customer project'],
  },
]

export function IndustrySelector() {
  const [activeIndustry, setActiveIndustry] = useState('hospitality')
  
  const currentIndustry = industries.find(i => i.id === activeIndustry) || industries[0]

  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Demo badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Demo Examples
          </span>
          
          <h2 className="mb-4">
            Built for <span className="gradient-text">any industry</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These demos show what&apos;s possible. Slydes works for restaurants, rentals, fitness studios, 
            car hire, and <strong>any business</strong> that wants a mobile-first experience.
          </p>
        </motion.div>

        {/* Industry Tabs - Mobile: Horizontal Scroll, Desktop: Centered */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Mobile: Horizontal Scrollable */}
          <div className="md:hidden overflow-x-auto -mx-6 px-6 scrollbar-hide">
            <div className="flex gap-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setActiveIndustry(industry.id)}
                  className={`
                    flex-shrink-0 min-h-[44px] px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation
                    ${activeIndustry === industry.id
                      ? 'bg-future-black text-white shadow-lg'
                      : 'bg-white text-gray-600 active:bg-gray-100 border border-gray-200'
                    }
                  `}
                  style={{ touchAction: 'manipulation' }}
                >
                  {industry.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Desktop: Centered Grid */}
          <div className="hidden md:flex justify-center flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveIndustry(industry.id)}
                className={`
                  min-h-[44px] px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeIndustry === industry.id
                    ? 'bg-future-black text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {industry.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Phone Mockup */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <PhoneMockup 
                  variant={currentIndustry.variant}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Details */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-4">{currentIndustry.title}</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {currentIndustry.description}
                </p>
                
                <ul className="space-y-3">
                  {currentIndustry.features.map((feature, i) => (
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
