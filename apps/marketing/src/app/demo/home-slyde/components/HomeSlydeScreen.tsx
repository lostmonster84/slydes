'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, Volume2, VolumeX } from 'lucide-react'
import { RatingDisplay } from '@/components/slyde-demo/RatingDisplay'
import { SocialActionStack } from '@/components/slyde-demo/SocialActionStack'
import { ProfilePill } from '@/components/slyde-demo/ProfilePill'
import { CategoryDrawer } from './CategoryDrawer'
import { ShareSheet } from '@/components/slyde-demo/ShareSheet'
import type { HomeSlydeData } from '../data/highlandMotorsData'

// Demo video (local public asset so it never 404s)
const HOME_SLYDE_VIDEO = '/videos/car.mp4'

interface HomeSlydeScreenProps {
  data: HomeSlydeData
  onCategoryTap: (categoryId: string) => void
}

/**
 * HomeSlydeScreen - Carbon copy of SlydeScreen structure
 * ProfilePill opens CategoryDrawer instead of AboutSheet
 */
export function HomeSlydeScreen({ data, onCategoryTap }: HomeSlydeScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(2400)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const firstSeenAtRef = useRef<number | null>(null)
  const drawerOpenedOnceRef = useRef(false)

  const handleHeartTap = useCallback(() => {
    setIsHearted((prev) => {
      setHeartCount((count) => (prev ? count - 1 : count + 1))
      return !prev
    })
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const handleCategoryTap = useCallback(
    (categoryId: string) => {
      setDrawerOpen(false)
      setTimeout(() => {
        onCategoryTap(categoryId)
      }, 100)
    },
    [onCategoryTap]
  )

  // --- Analytics (best-effort; uses existing ingest endpoint) ---
  const emit = useCallback(
    async (eventType: 'sessionStart' | 'drawerOpen' | 'categorySelect' | 'videoLoop', meta?: Record<string, unknown>) => {
      // Demo: Highland Motors doesn't map to a real org yet; use a stable slug for now.
      // When productized: org slug comes from organization profile and Home Slyde is the root Slyde.
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

  const drawerCategories = data.categories.map((cat) => ({
    id: cat.id,
    icon: cat.icon,
    label: cat.label,
    description: cat.description,
  }))

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video Background */}
      <motion.div
        className="absolute inset-0"
        animate={{ filter: drawerOpen ? 'brightness(0.4)' : 'brightness(1)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <video
          ref={videoRef}
          src={HOME_SLYDE_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => {
            void emit('videoLoop', {})
          }}
        />
      </motion.div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Sound Toggle - Top Left */}
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

      {/* === RIGHT SIDE ACTIONS === (Heart + Share only) */}
      <SocialActionStack
        heartCount={heartCount}
        isHearted={isHearted}
        onHeartTap={handleHeartTap}
        onShareTap={() => setShareOpen(true)}
        onInfoTap={() => {}}
        hideFAQ
        hideInfo
        className="absolute right-3 bottom-44 z-40"
      />

      {/* === BOTTOM CONTENT === (exact same as SlydeScreen) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-30">
        {/* Rating & Reviews */}
        <RatingDisplay
          rating={data.rating || 4.9}
          reviewCount={data.reviewCount || 847}
          className="mb-2"
        />

        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
          Premium Service
        </h3>

        {/* Subtitle */}
        <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14">
          Highland Style
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
    </div>
  )
}
