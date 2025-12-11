'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

const industries = [
  {
    id: 'hospitality',
    label: 'Hospitality',
    title: 'Maison Lumière',
    variant: 'hospitality' as const,
    description: 'Your menu comes alive. Video previews of signature dishes, chef\'s recommendations, and instant reservations—a digital experience as refined as your cuisine.',
    features: ['Video menu previews', 'Table reservations', 'Chef\'s specials & pairings'],
  },
  {
    id: 'rentals',
    label: 'Rentals',
    title: 'Villa Serenità',
    variant: 'rentals' as const,
    description: 'Let guests experience your property before they book. Immersive video tours, real reviews, and seamless reservation—all in one stunning mobile experience.',
    features: ['Virtual property tours', 'Direct booking integration', 'Guest reviews & ratings'],
  },
  {
    id: 'experiences',
    label: 'Experiences',
    title: 'Azure Charters',
    variant: 'experiences' as const,
    description: 'Curated adventures deserve cinematic presentation. Showcase your experiences with stunning video, instant booking, and the social proof that drives conversions.',
    features: ['Cinematic video showcase', 'Instant booking', 'Real-time availability'],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    title: 'Velvet Spa',
    variant: 'wellness' as const,
    description: 'Luxury wellness experiences begin with the first impression. Showcase treatments, ambiance, and transformations with video that converts browsers to bookings.',
    features: ['Treatment showcases', 'Online booking', 'Gift card integration'],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    title: 'Prestige Estates',
    variant: 'realestate' as const,
    description: 'Luxury properties demand luxury presentation. Video walkthroughs, virtual tours, and instant inquiry—help buyers fall in love before they visit.',
    features: ['Video property tours', 'Instant scheduling', 'Agent direct connect'],
  },
  {
    id: 'events',
    label: 'Events',
    title: 'The Glass House',
    variant: 'events' as const,
    description: 'Venues sell emotion. Showcase your space with video that captures the atmosphere, features past events, and makes booking seamless.',
    features: ['Venue video tours', 'Availability calendar', 'Quote requests'],
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
    label: 'Automotive',
    title: 'Apex Motors',
    variant: 'automotive' as const,
    description: 'Exotic cars deserve exotic presentation. Video walkarounds, engine sounds, and instant reservations—the premium experience your clients expect.',
    features: ['Video fleet showcase', 'Instant reservations', 'Concierge service'],
  },
]

export function IndustrySelector() {
  const [activeIndustry, setActiveIndustry] = useState('hospitality')
  
  const currentIndustry = industries.find(i => i.id === activeIndustry) || industries[0]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4">
            Built for <span className="gradient-text">your industry</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you run a restaurant, rental business, or service company—Slydes 
            helps you create mobile experiences that convert.
          </p>
        </motion.div>

        {/* Industry Tabs */}
        <motion.div 
          className="flex justify-center gap-2 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setActiveIndustry(industry.id)}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                ${activeIndustry === industry.id
                  ? 'bg-future-black text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {industry.label}
            </button>
          ))}
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
