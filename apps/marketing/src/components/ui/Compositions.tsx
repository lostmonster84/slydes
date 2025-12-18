'use client'

import { motion } from 'framer-motion'
import { MiniDevicePreview } from './DevicePreview'

/**
 * Side panel with info cards + phone
 */
export function CompositionSidePanel() {
  return (
    <div className="flex gap-6 items-center">
      <div className="w-48 space-y-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Editing</div>
          <div className="font-bold text-gray-900">Hero Frame</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-400 mb-2">Quick Actions</div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            <div className="w-8 h-8 bg-leader-blue rounded-lg" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
          <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Live Preview
          </div>
        </div>
      </div>
      <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-lg">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Timeline flow showing edit process
 */
export function CompositionTimeline() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-leader-blue rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
        <div className="w-0.5 h-8 bg-gray-200" />
        <div className="w-8 h-8 bg-leader-blue rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
        <div className="w-0.5 h-8 bg-gray-200" />
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold">3</div>
      </div>
      <div className="relative">
        <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white relative">
            <div className="absolute inset-x-2 bottom-12 top-1/2 border-2 border-leader-blue border-dashed rounded-lg" />
            <div className="text-[7px] text-white/60">Available Now</div>
            <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
            <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
          </div>
        </div>
        <div className="absolute -right-2 top-1/3 bg-leader-blue text-white text-[8px] px-2 py-1 rounded-lg shadow-lg">
          Editing title...
        </div>
      </div>
    </div>
  )
}

/**
 * Dark mode editor theme with animated phone preview
 */
export function CompositionDarkMode() {
  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-6 flex gap-6 border border-white/10">
      <div className="w-36 space-y-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Title</label>
          <div className="bg-white/5 rounded px-2 py-1.5 text-xs text-white border border-white/10">Bloom Studio</div>
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Style</label>
          <div className="flex gap-1.5">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-rose-500 to-pink-600 ring-2 ring-white/30" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-leader-blue to-electric-cyan" />
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-orange-500" />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Background</label>
          <div className="bg-white/5 rounded px-2 py-1.5 text-xs text-white/70 border border-white/10 flex items-center gap-2">
            <motion.div
              className="w-4 h-4 rounded bg-gradient-to-br from-rose-500 to-pink-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            video.mp4
          </div>
        </div>
      </div>
      <MiniDevicePreview>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ backgroundSize: '200% 200%' }}
        />

        {/* Pulsing orb */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative w-full h-full flex flex-col justify-end p-3 text-white z-10">
          <div className="text-[7px] text-white/80">Florist</div>
          <div className="text-[10px] font-bold mb-0.5">Bloom Studio</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[6px] font-semibold text-center">
            Shop Flowers
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white/30 rounded-full" />
      </MiniDevicePreview>
    </div>
  )
}

/**
 * Glassmorphism card composition
 */
export function CompositionGlass() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10">
        <div className="absolute top-0 left-0 w-48 h-48 bg-leader-blue/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-6 flex gap-6">
        <div className="w-36 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Title</label>
            <div className="bg-white/80 rounded px-2 py-1.5 text-xs text-gray-700 border border-gray-200/50">Land Rover Defender</div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Colors</label>
            <div className="flex gap-1.5">
              <div className="w-6 h-6 rounded bg-leader-blue shadow-sm" />
              <div className="w-6 h-6 rounded bg-white border border-gray-200" />
              <div className="w-6 h-6 rounded bg-gray-900" />
            </div>
          </div>
        </div>
        <div className="w-[100px] h-[200px] bg-gray-900 rounded-xl p-1 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
            <div className="text-[6px] text-white/60">Available Now</div>
            <div className="text-[8px] font-bold mb-0.5">Land Rover Defender</div>
            <div className="w-full bg-white text-gray-900 rounded-full py-0.5 text-[5px] font-semibold text-center">Book Now</div>
          </div>
        </div>
      </div>
    </div>
  )
}




