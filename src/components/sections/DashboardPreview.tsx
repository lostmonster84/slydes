'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

// Accurate product structure: Sections > Slides > Frames
const slides = [
  { 
    id: 'welcome', 
    name: 'Welcome',
    frames: [
      { id: 'hero', name: 'Hero Video' },
      { id: 'about', name: 'About Us' },
      { id: 'location', name: 'Location' },
    ],
    gradient: 'from-amber-600 to-orange-700',
    title: 'Highland Bites',
    subtitle: 'Welcome to our restaurant',
  },
  { 
    id: 'menu', 
    name: 'Menu',
    frames: [
      { id: 'starters', name: 'Starters' },
      { id: 'mains', name: 'Mains' },
      { id: 'desserts', name: 'Desserts' },
    ],
    gradient: 'from-rose-600 to-pink-700',
    title: 'Our Menu',
    subtitle: 'Swipe to explore dishes',
  },
  { 
    id: 'contact', 
    name: 'Contact',
    frames: [
      { id: 'book', name: 'Book a Table' },
      { id: 'hours', name: 'Opening Hours' },
    ],
    gradient: 'from-emerald-600 to-teal-700',
    title: 'Get in Touch',
    subtitle: 'Book your table today',
  },
]

export function DashboardPreview() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeFrame, setActiveFrame] = useState(0)

  const currentSlide = slides[activeSlide]

  const handleSlideChange = (index: number) => {
    setActiveSlide(index)
    setActiveFrame(0) // Reset frame when slide changes
  }

  return (
    <section className="py-24 bg-[#0A0E27] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-white">
            Build with <span className="gradient-text">drag-and-drop slides</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Swipe up and down between slides. Swipe left and right through frames within each slide.
          </p>
        </motion.div>

        {/* Dashboard mockup - DARK MODE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#1a1f36] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* macOS-style toolbar - DARK */}
          <div className="bg-[#12152a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-sm font-medium text-white/70">Highland Bites - Slydes Editor</div>
            <button className="px-4 py-1.5 bg-leader-blue text-white text-sm rounded-lg font-medium hover:bg-leader-blue/90 transition-colors">
              Publish
            </button>
          </div>

          <div className="grid md:grid-cols-[280px_1fr] min-h-[520px]">
            {/* Slides sidebar - DARK */}
            <div className="bg-[#12152a] border-r border-white/10 p-4 overflow-y-auto">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                Slides
                <span className="text-white/30 font-normal normal-case ml-1">(swipe up/down)</span>
              </div>
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => handleSlideChange(index)}
                    className={`w-full text-left rounded-lg transition-all duration-200 ${
                      activeSlide === index
                        ? 'bg-leader-blue text-white shadow-md'
                        : 'hover:bg-white/5 text-white/70 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <span className="text-sm font-medium block">{slide.name}</span>
                      <span className={`text-xs ${activeSlide === index ? 'text-white/70' : 'text-white/40'}`}>
                        {slide.frames.length} frames
                      </span>
                    </div>
                  </button>
                ))}
                <div className="pt-2 border-t border-white/10 mt-3">
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-white/40 text-sm border border-dashed border-white/20 hover:border-white/30 transition-colors">
                    + Add Slide
                  </button>
                </div>
              </div>

              {/* Frames within current slide - DARK */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                  Frames in &ldquo;{currentSlide.name}&rdquo;
                  <span className="text-white/30 font-normal normal-case ml-1">(swipe left/right)</span>
                </div>
                <div className="space-y-1">
                  {currentSlide.frames.map((frame, index) => (
                    <button
                      key={frame.id}
                      onClick={() => setActiveFrame(index)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                        activeFrame === index
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      {frame.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview area - DARK with subtle glow */}
            <div className="bg-[#0d1022] flex items-center justify-center p-8 relative">
              {/* Subtle spotlight glow behind phone */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSlide}-${activeFrame}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="animate-phone-float relative z-10"
                >
                  <PhoneMockup variant="hospitality" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* How it works hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 flex items-center justify-center gap-6 text-sm text-white/60"
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white/80">↑↓</span>
            Slides
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white/80">←→</span>
            Frames
          </span>
        </motion.div>
      </div>
    </section>
  )
}
