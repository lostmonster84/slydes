'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Smartphone, Layers, BarChart3, Inbox, Palette, Settings } from 'lucide-react'
import { DevicePreview } from '@/components/ui/DevicePreview'

// Simplified slyde structure for the phone preview
const slydes = [
  { id: 'hero', name: 'Hero Video' },
  { id: 'about', name: 'About Us' },
  { id: 'menu', name: 'Menu Highlights' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'location', name: 'Find Us' },
  { id: 'book', name: 'Book Now' },
]

export function DashboardPreview() {
  const [activeSlyde, setActiveSlyde] = useState(0)
  const [activeNav, setActiveNav] = useState<'studio' | 'momentum' | 'slydes' | 'analytics'>('studio')

  const navItems = [
    { id: 'momentum' as const, label: 'Momentum', icon: TrendingUp },
    { id: 'studio' as const, label: 'Studio', icon: Smartphone },
    { id: 'slydes' as const, label: 'Slydes', icon: Layers, badge: 6 },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'inbox' as const, label: 'Inbox', icon: Inbox, comingSoon: true },
  ]

  const bottomNavItems = [
    { id: 'brand', label: 'Brand', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Smartphone className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm font-medium text-white/70">Slydes Studio</span>
          </div>
          <h2 className="mb-4 text-white">
            See exactly what <span className="gradient-text">they&apos;ll see</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Build on desktop, preview on phone. What you see is what they get.
            No guesswork. No surprises.
          </p>
        </motion.div>

        {/* Dashboard mockup - macOS style dark mode */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* macOS-style toolbar */}
          <div className="bg-[#323232] border-b border-[#3a3a3a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-sm font-medium text-white/70">Bloom Studio</div>
            <button className="px-4 py-1.5 bg-leader-blue text-white text-sm rounded-lg font-medium hover:bg-leader-blue/90 transition-colors">
              Publish
            </button>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] min-h-[520px]">
            {/* Sidebar - matches real Studio HQSidebar */}
            <div className="bg-[#2d2d2d] border-r border-[#3a3a3a] flex flex-col">
              {/* Logo */}
              <div className="p-4 border-b border-[#3a3a3a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-leader-blue to-electric-cyan flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">
                      <span className="text-white">Slydes</span>
                      <span className="text-white/40">.io</span>
                    </span>
                    <span className="text-xs text-white/50 -mt-0.5">Studio</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeNav === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => !item.comingSoon && setActiveNav(item.id as typeof activeNav)}
                      disabled={item.comingSoon}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative text-left ${
                        item.comingSoon
                          ? 'opacity-50 cursor-not-allowed text-white/40'
                          : isActive
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && !item.comingSoon && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
                      )}
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.comingSoon && (
                        <span className="ml-auto text-[10px] text-white/40">Soon</span>
                      )}
                    </button>
                  )
                })}

                {/* Divider */}
                <div className="my-3 border-t border-white/10" />

                {/* Bottom nav items */}
                {bottomNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/5 text-left"
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Business profile */}
              <div className="p-3 border-t border-[#3a3a3a]">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    B
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">Bloom Studio</div>
                    <div className="text-xs text-white/50 truncate">bloomstudio.slydes.io</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="bg-[#1e1e1e] flex">
              {/* Slydes list (when in Studio view) */}
              {activeNav === 'studio' && (
                <div className="w-64 bg-[#252525] border-r border-[#3a3a3a] p-4 overflow-y-auto">
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                    Frames
                    <span className="text-white/30 font-normal normal-case ml-1">({slydes.length})</span>
                  </div>
                  <div className="space-y-2">
                    {slydes.map((slyde, index) => (
                      <button
                        key={slyde.id}
                        onClick={() => setActiveSlyde(index)}
                        className={`w-full text-left rounded-lg transition-all duration-200 ${
                          activeSlyde === index
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                            : 'hover:bg-white/5 text-white/70 border border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="px-3 py-2.5">
                          <span className="text-sm font-medium block">{slyde.name}</span>
                          <span className={`text-xs ${activeSlyde === index ? 'text-white/70' : 'text-white/40'}`}>
                            Frame {index + 1}
                          </span>
                        </div>
                      </button>
                    ))}
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-white/40 text-sm border border-dashed border-white/20 hover:border-white/30 transition-colors">
                      + Add frame
                    </button>
                  </div>
                </div>
              )}

              {/* Phone preview area */}
              <div className="flex-1 flex items-center justify-center p-8 relative">
                {/* Subtle spotlight glow */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 60%)',
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlyde}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10"
                  >
                    <DevicePreview enableTilt={false}>
                      {/* Screen content */}
                      <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex flex-col justify-end p-4">
                        {/* Video background placeholder */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Content */}
                        <div className="relative z-10">
                          <div className="text-xs text-white/80 mb-1">Florist</div>
                          <div className="text-xl font-bold text-white mb-1">{slydes[activeSlyde].name}</div>
                          <div className="text-sm text-white/70 mb-4">Bloom Studio</div>
                          <button className="w-full bg-white/20 backdrop-blur rounded-full py-3 text-sm font-medium text-white">
                            Shop Flowers
                          </button>
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
                      </div>
                    </DevicePreview>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it works hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 flex items-center justify-center gap-2 text-sm text-white/60"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/10 text-xs font-mono text-white/80">↑↓</span>
          <span>Swipe to navigate frames</span>
        </motion.div>
      </div>
    </section>
  )
}
