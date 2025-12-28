'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, Volume2, VolumeX } from 'lucide-react'
import { RatingDisplay } from '@/components/slyde-demo/RatingDisplay'
import { SocialActionStack } from '@/components/slyde-demo/SocialActionStack'
import { ProfilePill } from '@/components/slyde-demo/ProfilePill'
import { CategoryDrawer } from './CategoryDrawer'
import { ShareSheet } from '@/components/slyde-demo/ShareSheet'
import { AboutSheet } from '@/components/slyde-demo/AboutSheet'
import type { HomeSlydeData } from '../data/highlandMotorsData'
import { useDemoHomeSlyde, type BackgroundType } from '@/lib/demoHomeSlyde'
import { parseVideoUrl } from '@/lib/videoUtils'
import { getFilterStyle, getSpeedRate, VIGNETTE_STYLE, type VideoFilterPreset, type VideoSpeedPreset } from '@/lib/videoFilters'

interface HomeSlydeScreenProps {
  data: HomeSlydeData
  onCategoryTap: (categoryId: string) => void
  backgroundType?: BackgroundType
  imageSrc?: string
  videoFilter?: VideoFilterPreset
  videoVignette?: boolean
  videoSpeed?: VideoSpeedPreset
  // Audio props for background music
  audioSrc?: string
  audioEnabled?: boolean
}

/**
 * HomeSlydeScreen (Canonical)
 * - Video-first entry point with swipe-up category drawer
 * - Heart + Share + Info (AboutSheet) actions
 * - No FAQ (FAQ is frame-specific, only on Child Slydes)
 * - ProfilePill → opens drawer (NOT AboutSheet)
 * - Info button → opens AboutSheet (organization info)
 *
 * @see docs/UI-PATTERNS.md for full specification
 */
export function HomeSlydeScreen({ data, onCategoryTap, backgroundType = 'video', imageSrc, videoFilter = 'original', videoVignette = false, videoSpeed = 'normal', audioSrc, audioEnabled = true }: HomeSlydeScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(2400)
  const [isMuted, setIsMuted] = useState(true)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const firstSeenAtRef = useRef<number | null>(null)
  const drawerOpenedOnceRef = useRef(false)
  const { data: demoHome } = useDemoHomeSlyde()

  const handleHeartTap = useCallback(() => {
    setIsHearted((prev) => {
      setHeartCount((count) => (prev ? count - 1 : count + 1))
      return !prev
    })
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)

    // Toggle video audio
    if (videoRef.current) {
      videoRef.current.muted = newMuted
    }

    // Toggle background music
    if (audioRef.current && audioSrc && audioEnabled) {
      audioRef.current.muted = newMuted
      // If unmuting for the first time, start playback (mobile autoplay policy)
      if (!newMuted && !audioUnlocked) {
        setAudioUnlocked(true)
        audioRef.current.play().catch(() => {
          // Autoplay blocked - will start on next interaction
        })
      }
    }
  }, [isMuted, audioSrc, audioEnabled, audioUnlocked])

  const emit = useCallback(
    async (eventType: 'sessionStart' | 'drawerOpen' | 'categorySelect' | 'videoLoop', meta?: Record<string, unknown>) => {
      const organizationSlug = 'wildtrax'
      const slydePublicId = 'home'

      try {
        if (!sessionIdRef.current) sessionIdRef.current = crypto.randomUUID()
        if (!firstSeenAtRef.current) firstSeenAtRef.current = Date.now()

        await fetch('/api/analytics/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationSlug,
            events: [
              {
                eventType,
                sessionId: sessionIdRef.current,
                slydePublicId,
                source: 'direct',
                referrer: typeof document !== 'undefined' ? document.referrer : undefined,
                meta: meta ?? {},
              },
            ],
          }),
          keepalive: true,
        })
      } catch {
        // ignore
      }
    },
    []
  )

  useEffect(() => {
    void emit('sessionStart', {})
  }, [emit])

  const handleCategoryTap = useCallback(
    (categoryId: string) => {
      setDrawerOpen(false)
      setTimeout(() => {
        onCategoryTap(categoryId)
      }, 100)
    },
    [onCategoryTap]
  )

  const drawerCategories = data.categories.map((cat) => ({
    id: cat.id,
    icon: cat.icon,
    label: cat.label,
    description: cat.description,
  }))

  const videoSrc = data.videoSrc || demoHome.videoSrc || '/videos/adventure.mp4'

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Audio (hidden) */}
      {audioSrc && audioEnabled && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          muted={isMuted}
          playsInline
          style={{ display: 'none' }}
        />
      )}

      {/* Background (Video or Image) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ filter: drawerOpen ? `${getFilterStyle(videoFilter)} brightness(0.4)` : getFilterStyle(videoFilter) }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {backgroundType === 'image' && imageSrc ? (
          // Image background
          <img
            src={imageSrc}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // Video background
          (() => {
            const parsed = parseVideoUrl(videoSrc)
            // YouTube embed
            if (parsed?.type === 'youtube') {
              return (
                <iframe
                  src={parsed.embedUrl}
                  className="absolute inset-0 w-full h-full pointer-events-none scale-[1.5] origin-center"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="YouTube Video"
                  style={{ border: 'none' }}
                />
              )
            }
            // Vimeo embed
            if (parsed?.type === 'vimeo') {
              return (
                <iframe
                  src={parsed.embedUrl}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Vimeo Video"
                  style={{ border: 'none' }}
                />
              )
            }
            // Direct video (mp4, webm, Cloudflare HLS, etc.)
            return (
              <video
                ref={(el) => {
                  (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
                  if (el) el.playbackRate = getSpeedRate(videoSpeed)
                }}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onEnded={() => void emit('videoLoop', {})}
              />
            )
          })()
        )}
      </motion.div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Vignette overlay */}
      {videoVignette && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={VIGNETTE_STYLE}
        />
      )}

      {/* Sound Toggle - Top Left (conditionally shown) */}
      {(data.showSound ?? true) && (
        <motion.button
          className="absolute top-4 left-4 z-50 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </motion.button>
      )}

      {/* === RIGHT SIDE ACTIONS === (Share + Heart + Connect only on Home) */}
      <SocialActionStack
        heartCount={heartCount}
        isHearted={isHearted}
        onHeartTap={handleHeartTap}
        onShareTap={() => setShareOpen(true)}
        socialLinks={data.socialLinks}
        className="absolute right-3 bottom-36 z-40"
      />

      {/* === BOTTOM CONTENT === (exact same as SlydeScreen) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-30">
        {/* Rating & Reviews (conditionally shown) */}
        {(data.showReviews ?? true) && (
          <RatingDisplay
            rating={data.rating || 4.9}
            reviewCount={data.reviewCount || 847}
            className="mb-2"
          />
        )}

        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
          {data.businessName}
        </h3>

        {/* Subtitle */}
        <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14">
          {data.tagline}
        </p>

        {/* ProfilePill → opens drawer (instead of AboutSheet) */}
        <ProfilePill
          name={data.businessName}
          accentColor={data.accentColor}
          onClick={() => setDrawerOpen(true)}
        />

        {/* Swipe Up Indicator */}
        <motion.div
          className="flex flex-col items-center mt-4 cursor-pointer"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={() => setDrawerOpen(true)}
        >
          <ChevronUp className="w-5 h-5 text-white/60" />
          <span className="text-white/50 text-[10px] mt-0.5">Swipe up to explore</span>
        </motion.div>
      </div>

      {/* Swipe-up gesture zone (bottom 20%) */}
      {!drawerOpen && (
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-[20%] z-40"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.2, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) {
              setDrawerOpen(true)
              if (!drawerOpenedOnceRef.current) {
                drawerOpenedOnceRef.current = true
                const ms = firstSeenAtRef.current ? Date.now() - firstSeenAtRef.current : null
                void emit('drawerOpen', { timeToOpenMs: ms })
              }
            }
          }}
          onClick={() => {
            setDrawerOpen(true)
            if (!drawerOpenedOnceRef.current) {
              drawerOpenedOnceRef.current = true
              const ms = firstSeenAtRef.current ? Date.now() - firstSeenAtRef.current : null
              void emit('drawerOpen', { timeToOpenMs: ms })
            }
          }}
        />
      )}

      {/* Category Drawer (replaces AboutSheet) */}
      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={drawerCategories}
        onCategoryTap={(categoryId) => {
          void emit('categorySelect', { categoryId })
          handleCategoryTap(categoryId)
        }}
        businessName={data.businessName}
        accentColor={data.accentColor}
        showIcons={data.showCategoryIcons ?? false}
      />

      {/* Share Sheet */}
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        business={{
          name: data.businessName,
          tagline: data.tagline,
        }}
      />

      {/* About Sheet (Info button) */}
      <AboutSheet
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        business={{
          id: 'home-slyde',
          name: data.businessName,
          tagline: data.tagline,
          location: data.address || 'Scottish Highlands',
          rating: data.rating || 4.9,
          reviewCount: data.reviewCount || 847,
          credentials: [],
          about: data.about || `${data.businessName} - ${data.tagline}`,
          contact: {
            phone: data.phone || '+44 1234 567890',
            email: data.email || 'hello@example.com',
            website: data.website,
          },
          accentColor: data.accentColor,
        }}
      />
    </div>
  )
}
