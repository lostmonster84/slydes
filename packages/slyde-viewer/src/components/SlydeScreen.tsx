'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronLeft, Volume2, VolumeX } from 'lucide-react'
import { Badge } from './Badge'
import { RatingDisplay } from './RatingDisplay'
import { SocialActionStack } from './SocialActionStack'
import { ProfilePill } from './ProfilePill'
import { CTAButton } from './CTAButton'
import { InfoSheet } from './InfoSheet'
import { ShareSheet } from './ShareSheet'
import { ConnectSheet } from './ConnectSheet'
import { AboutSheet } from './AboutSheet'
import { LocationSheet } from './LocationSheet'
import { VideoPlayerOverlay } from './VideoPlayerOverlay'
import { SlydesPromoSlide } from './SlydesPromoSlide'
import { parseVideoUrl } from '../lib/videoUtils'
import { getFilterStyle, VIGNETTE_STYLE, type VideoFilterPreset } from '../lib/videoFilters'
import {
  type FrameData,
  type FAQItem,
  type BusinessInfo,
  emptyBusinessInfo,
} from '../types'

interface SlydeScreenProps {
  /** Frames to display in this Slyde */
  frames?: FrameData[]
  /** FAQ items for this Slyde */
  faqs?: FAQItem[]
  /** Business info for profile pill and sheets */
  business?: BusinessInfo
  /** Auto-advance frames */
  autoAdvance?: boolean
  /** Auto-advance interval in ms */
  autoAdvanceInterval?: number
  /** Additional class names */
  className?: string
  /** Initial frame index for deep-linking */
  initialFrameIndex?: number
  /** Callback when frame changes */
  onFrameChange?: (index: number) => void
  /** Callback to persist heart state to backend */
  onHeartPersist?: (frameId: string, hearted: boolean) => Promise<void>
  /** Callback when a question is submitted */
  onQuestionSubmit?: (question: string, frameId: string) => Promise<void>
  /** Canonical share URL for current frame */
  shareUrl?: string
  /** Optional analytics org slug (e.g. "wildtrax"). If provided, events are emitted to /api/analytics/ingest */
  analyticsOrgSlug?: string
  /** Optional public slyde id (e.g. "camping"). If provided, events are attributed to this Slyde */
  analyticsSlydePublicId?: string
  /** Optional traffic source (qr/bio/ad/direct/referral) */
  analyticsSource?: string
  /** Context mode - when 'category', shows back button and adjusts badge position */
  context?: 'standalone' | 'category'
  /** Callback when back button is pressed (only used in category context) */
  onBack?: () => void
  /** Callback when CTA with action='list' is clicked - passes the frame with listItems */
  onListView?: (frame: FrameData) => void
  /** Video filter preset to apply */
  videoFilter?: VideoFilterPreset
  /** Whether to show vignette overlay */
  videoVignette?: boolean
  /** Audio source URL for background music */
  audioSrc?: string
  /** Whether audio is enabled */
  audioEnabled?: boolean
  /** Whether audio is currently muted (controlled by parent) */
  isMuted?: boolean
  /** Callback when mute toggle is pressed */
  onMuteToggle?: () => void
  /** Location data for this Slyde (shown in action stack if present) */
  locationData?: { address?: string; lat?: number; lng?: number }
}

/**
 * SlydeScreen - Full Slyde experience within the device preview
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Slyde = shareable experience (e.g., "Camping", "Just Drive")
 * - Frame = vertical screen inside a Slyde (what users swipe through)
 *
 * Features:
 * - Auto-advancing frames (configurable)
 * - Tap/swipe navigation
 * - Social action stack on every frame
 * - Badge, rating, title, CTA per frame
 * - FAQ and Info bottom sheets
 */
export function SlydeScreen({
  frames = [],
  faqs = [],
  business = emptyBusinessInfo,
  autoAdvance = true,
  autoAdvanceInterval = 4000,
  className = '',
  initialFrameIndex = 0,
  onFrameChange,
  onHeartPersist,
  onQuestionSubmit,
  shareUrl,
  analyticsOrgSlug,
  analyticsSlydePublicId,
  analyticsSource,
  context = 'standalone',
  onBack,
  onListView,
  videoFilter = 'original',
  videoVignette = false,
  audioSrc,
  audioEnabled = true,
  isMuted = true,
  onMuteToggle,
  locationData,
}: SlydeScreenProps) {
  const [currentFrame, setCurrentFrame] = useState(initialFrameIndex)
  const syncingFromPropRef = useRef(false)
  const [isHearted, setIsHearted] = useState<Record<string, boolean>>({})
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    frames.forEach(frame => {
      counts[frame.id] = frame.heartCount
    })
    return counts
  })
  const [showInfo, setShowInfo] = useState(false)
  const [showInfoWithFaqs, setShowInfoWithFaqs] = useState(false) // When true, auto-expand FAQs section
  const [showShare, setShowShare] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [touchCursor, setTouchCursor] = useState({ x: 0, y: 0, visible: false })

  const currentFrameData = frames[currentFrame]

  // ============================
  // Analytics (client-side batch)
  // ============================
  const sessionIdRef = useRef<string | null>(null)
  const analyticsQueueRef = useRef<Array<{
    eventType: 'sessionStart' | 'frameView' | 'ctaClick' | 'shareClick' | 'heartTap' | 'faqOpen'
    sessionId: string
    occurredAt: string
    source?: string
    referrer?: string
    slydePublicId: string
    framePublicId?: string
    meta?: Record<string, unknown>
  }>>([])

  const canTrack = Boolean(analyticsOrgSlug && analyticsSlydePublicId)

  const enqueueEvent = useCallback(
    (event: Omit<(typeof analyticsQueueRef.current)[number], 'sessionId' | 'occurredAt'> & { meta?: Record<string, unknown> }) => {
      if (!canTrack) return
      if (!sessionIdRef.current) {
        sessionIdRef.current = (crypto?.randomUUID?.() ?? null) as string | null
      }
      if (!sessionIdRef.current) return
      analyticsQueueRef.current.push({
        ...event,
        sessionId: sessionIdRef.current,
        occurredAt: new Date().toISOString(),
      })
    },
    [canTrack]
  )

  const flushAnalytics = useCallback(async () => {
    if (!canTrack) return
    if (analyticsQueueRef.current.length === 0) return
    const batch = analyticsQueueRef.current.splice(0, 50)
    try {
      await fetch('/api/analytics/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationSlug: analyticsOrgSlug,
          events: batch,
        }),
        keepalive: true,
      })
    } catch {
      // Put back on failure (best-effort)
      analyticsQueueRef.current.unshift(...batch)
    }
  }, [canTrack, analyticsOrgSlug])

  // Start session once
  useEffect(() => {
    if (!canTrack) return
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID()
    }
    enqueueEvent({
      eventType: 'sessionStart',
      slydePublicId: analyticsSlydePublicId as string,
      source: analyticsSource,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      meta: {},
    })
    // Flush quickly after session start
    flushAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canTrack, analyticsSlydePublicId])

  // Background flush interval + pagehide flush
  useEffect(() => {
    if (!canTrack) return
    const id = window.setInterval(() => {
      flushAnalytics()
    }, 3000)
    const onHide = () => {
      // best effort final flush
      flushAnalytics()
    }
    window.addEventListener('pagehide', onHide)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pagehide', onHide)
    }
  }, [canTrack, flushAnalytics])

  // A stable key for the frame-set (add/remove/reorder/slyde switch).
  // Important: editor text edits should NOT force a reset to frame 0.
  const framesKey = `${frames.length}:${frames.map(f => `${f.id}:${f.order ?? ''}:${f.templateType ?? ''}`).join('|')}`

  // Keep internal heartCounts in sync with external data without resetting frame position.
  const heartSeedKey = frames.map(f => `${f.id}:${f.heartCount}`).join('|')

  // Reset/clamp frame index only when the frame-set meaningfully changes (not content edits).
  useEffect(() => {
    setCurrentFrame((prev) => {
      if (frames.length === 0) return 0
      const clamped = Math.max(0, Math.min(prev, frames.length - 1))
      return clamped
    })
  }, [framesKey, frames.length])

  // Respond to parent-driven selection changes (editor clicking frame list).
  useEffect(() => {
    if (frames.length === 0) return
    const clamped = Math.max(0, Math.min(initialFrameIndex, frames.length - 1))
    setCurrentFrame((prev) => {
      if (prev === clamped) return prev
      syncingFromPropRef.current = true
      return clamped
    })
  }, [initialFrameIndex, frames.length])

  // Sync heartCounts from frame data (e.g. editor changing heartCount) without resetting frame index.
  useEffect(() => {
    const counts: Record<string, number> = {}
    frames.forEach(frame => {
      counts[frame.id] = frame.heartCount
    })
    setHeartCounts(counts)
  }, [heartSeedKey])

  // Notify parent when frame changes (editor sync, share URL updates).
  // If the change came from prop-driven sync, don't immediately notify back.
  useEffect(() => {
    if (syncingFromPropRef.current) {
      syncingFromPropRef.current = false
      return
    }
    onFrameChange?.(currentFrame)

    // Analytics: frame view
    if (canTrack && currentFrameData) {
      enqueueEvent({
        eventType: 'frameView',
        slydePublicId: analyticsSlydePublicId as string,
        framePublicId: currentFrameData.id,
        source: analyticsSource,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        meta: {
          frameIndex: currentFrame + 1,
          templateType: currentFrameData.templateType ?? null,
        },
      })
      // keep the queue moving without spamming
      flushAnalytics()
    }
  }, [currentFrame, onFrameChange])

  // Auto-advance frames
  useEffect(() => {
    if (!autoAdvance || showInfo || showShare || showConnect || showAbout || showVideo || showLocation) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length)
    }, autoAdvanceInterval)

    return () => clearInterval(interval)
  }, [autoAdvance, autoAdvanceInterval, frames.length, showInfo, showShare, showConnect, showAbout, showVideo, showLocation])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys when user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (showInfo || showShare || showConnect || showAbout || showVideo || showLocation) return

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrentFrame((prev) => (prev + 1) % frames.length)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [frames.length, showInfo, showShare, showConnect, showAbout, showVideo, showLocation])

  // Handle heart tap
  const handleHeartTap = useCallback(() => {
    if (!currentFrameData) return
    const frameId = currentFrameData.id
    const wasHearted = isHearted[frameId]
    const newHearted = !wasHearted

    // Optimistic update
    setIsHearted(prev => ({
      ...prev,
      [frameId]: newHearted
    }))

    setHeartCounts(prev => ({
      ...prev,
      [frameId]: newHearted ? prev[frameId] + 1 : prev[frameId] - 1
    }))

    // Persist to backend (fire-and-forget, optimistic UI)
    if (onHeartPersist) {
      onHeartPersist(frameId, newHearted).catch((err) => {
        console.error('[SlydeScreen] Heart persist failed:', err)
        // Revert optimistic update on error
        setIsHearted(prev => ({
          ...prev,
          [frameId]: wasHearted
        }))
        setHeartCounts(prev => ({
          ...prev,
          [frameId]: wasHearted ? prev[frameId] + 1 : prev[frameId] - 1
        }))
      })
    }

    // Analytics: heart tap
    if (canTrack) {
      enqueueEvent({
        eventType: 'heartTap',
        slydePublicId: analyticsSlydePublicId as string,
        framePublicId: frameId,
        source: analyticsSource,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        meta: { hearted: newHearted },
      })
      flushAnalytics()
    }
  }, [currentFrameData?.id, isHearted, onHeartPersist])

  // Handle share - opens share sheet
  const handleShare = useCallback(() => {
    setShowShare(true)
    if (canTrack && currentFrameData) {
      enqueueEvent({
        eventType: 'shareClick',
        slydePublicId: analyticsSlydePublicId as string,
        framePublicId: currentFrameData.id,
        source: analyticsSource,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        meta: { platform: 'sheet_open' },
      })
      flushAnalytics()
    }
  }, [])

  // Handle connect - opens social links sheet
  const handleConnect = useCallback(() => {
    setShowConnect(true)
  }, [])

  // Handle location - opens location sheet
  const handleLocation = useCallback(() => {
    setShowLocation(true)
  }, [])

  // Handle FAQ question submission
  const handleAskQuestion = useCallback((question: string) => {
    if (!currentFrameData) return
    const frameId = currentFrameData.id

    if (onQuestionSubmit) {
      onQuestionSubmit(question, frameId).catch((err) => {
        console.error('[SlydeScreen] Question submit failed:', err)
      })
    } else {
      console.log('Question submitted:', question, 'for frame:', frameId)
    }
  }, [currentFrameData?.id, onQuestionSubmit])

  // Frame indicator string (e.g., "3/9")
  const frameIndicator = `${currentFrame + 1}/${frames.length}`

  const isSlydesPromo = currentFrameData?.templateType === 'slydes' || currentFrameData?.id === 'slydes'

  // Navigate next/prev
  const nextFrame = useCallback(() => {
    setCurrentFrame((prev) => (prev + 1) % frames.length)
  }, [frames.length])

  const prevFrame = useCallback(() => {
    setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)
  }, [frames.length])

  // Handle mouse move for touch cursor - on the whole container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTouchCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTouchCursor(prev => ({ ...prev, visible: false }))
  }, [])

  // Guard: If no frames or invalid index, show loading state
  if (!currentFrameData) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full cursor-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Touch cursor indicator - like Chrome DevTools mobile */}
      <div
        className={`pointer-events-none absolute w-7 h-7 rounded-full border-2 border-white/70 bg-white/20 z-[100] transition-opacity duration-100 ${touchCursor.visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: touchCursor.x,
          top: touchCursor.y,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Check if this is the Slydes promo frame */}
      {isSlydesPromo ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="slydes-promo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <SlydesPromoSlide />
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          {/* Background Media */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{ filter: getFilterStyle(videoFilter) }}
            >
              {currentFrameData.background.type === 'video' && currentFrameData.background.src ? (
                currentFrameData.background.src.startsWith('stream:') ? (
                  <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                    <div className="text-white/60 text-sm">Loading video…</div>
                  </div>
                ) : (() => {
                  const parsed = parseVideoUrl(currentFrameData.background.src)
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
                  // Cloudflare Stream iframe
                  if (currentFrameData.background.src.includes('iframe.videodelivery.net')) {
                    return (
                      <iframe
                        src={currentFrameData.background.src}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Video"
                      />
                    )
                  }
                  // Direct video (mp4, webm, etc.)
                  return (
                    <video
                      src={currentFrameData.background.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      ref={(el) => {
                        // Set video start time if specified
                        if (el && currentFrameData.background.startTime !== undefined) {
                          el.currentTime = currentFrameData.background.startTime
                        }
                      }}
                    />
                  )
                })()
              ) : currentFrameData.background.src ? (
                <img
                  src={currentFrameData.background.src}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
                    currentFrameData.background.kenBurns ? 'animate-ken-burns' : ''
                  }`}
                  style={{
                    objectPosition: currentFrameData.background.position || 'center',
                  }}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-[#0a0a0f] overflow-hidden">
                  {/* Animated floating orb */}
                  <motion.div
                    className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-40"
                    style={{
                      background: 'radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(6,182,212,0.4) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: ['-20%', '60%', '20%', '-20%'],
                      y: ['0%', '40%', '80%', '0%'],
                      scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Secondary subtle orb */}
                  <motion.div
                    className="absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-30"
                    style={{
                      background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(37,99,235,0.3) 50%, transparent 70%)',
                      right: '10%',
                      bottom: '20%',
                    }}
                    animate={{
                      x: ['0%', '-40%', '20%', '0%'],
                      y: ['0%', '-30%', '10%', '0%'],
                      scale: [1, 0.8, 1.1, 1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 2,
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Vignette overlay */}
          {videoVignette && (
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={VIGNETTE_STYLE}
            />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
        </>
      )}

      {/* Swipe/Tap zone for navigation - excludes left (back button), right (SocialActionStack), and bottom (content) */}
      {/* NUCLEAR FIX: left-14 to avoid back button, conditional pointer-events-none when sheets open */}
      <motion.div
        className={`absolute left-14 right-16 top-24 bottom-40 z-20 ${
          (showInfo || showShare || showConnect || showAbout || showLocation) ? 'pointer-events-none' : ''
        }`}
        onClick={() => nextFrame()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          // Swipe up = next frame, swipe down = previous frame
          if (info.offset.y < -50) {
            nextFrame()
          } else if (info.offset.y > 50) {
            prevFrame()
          }
        }}
      />

      {/* Back button - OUTSIDE TOP SECTION for proper z-index stacking */}
      {!isSlydesPromo && context === 'category' && onBack && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onBack()
          }}
          className="absolute top-10 left-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-[70] pointer-events-auto"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Sound toggle - Top-right corner (environmental control) */}
      {!isSlydesPromo && audioSrc && audioEnabled && onMuteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMuteToggle()
          }}
          className="absolute top-10 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-[70] pointer-events-auto"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      )}

      {/* === TOP SECTION === (Badge only - back button moved out for z-index fix) */}
      {!isSlydesPromo && (
        <div className="absolute top-10 left-0 right-0 px-4 z-30 pointer-events-none">
          <AnimatePresence mode="wait">
            {currentFrameData.badge && (
              <motion.div
                key={`badge-${currentFrame}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 ${
                  context === 'category' ? 'ml-10' : ''
                }`}
              >
                <span className="text-xs font-medium text-white">{currentFrameData.badge}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* === RIGHT SIDE ACTIONS === (hidden on Slydes promo) */}
      {/* In 'category' context (inside a Slyde after Cover), only show engagement buttons: Share, Heart */}
      {/* In 'standalone' context (direct view), show all context buttons: Location, Info, Connect */}
      {currentFrameData.id !== 'slydes' && (
        <SocialActionStack
          heartCount={heartCounts[currentFrameData.id] || currentFrameData.heartCount}
          isHearted={isHearted[currentFrameData.id] || false}
          onHeartTap={handleHeartTap}
          onShareTap={handleShare}
          onConnectTap={context === 'standalone' ? handleConnect : undefined}
          onInfoTap={context === 'standalone' ? () => setShowInfo(true) : undefined}
          onLocationTap={context === 'standalone' ? handleLocation : undefined}
          onVideoTap={currentFrameData.demoVideoUrl ? () => setShowVideo(true) : undefined}
          socialLinks={context === 'standalone' ? business.social : undefined}
          locationData={context === 'standalone' ? locationData : undefined}
          demoVideoUrl={currentFrameData.demoVideoUrl}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40"
        />
      )}

      {/* Slide indicator - Bottom-right corner (context: "Where am I?") */}
      {!isSlydesPromo && currentFrameData.id !== 'slydes' && (
        <div className="absolute bottom-6 right-3 z-40 pointer-events-none">
          <span className="text-white/50 text-[10px] font-medium">{frameIndicator}</span>
        </div>
      )}

      {/* === BOTTOM CONTENT === (hidden on Slydes promo) */}
      {!isSlydesPromo && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Rating & Reviews - clickable, navigates to proof frame */}
              {currentFrameData.rating && currentFrameData.reviewCount && (
                <RatingDisplay
                  rating={currentFrameData.rating}
                  reviewCount={currentFrameData.reviewCount}
                  onClick={() => {
                    const reviewsIndex = frames.findIndex(f => f.templateType === 'proof') !== -1
                      ? frames.findIndex(f => f.templateType === 'proof')
                      : frames.findIndex(f => f.id === 'proof')
                    if (reviewsIndex !== -1) {
                      setCurrentFrame(reviewsIndex)
                    }
                  }}
                  className="mb-2"
                />
              )}

              {/* Title */}
              {currentFrameData.title && (
                <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
                  {currentFrameData.title}
                </h3>
              )}

              {/* Subtitle */}
              {currentFrameData.subtitle && (
                <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14 line-clamp-2">
                  {currentFrameData.subtitle}
                </p>
              )}

              {/* Frame 1 only: Profile Pill (standalone context only - not in category context) */}
              {currentFrame === 0 && context !== 'category' && (
                <ProfilePill
                  name={business.name}
                  accentColor={business.accentColor}
                  onClick={() => setShowAbout(true)}
                />
              )}

              {/* CTA Button - render whenever cta is defined on the frame */}
              {currentFrameData.cta && (
                <CTAButton
                  text={currentFrameData.cta.text}
                  icon={currentFrameData.cta.icon}
                  accentColor={currentFrameData.accentColor}
                  onClick={() => {
                    if (canTrack) {
                      enqueueEvent({
                        eventType: 'ctaClick',
                        slydePublicId: analyticsSlydePublicId as string,
                        framePublicId: currentFrameData.id,
                        source: analyticsSource,
                        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
                        meta: {
                          ctaText: currentFrameData.cta?.text ?? null,
                          action: currentFrameData.cta?.action ?? null,
                        },
                      })
                      flushAnalytics()
                    }
                    // Support both new type field and legacy action field
                    const ctaType = currentFrameData.cta?.type
                    const ctaValue = currentFrameData.cta?.value
                    const legacyAction = currentFrameData.cta?.action

                    // Handle new CTA types first
                    if (ctaType) {
                      switch (ctaType) {
                        case 'call':
                          if (ctaValue) window.location.href = `tel:${ctaValue}`
                          break
                        case 'email':
                          if (ctaValue) window.location.href = `mailto:${ctaValue}`
                          break
                        case 'link':
                        case 'directions':
                          if (ctaValue) window.open(ctaValue, '_blank', 'noopener,noreferrer')
                          break
                        case 'info':
                          setShowInfo(true)
                          break
                        case 'faq':
                          setShowInfoWithFaqs(true)
                          setShowInfo(true)
                          break
                        case 'reviews':
                          const reviewsIdx = frames.findIndex(f => f.templateType === 'proof')
                          if (reviewsIdx !== -1) setCurrentFrame(reviewsIdx)
                          break
                        case 'frame':
                          const targetFrame = parseInt(ctaValue || '')
                          if (!isNaN(targetFrame) && targetFrame >= 0 && targetFrame < frames.length) {
                            setCurrentFrame(targetFrame)
                          }
                          break
                        case 'list':
                          if (onListView) onListView(currentFrameData)
                          break
                        default:
                          setShowInfo(true)
                      }
                    }
                    // Fallback to legacy action handling
                    else if (legacyAction?.startsWith('http')) {
                      window.open(legacyAction, '_blank', 'noopener,noreferrer')
                    } else if (legacyAction === 'list' && onListView) {
                      onListView(currentFrameData)
                    } else if (legacyAction === 'faq') {
                      setShowInfoWithFaqs(true)
                      setShowInfo(true)
                    } else if (legacyAction === 'reviews') {
                      const reviewsIndex = frames.findIndex(f => f.templateType === 'proof')
                      if (reviewsIndex !== -1) setCurrentFrame(reviewsIndex)
                    } else {
                      setShowInfo(true)
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Swipe Up / Back to Top Indicator */}
          <motion.div
            className="flex flex-col items-center mt-4 cursor-pointer"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={() => {
              if (currentFrame !== 0) {
                setCurrentFrame(0)
              }
            }}
          >
            <ChevronUp className="w-5 h-5 text-white/60" />
            <span className="text-white/50 text-[10px] mt-0.5">
              {currentFrame === 0 ? 'Swipe up' : 'Back to top'}
            </span>
          </motion.div>
        </div>
      )}

      {/* Bottom Sheets */}
      <InfoSheet
        isOpen={showInfo}
        onClose={() => {
          setShowInfo(false)
          setShowInfoWithFaqs(false)
        }}
        business={business}
        slideContext={{
          current: currentFrame + 1,
          total: frames.length,
          title: currentFrameData.title || ''
        }}
        slideContent={currentFrameData.infoContent}
        faqs={faqs}
        onAskQuestion={handleAskQuestion}
        autoExpandFaqs={showInfoWithFaqs}
        autoExpandContact={false}
      />

      <ShareSheet
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        business={business}
        slideTitle={currentFrameData.title}
        shareUrl={shareUrl}
      />

      <ConnectSheet
        isOpen={showConnect}
        onClose={() => setShowConnect(false)}
        business={business}
        socialLinks={business.social}
      />

      <AboutSheet
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        business={business}
      />

      {locationData && (
        <LocationSheet
          isOpen={showLocation}
          onClose={() => setShowLocation(false)}
          location={locationData}
          businessName={business.name}
        />
      )}

      {/* Video Player Overlay */}
      {currentFrameData.demoVideoUrl && (
        <VideoPlayerOverlay
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          videoUrl={currentFrameData.demoVideoUrl}
        />
      )}
    </div>
  )
}
