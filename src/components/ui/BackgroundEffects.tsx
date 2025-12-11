'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BackgroundProps {
  children: ReactNode
  className?: string
}

/**
 * Dot grid pattern background
 */
export function BackgroundDotGrid({ children, className = '' }: BackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-12 -z-10">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
      </div>
      {children}
    </div>
  )
}

/**
 * Concentric circles emanating from center
 */
export function BackgroundConcentricCircles({ children, className = '' }: BackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="absolute w-[400px] h-[400px] rounded-full border border-leader-blue/10" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-leader-blue/15" />
        <div className="absolute w-[240px] h-[240px] rounded-full border border-leader-blue/20" />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-leader-blue/25" />
      </div>
      {children}
    </div>
  )
}

/**
 * Animated floating gradient orbs
 */
export function BackgroundGradientOrbs({ children, className = '' }: BackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div 
        className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-leader-blue/20 to-cyan-500/20 rounded-full blur-3xl -z-10"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-3xl -z-10"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {children}
    </div>
  )
}

/**
 * Line grid with gradient overlay
 */
export function BackgroundLineGrid({ children, className = '' }: BackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-8 -z-10 overflow-hidden rounded-3xl">
        <div 
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white" />
      </div>
      {children}
    </div>
  )
}

/**
 * Floating abstract geometric shapes
 */
export function BackgroundAbstractShapes({ children, className = '' }: BackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -z-10">
        <motion.div 
          className="absolute -top-8 -right-8 w-24 h-24 bg-leader-blue/10 rounded-2xl"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-500/10 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 -left-12 w-8 h-32 bg-purple-500/10 rounded-full"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>
      {children}
    </div>
  )
}
