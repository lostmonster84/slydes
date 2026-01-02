'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Navigation, ExternalLink } from 'lucide-react'
import { SheetHandle } from './SheetHandle'
import type { LocationData } from '../types'

interface LocationSheetProps {
  isOpen: boolean
  onClose: () => void
  location: LocationData
  businessName?: string
}

/**
 * LocationSheet - Shows location with map and directions
 *
 * Opens from the Location button in the social stack.
 * Shows address, static map preview, and Get Directions CTA.
 */
export function LocationSheet({
  isOpen,
  onClose,
  location,
  businessName = 'this location'
}: LocationSheetProps) {
  const { address, lat, lng } = location

  // Build Google Maps URLs
  const hasCoordinates = lat !== undefined && lng !== undefined
  const mapsSearchQuery = encodeURIComponent(address || `${lat},${lng}`)

  // Static map image URL (Google Static Maps API)
  const staticMapUrl = hasCoordinates
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x200&scale=2&markers=color:red%7C${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}`
    : null

  // Directions URL - opens in Google Maps
  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`

  // Open in maps URL
  const openInMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(directionsUrl, '_blank', 'noopener,noreferrer')
  }

  const handleOpenInMaps = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(openInMapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[55] cursor-none pointer-events-auto"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[60] cursor-none pointer-events-auto"
          >
            <SheetHandle />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3">
              <h2 className="text-white text-base font-semibold">Location</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-6 pointer-events-auto">
              {/* Address */}
              {address && (
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Address</p>
                    <p className="text-white text-sm leading-relaxed">{address}</p>
                  </div>
                </div>
              )}

              {/* Static Map Preview */}
              {staticMapUrl && process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
                <button
                  onClick={handleOpenInMaps}
                  className="w-full mb-4 rounded-xl overflow-hidden relative group"
                >
                  <img
                    src={staticMapUrl}
                    alt={`Map of ${businessName}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs font-medium">Open in Maps</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Fallback when no map image (no API key) */}
              {(!staticMapUrl || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) && hasCoordinates && (
                <button
                  onClick={handleOpenInMaps}
                  className="w-full mb-4 rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-white/60" />
                  <span className="text-white/80 text-sm">View on Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </button>
              )}

              {/* Get Directions Button */}
              <button
                onClick={handleGetDirections}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                <span>Get Directions</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
