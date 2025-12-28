'use client'

import { motion } from 'framer-motion'
import { Heart, Share2, AtSign, Clapperboard, MapPin, Info } from 'lucide-react'
import type { SocialLinks } from './frameData'
import type { LocationData } from '@slydes/types'

interface SocialActionStackProps {
  // Heart
  heartCount?: number
  isHearted?: boolean
  onHeartTap?: () => void

  // Actions
  onShareTap?: () => void
  onConnectTap?: () => void
  onVideoTap?: () => void
  onInfoTap?: () => void
  onLocationTap?: () => void

  // Data for visibility (content presence = visibility)
  socialLinks?: SocialLinks
  locationData?: LocationData
  demoVideoUrl?: string

  className?: string
}

/**
 * Format count for display (e.g., 2400 → "2.4k")
 */
function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return (count / 1000).toFixed(1) + 'k'
  return Math.floor(count / 1000) + 'k'
}

/**
 * Check if any social links are configured
 */
function hasSocialLinks(links?: SocialLinks): boolean {
  if (!links) return false
  return !!(links.instagram || links.tiktok || links.facebook || links.youtube || links.twitter || links.linkedin)
}

/**
 * Check if location data is configured
 */
function hasLocationData(location?: LocationData): boolean {
  if (!location) return false
  return !!(location.address || (location.lat !== undefined && location.lng !== undefined))
}

/**
 * SocialActionStack - Content-driven vertical action buttons
 *
 * NO TOGGLES! Visibility is based purely on content presence:
 * - Location: shows if address/coordinates exist
 * - Info: always shows (opens Info sheet with FAQs, contact, etc.)
 * - Share: always shows
 * - Heart: always shows
 * - Connect: shows if social links exist
 * - Video: shows if demoVideoUrl exists
 *
 * Pattern: "Add content → button appears. No content → button hidden."
 *
 * Specs:
 * - Container: vertical flex, gap-5
 * - Button: 40x40px, bg-white/20 backdrop-blur-sm rounded-full
 * - Icon: 20x20px, white
 * - Label: 10px, white, medium weight
 */
export function SocialActionStack({
  heartCount = 0,
  isHearted = false,
  onHeartTap,
  onShareTap,
  onConnectTap,
  onVideoTap,
  onInfoTap,
  onLocationTap,
  socialLinks,
  locationData,
  demoVideoUrl,
  className = ''
}: SocialActionStackProps) {

  // Visibility based purely on content presence + handler existence
  const showLocation = hasLocationData(locationData) && !!onLocationTap
  const showInfo = !!onInfoTap
  const showShare = !!onShareTap
  const showHeart = !!onHeartTap
  const showConnect = hasSocialLinks(socialLinks) && !!onConnectTap
  const showVideo = !!demoVideoUrl && !!onVideoTap

  return (
    <div
      className={`flex flex-col items-center gap-5 pointer-events-auto ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Location - shows if address exists */}
      {showLocation && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onLocationTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Location</span>
        </motion.button>
      )}

      {/* Info - always shows */}
      {showInfo && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onInfoTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Info</span>
        </motion.button>
      )}

      {/* Share - always shows */}
      {showShare && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onShareTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Share</span>
        </motion.button>
      )}

      {/* Heart - always shows */}
      {showHeart && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onHeartTap?.()
          }}
        >
          <motion.div
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            animate={{
              scale: isHearted ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isHearted ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </motion.div>
          <span className="text-white text-[10px] font-medium">{formatCount(heartCount)}</span>
        </motion.button>
      )}

      {/* Connect - shows if social links exist */}
      {showConnect && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onConnectTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <AtSign className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Connect</span>
        </motion.button>
      )}

      {/* Video - shows if demoVideoUrl exists */}
      {showVideo && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onVideoTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Clapperboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Video</span>
        </motion.button>
      )}
    </div>
  )
}
