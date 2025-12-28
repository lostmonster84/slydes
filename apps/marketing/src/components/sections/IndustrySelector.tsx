'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

// Only industries with unique video content - honest demos
// Property-first homepage: we show the use cases we want to win at launch.
const industries = [
  {
    id: 'estate-agents',
    label: 'Estate Agents',
    title: 'Prestige Estates',
    variant: 'realestate' as const,
    description: 'A full-screen tour link you can share in WhatsApp, email, and ads. Show the best bits fast, then end with one clear action: book a viewing.',
    features: ['Video property tours', 'Instant viewing requests', 'One link for WhatsApp + email'],
  },
  {
    id: 'holiday-lets',
    label: 'Holiday Lets',
    title: 'Villa Serenità',
    variant: 'rentals' as const,
    description: 'Sell the atmosphere first. Then send guests to Airbnb, Booking.com, or your direct booking engine.',
    features: ['Immersive property tour', 'Link out to Airbnb / Booking', 'Availability & reviews'],
  },
  {
    id: 'hotels-lodges',
    label: 'Hotels & Lodges',
    title: 'Highland Retreat',
    variant: 'hospitality' as const,
    description: 'Guests don’t scroll galleries. They swipe stories. Show the feeling, the rooms, and the experience — then book direct.',
    features: ['Experience-first tour', 'Room & amenity highlights', 'Book direct CTA'],
  },
  {
    id: 'luxury-stays',
    label: 'Luxury Stays',
    title: 'Aurora Domes',
    variant: 'lunadomes' as const,
    description: 'Premium stays deserve premium presentation. One link that feels full-screen on every phone, then send guests to book.',
    features: ['Cinematic walkthroughs', 'Instant enquiries', 'Shareable link everywhere'],
  },
]

export function IndustrySelector() {
  const [activeIndustry, setActiveIndustry] = useState('estate-agents')
  
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
            Built for <span className="gradient-text">property &amp; hospitality</span>.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Slydes works best where guests and renters decide visually, quickly, and on their phones.
            <br /><strong>If you&apos;re selling or letting spaces, this format works.</strong> Works with your existing listing or booking link.
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
