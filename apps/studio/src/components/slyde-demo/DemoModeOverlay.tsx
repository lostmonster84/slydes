'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, VolumeX, Play } from 'lucide-react'
import { DevicePreview } from './DevicePreview'
import { HomeSlydeScreen } from '@/components/home-slyde/HomeSlydeScreen'
import { SlydeScreen } from './SlydeScreen'
import { BackgroundAudioPlayer } from '@/components/audio/BackgroundAudioPlayer'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import type { HomeSlydeData } from '@/components/home-slyde/data/highlandMotorsData'
import type { FrameData, BusinessInfo, SocialLinks } from './frameData'
import type { BackgroundType } from '@/lib/demoHomeSlyde'
import type { VideoFilterPreset, VideoSpeedPreset } from '@/lib/videoFilters'

interface DemoModeOverlayProps {
  isOpen: boolean
  onClose: () => void
  // Home screen data
  homeData: HomeSlydeData
  // Category frames (keyed by category ID)
  categoryFrames: Record<string, FrameData[]>
  // Music
  musicEnabled: boolean
  musicUrl: string | null
  // Visual settings
  backgroundType: BackgroundType
  imageSrc: string
  videoFilter: VideoFilterPreset
  videoVignette: boolean
  videoSpeed: VideoSpeedPreset
  // Business info for sheets
  businessInfo: BusinessInfo
  // Social links
  socialLinks?: SocialLinks
}

/**
 * DemoModeOverlay - Full-screen demo experience
 *
 * Opens when user clicks "Demo" button in Studio header.
 * Simulates the complete customer experience with:
 * - Background music playing
 * - Full navigation (Home → Drawer → Category frames)
 * - All interactive elements working
 *
 * Design:
 * - Full-screen black background
 * - Centered phone frame (DevicePreview)
 * - "Demo Mode" badge centered top
 * - Close button top-right, mute toggle top-left
 * - ESC key to close
 */
export function DemoModeOverlay({
  isOpen,
  onClose,
  homeData,
  categoryFrames,
  musicEnabled,
  musicUrl,
  backgroundType,
  imageSrc,
  videoFilter,
  videoVignette,
  videoSpeed,
  businessInfo,
  socialLinks,
}: DemoModeOverlayProps) {
  // Navigation state
  const [currentView, setCurrentView] = useState<'home' | 'category'>('home')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Music hook
  const { audioRef, isPlaying, isMuted, play, pause, toggleMute } = useBackgroundMusic({
    customUrl: musicUrl,
    enabled: musicEnabled,
    autoStart: false, // We control start manually
  })

  // Audio source URL (custom or default demo track)
  const audioSrc = musicUrl || 'https://pub-98abdd0a909a4a78b03fe6de579904ae.r2.dev/demo/slydesanthem.mp3'

  // Start music when overlay opens (if enabled)
  useEffect(() => {
    if (isOpen && musicEnabled) {
      // Small delay to ensure audio element is ready
      const timer = setTimeout(() => {
        play()
      }, 100)
      return () => clearTimeout(timer)
    }
    if (!isOpen) {
      pause()
    }
  }, [isOpen, musicEnabled, play, pause])

  // Reset navigation state when overlay opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('home')
      setSelectedCategoryId(null)
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Handle category tap from drawer
  const handleCategoryTap = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentView('category')
  }, [])

  // Handle back from category to home
  const handleBack = useCallback(() => {
    setCurrentView('home')
    setSelectedCategoryId(null)
  }, [])

  // Get frames for selected category
  const selectedFrames = selectedCategoryId ? (categoryFrames[selectedCategoryId] || []) : []

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          {/* Hidden audio element */}
          <BackgroundAudioPlayer
            ref={audioRef}
            src={musicEnabled ? audioSrc : undefined}
          />

          {/* Demo Mode badge - centered top */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[110]">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
              <Play className="w-3 h-3" />
              Demo Mode
            </div>
          </div>

          {/* Mute toggle - top left (only if music enabled) */}
          {musicEnabled && (
            <button
              onClick={toggleMute}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-[110]"
              title={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          )}

          {/* Close button - top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-[110]"
            title="Close demo (ESC)"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Phone frame wrapper */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <DevicePreview enableTilt={false}>
              {currentView === 'home' ? (
                <HomeSlydeScreen
                  data={homeData}
                  onCategoryTap={handleCategoryTap}
                  backgroundType={backgroundType}
                  imageSrc={imageSrc}
                  videoFilter={videoFilter}
                  videoVignette={videoVignette}
                  videoSpeed={videoSpeed}
                  // Music is handled at overlay level
                  hasMusicTrack={musicEnabled}
                  isMusicMuted={isMuted}
                  onMusicToggle={toggleMute}
                />
              ) : (
                <SlydeScreen
                  frames={selectedFrames}
                  business={businessInfo}
                  context="category"
                  onBack={handleBack}
                  videoFilter={videoFilter}
                  videoVignette={videoVignette}
                  autoAdvance={false}
                />
              )}
            </DevicePreview>
          </motion.div>

          {/* Hint text at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110]">
            <p className="text-white/50 text-xs">
              Press ESC or click X to exit
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
