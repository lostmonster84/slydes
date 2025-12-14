'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface ProfilePillProps {
  name: string
  image?: string
  accentColor?: string
  onClick: () => void
  className?: string
}

/**
 * ProfilePill - Full-width profile CTA button with glassmorphism
 * 
 * Profile circle sits snugly in the left curve of the pill.
 * Text centered, chevron right.
 * 
 * @see SLYDESBUILD.md for full specification
 */
export function ProfilePill({
  name,
  image,
  accentColor = 'bg-red-600',
  onClick,
  className = ''
}: ProfilePillProps) {
  // Get first letter for fallback
  const initial = name.charAt(0).toUpperCase()
  const isTailwindClass = typeof accentColor === 'string' && accentColor.trim().startsWith('bg-')

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-1.5 pl-1.5 pr-5 rounded-full flex items-center shadow-lg ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Profile circle - sits in the left curve of the pill */}
      <div
        className={`w-9 h-9 rounded-full ${isTailwindClass ? accentColor : ''} flex items-center justify-center flex-shrink-0`}
        style={isTailwindClass ? undefined : { background: accentColor }}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-white text-sm font-bold">{initial}</span>
        )}
      </div>

      {/* Business name - left aligned, next to profile */}
      <span className="flex-1 text-left text-white text-base font-semibold ml-3">
        {name}
      </span>

      {/* Chevron indicator - right aligned */}
      <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
    </motion.button>
  )
}
