'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'

interface CartToastProps {
  message: string | null
  onDismiss: () => void
}

/**
 * CartToast - Animated notification when item is added to cart
 *
 * Shows at top of phone screen with slide-down animation.
 * Auto-dismisses after 2 seconds.
 */
export function CartToast({ message, onDismiss }: CartToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message, onDismiss])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute top-12 left-4 right-4 z-[60]"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2c2c2e]/95 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{message}</p>
              <p className="text-xs text-white/50">Added to cart</p>
            </div>
            <ShoppingCart className="w-4 h-4 text-white/40" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
