'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DepthWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Soft gradient glow behind content
 */
export function DepthGlow({ children, className = '' }: DepthWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-br from-leader-blue/40 via-purple-500/30 to-cyan-500/40 rounded-full scale-90" />
      {children}
    </div>
  )
}

/**
 * 3D perspective tilt with hover interaction
 */
export function Depth3DTilt({ children, className = '' }: DepthWrapperProps) {
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ rotateY: -12, rotateX: 6 }}
      whileHover={{ rotateY: 0, rotateX: 0 }}
      transition={{ duration: 0.4 }}
      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-2xl translate-x-4 translate-y-4 blur-xl -z-10" />
      {children}
    </motion.div>
  )
}

/**
 * Layered cards creating depth effect
 */
export function DepthLayered({ children, className = '' }: DepthWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -bottom-3 -right-3 w-full h-full bg-gray-200 rounded-2xl -z-20" />
      <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-gray-100 rounded-2xl -z-10" />
      {children}
    </div>
  )
}

/**
 * Dramatic colored shadow
 */
export function DepthColorShadow({ children, className = '' }: DepthWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="[&>*]:shadow-[0_0_60px_-15px_rgba(37,99,235,0.4),0_25px_50px_-12px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  )
}

/**
 * Floating animation with reflection
 */
export function DepthFloating({ children, className = '' }: DepthWrapperProps) {
  return (
    <div className={`relative pb-8 ${className}`}>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-200/50 to-transparent rounded-b-2xl transform scale-y-[-0.3] opacity-30 blur-sm" />
    </div>
  )
}




