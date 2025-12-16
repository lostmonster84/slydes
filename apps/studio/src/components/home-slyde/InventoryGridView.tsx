'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, MessageCircle, Zap, Check } from 'lucide-react'
import type { InventoryItem, CommerceMode } from './data/highlandMotorsData'

interface InventoryGridViewProps {
  categoryName: string
  items: InventoryItem[]
  onItemTap: (itemId: string) => void
  onBack: () => void
  accentColor: string
  onAddToCart?: (item: InventoryItem) => void
  onBuyNow?: (item: InventoryItem) => void
  onEnquire?: (item: InventoryItem) => void
}

/**
 * InventoryGridView - Level 2: List format with square thumbnails
 *
 * Key rules from CATEGORY-INVENTORY-FLOW.md:
 * - Grids are NEVER an entry point
 * - Grids are only accessible from a Category Slyde
 * - Grids are shallow and utilitarian
 * - List layout with square thumbnails, minimal metadata
 */
/**
 * Commerce button component for quick actions
 * Flashes green with tick on add_to_cart success
 */
function CommerceButton({
  mode,
  accentColor,
  onClick,
}: {
  mode: CommerceMode
  accentColor: string
  onClick: (e: React.MouseEvent) => void
}) {
  const [showSuccess, setShowSuccess] = useState(false)

  if (mode === 'none' || !mode) return null

  const handleClick = (e: React.MouseEvent) => {
    onClick(e)
    // Flash checkmark for add_to_cart (iOS App Store style)
    if (mode === 'add_to_cart') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 800)
    }
  }

  // iOS App Store style - circle button with + or ✓
  if (mode === 'add_to_cart') {
    return (
      <motion.button
        onClick={handleClick}
        animate={{
          backgroundColor: showSuccess ? '#22c55e' : accentColor,
        }}
        transition={{ duration: 0.15 }}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="tick"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }

  // Other modes keep text labels
  const config = {
    enquire: { icon: MessageCircle, label: 'Enquire' },
    buy_now: { icon: Zap, label: 'Buy' },
  }[mode]

  if (!config) return null

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white text-[11px] font-semibold"
      style={{ backgroundColor: accentColor }}
    >
      <config.icon className="w-3.5 h-3.5" />
      {config.label}
    </button>
  )
}

export function InventoryGridView({
  categoryName,
  items,
  onItemTap,
  onBack,
  accentColor,
  onAddToCart,
  onBuyNow,
  onEnquire,
}: InventoryGridViewProps) {
  const handleCommerceClick = (e: React.MouseEvent, item: InventoryItem) => {
    e.stopPropagation() // Don't navigate to item detail
    const mode = item.commerce_mode
    if (mode === 'add_to_cart' && onAddToCart) {
      onAddToCart(item)
    } else if (mode === 'buy_now' && onBuyNow) {
      onBuyNow(item)
    } else if (mode === 'enquire' && onEnquire) {
      onEnquire(item)
    }
  }
  return (
    <div className="relative w-full h-full bg-[#1c1c1e] flex flex-col">
      {/* iOS Navigation Bar */}
      <div className="pt-12 pb-2 px-4 bg-[#1c1c1e]">
        <button
          onClick={onBack}
          className="flex items-center gap-0.5 -ml-1"
          style={{ color: accentColor }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[17px]">Back</span>
        </button>
        <div className="flex items-baseline gap-2 mt-1">
          <h1 className="text-white text-[34px] font-bold tracking-tight">
            {categoryName}
          </h1>
          <span className="text-white/40 text-[15px]">{items.length}</span>
        </div>
      </div>

      {/* iOS Grouped List */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Grouped container with rounded corners */}
        <div className="mx-4 mt-2 mb-6 bg-[#2c2c2e] rounded-xl overflow-hidden">
          {items.map((item, index) => (
            <div key={item.id}>
              <motion.button
                onClick={() => onItemTap(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/5 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                {/* Square Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-[#3a3a3c] flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient placeholder if image fails
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-[#3a3a3c] to-[#2c2c2e] ${item.image ? 'hidden' : ''}`} />
                </div>

                {/* Item Info - Title + Price only */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-white text-[15px] font-medium line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p style={{ color: accentColor }} className="text-[15px] font-semibold mt-0.5">
                    {item.price}
                  </p>
                </div>

                {/* Commerce button or chevron */}
                {item.commerce_mode && item.commerce_mode !== 'none' ? (
                  <CommerceButton
                    mode={item.commerce_mode}
                    accentColor={accentColor}
                    onClick={(e) => handleCommerceClick(e, item)}
                  />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/20 flex-shrink-0" />
                )}
              </motion.button>
              {/* iOS separator - inset from left (aligned with text, not thumbnail) */}
              {index < items.length - 1 && (
                <div className="ml-[76px] h-[0.5px] bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="w-32 h-1 rounded-full bg-white/30" />
      </div>
    </div>
  )
}
