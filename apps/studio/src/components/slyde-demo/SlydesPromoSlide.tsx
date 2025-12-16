'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * SlydesPromoSlide - The final slide promoting Slydes.io
 * 
 * Converts viewers into leads. Shows after the business content.
 * "Want this for your business? Create your Slyde."
 */
export function SlydesPromoSlide() {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Background - gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#0A0E27] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        
        {/* Slydes Logo Mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 64 64" 
            fill="none"
          >
            <defs>
              <linearGradient id="slydes-gradient-promo" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            {/* Bottom frame - faded */}
            <rect x="14" y="36" width="36" height="24" rx="4" fill="#2563EB" opacity="0.2" />
            {/* Middle frame */}
            <rect x="12" y="22" width="40" height="28" rx="5" fill="#2563EB" opacity="0.5" />
            {/* Top frame - bold */}
            <rect x="10" y="6" width="44" height="32" rx="6" fill="url(#slydes-gradient-promo)" />
            {/* Notch */}
            <rect x="24" y="6" width="16" height="4" rx="2" fill="white" opacity="0.3" />
          </svg>
        </motion.div>

        {/* Powered by badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <span className="text-[#06B6D4] text-[10px] font-medium uppercase tracking-widest">
            Powered by
          </span>
        </motion.div>

        {/* Slydes wordmark */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white text-3xl font-bold tracking-tight mb-2"
        >
          Slydes<span className="text-white/40">.io</span>
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/60 text-sm mb-8 max-w-[200px]"
        >
          Old school websites are OUT. Slydes are IN.
        </motion.p>

        {/* Value prop - clean text, no box */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-sm mb-8"
        >
          Want this for <span className="text-white font-semibold">your</span> business?
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="https://slydes.io"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-medium text-sm py-3 px-8 rounded-full flex items-center gap-2 shadow-lg shadow-[#2563EB]/30"
        >
          Try Slydes
          <ArrowRight className="w-4 h-4" />
        </motion.a>

        {/* Secondary link */}
        <motion.a
          href="https://slydes.io"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 text-white/40 text-xs hover:text-white/60 transition-colors"
        >
          Learn more →
        </motion.a>
      </div>

      {/* Bottom branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-0 right-0 text-center z-10"
      >
        <p className="text-white/30 text-[10px]">
          Built for the future
        </p>
      </motion.div>
    </div>
  )
}

