'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ============================================
// EDITOR STATE TYPES
// ============================================

type EditorState = 'empty' | 'first-slyde' | 'partial' | 'full' | 'publishing' | 'published'

const STATES: { id: EditorState; label: string; description: string }[] = [
  { id: 'empty', label: 'Empty', description: 'No slydes created yet' },
  { id: 'first-slyde', label: 'First Slyde', description: 'User just added their first slyde' },
  { id: 'partial', label: 'Partial', description: '3 slydes created, flow incomplete' },
  { id: 'full', label: 'Full Flow', description: '6 slydes, ready to publish' },
  { id: 'publishing', label: 'Publishing', description: 'Publish in progress' },
  { id: 'published', label: 'Published', description: 'Flow is live' },
]

// ============================================
// MINI PHONE COMPONENT
// ============================================

function MiniPhone({ hasContent = false, accentColor = 'bg-red-600' }: { hasContent?: boolean; accentColor?: string }) {
  return (
    <div className="w-[140px] h-[280px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.5rem] p-1.5 shadow-xl">
      <div className="w-full h-full bg-gray-900 rounded-[1.25rem] overflow-hidden relative">
        {hasContent ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="w-16 h-1.5 bg-white/60 rounded mb-1" />
              <div className="w-24 h-1 bg-white/40 rounded mb-2" />
              <div className={`w-full h-6 ${accentColor} rounded-full`} />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-[8px] text-white/30">No content</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// STATE COMPONENTS
// ============================================

function EmptyState() {
  return (
    <div className="flex h-full">
      {/* Slydes Panel */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Slydes</h2>
          <p className="text-xs text-gray-500">0 slides</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No slydes yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first slyde to get started</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create First Slyde
            </button>
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MiniPhone hasContent={false} />
          <p className="text-gray-400 text-sm mt-6">Your slyde preview will appear here</p>
        </div>
      </div>
      
      {/* Inspector */}
      <div className="w-[320px] bg-white border-l border-gray-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Select a slyde to edit</p>
        </div>
      </div>
    </div>
  )
}

function FirstSlydeState() {
  return (
    <div className="flex h-full">
      {/* Slydes Panel */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Slydes</h2>
          <p className="text-xs text-gray-500">1 slide</p>
        </div>
        <div className="p-3 space-y-2">
          <div className="bg-red-600 rounded-xl p-3 shadow-lg shadow-red-600/20">
            <div className="flex gap-3">
              <div className="w-10 h-16 rounded-lg bg-black/30 flex items-center justify-center text-lg">🎬</div>
              <div>
                <div className="text-xs text-white/70">1 • Hero</div>
                <div className="font-semibold text-white text-sm">My First Slyde</div>
                <div className="text-xs text-white/60">Add subtitle...</div>
              </div>
            </div>
          </div>
          <button className="w-full border-2 border-dashed border-gray-200 hover:border-red-300 rounded-xl p-3 text-gray-400 hover:text-gray-600 transition-colors text-sm bg-white">
            + Add Slyde
          </button>
        </div>
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">💡</span>
              <div>
                <p className="text-xs text-blue-800 font-medium">Tip: Add more slydes</p>
                <p className="text-xs text-blue-700/80 mt-1">A great flow has 5-7 slydes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <MiniPhone hasContent={true} />
      </div>
      
      {/* Inspector */}
      <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-sm font-medium text-red-600 border-b-2 border-red-500">Content</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Style</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Actions</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Title *</label>
            <input type="text" defaultValue="My First Slyde" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Subtitle</label>
            <input type="text" placeholder="Add subtitle..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Media</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Drop video or image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PartialState() {
  const slydes = [
    { type: '🎬', label: 'Hero', title: 'WildTrax 4x4', selected: false },
    { type: '✨', label: 'Showcase', title: 'Land Rover Defender', selected: true },
    { type: '⭐', label: 'Reviews', title: '209 Reviews', selected: false },
  ]
  
  return (
    <div className="flex h-full">
      {/* Slydes Panel */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Slydes</h2>
          <p className="text-xs text-gray-500">3 slides • Add more to complete</p>
        </div>
        <div className="p-3 space-y-2 flex-1">
          {slydes.map((slyde, i) => (
            <div key={i} className={`rounded-xl p-3 ${slyde.selected ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex gap-3">
                <div className={`w-10 h-16 rounded-lg flex items-center justify-center text-lg ${slyde.selected ? 'bg-black/30' : 'bg-white border border-gray-200'}`}>{slyde.type}</div>
                <div>
                  <div className={`text-xs ${slyde.selected ? 'text-white/70' : 'text-gray-500'}`}>{i + 1} • {slyde.label}</div>
                  <div className={`font-semibold text-sm ${slyde.selected ? 'text-white' : 'text-gray-900'}`}>{slyde.title}</div>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-gray-200 hover:border-red-300 rounded-xl p-3 text-gray-400 hover:text-gray-600 transition-colors text-sm bg-white">
            + Add Slyde
          </button>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-amber-600">⚠️</span>
              <div>
                <p className="text-xs text-amber-800 font-medium">Missing: Location & CTA</p>
                <p className="text-xs text-amber-700/80 mt-1">Add these for better conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div>
          <MiniPhone hasContent={true} />
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-full ${i === 1 ? 'w-1.5 h-4 bg-red-500' : 'w-1.5 h-1.5 bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Inspector */}
      <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-sm font-medium text-red-600 border-b-2 border-red-500">Content</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Style</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Actions</button>
        </div>
        <div className="p-4 space-y-4 flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Title</label>
            <input type="text" defaultValue="Land Rover Defender" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Subtitle</label>
            <input type="text" defaultValue="Roof tent • Full kit included" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FullState() {
  const slydes = [
    { type: '🎬', label: 'Hero', title: 'WildTrax 4x4' },
    { type: '✨', label: 'Showcase', title: 'Land Rover Defender' },
    { type: '📖', label: 'About', title: 'The Experience' },
    { type: '⭐', label: 'Reviews', title: '209 Reviews' },
    { type: '📍', label: 'Location', title: 'Scottish Highlands' },
    { type: '🎯', label: 'CTA', title: 'Book Now' },
  ]
  
  return (
    <div className="flex h-full">
      {/* Slydes Panel */}
      <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Slydes</h2>
          <p className="text-xs text-green-600">✓ 6 slides • Ready to publish</p>
        </div>
        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
          {slydes.map((slyde, i) => (
            <div key={i} className={`rounded-xl p-3 ${i === 0 ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex gap-3">
                <div className={`w-10 h-16 rounded-lg flex items-center justify-center text-lg ${i === 0 ? 'bg-black/30' : 'bg-white border border-gray-200'}`}>{slyde.type}</div>
                <div>
                  <div className={`text-xs ${i === 0 ? 'text-white/70' : 'text-gray-500'}`}>{i + 1} • {slyde.label}</div>
                  <div className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{slyde.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <p className="text-xs text-green-800 font-medium">Flow complete!</p>
                <p className="text-xs text-green-700/80 mt-1">Ready to publish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div>
          <MiniPhone hasContent={true} />
          <div className="flex justify-center gap-1 mt-4">
            {slydes.map((_, i) => (
              <div key={i} className={`rounded-full ${i === 0 ? 'w-1.5 h-4 bg-red-500' : 'w-1.5 h-1.5 bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Inspector */}
      <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-sm font-medium text-red-600 border-b-2 border-red-500">Content</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Style</button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-500">Actions</button>
        </div>
        <div className="p-4 space-y-4 flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Title</label>
            <input type="text" defaultValue="WildTrax 4x4" className="w-full bg-white border border-green-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-200 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Subtitle</label>
            <input type="text" defaultValue="Scottish Highlands" className="w-full bg-white border border-green-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-200 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Media</label>
            <div className="bg-gray-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div>
                <p className="text-sm text-gray-900">hero-video.mp4</p>
                <p className="text-xs text-green-600">✓ Uploaded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PublishingState() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Publishing your flow...</h2>
        <p className="text-gray-500 mb-6">This usually takes a few seconds</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <motion.div 
            className="h-full bg-red-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '75%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}

function PublishedState() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-100">
      <motion.div 
        className="text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your flow is live!</h2>
        <p className="text-gray-500 mb-6">Share it with the world</p>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 max-w-md mx-auto shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-700 font-mono border border-gray-200">
              slydes.io/wildtrax
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Copy
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Live
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Code
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function EditorStatesPage() {
  const [activeState, setActiveState] = useState<EditorState>('empty')

  const renderState = () => {
    switch (activeState) {
      case 'empty': return <EmptyState />
      case 'first-slyde': return <FirstSlydeState />
      case 'partial': return <PartialState />
      case 'full': return <FullState />
      case 'publishing': return <PublishingState />
      case 'published': return <PublishedState />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <h1 className="font-semibold text-gray-900 dark:text-white">Editor States</h1>
        </div>
        
        {/* State Selector */}
        <div className="flex items-center gap-2">
          {STATES.map((state) => (
            <button
              key={state.id}
              onClick={() => setActiveState(state.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeState === state.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
      </header>

      {/* State Description */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 dark:bg-[#1c1c1e] dark:border-white/10">
        <p className="text-sm text-gray-500 dark:text-white/60 text-center">
          {STATES.find(s => s.id === activeState)?.description}
        </p>
      </div>

      {/* Editor Preview */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderState()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

