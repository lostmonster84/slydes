'use client'

import { motion } from 'framer-motion'

interface PhonePreviewProps {
  title?: string
  subtitle?: string
  cta?: string
  className?: string
}

const defaultProps = {
  title: 'Land Rover Defender',
  subtitle: 'Highland adventures await',
  cta: 'Book Now',
}

/**
 * Standard iPhone mockup with notch
 */
export function PhoneIPhone({ 
  title = defaultProps.title, 
  subtitle = defaultProps.subtitle, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`w-[160px] h-[320px] bg-gray-900 rounded-[2.5rem] p-2 shadow-xl relative ${className}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-10" />
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] flex flex-col justify-end p-4 text-white">
        <div className="text-[8px] text-white/60">Available Now</div>
        <div className="text-sm font-bold mb-1">{title}</div>
        {subtitle && <div className="text-[9px] text-white/70 mb-3">{subtitle}</div>}
        <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">{cta}</div>
      </div>
    </div>
  )
}

/**
 * Minimal flat phone frame
 */
export function PhoneMinimal({ 
  title = defaultProps.title, 
  subtitle = defaultProps.subtitle, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`w-[140px] h-[280px] bg-white rounded-2xl border-4 border-gray-900 overflow-hidden shadow-lg ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col justify-end p-4 text-white">
        <div className="text-[8px] text-white/60">Available Now</div>
        <div className="text-xs font-bold mb-1">{title}</div>
        {subtitle && <div className="text-[8px] text-white/70 mb-2">{subtitle}</div>}
        <div className="w-full bg-white text-gray-900 rounded-full py-1.5 text-[10px] font-semibold text-center">{cta}</div>
      </div>
    </div>
  )
}

/**
 * Browser frame instead of phone
 */
export function PhoneBrowser({ 
  title = defaultProps.title, 
  subtitle = defaultProps.subtitle, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`w-[280px] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
        <div className="flex-1 bg-gray-200 rounded text-[8px] text-gray-500 px-2 py-0.5 text-center">slydes.io/wildtrax</div>
      </div>
      <div className="aspect-[9/16] max-h-[300px] bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col justify-end p-4 text-white">
        <div className="text-[8px] text-white/60">Available Now</div>
        <div className="text-sm font-bold mb-1">{title}</div>
        {subtitle && <div className="text-[9px] text-white/70 mb-3">{subtitle}</div>}
        <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">{cta}</div>
      </div>
    </div>
  )
}

/**
 * Phone with hand holding gesture
 */
export function PhoneWithHand({ 
  title = defaultProps.title, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-xl relative z-10">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">{title}</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">{cta}</div>
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-full -z-10" />
    </div>
  )
}

/**
 * Phone with floating app icons around it
 */
export function PhoneWithIcons({ 
  title = defaultProps.title, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div 
        className="absolute -top-4 -left-8 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-8 -right-10 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-2 -left-6 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">{title}</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">{cta}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Small inline phone preview (for editor mockups)
 */
export function PhoneMini({ 
  title = defaultProps.title, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`w-[100px] h-[200px] bg-gray-900 rounded-xl p-1 shadow-sm ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
        <div className="text-[6px] text-white/60">Available Now</div>
        <div className="text-[8px] font-bold mb-0.5">{title}</div>
        <div className="w-full bg-white text-gray-900 rounded-full py-0.5 text-[5px] font-semibold text-center">{cta}</div>
      </div>
    </div>
  )
}

/**
 * Large dramatic phone for hero sections
 */
export function PhoneDramatic({ 
  title = defaultProps.title, 
  subtitle = defaultProps.subtitle, 
  cta = defaultProps.cta,
  className = '' 
}: PhonePreviewProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-64 h-64 bg-gradient-to-br from-leader-blue/20 to-cyan-500/20 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ rotateY: -10 }}
        whileHover={{ rotateY: 0 }}
        style={{ transformPerspective: 1000 }}
      >
        <div className="w-[180px] h-[360px] bg-gray-900 rounded-[2.5rem] p-2 shadow-[0_0_60px_-15px_rgba(37,99,235,0.3)]">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] flex flex-col justify-end p-5 text-white">
            <div className="text-xs text-white/60 mb-1">Available Now</div>
            <div className="text-lg font-bold mb-2">{title}</div>
            {subtitle && <div className="text-xs text-white/70 mb-4">{subtitle}</div>}
            <div className="w-full bg-white text-gray-900 rounded-full py-2.5 text-sm font-semibold text-center">{cta}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}



