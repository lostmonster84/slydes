'use client'

import { motion } from 'framer-motion'
import { Heart, Share2 } from 'lucide-react'
import type { HomeSlydeData } from '../data/highlandMotorsData'

interface HomeSlydeViewProps {
  data: HomeSlydeData
  onCategoryTap: (categoryId: string) => void
}

/**
 * HomeSlydeView - Level 0: Single-slide decision surface
 *
 * Per HOME-SLYDE-BUILD-SPEC.md:
 * - Single slide only (no frames, no scrolling)
 * - 3 zones: Orientation (top), Primary Paths (middle), Optional CTA (bottom)
 * - Heart + Share actions only (no FAQ, no Info)
 * - Tap category → navigate to CategorySlydeView
 */
export function HomeSlydeView({ data, onCategoryTap }: HomeSlydeViewProps) {
  return (
    <div className={`relative w-full h-full bg-gradient-to-b ${data.backgroundGradient}`}>
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>

      {/* === ZONE 1: Orientation (Top) === */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            {data.businessName}
          </h1>
          <p className="text-white/60 text-sm">
            {data.tagline}
          </p>
        </motion.div>
      </div>

      {/* === ZONE 2: Primary Paths (Middle - THE HEART) === */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
          {data.categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryTap(category.id)}
              className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-left transition-all border border-white/10 hover:border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon */}
              <div className="text-2xl mb-2">{category.icon}</div>

              {/* Label */}
              <div className="text-white font-semibold text-sm mb-0.5">
                {category.label}
              </div>

              {/* Description */}
              <div className="text-white/50 text-[10px] leading-tight">
                {category.description}
              </div>

              {/* Hover indicator */}
              <div
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: data.accentColor }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* === Social Actions (Right side - Heart & Share only) === */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <motion.button
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">2.4k</span>
        </motion.button>

        <motion.button
          className="flex flex-col items-center gap-1"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">Share</span>
        </motion.button>
      </div>

      {/* === ZONE 3: Primary CTA (Bottom) === */}
      {data.primaryCta && (
        <div className="absolute bottom-0 left-0 right-0 pb-8 px-4">
          <motion.button
            className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all"
            style={{ backgroundColor: data.accentColor }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {data.primaryCta.text}
          </motion.button>

          {/* Home indicator */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      )}
    </div>
  )
}
