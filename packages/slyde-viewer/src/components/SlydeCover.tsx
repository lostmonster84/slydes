'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronLeft, Volume2, VolumeX } from 'lucide-react'
import { SocialActionStack } from './SocialActionStack'
import { InfoSheet } from './InfoSheet'
import { ShareSheet } from './ShareSheet'
import { ConnectSheet } from './ConnectSheet'
import { LocationSheet } from './LocationSheet'
import { parseVideoUrl } from '../lib/videoUtils'
import { getFilterStyle, getSpeedRate, VIGNETTE_STYLE, type VideoFilterPreset, type VideoSpeedPreset } from '../lib/videoFilters'
import type { FAQItem, BusinessInfo, SocialLinks, LocationData } from '../types'

interface SlydeCoverProps {
  /** Slyde name (shown as title) */
  name: string
  /** Slyde description (shown as subtitle) */
  description?: string
  /** Background type */
  backgroundType?: 'video' | 'image'
  /** Video source URL (HLS or direct) */
  videoSrc?: string
  /** Image source URL */
  imageSrc?: string
  /** Poster image for video */
  posterSrc?: string
  /** Video filter preset */
  videoFilter?: VideoFilterPreset
  /** Enable vignette effect */
  videoVignette?: boolean
  /** Video playback speed */
  videoSpeed?: VideoSpeedPreset
  /** Location data for this Slyde */
  locationData?: LocationData
  /** Business info for sheets */
  business?: BusinessInfo
  /** Social links */
  socialLinks?: SocialLinks
  /** FAQs for this Slyde */
  faqs?: FAQItem[]
  /** Accent color */
  accentColor?: string
  /** Callback when "Explore" / swipe up is triggered */
  onExplore?: () => void
  /** Callback when back button is pressed */
  onBack?: () => void
  /** Whether to show back button */
  showBack?: boolean
  /** Audio enabled */
  audioEnabled?: boolean
  /** Audio muted state */
  isMuted?: boolean
  /** Audio toggle callback */
  onMuteToggle?: () => void
  /** Additional class names */
  className?: string
}

/**
 * SlydeCover - Landing screen for a Slyde before entering frames
 *
 * This is the "cover page" that users see when they tap a Slyde from Home.
 * It shows:
 * - Slyde background (video/image)
 * - Slyde name and description
 * - Full action stack: Location, Info, Share, Heart, Connect
 * - "Explore" swipe-up gesture to enter frames
 *
 * Architecture:
 * Home → tap Slyde → SlydeCover → swipe up → Frames
 */
export function SlydeCover({
  name,
  description,
  backgroundType = 'video',
  videoSrc,
  imageSrc,
  posterSrc,
  videoFilter = 'original',
  videoVignette = false,
  videoSpeed = 'normal',
  locationData,
  business,
  socialLinks,
  faqs = [],
  accentColor,
  onExplore,
  onBack,
  showBack = true,
  audioEnabled,
  isMuted = true,
  onMuteToggle,
  className = ''
}: SlydeCoverProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(0)
  const [touchCursor, setTouchCursor] = useState({ x: 0, y: 0, visible: false })
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const handleHeartTap = useCallback(() => {
    setIsHearted(prev => {
      setHeartCount(count => prev ? count - 1 : count + 1)
      return !prev
    })
  }, [])

  const handleExplore = useCallback(() => {
    onExplore?.()
  }, [onExplore])

  // Check if any sheet is open
  const isSheetOpen = showInfo || showShare || showConnect || showLocation

  // Render video or image background
  const renderBackground = () => {
    if (backgroundType === 'image' && imageSrc) {
      return (
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )
    }

    if (videoSrc) {
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

      // Direct video (mp4, HLS, etc.)
      return (
        <video
          ref={el => {
            (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el
            if (el) el.playbackRate = getSpeedRate(videoSpeed)
          }}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )
    }

    // Fallback: animated gradient background
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0a0a0f] overflow-hidden">
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
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full cursor-none overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Touch cursor indicator */}
      <div
        className={`pointer-events-none absolute w-7 h-7 rounded-full border-2 border-white/70 bg-white/20 z-[100] transition-opacity duration-100 ${touchCursor.visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: touchCursor.x,
          top: touchCursor.y,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: getFilterStyle(videoFilter) }}
      >
        {renderBackground()}
      </motion.div>

      {/* Vignette overlay */}
      {videoVignette && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={VIGNETTE_STYLE}
        />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Back button - Top left */}
      {showBack && onBack && (
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

      {/* Sound toggle - Top right */}
      {audioEnabled && onMuteToggle && (
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

      {/* Action Stack - Right side */}
      <SocialActionStack
        heartCount={heartCount}
        isHearted={isHearted}
        onHeartTap={handleHeartTap}
        onShareTap={() => setShowShare(true)}
        onConnectTap={() => setShowConnect(true)}
        onInfoTap={() => setShowInfo(true)}
        socialLinks={socialLinks}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-40"
      />

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-30">
        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg pr-14">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-white/80 text-sm mb-4 drop-shadow-md pr-14 line-clamp-2">
            {description}
          </p>
        )}

        {/* Location pill (if location exists) */}
        {locationData?.address && (
          <button
            onClick={() => setShowLocation(true)}
            className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 hover:bg-black/50 transition-colors pointer-events-auto"
          >
            <span className="text-white/80 text-xs">{locationData.address}</span>
          </button>
        )}

        {/* Swipe Up Indicator */}
        <motion.div
          className="flex flex-col items-center mt-4 cursor-pointer pointer-events-auto"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={handleExplore}
        >
          <ChevronUp className="w-5 h-5 text-white/60" />
          <span className="text-white/50 text-[10px] mt-0.5">Swipe up to explore</span>
        </motion.div>
      </div>

      {/* Swipe-up gesture zone (bottom 20%) */}
      {!isSheetOpen && (
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-[20%] z-20"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.2, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) {
              handleExplore()
            }
          }}
          onClick={handleExplore}
        />
      )}

      {/* Info Sheet */}
      {business && (
        <InfoSheet
          isOpen={showInfo}
          onClose={() => setShowInfo(false)}
          business={business}
          faqs={faqs}
          autoExpandFaqs={false}
          autoExpandContact={false}
        />
      )}

      {/* Share Sheet */}
      <ShareSheet
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        business={{ name, tagline: description || '' }}
      />

      {/* Connect Sheet */}
      <ConnectSheet
        isOpen={showConnect}
        onClose={() => setShowConnect(false)}
        business={{ name, tagline: description || '' }}
        socialLinks={socialLinks}
      />

      {/* Location Sheet */}
      {locationData && (
        <LocationSheet
          isOpen={showLocation}
          onClose={() => setShowLocation(false)}
          location={locationData}
          businessName={name}
        />
      )}
    </div>
  )
}
