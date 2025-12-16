'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/lib/useCart'

interface FloatingCartButtonProps {
  items: CartItem[]
  itemCount: number
  totalFormatted: string
  isOpen: boolean
  onToggle: () => void
  onCheckout: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  accentColor: string
  /** Flash green tick when item added */
  showAddedFeedback?: boolean
}

/**
 * iOS-style Swipeable Cart Item
 */
function SwipeableCartItem({
  item,
  accentColor,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  accentColor: string
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  const x = useMotionValue(0)
  const deleteOpacity = useTransform(x, [-100, -50], [1, 0])
  const deleteScale = useTransform(x, [-100, -50], [1, 0.8])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false)
    if (info.offset.x < -80) {
      onRemove()
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Delete button behind */}
      <motion.div
        className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center"
        style={{ opacity: deleteOpacity, scale: deleteScale }}
      >
        <Trash2 className="w-5 h-5 text-white" />
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative bg-[#2c2c2e] px-4 py-3"
      >
        <div className="flex items-center gap-3">
          {/* Title + Subtitle + Stepper */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-[13px] font-medium leading-tight">
              {item.title}
            </h4>
            {item.subtitle && (
              <p className="text-white/40 text-[11px] mt-0.5 mb-1.5">
                {item.subtitle}
              </p>
            )}
            {/* Compact iOS Stepper */}
            <div className="inline-flex items-center rounded-md overflow-hidden bg-white/10">
              <button
                onClick={() => !isDragging && onUpdateQuantity(item.quantity - 1)}
                className="w-7 h-6 flex items-center justify-center active:bg-white/20"
              >
                <Minus className="w-3 h-3 text-white/60" />
              </button>
              <div className="w-6 h-6 flex items-center justify-center border-x border-white/10">
                <span className="text-white text-[11px] font-semibold">
                  {item.quantity}
                </span>
              </div>
              <button
                onClick={() => !isDragging && onUpdateQuantity(item.quantity + 1)}
                className="w-7 h-6 flex items-center justify-center active:bg-white/20"
              >
                <Plus className="w-3 h-3 text-white/60" />
              </button>
            </div>
          </div>

          {/* Price */}
          <p
            className="text-[14px] font-semibold flex-shrink-0"
            style={{ color: accentColor }}
          >
            {item.price}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * FloatingCartButton - Non-intrusive cart access
 *
 * - Small floating button top-right with badge
 * - Tap opens bottom sheet with full cart
 * - Checkout happens inside the sheet
 * - Close to continue browsing
 */
export function FloatingCartButton({
  items,
  itemCount,
  totalFormatted,
  isOpen,
  onToggle,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  accentColor,
}: FloatingCartButtonProps) {
  if (itemCount === 0) return null

  return (
    <>
      {/* Floating Cart Button - Top Right */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="absolute top-4 right-4 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: accentColor }}
        aria-label="View cart"
      >
        <ShoppingCart className="w-5 h-5 text-white" />
        {/* Badge */}
        <span
          className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center shadow bg-white"
          style={{ color: accentColor }}
        >
          {itemCount}
        </span>
      </motion.button>

      {/* Cart Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40"
              onClick={onToggle}
            />

            {/* Bottom Sheet - iOS style with blur */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-[#1c1c1e]/90 backdrop-blur-xl rounded-t-[20px] overflow-hidden"
            >
              {/* Handle - iOS style */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-9 h-[5px] rounded-full bg-white/30" />
              </div>

              {/* Header - iOS minimal */}
              <div className="px-4 py-2">
                <h2 className="text-white/80 text-[13px] font-medium text-center">
                  Cart
                </h2>
              </div>

              {/* Cart Items - Swipeable */}
              <div className="max-h-[260px] overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={index !== items.length - 1 ? 'border-b border-white/5' : ''}
                  >
                    <SwipeableCartItem
                      item={item}
                      accentColor={accentColor}
                      onUpdateQuantity={(qty) => onUpdateQuantity(item.id, qty)}
                      onRemove={() => onRemoveItem(item.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Footer - Total + Checkout */}
              <div className="px-4 pt-3 pb-4 border-t border-white/10 safe-area-pb">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-[13px]">Total</span>
                  <span className="text-white font-bold text-[17px]">{totalFormatted}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full h-11 mt-3 rounded-xl text-white text-[15px] font-semibold flex items-center justify-center active:opacity-80 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
