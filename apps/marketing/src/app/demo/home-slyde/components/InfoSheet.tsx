'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Globe } from 'lucide-react'

interface InfoSheetProps {
  isOpen: boolean
  onClose: () => void
  businessName: string
  accentColor: string
  about: string
  address: string
  hours?: string
  website?: string
}

/**
 * InfoSheet - Business info overlay
 *
 * Shows company description and address.
 * Triggered by Info button in SocialActionStack.
 */
export function InfoSheet({
  isOpen,
  onClose,
  businessName,
  accentColor,
  about,
  address,
  hours,
  website,
}: InfoSheetProps) {
  const initial = businessName.charAt(0).toUpperCase()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-40"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-50 flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            {/* Drag Handle + Header */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose()
                }
              }}
              className="flex items-center justify-between px-4 py-4 border-b border-white/10 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3">
                {/* Business Logo */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: accentColor }}
                >
                  <span className="text-white text-base font-bold">{initial}</span>
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">About Us</h2>
                  <p className="text-white/60 text-xs">{businessName}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              {/* About Text */}
              <p className="text-white/80 text-[14px] leading-relaxed">
                {about}
              </p>

              {/* Info Items */}
              <div className="space-y-3 pt-2">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px] uppercase tracking-wider">Address</p>
                    <p className="text-white/80 text-[13px]">{address}</p>
                  </div>
                </div>

                {/* Hours (optional) */}
                {hours && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white/40 text-[11px] uppercase tracking-wider">Hours</p>
                      <p className="text-white/80 text-[13px]">{hours}</p>
                    </div>
                  </div>
                )}

                {/* Website (optional) */}
                {website && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white/40 text-[11px] uppercase tracking-wider">Website</p>
                      <p className="text-white/80 text-[13px]">{website}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
