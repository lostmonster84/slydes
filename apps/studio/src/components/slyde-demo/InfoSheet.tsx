'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Search, HelpCircle, Send, CheckCircle } from 'lucide-react'
import type { FrameInfoContent, FAQItem } from './frameData'
import { SheetHandle } from './SheetHandle'

// WhatsApp icon (not in Lucide)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

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
    whatsapp?: string
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
            <SheetHandle />

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
                        {business.contact.whatsapp && (
                          <a
                            href={`https://wa.me/${business.contact.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] flex items-center justify-center transition-colors"
                            title="WhatsApp"
                          >
                            <WhatsAppIcon className="w-5 h-5 text-white" />
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
