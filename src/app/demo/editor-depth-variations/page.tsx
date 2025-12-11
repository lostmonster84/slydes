'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// ============================================
// CATEGORY 1: EDITOR LAYOUTS (5 variations)
// Different ways to structure the editor UI
// ============================================

function EditorLayout1() {
  // Side-by-side: Controls left, phone right (current)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden w-full max-w-md">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-400">Slydes Editor</div>
      </div>
      <div className="p-6 flex gap-6">
        <div className="w-36 space-y-4 flex-shrink-0">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Title</label>
            <div className="bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-700 border border-gray-100">Land Rover Defender</div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Background</label>
            <div className="bg-gray-100 rounded px-2 py-1.5 text-xs text-gray-500 border border-gray-100">video.mp4</div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Button</label>
            <div className="flex gap-1.5">
              <div className="w-6 h-6 rounded bg-leader-blue"></div>
              <div className="w-6 h-6 rounded bg-white border border-gray-200"></div>
              <div className="w-6 h-6 rounded bg-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-[100px] h-[200px] bg-gray-900 rounded-xl p-1">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
              <div className="text-[6px] text-white/60">Available Now</div>
              <div className="text-[8px] font-bold mb-0.5">Land Rover Defender</div>
              <div className="w-full bg-white text-gray-900 rounded-full py-0.5 text-[5px] font-semibold text-center">Book Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorLayout2() {
  // Stacked: Phone on top, controls below
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden w-72">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-400">Slydes Editor</div>
      </div>
      <div className="p-6">
        {/* Phone centered on top */}
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[240px] bg-gray-900 rounded-2xl p-1.5">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
              <div className="text-[7px] text-white/60">Available Now</div>
              <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
              <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
            </div>
          </div>
        </div>
        {/* Controls in a row below */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">Media</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">Text</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">Style</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorLayout3() {
  // Toolbar style: Phone with floating toolbar
  return (
    <div className="relative">
      {/* Phone */}
      <div className="w-[160px] h-[320px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl mx-auto">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-4 text-white">
          <div className="text-[8px] text-white/60">Available Now</div>
          <div className="text-sm font-bold mb-1">Land Rover Defender</div>
          <div className="text-[9px] text-white/70 mb-3">Highland adventures await</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">Book Now</div>
        </div>
      </div>
      {/* Floating toolbar */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex gap-3">
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-leader-blue flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function EditorLayout4() {
  // Split screen: Two phones showing before/after
  return (
    <div className="flex gap-4 items-end">
      {/* Before - smaller, faded */}
      <div className="opacity-50">
        <div className="text-[10px] text-gray-400 text-center mb-2">Before</div>
        <div className="w-[80px] h-[160px] bg-gray-300 rounded-xl p-1">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-[8px]">Old Site</span>
          </div>
        </div>
      </div>
      {/* Arrow */}
      <div className="pb-20">
        <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      {/* After - larger, prominent */}
      <div>
        <div className="text-[10px] text-leader-blue text-center mb-2 font-medium">With Slydes</div>
        <div className="w-[120px] h-[240px] bg-gray-900 rounded-2xl p-1.5 shadow-lg shadow-leader-blue/20">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
            <div className="text-[7px] text-white/60">Available Now</div>
            <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
            <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorLayout5() {
  // Frame stack: Multiple frames visible in layers
  return (
    <div className="relative w-[200px] h-[350px]">
      {/* Background frames */}
      <div className="absolute top-0 left-0 w-[140px] h-[280px] bg-gray-200 rounded-2xl opacity-30 transform -rotate-6" />
      <div className="absolute top-4 left-4 w-[140px] h-[280px] bg-gray-300 rounded-2xl opacity-50 transform -rotate-3" />
      {/* Main frame */}
      <div className="absolute top-8 left-8 w-[140px] h-[280px] bg-gray-900 rounded-2xl p-1.5 shadow-xl">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
          <div className="text-[6px] text-white/70 mb-2">Highland adventures await</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
        </div>
      </div>
      {/* Frame count badge */}
      <div className="absolute bottom-0 right-0 bg-leader-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        3 frames
      </div>
    </div>
  )
}

// ============================================
// CATEGORY 2: DEPTH TREATMENTS (5 variations)
// Different ways to add depth/dimension
// ============================================

function Depth1() {
  // Soft glow behind
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-br from-leader-blue/40 via-purple-500/30 to-cyan-500/40 rounded-full scale-90" />
      <PhoneCard />
    </div>
  )
}

function Depth2() {
  // 3D tilt with perspective
  return (
    <motion.div 
      className="relative"
      initial={{ rotateY: -12, rotateX: 6 }}
      whileHover={{ rotateY: 0, rotateX: 0 }}
      transition={{ duration: 0.4 }}
      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-2xl translate-x-4 translate-y-4 blur-xl" />
      <PhoneCard className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]" />
    </motion.div>
  )
}

function Depth3() {
  // Layered cards creating depth
  return (
    <div className="relative">
      <div className="absolute -bottom-3 -right-3 w-full h-full bg-gray-200 rounded-2xl" />
      <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-gray-100 rounded-2xl" />
      <PhoneCard className="relative" />
    </div>
  )
}

function Depth4() {
  // Dramatic shadow with color
  return (
    <div className="relative">
      <PhoneCard className="shadow-[0_0_60px_-15px_rgba(37,99,235,0.4),0_25px_50px_-12px_rgba(0,0,0,0.25)]" />
    </div>
  )
}

function Depth5() {
  // Floating with reflection
  return (
    <div className="relative pb-8">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <PhoneCard className="shadow-2xl" />
      </motion.div>
      {/* Reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-200/50 to-transparent rounded-b-2xl transform scale-y-[-0.3] opacity-30 blur-sm" />
    </div>
  )
}

// ============================================
// CATEGORY 3: BACKGROUND ELEMENTS (5 variations)
// Different backdrop patterns/shapes
// ============================================

function Background1() {
  // Dot grid
  return (
    <div className="relative">
      <div className="absolute -inset-12 -z-10">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />
      </div>
      <PhoneCard />
    </div>
  )
}

function Background2() {
  // Concentric circles
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="absolute w-[400px] h-[400px] rounded-full border border-leader-blue/10" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-leader-blue/15" />
        <div className="absolute w-[240px] h-[240px] rounded-full border border-leader-blue/20" />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-leader-blue/25" />
      </div>
      <PhoneCard />
    </div>
  )
}

function Background3() {
  // Floating gradient orbs
  return (
    <div className="relative">
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
      <PhoneCard />
    </div>
  )
}

function Background4() {
  // Line grid with gradient
  return (
    <div className="relative">
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
      <PhoneCard />
    </div>
  )
}

function Background5() {
  // Abstract shapes
  return (
    <div className="relative">
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
      <PhoneCard />
    </div>
  )
}

// ============================================
// CATEGORY 4: PHONE PREVIEW STYLES (5 variations)
// Different phone mockup treatments
// ============================================

function Phone1() {
  // Standard iPhone mockup
  return (
    <div className="w-[160px] h-[320px] bg-gray-900 rounded-[2.5rem] p-2 shadow-xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-10" />
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[2rem] flex flex-col justify-end p-4 text-white">
        <div className="text-[8px] text-white/60">Available Now</div>
        <div className="text-sm font-bold mb-1">Land Rover Defender</div>
        <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">Book Now</div>
      </div>
    </div>
  )
}

function Phone2() {
  // Minimal flat phone
  return (
    <div className="w-[140px] h-[280px] bg-white rounded-2xl border-4 border-gray-900 overflow-hidden shadow-lg">
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col justify-end p-4 text-white">
        <div className="text-[8px] text-white/60">Available Now</div>
        <div className="text-xs font-bold mb-1">Land Rover Defender</div>
        <div className="w-full bg-white text-gray-900 rounded-full py-1.5 text-[10px] font-semibold text-center">Book Now</div>
      </div>
    </div>
  )
}

function Phone3() {
  // Browser frame instead of phone
  return (
    <div className="w-[280px] bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
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
        <div className="text-sm font-bold mb-1">Land Rover Defender</div>
        <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">Book Now</div>
      </div>
    </div>
  )
}

function Phone4() {
  // Phone with hand holding it
  return (
    <div className="relative">
      <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-xl relative z-10">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
        </div>
      </div>
      {/* Simplified hand shape */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-full -z-10" />
    </div>
  )
}

function Phone5() {
  // Phone with app icon grid around it
  return (
    <div className="relative">
      {/* App icons floating around */}
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
          <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CATEGORY 5: OVERALL COMPOSITIONS (5 variations)
// Complete different approaches to Step 02
// ============================================

function Composition1() {
  // Just the phone with dramatic presentation
  return (
    <div className="relative">
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
            <div className="text-lg font-bold mb-2">Land Rover Defender</div>
            <div className="text-xs text-white/70 mb-4">Highland adventures await</div>
            <div className="w-full bg-white text-gray-900 rounded-full py-2.5 text-sm font-semibold text-center">Book Now</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Composition2() {
  // Side panel with phone
  return (
    <div className="flex gap-6 items-center">
      {/* Info panel */}
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
      {/* Phone */}
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

function Composition3() {
  // Timeline/flow showing edit process
  return (
    <div className="flex items-center gap-4">
      {/* Step indicators */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-leader-blue rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
        <div className="w-0.5 h-8 bg-gray-200" />
        <div className="w-8 h-8 bg-leader-blue rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
        <div className="w-0.5 h-8 bg-gray-200" />
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs font-bold">3</div>
      </div>
      {/* Phone with overlay showing what's being edited */}
      <div className="relative">
        <div className="w-[140px] h-[280px] bg-gray-900 rounded-[2rem] p-1.5 shadow-lg">
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-3 text-white relative">
            {/* Highlight box showing active edit area */}
            <div className="absolute inset-x-2 bottom-12 top-1/2 border-2 border-leader-blue border-dashed rounded-lg" />
            <div className="text-[7px] text-white/60">Available Now</div>
            <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
            <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
          </div>
        </div>
        {/* Edit tooltip */}
        <div className="absolute -right-2 top-1/3 bg-leader-blue text-white text-[8px] px-2 py-1 rounded-lg shadow-lg">
          Editing title...
        </div>
      </div>
    </div>
  )
}

function Composition4() {
  // Dark mode editor
  return (
    <div className="bg-gray-900 rounded-2xl p-6 flex gap-6">
      {/* Dark controls */}
      <div className="w-36 space-y-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Title</label>
          <div className="bg-gray-800 rounded px-2 py-1.5 text-xs text-white border border-gray-700">Land Rover Defender</div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Style</label>
          <div className="flex gap-1.5">
            <div className="w-6 h-6 rounded bg-leader-blue" />
            <div className="w-6 h-6 rounded bg-white" />
            <div className="w-6 h-6 rounded bg-gray-700 border border-gray-600" />
          </div>
        </div>
      </div>
      {/* Phone */}
      <div className="w-[100px] h-[200px] bg-gray-800 rounded-xl p-1 border border-gray-700">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
          <div className="text-[6px] text-white/60">Available Now</div>
          <div className="text-[8px] font-bold mb-0.5">Land Rover Defender</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-0.5 text-[5px] font-semibold text-center">Book Now</div>
        </div>
      </div>
    </div>
  )
}

function Composition5() {
  // Glassmorphism card with everything
  return (
    <div className="relative">
      {/* Background blobs */}
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

// Helper component for consistent phone card
function PhoneCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden w-full max-w-md ${className}`}>
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex-1 text-center text-xs text-gray-400">Slydes Editor</div>
      </div>
      <div className="p-6 flex gap-6">
        <div className="w-36 space-y-4 flex-shrink-0">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Title</label>
            <div className="bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-700 border border-gray-100">Land Rover Defender</div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Background</label>
            <div className="bg-gray-100 rounded px-2 py-1.5 text-xs text-gray-500 border border-gray-100">video.mp4</div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Button</label>
            <div className="flex gap-1.5">
              <div className="w-6 h-6 rounded bg-leader-blue"></div>
              <div className="w-6 h-6 rounded bg-white border border-gray-200"></div>
              <div className="w-6 h-6 rounded bg-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-[100px] h-[200px] bg-gray-900 rounded-xl p-1">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex flex-col justify-end p-2 text-white">
              <div className="text-[6px] text-white/60">Available Now</div>
              <div className="text-[8px] font-bold mb-0.5">Land Rover Defender</div>
              <div className="w-full bg-white text-gray-900 rounded-full py-0.5 text-[5px] font-semibold text-center">Book Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CATEGORIES DATA
// ============================================
const categories = [
  {
    id: 'layouts',
    name: 'Editor Layouts',
    description: 'Different ways to structure the editor UI',
    variations: [
      { id: 'l1', name: 'Side-by-Side', component: EditorLayout1 },
      { id: 'l2', name: 'Stacked', component: EditorLayout2 },
      { id: 'l3', name: 'Toolbar Style', component: EditorLayout3 },
      { id: 'l4', name: 'Before/After', component: EditorLayout4 },
      { id: 'l5', name: 'Frame Stack', component: EditorLayout5 },
    ],
  },
  {
    id: 'depth',
    name: 'Depth Treatments',
    description: 'Different ways to add depth and dimension',
    variations: [
      { id: 'd1', name: 'Soft Glow', component: Depth1 },
      { id: 'd2', name: '3D Tilt', component: Depth2 },
      { id: 'd3', name: 'Layered Cards', component: Depth3 },
      { id: 'd4', name: 'Color Shadow', component: Depth4 },
      { id: 'd5', name: 'Floating + Reflection', component: Depth5 },
    ],
  },
  {
    id: 'backgrounds',
    name: 'Background Elements',
    description: 'Different backdrop patterns and shapes',
    variations: [
      { id: 'b1', name: 'Dot Grid', component: Background1 },
      { id: 'b2', name: 'Concentric Circles', component: Background2 },
      { id: 'b3', name: 'Gradient Orbs', component: Background3 },
      { id: 'b4', name: 'Line Grid', component: Background4 },
      { id: 'b5', name: 'Abstract Shapes', component: Background5 },
    ],
  },
  {
    id: 'phones',
    name: 'Phone Preview Styles',
    description: 'Different ways to show the phone mockup',
    variations: [
      { id: 'p1', name: 'iPhone Mockup', component: Phone1 },
      { id: 'p2', name: 'Minimal Flat', component: Phone2 },
      { id: 'p3', name: 'Browser Frame', component: Phone3 },
      { id: 'p4', name: 'With Hand', component: Phone4 },
      { id: 'p5', name: 'With App Icons', component: Phone5 },
    ],
  },
  {
    id: 'compositions',
    name: 'Overall Compositions',
    description: 'Complete different approaches to Step 02',
    variations: [
      { id: 'c1', name: 'Dramatic Phone', component: Composition1 },
      { id: 'c2', name: 'Side Panel', component: Composition2 },
      { id: 'c3', name: 'Timeline Flow', component: Composition3 },
      { id: 'c4', name: 'Dark Mode', component: Composition4 },
      { id: 'c5', name: 'Glassmorphism', component: Composition5 },
    ],
  },
]

// ============================================
// DEMO PAGE
// ============================================
export default function EditorDepthVariationsPage() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [activeVariation, setActiveVariation] = useState(0)
  
  const category = categories[activeCategory]
  const variation = category.variations[activeVariation]
  const Component = variation.component

  return (
    <div className="min-h-screen bg-future-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-future-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-lg font-bold">Step 02 Visual Explorer</h1>
          <div className="w-20" />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(i); setActiveVariation(0); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === i
                    ? 'bg-leader-blue text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Category Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
            <p className="text-white/60">{category.description}</p>
          </div>
          
          {/* Variation Selector */}
          <div className="flex gap-2 mb-8">
            {category.variations.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActiveVariation(i)}
                className={`px-3 py-1.5 rounded text-sm transition-all ${
                  activeVariation === i
                    ? 'bg-white text-future-black font-medium'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
          
          {/* Preview Area */}
          <div className="bg-gray-100 rounded-2xl p-12 min-h-[500px] flex items-center justify-center">
            <Component />
          </div>
          
          {/* All Variations Grid */}
          <div className="mt-12">
            <h3 className="text-lg font-bold mb-6">All {category.name} Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.variations.map((v, i) => {
                const Comp = v.component
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveVariation(i)}
                    className={`bg-gray-100 rounded-xl p-8 transition-all hover:scale-[1.02] ${
                      activeVariation === i ? 'ring-2 ring-leader-blue' : ''
                    }`}
                  >
                    <div className="transform scale-50 origin-center pointer-events-none">
                      <Comp />
                    </div>
                    <div className="mt-4 text-future-black font-medium text-sm">{v.name}</div>
                  </button>
                )
              })}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}



