'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, HelpCircle, Share2, Info, ChevronUp, ChevronLeft } from 'lucide-react'
import type { CategoryData } from '../data/highlandMotorsData'

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
  const frames = category.frames
  const currentFrame = frames[frameIndex] || frames[0]
  const totalFrames = frames.length

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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFrame.id}
          className={`absolute inset-0 bg-gradient-to-b ${currentFrame.background.gradient || 'from-slate-800 to-slate-900'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-10 left-3 z-30 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Tap zone for navigation */}
      <div
        className="absolute left-0 right-16 top-0 bottom-40 z-20 cursor-pointer"
        onClick={handleTap}
      />

      {/* === TOP SECTION === */}
      <div className="absolute top-10 left-0 right-0 px-4 z-10">
        <AnimatePresence mode="wait">
          {currentFrame.badge && (
            <motion.div
              key={`badge-${currentFrame.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 ml-10"
            >
              <span className="text-xs font-medium text-white">{currentFrame.badge}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === RIGHT SIDE ACTIONS === */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {/* Frame indicator */}
        <div className="text-[10px] text-white/60 font-medium mb-2">
          {frameIndex + 1}/{totalFrames}
        </div>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">1.2k</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">FAQ</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">Share</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">Info</span>
        </button>
      </div>

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

      {/* Frame dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => onFrameChange(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === frameIndex ? 'bg-white w-4' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
