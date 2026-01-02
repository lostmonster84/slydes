'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Phone, Mail, MessageCircle, MapPin, ChevronDown
} from 'lucide-react'
import type { BusinessInfo } from '../types'
import { SheetHandle } from './SheetHandle'

interface AboutSheetProps {
  isOpen: boolean
  onClose: () => void
  business: BusinessInfo
}

/**
 * AboutSheet - Business overview
 *
 * Opened from ProfilePill on Frame 1. Shows business info and contact options.
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Profile → Slyde → Frame
 * - This sheet shows the business (Profile level info) while viewing a Slyde
 * - Navigation between Slydes happens at the Profile level, not here
 *
 * Content (in order):
 * - Header: Business name, logo, location
 * - About section: Collapsible highlights
 * - Contact buttons: Call, Email, Message
 */
export function AboutSheet({
  isOpen,
  onClose,
  business
}: AboutSheetProps) {
  // Get first letter for fallback logo
  const initial = business.name.charAt(0).toUpperCase()

  // About section is expanded by default (since we removed world selector)
  const [showAbout, setShowAbout] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[55] cursor-none pointer-events-auto"
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
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-[60] flex flex-col cursor-none pointer-events-auto"
            style={{ maxHeight: '70vh' }}
          >
            <SheetHandle />

            {/* Drag Handle - only this area triggers drag-to-close */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose()
                }
              }}
              className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                {/* Business Logo */}
                <div
                  className={`w-11 h-11 rounded-full ${business.accentColor?.startsWith('bg-') ? business.accentColor : ''} flex items-center justify-center flex-shrink-0`}
                  style={business.accentColor && !business.accentColor.startsWith('bg-') ? { background: business.accentColor } : undefined}
                >
                  {business.image ? (
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-base font-bold">{initial}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">{business.name}</h2>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{business.location}</span>
                  </div>
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

            {/* Content - scrollable area with touch support */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y'
              }}
            >
              {/* About Section */}
              {(business.about || (business.highlights && business.highlights.length > 0)) && (
                <div>
                  {/* Sticky header for About section */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAbout(!showAbout)
                    }}
                    className="w-full flex items-center justify-between py-3 sticky top-0 bg-gray-900 z-10"
                  >
                    <h3 className="text-white/50 text-xs uppercase tracking-wider">About {business.name}</h3>
                    <motion.div
                      animate={{ rotate: showAbout ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {showAbout && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 space-y-4">
                          {/* About Paragraph */}
                          {business.about && (
                            <p className="text-white/80 text-sm leading-relaxed">
                              {business.about}
                            </p>
                          )}

                          {/* Highlights */}
                          {business.highlights && business.highlights.length > 0 && (
                            <div className="space-y-2">
                              {business.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                  <span className="text-white/70 text-sm">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex items-center justify-evenly gap-4">
                <a
                  href={`tel:${business.contact.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Call</span>
                </a>

                <a
                  href={`mailto:${business.contact.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Email</span>
                </a>

                <a
                  href={`sms:${business.contact.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Message</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
