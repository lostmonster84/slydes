'use client'

import { motion } from 'framer-motion'
import { Heart, HelpCircle, Share2, Info } from 'lucide-react'

interface SocialActionStackProps {
  heartCount: number
  isHearted: boolean
  faqCount?: number
  onHeartTap: () => void
  onFAQTap?: () => void
  onShareTap: () => void
  onInfoTap: () => void
  slideIndicator?: string // e.g., "3/9"
  hideFAQ?: boolean // Hide FAQ button (e.g., for Home Slyde)
  className?: string
}

/**
 * Format count for display (e.g., 2400 → "2.4k")
 */
function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'k'
  return Math.floor(count / 1000) + 'k'
}

/**
 * SocialActionStack - TikTok-style vertical action buttons
 * 
 * Buttons (top to bottom):
 * 1. Heart - Like/save with count
 * 2. FAQ - Question mark with FAQ count
 * 3. Share - Share button with label
 * 4. Info - Business info (no label)
 * 
 * Specs:
 * - Container: absolute right-3, vertical flex, gap-5
 * - Button: 40x40px, bg-white/20 backdrop-blur-sm rounded-full
 * - Icon: 20x20px, white
 * - Label: 10px, white, medium weight
 * 
 * @see SLYDESBUILD.md for full specification
 */
export function SocialActionStack({
  heartCount,
  isHearted,
  faqCount,
  onHeartTap,
  onFAQTap,
  onShareTap,
  onInfoTap,
  slideIndicator,
  hideFAQ = false,
  className = ''
}: SocialActionStackProps) {
  return (
    <div
      className={`flex flex-col items-center gap-5 pointer-events-auto ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Heart Button */}
      <motion.button
        className="flex flex-col items-center gap-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onHeartTap()
        }}
      >
        <motion.div
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          animate={{
            scale: isHearted ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isHearted ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </motion.div>
        <span className="text-white text-[10px] font-medium">{formatCount(heartCount)}</span>
      </motion.button>

      {/* FAQ Button (only shown when not hidden) */}
      {!hideFAQ && onFAQTap && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onFAQTap()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">{faqCount} FAQs</span>
        </motion.button>
      )}

      {/* Share Button */}
      <motion.button
        className="flex flex-col items-center gap-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onShareTap()
        }}
      >
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-[10px] font-medium">Share</span>
      </motion.button>

      {/* Info Button with Slide Indicator */}
      <motion.button
        className="flex flex-col items-center gap-1"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onInfoTap()
        }}
      >
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Info className="w-5 h-5 text-white" />
        </div>
        {slideIndicator && (
          <span className="text-white/50 text-[9px] font-medium">{slideIndicator}</span>
        )}
      </motion.button>
    </div>
  )
}

