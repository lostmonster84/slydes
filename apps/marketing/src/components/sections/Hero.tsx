'use client'

import { Button } from '@/components/ui/Button'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const SUBHEADS = [
  // Property + hospitality focus: replace the link you share (WhatsApp/email/QR/ads), not the final destination (portal/OTA/booking engine).
  { main: "Buyers browse on phones.", punch: "Make the tour feel made for mobile." },
  { main: "Guests book on Airbnb and Booking.", punch: "Slydes sells the atmosphere first." },
  { main: "One link. Full-screen tour.", punch: "Instant enquiries and viewing requests." },
  { main: "Your best link isn't your homepage.", punch: "It's the one you share." },
  { main: "WhatsApp. Email. QR. Ads.", punch: "Slydes is built for the handoff." },
  { main: "People decide in seconds.", punch: "Slydes wins those seconds." },
]

export function Hero() {
  const [subheadIndex, setSubheadIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Set random start index + begin rotation after mount (avoids hydration mismatch)
  useEffect(() => {
    setSubheadIndex(Math.floor(Math.random() * SUBHEADS.length))
    setMounted(true)
    
    const interval = setInterval(() => {
      setSubheadIndex((prev) => (prev + 1) % SUBHEADS.length)
    }, 6000) // 6 seconds between rotations
    return () => clearInterval(interval)
  }, [])
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030712]">
      {/* === BACKGROUND === */}
      <div className="absolute inset-0">
        {/* Soft vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 0%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 100%)',
          }}
        />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Spotlight glow - positioned behind phone */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[5%]">
          <motion.div
            className="relative w-[500px] h-[500px]"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 50% 50%, 
                  rgba(37, 99, 235, 0.25) 0%, 
                  rgba(37, 99, 235, 0.12) 30%, 
                  rgba(37, 99, 235, 0.04) 55%, 
                  transparent 80%
                )`,
                filter: 'blur(50px)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 pt-20 md:pt-24 pb-12 md:pb-16 min-h-screen flex flex-col items-center justify-start px-6">
        
        {/* 1. BADGE - Urgency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Built for property & hospitality
          </span>
        </motion.div>
        
        {/* 2. HEADLINE - THE statement */}
        <motion.h1
          className="font-display text-center mb-4 text-balance text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-white">Stop sharing </span>
          <span className="text-white/40">boring links</span>
          <span className="text-white">.</span>
          <br />
          <span className="text-white">Share a </span>
          <span className="bg-gradient-to-r from-leader-blue to-electric-cyan bg-clip-text text-transparent">Slyde</span>
          <span className="text-white">.</span>
        </motion.h1>
        
        {/* 3. SUBHEAD - Slot machine with staggered left-to-right roll */}
        <div className="mb-6 max-w-xl" style={{ perspective: '800px' }}>
          <AnimatePresence mode="wait">
            <motion.p 
              key={subheadIndex}
              className="text-center text-lg md:text-xl text-white/70 leading-relaxed flex flex-wrap justify-center gap-x-[0.3em]"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {SUBHEADS[subheadIndex].main.split(' ').map((word, i) => (
                <motion.span
                  key={`main-${i}`}
                  className="inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                  variants={{
                    hidden: { rotateX: 90, opacity: 0, y: 10 },
                    visible: { rotateX: 0, opacity: 1, y: 0 },
                    exit: { rotateX: -90, opacity: 0, y: -10 }
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {word}
                </motion.span>
              ))}
              {' '}
              {SUBHEADS[subheadIndex].punch.split(' ').map((word, i) => (
                <motion.span
                  key={`punch-${i}`}
                  className="inline-block text-white font-semibold"
                  style={{ transformStyle: 'preserve-3d' }}
                  variants={{
                    hidden: { rotateX: 90, opacity: 0, y: 10 },
                    visible: { rotateX: 0, opacity: 1, y: 0 },
                    exit: { rotateX: -90, opacity: 0, y: -10 }
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: (SUBHEADS[subheadIndex].main.split(' ').length + i) * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </AnimatePresence>
        </div>
        
        {/* 4. CTA - Single, bold, above fold */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#waitlist">
            <Button size="lg" className="shadow-lg shadow-leader-blue/30 px-10 text-base">
              Create your first Slyde
            </Button>
          </a>
        </motion.div>

        {/* CTA support - risk reversal */}
        <motion.p
          className="text-sm text-white/50 -mt-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          No credit card. Live in minutes.
        </motion.p>

        {/* 5. Secondary link - not a competing button */}
        <motion.p
          className="text-sm text-white/50 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          or{' '}
          <Link href="/showcase" className="text-white/70 hover:text-white underline underline-offset-2">
            see a property demo
          </Link>
        </motion.p>
        
        {/* 6. PHONE - THE STAR */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="animate-phone-float">
            <PhoneMockup variant="realestate" />
          </div>
        </motion.div>
        
        {/* 7. THE CLOSER - Invite conversation */}
        <motion.p
          className="text-center text-sm md:text-base text-white/60 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Selling, letting, or hosting?{' '}
          <a href="#contact" className="text-white/90 font-medium hover:text-white underline underline-offset-2">
            We should talk.
          </a>
        </motion.p>
      </div>
    </section>
  )
}
