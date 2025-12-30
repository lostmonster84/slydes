'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Smartphone, Layers, BarChart3, Inbox, Palette, Settings } from 'lucide-react'
import { DevicePreview } from '@/components/ui/DevicePreview'

function VideoBackground({
  src,
  fallbackSrc,
  className
}: {
  src: string
  fallbackSrc: string
  className?: string
}) {
  const [currentSrc, setCurrentSrc] = useState(src)

  // When the desired src changes (e.g. switching frames), attempt it again.
  useEffect(() => {
    const controller = new AbortController()

    // Optimistic: try the desired src, but preflight with HEAD to avoid a black flash
    // when the marketing site is missing optional local demo clips.
    ;(async () => {
      try {
        const res = await fetch(src, { method: 'HEAD', signal: controller.signal })
        if (!res.ok) {
          setCurrentSrc(fallbackSrc)
          return
        }
        setCurrentSrc(src)
      } catch {
        // If HEAD fails (dev server / aborted / offline), fall back gracefully.
        setCurrentSrc(fallbackSrc)
      }
    })()

    return () => controller.abort()
  }, [src])

  return (
    <motion.video
      key={currentSrc}
      src={currentSrc}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
      }}
    />
  )
}

// Simplified slyde structure for the phone preview - restaurant example
const slydes = [
  { id: 'welcome', name: 'Welcome' },
  { id: 'ambiance', name: 'Ambiance' },
  { id: 'menu', name: 'Menu' },
  { id: 'cocktails', name: 'Cocktails' },
  { id: 'chefs-table', name: "Chef's Table" },
  { id: 'reserve', name: 'Reserve' },
]

// Using fallback video for all frames - demo purpose
const FALLBACK_VIDEO = '/videos/maison.mp4'

const previewSlides = [
  {
    label: 'Featured',
    title: 'Welcome',
    brand: 'The Kitchen Table',
    cta: 'Reserve a table',
    videoSrc: FALLBACK_VIDEO,
  },
  {
    label: 'Atmosphere',
    title: 'Ambiance',
    brand: 'The Kitchen Table',
    cta: 'Reserve a table',
    videoSrc: FALLBACK_VIDEO,
  },
  {
    label: 'Our Menu',
    title: 'Menu',
    brand: 'The Kitchen Table',
    cta: 'View full menu',
    videoSrc: FALLBACK_VIDEO,
  },
  {
    label: 'Cocktails',
    title: 'Cocktails',
    brand: 'The Kitchen Table',
    cta: 'See drink menu',
    videoSrc: FALLBACK_VIDEO,
  },
  {
    label: 'Private Dining',
    title: "Chef's Table",
    brand: 'The Kitchen Table',
    cta: 'Book private dining',
    videoSrc: FALLBACK_VIDEO,
  },
  {
    label: 'Reserve',
    title: 'Reserve',
    brand: 'The Kitchen Table',
    cta: 'Book now',
    videoSrc: FALLBACK_VIDEO,
  },
] as const

export function DashboardPreview() {
  const [activeSlyde, setActiveSlyde] = useState(0)
  const [activeNav, setActiveNav] = useState<'studio' | 'momentum' | 'slydes' | 'analytics'>('studio')

  const navItems = [
    { id: 'momentum' as const, label: 'Momentum', icon: TrendingUp },
    { id: 'studio' as const, label: 'Studio', icon: Smartphone },
    { id: 'slydes' as const, label: 'Slydes', icon: Layers, badge: slydes.length },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'inbox' as const, label: 'Inbox', icon: Inbox, comingSoon: true },
  ]

  const bottomNavItems = [
    { id: 'brand', label: 'Brand', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const currentSlide = previewSlides[activeSlyde] ?? previewSlides[0]

  return (
    <section id="dashboard-preview" className="py-16 md:py-24 bg-[#0A0E27] overflow-hidden">
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

        {/* Mobile: keep it simple (phone-first) */}
        <div className="md:hidden">
          <div className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] shadow-2xl shadow-black/50 overflow-hidden">
            {/* Minimal toolbar */}
            <div className="bg-[#323232] border-b border-[#3a3a3a] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-xs font-medium text-white/70">The Kitchen Table</div>
              <button className="px-3 py-1.5 min-h-[44px] bg-leader-blue text-white text-xs rounded-lg font-medium hover:bg-leader-blue/90 transition-colors flex items-center">
                Publish
              </button>
            </div>

            {/* Phone preview + frame tabs */}
            <div className="p-4">
              <div className="relative flex items-center justify-center">
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
                    className="relative z-10 w-full flex justify-center"
                  >
                    <DevicePreview enableTilt={false}>
                      <div className="relative w-full h-full flex flex-col justify-end p-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                          <VideoBackground
                            src={currentSlide.videoSrc}
                            fallbackSrc={FALLBACK_VIDEO}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

                        <div className="relative z-10">
                          <div className="text-xs text-white/80 mb-1">{currentSlide.label}</div>
                          <div className="text-xl font-bold text-white mb-1">{currentSlide.title}</div>
                          <div className="text-sm text-white/70 mb-4">{currentSlide.brand}</div>
                          <button className="w-full bg-white/20 backdrop-blur rounded-full py-3 text-sm font-medium text-white">
                            {currentSlide.cta}
                          </button>
                        </div>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
                      </div>
                    </DevicePreview>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="w-full mt-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                  {slydes.map((slyde, index) => (
                    <button
                      key={slyde.id}
                      onClick={() => setActiveSlyde(index)}
                      className={`flex-shrink-0 px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium transition-all ${
                        activeSlyde === index
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {slyde.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard mockup - macOS style dark mode */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden md:block bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* macOS-style toolbar */}
          <div className="bg-[#323232] border-b border-[#3a3a3a] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-xs md:text-sm font-medium text-white/70">The Kitchen Table</div>
            <button className="px-3 md:px-4 py-1.5 min-h-[44px] bg-leader-blue text-white text-xs md:text-sm rounded-lg font-medium hover:bg-leader-blue/90 transition-colors flex items-center">
              Publish
            </button>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] min-h-[400px] md:min-h-[520px]">
            {/* Sidebar - hidden on mobile, matches real Studio HQSidebar */}
            <div className="hidden md:flex bg-[#2d2d2d] border-r border-[#3a3a3a] flex-col">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl transition-colors relative text-left ${
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
                      className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/5 text-left"
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
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    K
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">The Kitchen Table</div>
                    <div className="text-xs text-white/50 truncate">thekitchentable.slydes.io</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="bg-[#1e1e1e] flex flex-col md:flex-row">
              {/* Slydes list (when in Studio view) - hidden on mobile */}
              {activeNav === 'studio' && (
                <div className="hidden md:block w-64 bg-[#252525] border-r border-[#3a3a3a] p-4 overflow-y-auto">
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
                    Frames
                    <span className="text-white/30 font-normal normal-case ml-1">({slydes.length})</span>
                  </div>
                  <div className="space-y-2">
                    {slydes.map((slyde, index) => (
                      <button
                        key={slyde.id}
                        onClick={() => setActiveSlyde(index)}
                        className={`w-full text-left rounded-lg transition-all duration-200 min-h-[44px] ${
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
                    <button className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg hover:bg-white/5 text-white/40 text-sm border border-dashed border-white/20 hover:border-white/30 transition-colors">
                      + Add frame
                    </button>
                  </div>
                </div>
              )}

              {/* Phone preview area */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
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
                    className="relative z-10 w-full flex justify-center"
                  >
                    <DevicePreview enableTilt={false}>
                      {/* Screen content */}
                      <div className="relative w-full h-full flex flex-col justify-end p-4 overflow-hidden">
                        {/* Video background */}
                        <AnimatePresence mode="wait">
                          <VideoBackground
                            src={currentSlide.videoSrc}
                            fallbackSrc={FALLBACK_VIDEO}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </AnimatePresence>

                        {/* Readability overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

                        {/* Content */}
                        <div className="relative z-10">
                          <div className="text-xs text-white/80 mb-1">{currentSlide.label}</div>
                          <div className="text-xl font-bold text-white mb-1">{currentSlide.title}</div>
                          <div className="text-sm text-white/70 mb-4">{currentSlide.brand}</div>
                          <button className="w-full bg-white/20 backdrop-blur rounded-full py-3 text-sm font-medium text-white">
                            {currentSlide.cta}
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
