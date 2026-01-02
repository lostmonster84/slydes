'use client'

import { motion } from 'framer-motion'
import { Heart, Share2, AtSign, Clapperboard, MapPin, Info, Video, LayoutGrid, Calendar, FileText, Phone, ClipboardCheck, HandCoins, Home } from 'lucide-react'
import type { SocialLinks, FrameData } from '../types'

interface LocationData {
  address?: string
  lat?: number
  lng?: number
}

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

  // Property Actions
  onPropertyLocationTap?: () => void
  onVirtualTourTap?: () => void
  onFloorPlanTap?: () => void
  onBookViewingTap?: () => void
  onBrochureTap?: () => void
  onAgentPhoneTap?: () => void
  onApplyTap?: () => void
  onMakeOfferTap?: () => void
  onPropertyDetailsTap?: () => void

  // Data for visibility (content presence = visibility)
  socialLinks?: SocialLinks
  locationData?: LocationData
  demoVideoUrl?: string
  property?: FrameData['property']

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
 * FIXED ORDER (top to bottom):
 * 1. Video    - Watch more (content-driven)
 * 2. Location - Where is this? (content-driven)
 * 3. Heart    - Like this (always shown if handler provided)
 * 4. Share    - Share this (always shown if handler provided)
 * 5. Connect  - Follow socials (content-driven)
 * 6. Info     - Learn more (ALWAYS AT BOTTOM)
 *
 * Pattern: "Add content → button appears. No content → button hidden."
 * Hidden buttons don't leave gaps - others slide up to fill.
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
  onPropertyLocationTap,
  onVirtualTourTap,
  onFloorPlanTap,
  onBookViewingTap,
  onBrochureTap,
  onAgentPhoneTap,
  onApplyTap,
  onMakeOfferTap,
  onPropertyDetailsTap,
  socialLinks,
  locationData,
  demoVideoUrl,
  property,
  className = ''
}: SocialActionStackProps) {

  // Visibility based purely on content presence + handler existence
  const showVideo = !!demoVideoUrl && !!onVideoTap
  const showLocation = hasLocationData(locationData) && !!onLocationTap
  const showHeart = !!onHeartTap
  const showShare = !!onShareTap
  const showConnect = hasSocialLinks(socialLinks) && !!onConnectTap
  const showInfo = !!onInfoTap

  // Property action visibility (content-driven)
  const showPropertyLocation = !!property?.locationUrl && !!onPropertyLocationTap
  const showVirtualTour = !!property?.virtualTourUrl && !!onVirtualTourTap
  const showFloorPlan = !!property?.floorPlanUrl && !!onFloorPlanTap
  const showBookViewing = !!property?.bookViewingUrl && !!onBookViewingTap
  const showBrochure = !!property?.brochureUrl && !!onBrochureTap
  const showAgentPhone = !!property?.agentPhone && !!onAgentPhoneTap
  const showApply = !!property?.applyUrl && !!onApplyTap
  const showMakeOffer = !!property?.makeOfferUrl && !!onMakeOfferTap

  // Property details visibility (show if any info field is filled)
  const hasPropertyInfo = !!(
    property?.price ||
    property?.bedrooms !== undefined ||
    property?.bathrooms !== undefined ||
    property?.propertyType ||
    property?.sqft !== undefined ||
    property?.epcRating ||
    property?.councilTaxBand ||
    property?.availability ||
    property?.parking ||
    property?.garden ||
    property?.petFriendly !== undefined ||
    property?.tenure
  )
  const showPropertyDetails = hasPropertyInfo && !!onPropertyDetailsTap

  return (
    <div
      className={`flex flex-col items-center gap-5 pointer-events-auto ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Video - Watch more content (top) */}
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

      {/* 2. Location - Where is this? */}
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

      {/* 3. Heart - Like this */}
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

      {/* 4. Share - Share this */}
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

      {/* 5. Connect - Follow socials */}
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

      {/* ===== PROPERTY ACTIONS (content-driven) ===== */}

      {/* Property Location */}
      {showPropertyLocation && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onPropertyLocationTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Map</span>
        </motion.button>
      )}

      {/* Virtual Tour */}
      {showVirtualTour && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onVirtualTourTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Tour</span>
        </motion.button>
      )}

      {/* Floor Plan */}
      {showFloorPlan && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onFloorPlanTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Plan</span>
        </motion.button>
      )}

      {/* Book Viewing */}
      {showBookViewing && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onBookViewingTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Book</span>
        </motion.button>
      )}

      {/* Brochure */}
      {showBrochure && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onBrochureTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">PDF</span>
        </motion.button>
      )}

      {/* Agent Phone */}
      {showAgentPhone && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onAgentPhoneTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Call</span>
        </motion.button>
      )}

      {/* Apply (Rental) */}
      {showApply && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onApplyTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Apply</span>
        </motion.button>
      )}

      {/* Make Offer (Sales) */}
      {showMakeOffer && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onMakeOfferTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <HandCoins className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Offer</span>
        </motion.button>
      )}

      {/* Property Details (shows if any info field is filled) */}
      {showPropertyDetails && (
        <motion.button
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onPropertyDetailsTap?.()
          }}
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-medium">Details</span>
        </motion.button>
      )}

      {/* 6. Info - Learn more (ALWAYS AT BOTTOM) */}
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
    </div>
  )
}
