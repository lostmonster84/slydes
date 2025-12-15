'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQSheetProps {
  isOpen: boolean
  onClose: () => void
  faqs: FAQItem[]
  businessName: string
  accentColor?: string
  onAskQuestion?: (question: string) => void
}

/**
 * FAQSheet - Bottom sheet with FAQ accordion and Ask Question form
 * 
 * Features:
 * - Search bar for filtering FAQs
 * - Expandable accordion for each FAQ
 * - "Ask [Business]" button for new questions
 * - Success state after submission
 * 
 * Specs:
 * - Sheet: fixed bottom-0, bg-gray-900, rounded-t-3xl
 * - Max height: 70vh
 * - Header: p-4, border-b border-white/10
 * - FAQ item: border-b border-white/5, py-4
 * 
 * @see SLYDESBUILD.md for full specification
 */
export function FAQSheet({
  isOpen,
  onClose,
  faqs,
  businessName,
  accentColor = 'bg-red-600',
  onAskQuestion
}: FAQSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAskForm, setShowAskForm] = useState(false)
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = () => {
    if (question.trim()) {
      onAskQuestion?.(question)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setShowAskForm(false)
        setQuestion('')
      }, 2000)
    }
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
            className="absolute inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          
          {/* Sheet - full screen within phone frame */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="absolute inset-0 bg-gray-900 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <h2 className="text-white text-lg font-semibold">Questions & Answers</h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 rounded-full px-4 py-2 pl-10 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            {/* FAQ List */}
            <div className="flex-1 overflow-y-auto px-4">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Frequently Asked</p>
              
              {filteredFaqs.length === 0 ? (
                <p className="text-white/60 text-sm py-4">No matching questions found.</p>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border-b border-white/5">
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-white/60 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/60 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/70 text-sm pb-4">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>

            {/* Ask Question Section */}
            <div className="px-4 py-3 border-t border-white/10">
              {!showAskForm ? (
                <button
                  onClick={() => setShowAskForm(true)}
                  className="w-full bg-white/10 text-white text-sm font-medium py-2.5 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-colors whitespace-nowrap"
                >
                  <span className="truncate">Ask {businessName}</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </button>
              ) : submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-white font-medium">Question sent!</p>
                  <p className="text-white/60 text-sm">{businessName} will reply soon</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!question.trim()}
                      className={`w-10 h-10 ${accentColor.startsWith('bg-') ? accentColor : ''} rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
                      style={!accentColor.startsWith('bg-') ? { background: accentColor } : undefined}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAskForm(false)}
                    className="text-white/50 text-xs mt-2 hover:text-white/70"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

