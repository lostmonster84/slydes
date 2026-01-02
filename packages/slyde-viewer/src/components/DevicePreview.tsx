'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface DevicePreviewProps {
  children: React.ReactNode
  className?: string
  enableTilt?: boolean
}

/**
 * DevicePreview - iPhone device container for demo/preview
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - This component renders the phone chrome, renamed from PhoneFrame
 *   to avoid collision with "Frame" (vertical screen inside a Slyde)
 *
 * Specs:
 * - Device: 280x580px, rounded-[3rem]
 * - Screen: rounded-[2.25rem]
 * - Notch: w-32, h-7
 * - Side buttons: Left (3), Right (1)
 */
export function DevicePreview({
  children,
  className = '',
  enableTilt = true
}: DevicePreviewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // 3D tilt effect on scroll
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3])

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={enableTilt ? {
        rotateY,
        rotateX,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      } : undefined}
    >
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 rounded-full scale-75" />

      {/* iPhone Device */}
      <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-[0_0_60px_-15px_rgba(37,99,235,0.3),0_25px_50px_-12px_rgba(0,0,0,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]">
        {/* Side buttons - Left (decorative, no pointer events) */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l-full pointer-events-none" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l-full pointer-events-none" />
        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-700 rounded-l-full pointer-events-none" />

        {/* Side button - Right (power, decorative) */}
        <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-700 rounded-r-full pointer-events-none" />

        {/* Notch (decorative) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-4 bg-gray-800 rounded-full flex items-center justify-center gap-2">
            {/* Camera */}
            <div className="w-2 h-2 bg-gray-700 rounded-full" />
            {/* Sensor */}
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>

        {/* Screen Container */}
        <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-black">
          {children}
        </div>

        {/* Home indicator on device (decorative) */}
        <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full pointer-events-none" />
      </div>
    </motion.div>
  )
}

/**
 * HomeIndicator - Swipe indicator at bottom of screen
 */
export function HomeIndicator() {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-10" />
  )
}

// Backwards compatibility export
/** @deprecated Use DevicePreview instead */
export const PhoneFrame = DevicePreview
