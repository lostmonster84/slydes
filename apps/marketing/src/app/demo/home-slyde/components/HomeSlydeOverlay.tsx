'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { RatingDisplay } from '@/components/slyde-demo'
import { SocialActionStack } from '@/components/slyde-demo'
import { ProfilePill } from '@/components/slyde-demo'
import { CategoryDrawer } from './CategoryDrawer'
import { ShareSheet } from '@/components/slyde-demo'
import type { HomeSlydeData } from './data/highlandMotorsData'

interface HomeSlydeOverlayProps {
  data: HomeSlydeData
  drawerOpen: boolean
  onDrawerOpen: () => void
  onDrawerClose: () => void
  onCategoryTap: (categoryId: string) => void
}

/**
 * HomeSlydeOverlay - UI-only layer for home screen
 *
 * Video is now rendered in the parent (HomeSlydeDemo) as a persistent layer.
 * This component handles:
 * - Social actions (heart, share)
 * - Business info display
 * - Category drawer
 * - Swipe-up gesture
 */
export function HomeSlydeOverlay({
  data,
  drawerOpen,
  onDrawerOpen,
  onDrawerClose,
  onCategoryTap,
}: HomeSlydeOverlayProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(2400)
  const sessionIdRef = useRef<string | null>(null)
  const firstSeenAtRef = useRef<number | null>(null)
  const drawerOpenedOnceRef = useRef(false)

  const handleHeartTap = useCallback(() => {
    setIsHearted((prev) => {
      setHeartCount((count) => (prev ? count - 1 : count + 1))
      return !prev
    })
  }, [])

  const emit = useCallback(
    async (eventType: 'sessionStart' | 'drawerOpen' | 'categorySelect' | 'videoLoop', meta?: Record<string, unknown>) => {
      const organizationSlug = data.organizationSlug || 'unknown'
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
    [data.organizationSlug]
  )

  useEffect(() => {
    void emit('sessionStart', {})
  }, [emit])

  const handleCategoryTapInternal = useCallback(
    (categoryId: string) => {
      void emit('categorySelect', { categoryId })
      onCategoryTap(categoryId)
    },
    [emit, onCategoryTap]
  )

  const handleOpenDrawer = useCallback(() => {
    onDrawerOpen()
    if (!drawerOpenedOnceRef.current) {
      drawerOpenedOnceRef.current = true
      const ms = firstSeenAtRef.current ? Date.now() - firstSeenAtRef.current : null
      void emit('drawerOpen', { timeToOpenMs: ms })
    }
  }, [onDrawerOpen, emit])

  const drawerCategories = data.categories.map((cat) => ({
    id: cat.id,
    icon: cat.icon,
    label: cat.label,
    description: cat.description,
  }))

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* === RIGHT SIDE ACTIONS === (Heart + Share only) */}
      <SocialActionStack
        heartCount={heartCount}
        isHearted={isHearted}
        onHeartTap={handleHeartTap}
        onShareTap={() => setShareOpen(true)}
        className="absolute right-3 bottom-36 z-40"
      />

      {/* === BOTTOM CONTENT === */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-30">
        {/* Rating & Reviews */}
        <RatingDisplay
          rating={data.rating || 4.9}
          reviewCount={data.reviewCount || 847}
          className="mb-2"
        />

        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
          {data.businessName}
        </h3>

        {/* Subtitle */}
        <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14">
          {data.tagline}
        </p>

        {/* ProfilePill -> opens drawer */}
        <ProfilePill
          name={data.businessName}
          accentColor={data.accentColor}
          onClick={handleOpenDrawer}
        />

        {/* Swipe Up Indicator */}
        <motion.div
          className="flex flex-col items-center mt-4 cursor-pointer"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={handleOpenDrawer}
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
              handleOpenDrawer()
            }
          }}
          onClick={handleOpenDrawer}
        />
      )}

      {/* Category Drawer */}
      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={onDrawerClose}
        categories={drawerCategories}
        onCategoryTap={handleCategoryTapInternal}
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
