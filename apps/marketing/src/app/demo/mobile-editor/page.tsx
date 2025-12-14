'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ============================================
// MOBILE EDITOR - PARTNER APP MOCKUP
// ============================================

// This is the phone-native editor experience for the Partner App
// It's designed for editing on mobile devices directly

interface Slyde {
  id: number
  type: string
  icon: string
  title: string
  subtitle: string
  gradient: string
}

const DEMO_SLYDES: Slyde[] = [
  { id: 1, type: 'Hero', icon: '🎬', title: 'WildTrax 4x4', subtitle: 'Scottish Highlands', gradient: 'from-amber-900 to-black' },
  { id: 2, type: 'Showcase', icon: '✨', title: 'Land Rover Defender', subtitle: 'Roof tent • Full kit', gradient: 'from-green-900 to-black' },
  { id: 3, type: 'Reviews', icon: '⭐', title: '209 Reviews', subtitle: '"Best adventure!"', gradient: 'from-yellow-900 to-black' },
  { id: 4, type: 'CTA', icon: '🎯', title: 'Book Now', subtitle: 'From £149/night', gradient: 'from-red-900 to-black' },
]

// ============================================
// PHONE FRAME WRAPPER
// ============================================

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[375px] h-[812px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/50">
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-50" />
      
      {/* Screen */}
      <div className="w-full h-full bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden relative">
        {children}
      </div>
      
      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
    </div>
  )
}

// ============================================
// MOBILE EDITOR VIEWS
// ============================================

type MobileView = 'home' | 'edit' | 'preview' | 'publish'

function HomeView({ 
  slydes, 
  onEditSlyde, 
  onPreview 
}: { 
  slydes: Slyde[]
  onEditSlyde: (id: number) => void
  onPreview: () => void
}) {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Status bar */}
      <div className="h-12 flex items-end justify-between px-6 pb-2">
        <span className="text-white text-xs font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
          </svg>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 22h20V2z"/>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">WildTrax 4x4</h1>
        <p className="text-white/50 text-sm mt-1">4 slydes • Draft</p>
      </div>
      
      {/* Slydes list */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <div className="space-y-3">
          {slydes.map((slyde, i) => (
            <motion.button
              key={slyde.id}
              onClick={() => onEditSlyde(slyde.id)}
              className="w-full bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-4 active:scale-98 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`w-14 h-20 rounded-xl bg-gradient-to-br ${slyde.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {slyde.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs text-white/50 mb-0.5">{i + 1} • {slyde.type}</div>
                <div className="font-semibold text-white">{slyde.title}</div>
                <div className="text-sm text-white/60">{slyde.subtitle}</div>
              </div>
              <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          ))}
          
          {/* Add slyde button */}
          <button className="w-full border-2 border-dashed border-[#3a3a3a] rounded-2xl p-4 flex items-center justify-center gap-2 text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Add Slyde</span>
          </button>
        </div>
      </div>
      
      {/* Bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8 pb-8 px-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={onPreview}
            className="flex-1 bg-[#2a2a2a] text-white py-4 rounded-2xl font-semibold text-center"
          >
            Preview
          </button>
          <button className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-semibold text-center">
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

function EditView({ 
  slyde, 
  onBack 
}: { 
  slyde: Slyde
  onBack: () => void 
}) {
  const [title, setTitle] = useState(slyde.title)
  const [subtitle, setSubtitle] = useState(slyde.subtitle)
  
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Status bar */}
      <div className="h-12 flex items-end justify-between px-6 pb-2">
        <span className="text-white text-xs font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={onBack} className="text-white/60">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-semibold text-white">Edit {slyde.type}</h1>
        <button className="text-red-500 font-semibold text-sm">Done</button>
      </div>
      
      {/* Preview */}
      <div className="px-5 py-4">
        <div className={`w-full aspect-[9/16] max-h-48 rounded-2xl bg-gradient-to-br ${slyde.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-white/70">{subtitle}</p>
          </div>
          <div className="absolute top-3 left-3 text-2xl">{slyde.icon}</div>
        </div>
      </div>
      
      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3.5 text-white text-lg"
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3.5 text-white"
            />
          </div>
          
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">Media</label>
            <button className="w-full bg-[#1a1a1a] border border-[#3a3a3a] border-dashed rounded-xl p-6 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white/50 text-sm">Tap to add photo or video</span>
            </button>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide block mb-2">Style</label>
            <div className="grid grid-cols-4 gap-2">
              {['from-red-900 to-black', 'from-blue-900 to-black', 'from-green-900 to-black', 'from-purple-900 to-black'].map((grad, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${grad} ${i === 0 ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-[#0a0a0a]' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewView({ 
  slydes, 
  onBack 
}: { 
  slydes: Slyde[]
  onBack: () => void 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlyde = slydes[currentIndex]
  
  return (
    <div className="h-full flex flex-col">
      {/* Full screen preview */}
      <div className={`flex-1 bg-gradient-to-br ${currentSlyde.gradient} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        
        {/* Back button */}
        <button 
          onClick={onBack}
          className="absolute top-14 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Preview badge */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 z-10">
          <span className="text-xs text-white/80">Preview Mode</span>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">{currentSlyde.title}</h2>
            <p className="text-lg text-white/70 mb-4">{currentSlyde.subtitle}</p>
            {currentSlyde.type === 'CTA' && (
              <button className="w-full bg-red-600 text-white py-4 rounded-full font-semibold text-lg">
                Book Now
              </button>
            )}
          </motion.div>
        </div>
        
        {/* Side actions */}
        <div className="absolute right-4 bottom-40 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-xs text-white mt-1">2.4k</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {slydes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all ${
                i === currentIndex 
                  ? 'w-2 h-6 bg-white' 
                  : 'w-2 h-2 bg-white/40'
              }`}
            />
          ))}
        </div>
        
        {/* Swipe hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-8 h-1 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function MobileEditorPage() {
  const [view, setView] = useState<MobileView>('home')
  const [editingSlyde, setEditingSlyde] = useState<Slyde | null>(null)
  
  const handleEditSlyde = (id: number) => {
    const slyde = DEMO_SLYDES.find(s => s.id === id)
    if (slyde) {
      setEditingSlyde(slyde)
      setView('edit')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col dark:bg-[#1c1c1e] dark:text-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <h1 className="font-semibold text-gray-900 dark:text-white">Mobile Editor</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-white/60">Partner App</div>
      </header>

      {/* View Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 dark:bg-[#1c1c1e] dark:border-white/10">
        <div className="flex items-center justify-center gap-2">
          {(['home', 'edit', 'preview'] as MobileView[]).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v)
                if (v === 'edit' && !editingSlyde) {
                  setEditingSlyde(DEMO_SLYDES[0])
                }
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                view === v
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 dark:bg-[#1c1c1e] dark:border-white/10">
        <p className="text-sm text-gray-500 dark:text-white/60 text-center">
          {view === 'home' && 'Manage your slydes from the Partner App'}
          {view === 'edit' && 'Edit individual slyde content and style'}
          {view === 'preview' && 'Full-screen preview with swipe navigation'}
        </p>
      </div>

      {/* Phone Mockup */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="relative">
          <PhoneFrame>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {view === 'home' && (
                  <HomeView 
                    slydes={DEMO_SLYDES} 
                    onEditSlyde={handleEditSlyde}
                    onPreview={() => setView('preview')}
                  />
                )}
                {view === 'edit' && editingSlyde && (
                  <EditView 
                    slyde={editingSlyde} 
                    onBack={() => setView('home')} 
                  />
                )}
                {view === 'preview' && (
                  <PreviewView 
                    slydes={DEMO_SLYDES} 
                    onBack={() => setView('home')} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
          
          {/* Device label */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">iPhone 14 Pro</p>
            <p className="text-gray-400 text-xs">Partner App • Native Editor</p>
          </div>
        </div>
      </div>
    </div>
  )
}

