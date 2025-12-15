'use client'

import { motion } from 'framer-motion'

interface RatingDisplayProps {
  rating: number      // 0-5
  reviewCount: number
  onClick?: () => void
  className?: string
}

/**
 * RatingDisplay - Star rating with review count
 * 
 * Specs:
 * - Stars: 12x12px, text-yellow-400 filled
 * - Rating: 10px, text-white/80
 * - Format: "5.0 (209 reviews)"
 * - Clickable: Opens reviews when onClick provided
 * 
 * @see SLYDESBUILD.md for full specification
 */
export function RatingDisplay({ rating, reviewCount, onClick, className = '' }: RatingDisplayProps) {
  const content = (
    <>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-white/30'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-white/80 text-[10px]">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
    </>
  )

  if (onClick) {
    return (
      <motion.button
        className={`flex items-center gap-2 ${className}`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {content}
    </div>
  )
}

