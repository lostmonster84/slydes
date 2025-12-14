'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneMockup } from '@/components/ui/PhoneMockup'

// Simple slyde structure - vertical swipe only
const slydes = [
  {
    id: 'hero',
    name: 'Hero Video',
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'about',
    name: 'About Us',
    gradient: 'from-rose-600 to-pink-700',
  },
  {
    id: 'menu',
    name: 'Menu Highlights',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'reviews',
    name: 'Reviews',
    gradient: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'location',
    name: 'Find Us',
    gradient: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'book',
    name: 'Book Now',
    gradient: 'from-leader-blue to-electric-cyan',
  },
]

export function DashboardPreview() {
  const [activeSlide, setActiveSlide] = useState(0)

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
            A Slyde is a <span className="gradient-text">flow</span>, not a page.
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Swipe through slydes to move forward. Each slyde captures attention and drives action.
          </p>
        </motion.div>

        {/* Dashboard mockup - macOS DARK MODE (neutral grays) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* macOS-style toolbar - DARK */}
          <div className="bg-[#323232] border-b border-[#3a3a3a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-sm font-medium text-white/70">Highland Bites - Slydes Editor</div>
            <button className="px-4 py-1.5 bg-leader-blue text-white text-sm rounded-lg font-medium hover:bg-leader-blue/90 transition-colors">
              Publish
            </button>
          </div>

          <div className="grid md:grid-cols-[280px_1fr] min-h-[520px]">
            {/* Slydes sidebar - macOS dark sidebar */}
            <div className="bg-[#2d2d2d] border-r border-[#3a3a3a] p-4 overflow-y-auto">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                Slydes
                <span className="text-white/30 font-normal normal-case ml-1">(swipe up/down)</span>
              </div>
              <div className="space-y-2">
                {slydes.map((slyde, index) => (
                  <button
                    key={slyde.id}
                    onClick={() => setActiveSlide(index)}
                    className={`w-full text-left rounded-lg transition-all duration-200 ${
                      activeSlide === index
                        ? 'bg-leader-blue text-white shadow-md'
                        : 'hover:bg-white/5 text-white/70 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="px-3 py-2.5">
                      <span className="text-sm font-medium block">{slyde.name}</span>
                      <span className={`text-xs ${activeSlide === index ? 'text-white/70' : 'text-white/40'}`}>
                        Slyde {index + 1} of {slydes.length}
                      </span>
                    </div>
                  </button>
                ))}
                <div className="pt-2 border-t border-[#3a3a3a] mt-3">
                  <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-white/40 text-sm border border-dashed border-white/20 hover:border-white/30 transition-colors">
                    + Add Slyde
                  </button>
                </div>
              </div>
            </div>

            {/* Preview area - darker content area */}
            <div className="bg-[#1e1e1e] flex items-center justify-center p-8 relative">
              {/* Subtle spotlight glow behind phone */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)',
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
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

        {/* How it works hint - simplified to vertical only */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 flex items-center justify-center gap-2 text-sm text-white/60"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white/80">↑↓</span>
          <span>Swipe to navigate slydes</span>
        </motion.div>
      </div>
    </section>
  )
}
