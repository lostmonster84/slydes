'use client'

import { motion } from 'framer-motion'

interface BadgeProps {
  text: string
  className?: string
}

/**
 * Badge - Top-left credential/tag pill
 *
 * Specs:
 * - Position: absolute top-10 left-4
 * - Background: bg-white/20 backdrop-blur-md
 * - Text: 10px, white, medium weight
 * - Padding: px-3 py-1
 * - Border: rounded-full
 */
export function Badge({ text, className = '' }: BadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`inline-block ${className}`}
    >
      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1 rounded-full">
        {text}
      </span>
    </motion.div>
  )
}
