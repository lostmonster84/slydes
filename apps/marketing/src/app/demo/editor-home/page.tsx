'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  wildtraxBusiness, 
  wildtraxSlydes, 
  campingFrames, 
  justDriveFrames,
  type SlydeConfig 
} from '@/components/slyde-demo/frameData'

/**
 * Editor Home Page
 * 
 * TERMINOLOGY (per STRUCTURE.md):
 * - Public: Home Slyde → Child Slyde → Frame
 * - HQ: we keep the business context label as "Profile"
 * - This page shows the HQ Profile context and a list of Child Slydes
 * - Click on a Slyde to edit its Frames
 * 
 * This is the entry point to the editor experience.
 */

interface SlydeCardProps {
  slyde: SlydeConfig
  frameCount: number
  onClick: () => void
  isSelected: boolean
}

function SlydeCard({ slyde, frameCount, onClick, isSelected }: SlydeCardProps) {
  const iconMap: Record<string, string> = {
    tent: '🏕️',
    car: '🚗',
    home: '🏠',
    restaurant: '🍽️',
    hotel: '🏨',
    shop: '🛍️',
    travel: '✈️',
    boat: '⛵',
    bike: '🚴',
    photo: '📷',
  }
  const icon = slyde.icon ? iconMap[slyde.icon] || '📄' : '📄'

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
        isSelected
          ? 'border-red-500 bg-red-50 dark:bg-red-500/10'
          : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-white/5'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${slyde.accentColor || 'bg-gray-100 dark:bg-white/10'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {slyde.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">
            {slyde.description || 'No description'}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400 dark:text-white/40 px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-full">
              {frameCount} frames
            </span>
            <span className="text-xs text-gray-400 dark:text-white/40">
              /{slyde.slug}
            </span>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400 dark:text-white/40 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  )
}

export default function EditorHomePage() {
  const [selectedSlydeId, setSelectedSlydeId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSlydeName, setNewSlydeName] = useState('')

  // Map slyde IDs to frame counts
  const frameCountMap: Record<string, number> = {
    'camping': campingFrames.length,
    'just-drive': justDriveFrames.length,
  }

  const business = wildtraxBusiness
  const slydes = wildtraxSlydes
  const defaultSlydeId = slydes[0]?.id || 'camping'
  const activeSlydeId = selectedSlydeId || defaultSlydeId

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] flex items-center px-6 gap-4 shrink-0">
        <Link href="/demo" className="flex items-center gap-2 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </Link>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${business.accentColor}`}>
            {business.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">{business.name}</h1>
            <p className="text-xs text-gray-500 dark:text-white/50">{business.tagline}</p>
          </div>
        </div>

        <div className="flex-1" />

        <Link
          href={`/demo/editor-mockup?slyde=${encodeURIComponent(activeSlydeId)}`}
          className="px-4 py-2 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          Frame Editor →
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {/* Profile Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Slydes</h2>
            <span className="text-sm text-gray-500 dark:text-white/50">
              Public Home Slyde: slydes.io/{business.id}
            </span>
          </div>
          <p className="text-gray-600 dark:text-white/60">
            Your public root link opens the Home Slyde. Each Child Slyde is a shareable experience with Frames inside.
          </p>
        </div>

        {/* Home Slyde (pinned) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-white/70">Home Slyde (public root)</h3>
            <span className="text-xs text-gray-500 dark:text-white/50">Required</span>
          </div>
          <Link
            href="/demo/editor-home-slyde"
            className="block w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-blue-600/15 to-cyan-500/15 border border-blue-500/15 text-blue-700 dark:text-cyan-300">
                🎬
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Home Slyde</h4>
                <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">
                  One hero video + swipe-up categories (routes into Child Slydes)
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400 dark:text-white/40 px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-full">
                    /{business.id}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-cyan-300 font-medium">
                    Edit →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Slydes Grid */}
        <div className="space-y-4 mb-8">
          {slydes.map(slyde => (
            <SlydeCard
              key={slyde.id}
              slyde={slyde}
              frameCount={frameCountMap[slyde.id] || 0}
              onClick={() => setSelectedSlydeId(slyde.id)}
              isSelected={selectedSlydeId === slyde.id}
            />
          ))}
        </div>

        {/* Add New Slyde */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl text-gray-500 dark:text-white/50 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors font-medium"
        >
          + Create New Slyde
        </button>

        {/* Quick Actions when Slyde selected */}
        <AnimatePresence>
          {selectedSlydeId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-4 flex items-center gap-4"
            >
              <div className="text-sm text-gray-600 dark:text-white/70">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {slydes.find(s => s.id === selectedSlydeId)?.name}
                </span>
                {' '}selected
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
              <Link
                href={`/demo/editor-mockup?slyde=${encodeURIComponent(activeSlydeId)}`}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Edit Frames
              </Link>
              <button
                onClick={() => setSelectedSlydeId(null)}
                className="px-3 py-2 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 text-sm transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hierarchy Explanation */}
        <div className="mt-12 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Understanding the Hierarchy</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Profile (HQ)</span>
                <span className="text-gray-500 dark:text-white/50"> — Your business context (brand, settings, billing)</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Home Slyde (public root)</span>
                <span className="text-gray-500 dark:text-white/50"> — The entry experience at slydes.io/{business.id}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Child Slyde → Frames</span>
                <span className="text-gray-500 dark:text-white/50"> — A shareable experience with swipeable Frames inside</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Slyde Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Slyde</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                  A new shareable experience for your business.
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider mb-2">
                    Slyde Name
                  </label>
                  <input
                    type="text"
                    value={newSlydeName}
                    onChange={e => setNewSlydeName(e.target.value)}
                    placeholder="e.g., Summer Menu, Property 3, Day Tours"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-white/10 flex gap-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewSlydeName('')
                  }}
                  className="flex-1 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <Link
                  href={`/demo/editor-mockup?slyde=new&name=${encodeURIComponent((newSlydeName || 'New Slyde').trim())}`}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Create & Edit
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

