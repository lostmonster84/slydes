'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MessageCircle, ChevronDown } from 'lucide-react'
import type { FrameInfoContent } from './frameData'

interface BusinessInfo {
  name: string
  tagline?: string
  location: string
  rating: number
  reviewCount: number
  credentials: Array<{ icon: string; label: string; value: string }>
  about: string
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  image?: string
}

interface FrameContext {
  current: number
  total: number
  title: string
}

interface InfoSheetProps {
  isOpen: boolean
  onClose: () => void
  business: BusinessInfo
  /** @deprecated Use frameContext instead */
  slideContext?: FrameContext
  frameContext?: FrameContext
  /** @deprecated Use frameContent instead */
  slideContent?: FrameInfoContent
  frameContent?: FrameInfoContent
  autoExpandContact?: boolean
}

/**
 * InfoSheet - Frame-focused info sheet with collapsible business section
 * 
 * TERMINOLOGY (per STRUCTURE.md):
 * - Frame = vertical screen inside a Slyde
 * 
 * Priority order:
 * 1. Frame headline & description (what is this frame about?)
 * 2. Frame items/details (bullet points)
 * 3. Collapsible business card (tappable to expand contact options)
 * 
 * When autoExpandContact is true, the contact section starts expanded.
 */
export function InfoSheet({
  isOpen,
  onClose,
  business,
  slideContext,
  frameContext,
  slideContent,
  frameContent,
  autoExpandContact = false
}: InfoSheetProps) {
  const [businessExpanded, setBusinessExpanded] = useState(autoExpandContact)
  
  // Support both old and new prop names during migration
  const context = frameContext || slideContext
  const content = frameContent || slideContent
  
  // Get up to 4 items to display
  const displayItems = content?.items?.slice(0, 4)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 z-40"
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
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-2xl z-50 max-h-[85%] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 bg-white/30 rounded-full" />
            </div>

            {/* Scrollable content area */}
            <div className="overflow-y-auto max-h-[calc(85vh-40px)] px-4 pb-6">
              
              {/* Header row */}
              <div className="flex items-start justify-between mb-3 pt-2">
                <div className="flex-1 pr-4">
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider">
                    {context ? `Frame ${context.current} of ${context.total}` : 'Info'}
                  </p>
                  <h2 className="text-white text-xl font-bold mt-1 leading-tight">
                    {content?.headline || context?.title || 'About This Frame'}
                  </h2>
                </div>
                {/* Circular close button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Description */}
              {content?.description && (
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {content.description}
                </p>
              )}

              {/* Items list - the meat of the slide info */}
              {displayItems && displayItems.length > 0 && (
                <div className="space-y-2 mb-4">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="flex-shrink-0">{item.startsWith(item.charAt(0)) && /\p{Emoji}/u.test(item.charAt(0)) ? '' : '•'}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}


              {/* Collapsible Business Section */}
              <div className="border-t border-white/10 pt-3 mt-auto">
                {/* Collapsed state - single tappable row */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setBusinessExpanded(!businessExpanded)
                  }}
                  className="w-full flex items-center gap-3 py-2 group"
                >
                  {/* Circular logo */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{business.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm font-medium">{business.name}</p>
                    <p className="text-white/40 text-xs">
                      {businessExpanded ? 'Tap to collapse' : 'Tap for contact options'}
                    </p>
                  </div>
                  {/* Chevron indicator */}
                  <motion.div
                    animate={{ rotate: businessExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  </motion.div>
                </button>

                {/* Expanded state - contact options inline */}
                <AnimatePresence>
                  {businessExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {/* Contact buttons - naturally spaced across full width */}
                      <div className="flex justify-evenly pt-3 pb-2">
                        {business.contact.phone && (
                          <a
                            href={`tel:${business.contact.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="Call"
                          >
                            <Phone className="w-5 h-5 text-white" />
                          </a>
                        )}
                        {business.contact.email && (
                          <a
                            href={`mailto:${business.contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="Email"
                          >
                            <Mail className="w-5 h-5 text-white" />
                          </a>
                        )}
                        {business.contact.phone && (
                          <a
                            href={`sms:${business.contact.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="Text"
                          >
                            <MessageCircle className="w-5 h-5 text-white" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
