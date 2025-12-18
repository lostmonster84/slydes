'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, AtSign, Info, ChevronRight } from 'lucide-react'
import { DevicePreview, MiniDevicePreview } from './DevicePreview'

/**
 * SlydeDemo - Interactive Slyde preview component
 *
 * Matches Studio UX exactly with:
 * - ProfilePill (frame 0 only)
 * - Social action stack (Heart, Share, Connect, Info)
 * - Badge (top center)
 * - Swipe/tap navigation
 *
 * Demo Business: Bloom Studio (Florist)
 */

interface Frame {
  title: string
  subtitle: string
  cta: string
  badge?: string
  gradient: string
  video?: string
  rating?: number
  reviewCount?: number
}

const frames: Frame[] = [
  {
    title: 'Villa Serenità',
    subtitle: 'Luxury Italian Escape',
    cta: 'Book Your Stay',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    video: '/videos/maison.mp4',
    rating: 5.0,
    reviewCount: 209
  },
  {
    title: 'Stunning Views',
    subtitle: 'Overlooking the Amalfi Coast',
    cta: 'See the Villa',
    gradient: 'from-sky-400 to-blue-500',
    video: '/videos/adventure.mp4'
  },
  {
    title: 'Private Chef Available',
    subtitle: 'Authentic Italian cuisine',
    cta: 'View Amenities',
    gradient: 'from-amber-400 to-orange-500',
    video: '/videos/restaurant.mp4'
  },
  {
    title: '"Best holiday ever!"',
    subtitle: '500+ five-star reviews',
    cta: 'Read Reviews',
    gradient: 'from-orange-500 to-amber-600',
    video: '/videos/car.mp4'
  },
  {
    title: 'Book Now',
    subtitle: 'From €450/night',
    cta: 'Check Availability',
    gradient: 'from-amber-600 to-orange-500',
    video: '/videos/maison.mp4'
  }
]

interface SlydeDemoProps {
  size?: 'full' | 'mini'
  autoPlay?: boolean
  className?: string
}

export function SlydeDemo({
  size = 'full',
  autoPlay = false,
  className = ''
}: SlydeDemoProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const touchStartY = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalFrames = frames.length
  const frame = frames[currentFrame]

  // Navigate to next/previous frame
  const goToFrame = useCallback((direction: 'next' | 'prev') => {
    setCurrentFrame(prev => {
      if (direction === 'next') {
        return prev < totalFrames - 1 ? prev + 1 : prev
      } else {
        return prev > 0 ? prev - 1 : prev
      }
    })
  }, [totalFrames])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToFrame('next')
      } else {
        goToFrame('prev')
      }
    }
  }

  // Wheel handler for desktop scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 20) {
      goToFrame('next')
    } else if (e.deltaY < -20) {
      goToFrame('prev')
    }
  }

  // Click handler - tap top/bottom halves
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const halfHeight = rect.height / 2

    if (clickY < halfHeight) {
      goToFrame('prev')
    } else {
      goToFrame('next')
    }
  }

  // Content that goes inside the device
  const content = (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer select-none overflow-hidden rounded-[2.5rem]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      {/* Background - Video or Gradient */}
      <AnimatePresence mode="wait">
        {frame.video ? (
          <motion.div
            key={`video-${currentFrame}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <video
              src={frame.video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            key={`gradient-${currentFrame}`}
            className={`absolute inset-0 bg-gradient-to-br ${frame.gradient}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Floating orb animation */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-24 h-24 bg-white/20 rounded-full blur-2xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-pink-300/30 rounded-full blur-xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 20, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      {/* Badge (top center) - NOT on home screen (frame 0) */}
      <AnimatePresence mode="wait">
        {frame.badge && currentFrame > 0 && (
          <motion.div
            key={`badge-${currentFrame}`}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {frame.badge}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Action Stack (right side) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
        {/* Heart */}
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">2.4k</span>
        </motion.button>

        {/* Share */}
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Share</span>
        </motion.button>

        {/* Connect */}
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <AtSign className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Connect</span>
        </motion.button>

        {/* Info + Frame indicator */}
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">{currentFrame + 1}/{totalFrames}</span>
        </motion.button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFrame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Rating display (frame 0 only) - ABOVE title */}
            {currentFrame === 0 && frame.rating && frame.reviewCount && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(frame.rating!) ? 'text-yellow-400' : 'text-white/30'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/80 text-xs">
                  {frame.rating.toFixed(1)} ({frame.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
              {frame.title}
            </h3>

            {/* Subtitle */}
            <p className="text-white/80 text-sm mb-3 drop-shadow-md">
              {frame.subtitle}
            </p>

            {/* ProfilePill (frame 0 only - NO CTA on home screen) */}
            {currentFrame === 0 ? (
              <motion.button
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-1.5 pl-1.5 pr-4 rounded-full flex items-center shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Profile circle */}
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">V</span>
                </div>
                {/* Business name */}
                <span className="flex-1 text-left text-sm font-semibold ml-2.5">Villa Serenità</span>
                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
              </motion.button>
            ) : (
              /* CTA Button (frames 1+ only) */
              <motion.button
                className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => e.stopPropagation()}
              >
                {frame.cta}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Swipe indicator (not on last frame) */}
        {currentFrame < totalFrames - 1 && (
          <motion.div
            className="flex flex-col items-center mt-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-white/50 text-[10px] mt-0.5">Swipe up</span>
          </motion.div>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-10" />
    </div>
  )

  // Render with appropriate device wrapper
  if (size === 'mini') {
    return (
      <MiniDevicePreview size="lg">
        {content}
      </MiniDevicePreview>
    )
  }

  return (
    <DevicePreview className={className} enableTilt={false}>
      {content}
    </DevicePreview>
  )
}

/**
 * MiniSlydeDemo - Compact version for inline use
 * Just shows the content without full interaction
 */
export function MiniSlydeDemo() {
  return <SlydeDemo size="mini" />
}
