'use client'

import { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  /** Type of inquiry - determines how it's categorized in HQ */
  type: 'investor' | 'affiliate' | 'partner' | 'support' | 'general'
  /** Title shown in modal header */
  title?: string
  /** Placeholder text for message input */
  placeholder?: string
  /** Subject line for the message */
  subject?: string
}

const TYPE_DEFAULTS: Record<string, { title: string; placeholder: string; subject: string }> = {
  investor: {
    title: 'Contact Investors Team',
    placeholder: 'Tell us about your interest in Slydes...',
    subject: '💰 Investor Inquiry',
  },
  affiliate: {
    title: 'Contact Affiliates Team',
    placeholder: 'Tell us about your audience and how you plan to promote Slydes...',
    subject: '🤝 Affiliate Inquiry',
  },
  partner: {
    title: 'Contact Partners Team',
    placeholder: 'Tell us about your partnership idea or question...',
    subject: '🚀 Partner Inquiry',
  },
  support: {
    title: 'Get Support',
    placeholder: 'Describe what you need help with...',
    subject: '🆘 Support Request',
  },
  general: {
    title: 'Send a Message',
    placeholder: 'What would you like to tell us?',
    subject: '💬 General Message',
  },
}

export function ContactModal({
  isOpen,
  onClose,
  type,
  title,
  placeholder,
  subject,
}: ContactModalProps) {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const defaults = TYPE_DEFAULTS[type] || TYPE_DEFAULTS.general

  const handleSubmit = async () => {
    if (!message.trim()) return
    setStatus('sending')

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          subject: subject || defaults.subject,
          message: message.trim(),
          email: email.trim() || null,
          name: name.trim() || null,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setTimeout(() => {
          onClose()
          setMessage('')
          setEmail('')
          setName('')
          setStatus('idle')
        }, 1500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
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
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {status === 'sent' ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Message Sent!</p>
              <p className="text-sm text-gray-500 mt-1">We'll get back to you soon</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title || defaults.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Optional: Name + Email (help us respond faster) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') onClose()
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                    }}
                    placeholder={placeholder || defaults.placeholder}
                    rows={4}
                    autoFocus
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600 text-center">
                    Failed to send. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === 'sending'}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-leader-blue to-electric-cyan text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
                >
                  {status === 'sending' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Press ⌘+Enter to send
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
