'use client'

import { useState } from 'react'
import { X, Lightbulb, Send, Sparkles, Bug, Zap, Palette, BarChart3, Smartphone, MessageSquare } from 'lucide-react'

interface FeatureSuggestionModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { id: 'editor', label: 'Editor / Studio', icon: Smartphone },
  { id: 'slydes', label: 'Slydes & Content', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'brand', label: 'Brand & Design', icon: Palette },
  { id: 'inbox', label: 'Inbox & Enquiries', icon: MessageSquare },
  { id: 'other', label: 'Other', icon: Lightbulb },
]

const REQUEST_TYPES = [
  { id: 'feature', label: 'New Feature', color: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400' },
  { id: 'improvement', label: 'Improvement', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400' },
  { id: 'bug', label: 'Bug Report', color: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400' },
  { id: 'ux', label: 'UX / Usability', color: 'bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400' },
]

export function FeatureSuggestionModal({ isOpen, onClose }: FeatureSuggestionModalProps) {
  const [category, setCategory] = useState('')
  const [requestType, setRequestType] = useState('feature')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          requestType,
          title,
          description,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to send feedback')
      }

      setSubmitted(true)

      // Reset and close after brief success state
      setTimeout(() => {
        setSubmitted(false)
        setCategory('')
        setRequestType('feature')
        setTitle('')
        setDescription('')
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Error submitting feedback:', err)
      // Could add error state here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden dark:bg-[#2c2c2e]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-white/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Suggest a Feature</h2>
                  <p className="text-sm text-gray-500 dark:text-white/50">Help shape Slydes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sent!</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-white/50">Thanks for your feedback!</p>
              </div>
            ) : (
              <>
                {/* Request Type - Quick Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    What type of feedback?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REQUEST_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setRequestType(type.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          requestType === type.id
                            ? type.color + ' ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#2c2c2e] ' +
                              (type.id === 'feature' ? 'ring-cyan-500' :
                               type.id === 'improvement' ? 'ring-blue-500' :
                               type.id === 'bug' ? 'ring-red-500' : 'ring-purple-500')
                            : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Category <span className="text-gray-400 dark:text-white/40">(optional)</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-leader-blue/40 focus:border-cyan-500 transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white appearance-none cursor-pointer"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="">Select a category...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Add dark mode toggle"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leader-blue/40 focus:border-cyan-500 transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/40"
                    style={{ fontSize: '16px' }}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Description <span className="text-gray-400 dark:text-white/40">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about your idea..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leader-blue/40 focus:border-cyan-500 transition-colors resize-none dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-white/40"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors dark:text-white/70 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
