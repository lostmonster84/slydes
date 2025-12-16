'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, Trash2, Minus, Plus, X } from 'lucide-react'
import type { CartItem } from '@/lib/useCart'

interface StickyCheckoutBarProps {
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
}

/**
 * StickyCheckoutBar - Persistent cart summary at bottom of phone
 *
 * Two states:
 * 1. Collapsed: Shows item count + total, tap to expand
 * 2. Expanded: Full cart view with items, quantities, checkout button
 */
export function StickyCheckoutBar({
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
}: StickyCheckoutBarProps) {
  if (itemCount === 0) return null

  return (
    <AnimatePresence>
      {/* Backdrop when expanded */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 z-40"
          onClick={onToggle}
        />
      )}

      {/* Cart Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Expanded Cart View */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1c1c1e] border-t border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-white/60" />
                  <span className="text-white font-semibold text-sm">
                    Your Cart ({itemCount})
                  </span>
                </div>
                <button
                  onClick={onClearCart}
                  className="text-red-400 text-xs font-medium flex items-center gap-1 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              {/* Cart Items */}
              <div className="max-h-[200px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 flex items-center justify-center">
                      <span className="text-sm opacity-40">🚗</span>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-xs font-semibold truncate">
                        {item.title}
                      </h4>
                      <p className="text-white/50 text-[10px] truncate">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-white text-xs font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p
                        className="text-xs font-bold"
                        style={{ color: accentColor }}
                      >
                        {item.price}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Bar / Checkout Button */}
        <div className="bg-[#1c1c1e] border-t border-white/10 px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-center gap-4">
            {/* Left: View cart */}
            <button
              onClick={onToggle}
              className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: accentColor }}
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {/* Item count badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[10px] font-bold rounded-full flex items-center justify-center"
                style={{ color: accentColor }}
              >
                {itemCount}
              </span>
            </button>

            {/* Center: Total */}
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {totalFormatted}
              </p>
            </div>

            {/* Right: Checkout button */}
            <button
              onClick={onCheckout}
              className="w-12 h-12 rounded-full text-white flex items-center justify-center active:scale-95 transition-transform shadow-lg"
              style={{ backgroundColor: accentColor }}
              aria-label="Checkout"
            >
              <Check className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
