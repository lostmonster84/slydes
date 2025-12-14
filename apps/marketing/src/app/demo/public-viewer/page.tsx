'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ============================================
// PUBLIC VIEWER - CUSTOMER EXPERIENCE
// ============================================

// This is what customers see when they view a published slyde flow
// Full-screen, immersive, vertical swipe experience

interface Slyde {
  id: number
  type: string
  title: string
  subtitle: string
  gradient: string
  ctaText?: string
  ctaUrl?: string
}

const DEMO_SLYDES: Slyde[] = [
  { id: 1, type: 'Hero', title: 'WildTrax 4x4', subtitle: 'Scottish Highlands', gradient: 'from-amber-900 via-stone-900 to-black' },
  { id: 2, type: 'About', title: 'The Experience', subtitle: 'Wake up to mountain views. Cook under the stars. Adventure awaits around every corner.', gradient: 'from-slate-800 via-stone-900 to-black' },
  { id: 3, type: 'Showcase', title: 'Land Rover Defender', subtitle: 'Roof tent • Full kit • Ready for anything', gradient: 'from-emerald-900 via-stone-900 to-black' },
  { id: 4, type: 'Reviews', title: '209 Reviews', subtitle: '"Best adventure of our lives! The Defender was perfect and the kit had everything we needed." — Sarah M.', gradient: 'from-yellow-900 via-orange-900 to-black' },
  { id: 5, type: 'Location', title: 'Scottish Highlands', subtitle: '2 hours from Edinburgh • Loch Ness nearby • Endless routes', gradient: 'from-teal-900 via-emerald-900 to-black' },
  { id: 6, type: 'CTA', title: 'Ready for Adventure?', subtitle: 'From £149/night • Free cancellation • Unlimited miles', gradient: 'from-red-900 via-rose-900 to-black', ctaText: 'Book Now', ctaUrl: '#' },
]

// ============================================
// PHONE FRAME WRAPPER
// ============================================

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[320px] h-[693px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2.5 shadow-2xl shadow-black/50">
      {/* Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50" />
      
      {/* Screen */}
      <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
        {children}
      </div>
      
      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
    </div>
  )
}

// ============================================
// SLYDE VIEWER COMPONENT
// ============================================

function SlydeViewer({ slyde, isActive }: { slyde: Slyde; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.5 }}
      className={`absolute inset-0 bg-gradient-to-br ${slyde.gradient}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
      
      {/* Type indicator (subtle) */}
      {slyde.type !== 'Hero' && slyde.type !== 'CTA' && (
        <div className="absolute top-16 left-4 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-[10px] text-white/60 uppercase tracking-wide">{slyde.type}</span>
        </div>
      )}
      
      {/* Map indicator for Location */}
      {slyde.type === 'Location' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-red-500/40 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          </div>
        </div>
      )}
      
      {/* Star rating for Reviews */}
      {slyde.type === 'Reviews' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={slyde.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">{slyde.title}</h2>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">{slyde.subtitle}</p>
              {slyde.ctaText && (
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-semibold text-base transition-colors shadow-lg shadow-red-600/30">
                  {slyde.ctaText}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Side actions */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <span className="text-xs text-white/80 mt-1 font-medium">2.4k</span>
        </div>
        <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function PublicViewerPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  
  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEMO_SLYDES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [autoPlay])
  
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, DEMO_SLYDES.length - 1))
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0))

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <h1 className="font-semibold text-gray-900 dark:text-white">Public Viewer</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-white/60">Customer Experience</div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div className="text-sm text-gray-600">
            Slide {currentIndex + 1} of {DEMO_SLYDES.length}
          </div>
          <button
            onClick={goNext}
            disabled={currentIndex === DEMO_SLYDES.length - 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              autoPlay ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {autoPlay ? 'Pause' : 'Auto-play'}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 dark:bg-[#1c1c1e] dark:border-white/10">
        <p className="text-sm text-gray-500 dark:text-white/60 text-center">
          Full-screen immersive experience • Swipe up to navigate • This is what your customers see
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="flex items-center gap-8">
          {/* Phone */}
          <div className="relative">
            <PhoneFrame>
              {/* Slydes */}
              {DEMO_SLYDES.map((slyde, i) => (
                <SlydeViewer 
                  key={slyde.id} 
                  slyde={slyde} 
                  isActive={i === currentIndex} 
                />
              ))}
              
              {/* Slide indicators */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
                {DEMO_SLYDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all ${
                      i === currentIndex 
                        ? 'w-1.5 h-5 bg-white' 
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              
              {/* Swipe hint */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </motion.div>
              </div>
            </PhoneFrame>
            
            {/* Device label */}
            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm">slydes.io/wildtrax</p>
              <p className="text-gray-400 text-xs">Published • 2.4k saves</p>
            </div>
          </div>
          
          {/* Slide Info Panel */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Current Slide</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Type</div>
                  <div className="text-gray-900 font-medium">{DEMO_SLYDES[currentIndex].type}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Title</div>
                  <div className="text-gray-900 font-medium">{DEMO_SLYDES[currentIndex].title}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">Subtitle</div>
                  <div className="text-gray-700 text-sm">{DEMO_SLYDES[currentIndex].subtitle}</div>
                </div>
                {DEMO_SLYDES[currentIndex].ctaText && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">CTA</div>
                    <div className="text-red-600 font-medium">{DEMO_SLYDES[currentIndex].ctaText}</div>
                  </div>
                )}
              </div>
              
              {/* Flow progress */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Flow Progress</span>
                  <span>{Math.round(((currentIndex + 1) / DEMO_SLYDES.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / DEMO_SLYDES.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick nav */}
            <div className="mt-4 grid grid-cols-6 gap-2">
              {DEMO_SLYDES.map((slyde, i) => (
                <button
                  key={slyde.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-[9/16] rounded-lg bg-gradient-to-br ${slyde.gradient} transition-all ${
                    i === currentIndex 
                      ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-100' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

