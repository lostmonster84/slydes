'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronLeft, ShoppingCart, MessageCircle, Zap, Plus, Check } from 'lucide-react'
import { SocialActionStack } from '@/components/slyde-demo/SocialActionStack'
import type { InventoryItem } from './data/highlandMotorsData'

interface ItemSlydeViewProps {
  item: InventoryItem
  frameIndex: number
  onFrameChange: (index: number) => void
  onBack: () => void
  accentColor: string
  onAddToCart?: (item: InventoryItem) => void
  onBuyNow?: (item: InventoryItem) => void
  onEnquire?: (item: InventoryItem) => void
}

/**
 * ItemSlydeView - Level 3: Deep item immersion
 *
 * Full immersive experience for a single inventory item.
 * - Multi-frame navigation
 * - Complete SocialActionStack
 * - Back returns to InventoryGridView
 */
export function ItemSlydeView({
  item,
  frameIndex,
  onFrameChange,
  onBack,
  accentColor,
  onAddToCart,
  onBuyNow,
  onEnquire,
}: ItemSlydeViewProps) {
  const frames = item.frames
  const currentFrame = frames[frameIndex] || frames[0]
  const totalFrames = frames.length
  const commerceMode = item.commerce_mode

  // Heart state (local for demo)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(248)
  const [showAddSuccess, setShowAddSuccess] = useState(false)

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

  const handleTap = useCallback(() => {
    nextFrame()
  }, [nextFrame])

  const handleCommerceClick = useCallback(() => {
    if (commerceMode === 'add_to_cart' && onAddToCart) {
      onAddToCart(item)
      setShowAddSuccess(true)
      setTimeout(() => setShowAddSuccess(false), 800)
    } else if (commerceMode === 'buy_now' && onBuyNow) {
      onBuyNow(item)
    } else if (commerceMode === 'enquire' && onEnquire) {
      onEnquire(item)
    }
  }, [commerceMode, item, onAddToCart, onBuyNow, onEnquire])

  // Get commerce button config
  const getCommerceButton = () => {
    if (!commerceMode || commerceMode === 'none') return null
    const configs = {
      enquire: { icon: MessageCircle, label: 'Enquire Now', fullWidth: true },
      buy_now: { icon: Zap, label: 'Buy Now', fullWidth: true },
      add_to_cart: { icon: ShoppingCart, label: 'Add to Cart', fullWidth: true },
    }
    return configs[commerceMode] || null
  }

  const commerceButton = getCommerceButton()

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFrame.id}
          className={`absolute inset-0 bg-gradient-to-b pointer-events-none ${currentFrame.background.gradient || 'from-slate-800 to-slate-900'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

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
        onHeartTap={handleHeartTap}
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

            {/* Commerce Button (takes priority over frame CTA) */}
            {commerceButton ? (
              <button
                onClick={handleCommerceClick}
                className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ backgroundColor: accentColor }}
              >
                <commerceButton.icon className="w-4 h-4" />
                {commerceButton.label}
                {item.price && (
                  <span className="ml-1 opacity-80">• {item.price}</span>
                )}
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
