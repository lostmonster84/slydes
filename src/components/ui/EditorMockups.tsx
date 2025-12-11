'use client'

import { motion } from 'framer-motion'

// ============================================
// EDITOR LAYOUTS
// Different ways to structure the editor UI
// ============================================

/**
 * Side-by-side layout: Controls left, phone preview right
 */
export function EditorSideBySide() {
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

/**
 * Stacked layout: Phone on top, icon controls below
 */
export function EditorStacked() {
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
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[240px] bg-gray-900 rounded-2xl p-1.5">
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
              <div className="text-[7px] text-white/60">Available Now</div>
              <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
              <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
            </div>
          </div>
        </div>
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

/**
 * Toolbar style: Phone with floating action bar
 */
export function EditorToolbar() {
  return (
    <div className="relative">
      <div className="w-[160px] h-[320px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl mx-auto">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-[1.5rem] flex flex-col justify-end p-4 text-white">
          <div className="text-[8px] text-white/60">Available Now</div>
          <div className="text-sm font-bold mb-1">Land Rover Defender</div>
          <div className="text-[9px] text-white/70 mb-3">Highland adventures await</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-2 text-xs font-semibold text-center">Book Now</div>
        </div>
      </div>
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

/**
 * Before/After comparison layout
 */
export function EditorBeforeAfter() {
  return (
    <div className="flex gap-4 items-end">
      <div className="opacity-50">
        <div className="text-[10px] text-gray-400 text-center mb-2">Before</div>
        <div className="w-[80px] h-[160px] bg-gray-300 rounded-xl p-1">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-[8px]">Old Site</span>
          </div>
        </div>
      </div>
      <div className="pb-20">
        <svg className="w-8 h-8 text-leader-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
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

/**
 * Frame stack: Multiple frames visible in layers
 */
export function EditorFrameStack() {
  return (
    <div className="relative w-[200px] h-[350px]">
      <div className="absolute top-0 left-0 w-[140px] h-[280px] bg-gray-200 rounded-2xl opacity-30 transform -rotate-6" />
      <div className="absolute top-4 left-4 w-[140px] h-[280px] bg-gray-300 rounded-2xl opacity-50 transform -rotate-3" />
      <div className="absolute top-8 left-8 w-[140px] h-[280px] bg-gray-900 rounded-2xl p-1.5 shadow-xl">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex flex-col justify-end p-3 text-white">
          <div className="text-[7px] text-white/60">Available Now</div>
          <div className="text-[10px] font-bold mb-1">Land Rover Defender</div>
          <div className="text-[6px] text-white/70 mb-2">Highland adventures await</div>
          <div className="w-full bg-white text-gray-900 rounded-full py-1 text-[7px] font-semibold text-center">Book Now</div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 bg-leader-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        3 frames
      </div>
    </div>
  )
}
