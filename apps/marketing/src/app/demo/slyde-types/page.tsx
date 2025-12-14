'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ============================================
// SLYDE TYPE DEFINITIONS
// ============================================

interface SlydeType {
  id: string
  icon: string
  name: string
  purpose: string
  aidaStage: string
  bestPractices: string[]
  example: {
    title: string
    subtitle: string
    ctaText?: string
    media: 'video' | 'image' | 'map'
    gradient: string
  }
}

const SLYDE_TYPES: SlydeType[] = [
  {
    id: 'hero',
    icon: '🎬',
    name: 'Hero',
    purpose: 'Capture attention in the first 0.3 seconds',
    aidaStage: 'Attention',
    bestPractices: [
      'Use high-impact video or image',
      'Keep title under 5 words',
      'Create emotional resonance immediately',
      'No CTA here — let them explore first',
    ],
    example: {
      title: 'WildTrax 4x4',
      subtitle: 'Scottish Highlands',
      media: 'video',
      gradient: 'from-amber-900 via-stone-900 to-black',
    },
  },
  {
    id: 'about',
    icon: '📖',
    name: 'About',
    purpose: 'Build interest by explaining the value proposition',
    aidaStage: 'Interest',
    bestPractices: [
      'Lead with benefits, not features',
      'Use second person ("You\'ll experience...")',
      'Keep it scannable — short sentences',
      'Support with atmospheric media',
    ],
    example: {
      title: 'The Experience',
      subtitle: 'Wake up to mountain views. Cook under the stars. Adventure awaits.',
      media: 'image',
      gradient: 'from-blue-900 via-slate-900 to-black',
    },
  },
  {
    id: 'showcase',
    icon: '✨',
    name: 'Showcase',
    purpose: 'Create desire by showing what they\'ll get',
    aidaStage: 'Desire',
    bestPractices: [
      'Feature your best product/service',
      'Show it in action or in context',
      'Highlight what makes it special',
      'Use video for maximum impact',
    ],
    example: {
      title: 'Land Rover Defender',
      subtitle: 'Roof tent • Full kit • Ready for anything',
      media: 'video',
      gradient: 'from-emerald-900 via-stone-900 to-black',
    },
  },
  {
    id: 'reviews',
    icon: '⭐',
    name: 'Reviews',
    purpose: 'Build trust through social proof',
    aidaStage: 'Trust',
    bestPractices: [
      'Show aggregate rating prominently',
      'Include 1-2 short testimonials',
      'Use real names and photos if possible',
      'Keep reviews authentic and recent',
    ],
    example: {
      title: '209 Reviews',
      subtitle: '"Best adventure of our lives!" — Sarah M.',
      media: 'image',
      gradient: 'from-yellow-900 via-orange-900 to-black',
    },
  },
  {
    id: 'location',
    icon: '📍',
    name: 'Location',
    purpose: 'Make it tangible — show where they\'ll be',
    aidaStage: 'Desire',
    bestPractices: [
      'Include interactive map if possible',
      'Show the area, not just a pin',
      'Mention nearby attractions',
      'Include distance from major cities',
    ],
    example: {
      title: 'Scottish Highlands',
      subtitle: '2 hours from Edinburgh • Loch Ness nearby',
      media: 'map',
      gradient: 'from-green-900 via-teal-900 to-black',
    },
  },
  {
    id: 'cta',
    icon: '🎯',
    name: 'CTA',
    purpose: 'Drive action — the conversion moment',
    aidaStage: 'Action',
    bestPractices: [
      'Single, clear call to action',
      'Create urgency without being pushy',
      'Reinforce value one more time',
      'Make the button unmissable',
    ],
    example: {
      title: 'Ready for Adventure?',
      subtitle: 'From £149/night • Free cancellation',
      ctaText: 'Book Now',
      media: 'video',
      gradient: 'from-red-900 via-rose-900 to-black',
    },
  },
]

// ============================================
// PHONE PREVIEW COMPONENT
// ============================================

function PhonePreview({ slyde }: { slyde: SlydeType }) {
  return (
    <div className="w-[280px] h-[560px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50">
      <div className="w-full h-full bg-gray-900 rounded-[2.25rem] overflow-hidden relative">
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${slyde.example.gradient}`} />
        
        {/* Media indicator */}
        {slyde.example.media === 'video' && (
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-white/80">LIVE</span>
          </div>
        )}
        
        {slyde.example.media === 'map' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-red-500/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-1">{slyde.example.title}</h3>
            <p className="text-sm text-white/70 mb-4">{slyde.example.subtitle}</p>
            {slyde.example.ctaText && (
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold text-sm transition-colors">
                {slyde.example.ctaText}
              </button>
            )}
          </motion.div>
        </div>
        
        {/* Side actions */}
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
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
// BEST PRACTICES PANEL
// ============================================

function BestPracticesPanel({ slyde }: { slyde: SlydeType }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
          {slyde.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{slyde.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              {slyde.aidaStage}
            </span>
          </div>
        </div>
      </div>
      
      {/* Purpose */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Purpose</h4>
        <p className="text-gray-700">{slyde.purpose}</p>
      </div>
      
      {/* Best Practices */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Best Practices</h4>
        <ul className="space-y-2">
          {slyde.bestPractices.map((practice, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-600 text-sm">{practice}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Example Fields */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Example Content</h4>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Title</div>
            <div className="text-gray-900 font-medium">{slyde.example.title}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Subtitle</div>
            <div className="text-gray-700 text-sm">{slyde.example.subtitle}</div>
          </div>
          {slyde.example.ctaText && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">CTA Button</div>
              <div className="text-red-600 font-medium">{slyde.example.ctaText}</div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Media Type</div>
            <div className="text-gray-700 capitalize">{slyde.example.media}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// AIDA FLOW DIAGRAM
// ============================================

function AIDAFlow({ activeType }: { activeType: string }) {
  const stages = [
    { name: 'Attention', types: ['hero'], color: 'bg-red-500' },
    { name: 'Interest', types: ['about'], color: 'bg-orange-500' },
    { name: 'Desire', types: ['showcase', 'location'], color: 'bg-yellow-500' },
    { name: 'Trust', types: ['reviews'], color: 'bg-green-500' },
    { name: 'Action', types: ['cta'], color: 'bg-blue-500' },
  ]
  
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stages.map((stage, i) => (
        <div key={stage.name} className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            stage.types.includes(activeType)
              ? `${stage.color} text-white shadow-lg`
              : 'bg-gray-100 text-gray-500'
          }`}>
            {stage.name}
          </div>
          {i < stages.length - 1 && (
            <svg className="w-4 h-4 text-gray-300 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function SlydeTypesPage() {
  const [activeType, setActiveType] = useState<string>('hero')
  const activeSlyde = SLYDE_TYPES.find(s => s.id === activeType)!

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
          <h1 className="font-semibold text-gray-900 dark:text-white">Slyde Types</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-white/60">6 types • AIDA framework</div>
      </header>

      {/* Type Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {SLYDE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeType === type.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* AIDA Flow */}
        <AIDAFlow activeType={activeType} />
        
        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-2 gap-8 items-start"
          >
            {/* Phone Preview */}
            <div className="flex justify-center lg:justify-end">
              <PhonePreview slyde={activeSlyde} />
            </div>
            
            {/* Best Practices */}
            <div className="lg:max-w-md">
              <BestPracticesPanel slyde={activeSlyde} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Full Flow Preview */}
      <div className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-gray-400 text-sm font-semibold uppercase tracking-wide mb-6">
            Complete Flow Order
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {SLYDE_TYPES.map((type, i) => (
              <div key={type.id} className="flex items-center">
                <button
                  onClick={() => setActiveType(type.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    activeType === type.id
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    activeType === type.id ? 'bg-red-600' : 'bg-gray-100'
                  }`}>
                    {type.icon}
                  </div>
                  <span className={`text-xs font-medium ${
                    activeType === type.id ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {i + 1}. {type.name}
                  </span>
                </button>
                {i < SLYDE_TYPES.length - 1 && (
                  <svg className="w-6 h-6 text-gray-300 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

