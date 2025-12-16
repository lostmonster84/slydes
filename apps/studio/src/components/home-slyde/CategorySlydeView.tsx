'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronLeft } from 'lucide-react'
import { SocialActionStack } from '@/components/slyde-demo/SocialActionStack'
import type { CategoryData } from './data/highlandMotorsData'

interface CategorySlydeViewProps {
  category: CategoryData
  frameIndex: number
  onFrameChange: (index: number) => void
  onViewAll: () => void
  onBack: () => void
  accentColor: string
}

/**
 * CategorySlydeView - Level 1: Curated multi-frame experience
 *
 * - 3-6 frames with swipe navigation
 * - Full SocialActionStack
 * - "View All" CTA triggers inventory grid transition
 * - Back gesture returns to Home Slyde
 */
export function CategorySlydeView({
  category,
  frameIndex,
  onFrameChange,
  onViewAll,
  onBack,
  accentColor,
}: CategorySlydeViewProps) {
  const frames = category.frames || []
  const currentFrame = frames[frameIndex] || frames[0]
  const totalFrames = frames.length

  // Heart state (local for demo)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(1200)

  const handleHeartTap = useCallback(() => {
    setIsHearted((prev) => {
      setHeartCount((count) => (prev ? count - 1 : count + 1))
      return !prev
    })
  }, [])

  const nextFrame = useCallback(() => {
    if (frameIndex < totalFrames - 1) {
      onFrameChange(frameIndex + 1)
    }
  }, [frameIndex, totalFrames, onFrameChange])

  const prevFrame = useCallback(() => {
    if (frameIndex > 0) {
      onFrameChange(frameIndex - 1)
    }
  }, [frameIndex, onFrameChange])

  const handleTap = useCallback(() => {
    nextFrame()
  }, [nextFrame])

  // Guard against missing frames
  if (!currentFrame) {
    return (
      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
        <p className="text-white/60">No frames available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${currentFrame.background.gradient || 'from-slate-800 to-slate-900'}`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* iOS Back button */}
      <button
        onClick={onBack}
        className="absolute top-12 left-3 z-30 flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
        <span className="text-white text-[15px] font-medium pr-1">Back</span>
      </button>

      {/* Tap zone for navigation */}
      <div
        className="absolute left-0 right-16 top-0 bottom-40 z-20 cursor-pointer"
        onClick={handleTap}
      />


      {/* === RIGHT SIDE ACTIONS === (using shared SocialActionStack) */}
      <SocialActionStack
        heartCount={heartCount}
        isHearted={isHearted}
        faqCount={12}
        onHeartTap={handleHeartTap}
        onFAQTap={() => {}}
        onShareTap={() => {}}
        onInfoTap={() => {}}
        slideIndicator={`${frameIndex + 1}/${totalFrames}`}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-40"
      />

      {/* === BOTTOM CONTENT === */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
              {currentFrame.title}
            </h3>

            {/* Subtitle */}
            {currentFrame.subtitle && (
              <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14 line-clamp-2">
                {currentFrame.subtitle}
              </p>
            )}

            {/* CTA Button - View All or regular CTA */}
            {currentFrame.showViewAll && category.inventory ? (
              <button
                onClick={onViewAll}
                className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all"
                style={{ backgroundColor: accentColor }}
              >
                {currentFrame.cta?.text || `View All ${category.inventory.length} Items`}
              </button>
            ) : currentFrame.cta ? (
              <button
                className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all"
                style={{ backgroundColor: accentColor }}
              >
                {currentFrame.cta.text}
              </button>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Swipe indicator */}
        <motion.div
          className="flex flex-col items-center mt-4 cursor-pointer"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={() => {
            if (frameIndex !== 0) {
              onFrameChange(0)
            }
          }}
        >
          <ChevronUp className="w-5 h-5 text-white/60" />
          <span className="text-white/50 text-[10px] mt-0.5">
            {frameIndex === 0 ? 'Swipe up' : 'Back to top'}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
