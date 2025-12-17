'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Search, HelpCircle, Send, CheckCircle } from 'lucide-react'
import type { FrameInfoContent, FAQItem } from './frameData'

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
  accentColor?: string
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
  faqs?: FAQItem[]
  onAskQuestion?: (question: string) => void
  autoExpandContact?: boolean
  autoExpandFaqs?: boolean
}

/**
 * InfoSheet - Frame-focused info sheet with FAQs and contact
 *
 * TERMINOLOGY (per STRUCTURE.md):
 * - Frame = vertical screen inside a Slyde
 *
 * Priority order:
 * 1. Frame headline & description (what is this frame about?)
 * 2. Frame items/details (bullet points)
 * 3. FAQs accordion (collapsible)
 * 4. Contact row (collapsible)
 *
 * @see UI-PATTERNS.md for full specification
 */
export function InfoSheet({
  isOpen,
  onClose,
  business,
  slideContext,
  frameContext,
  slideContent,
  frameContent,
  faqs = [],
  onAskQuestion,
  autoExpandContact = false,
  autoExpandFaqs = false
}: InfoSheetProps) {
  // Section expand states
  const [faqsExpanded, setFaqsExpanded] = useState(autoExpandFaqs)
  const [contactExpanded, setContactExpanded] = useState(autoExpandContact)

  // FAQ states
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)
  const [askQuestion, setAskQuestion] = useState('')
  const [questionSubmitted, setQuestionSubmitted] = useState(false)

  // Support both old and new prop names during migration
  const context = frameContext || slideContext
  const content = frameContent || slideContent

  // Get up to 4 items to display
  const displayItems = content?.items?.slice(0, 4)

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle question submission
  const handleSubmitQuestion = () => {
    if (askQuestion.trim()) {
      onAskQuestion?.(askQuestion)
      setQuestionSubmitted(true)
      setTimeout(() => {
        setQuestionSubmitted(false)
        setAskQuestion('')
      }, 2000)
    }
  }

  // Get accent color for send button
  const accentColor = business.accentColor || 'bg-blue-600'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 z-[55] cursor-none pointer-events-auto"
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
            className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-2xl z-[60] max-h-[85%] overflow-hidden cursor-none pointer-events-auto"
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

              {/* Items list - the meat of the frame info */}
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

              {/* FAQs Section */}
              {faqs.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFaqsExpanded(!faqsExpanded)
                    }}
                    className="w-full flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-white/60" />
                      <span className="text-white text-sm font-medium">FAQs</span>
                      <span className="text-white/40 text-xs">({faqs.length})</span>
                    </div>
                    <motion.div
                      animate={{ rotate: faqsExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {faqsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {/* Search FAQs */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 rounded-full px-4 py-2 pl-10 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                          />
                        </div>

                        {/* FAQ Accordion */}
                        <div className="space-y-1 mb-3">
                          {filteredFaqs.length === 0 ? (
                            <p className="text-white/50 text-sm py-2">No matching questions found.</p>
                          ) : (
                            filteredFaqs.map((faq) => (
                              <div key={faq.id} className="border-b border-white/5 last:border-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)
                                  }}
                                  className="w-full flex items-center justify-between py-3 text-left"
                                >
                                  <span className="text-white/90 text-sm pr-4">{faq.question}</span>
                                  {expandedFaqId === faq.id ? (
                                    <ChevronUp className="w-4 h-4 text-white/50 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-white/50 flex-shrink-0" />
                                  )}
                                </button>
                                <AnimatePresence>
                                  {expandedFaqId === faq.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="text-white/60 text-sm pb-3">{faq.answer}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Ask a question */}
                        {onAskQuestion && (
                          <div className="pt-2">
                            {questionSubmitted ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2 py-3"
                              >
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-white/80 text-sm">Question sent!</span>
                              </motion.div>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Ask a question..."
                                  value={askQuestion}
                                  onChange={(e) => setAskQuestion(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                                  className="flex-1 bg-white/10 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                                />
                                <button
                                  onClick={handleSubmitQuestion}
                                  disabled={!askQuestion.trim()}
                                  className={`w-9 h-9 ${accentColor.startsWith('bg-') ? accentColor : ''} rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
                                  style={!accentColor.startsWith('bg-') ? { background: accentColor } : undefined}
                                >
                                  <Send className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Contact Section */}
              <div className="border-t border-white/10 pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setContactExpanded(!contactExpanded)
                  }}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/60" />
                    <span className="text-white text-sm font-medium">Contact {business.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: contactExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {contactExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
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
