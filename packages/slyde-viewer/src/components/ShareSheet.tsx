'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, MessageCircle, Send, Twitter, Facebook, Instagram, Linkedin, Mail, Ghost } from 'lucide-react'
import { useState, useCallback } from 'react'
import { SheetHandle } from './SheetHandle'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  business: {
    name: string
    tagline?: string
  }
  slideTitle?: string
  shareUrl?: string
}

export function ShareSheet({
  isOpen,
  onClose,
  business,
  slideTitle,
  shareUrl = typeof window !== 'undefined' ? window.location.href : '',
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false)

  // Truncate helper
  const truncate = (str: string, maxLength: number) =>
    str.length > maxLength ? str.slice(0, maxLength - 1) + '…' : str

  // Build share text with character limit for social platforms
  const rawShareText = `Check out ${business.name}${slideTitle ? ` - ${slideTitle}` : ''}${business.tagline ? ` | ${business.tagline}` : ''}`
  const shareText = truncate(rawShareText, 140) // Twitter-friendly limit

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  // Row 1: Direct/Personal
  const row1Options = [
    {
      id: 'copy',
      label: 'Copy',
      icon: copied ? Check : Copy,
      color: copied ? 'bg-green-500' : 'bg-white/20',
      action: handleCopyLink,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
      },
    },
    {
      id: 'imessage',
      label: 'iMessage',
      icon: Send,
      color: 'bg-[#34C759]',
      action: () => {
        window.open(`sms:&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
      },
    },
  ]

  // Row 2: Social
  const row2Options = [
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      action: () => {
        // Instagram doesn't have a direct share URL, copy link and open app
        handleCopyLink()
        window.open('https://instagram.com', '_blank')
      },
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
      },
    },
    {
      id: 'twitter',
      label: 'X',
      icon: Twitter,
      color: 'bg-black',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
      },
    },
  ]

  // Row 3: Professional/Other
  const row3Options = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
      },
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      color: 'bg-white/20',
      action: () => {
        window.open(`mailto:?subject=${encodeURIComponent(business.name)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
      },
    },
    {
      id: 'snapchat',
      label: 'Snapchat',
      icon: Ghost,
      color: 'bg-[#FFFC00]',
      action: () => {
        // Snapchat creative kit URL scheme
        window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`, '_blank')
      },
    },
  ]

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

          {/* Sheet - fixed height, no scroll */}
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
              <h2 className="text-white text-base font-semibold">Share</h2>
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

            {/* Content - fixed, no scroll - all containers get pointer-events-auto */}
            <div className="px-4 pb-6 pointer-events-auto">
              {/* Share Preview Card */}
              <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">W</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{business.name}</p>
                    <p className="text-white/40 text-[10px] truncate">{slideTitle || business.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Share Options - 3 rows of 3 */}
              <div className="flex flex-col gap-4 pointer-events-auto">
                {[row1Options, row2Options, row3Options].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-6 pointer-events-auto">
                    {row.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          option.action()
                        }}
                        className="flex flex-col items-center gap-1.5 w-16 pointer-events-auto cursor-pointer"
                      >
                        <div className={`w-11 h-11 ${option.color} rounded-full flex items-center justify-center pointer-events-none`}>
                          <option.icon className={`w-5 h-5 ${option.id === 'snapchat' ? 'text-black' : 'text-white'}`} />
                        </div>
                        <span className="text-white/60 text-[10px] font-medium pointer-events-none">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
