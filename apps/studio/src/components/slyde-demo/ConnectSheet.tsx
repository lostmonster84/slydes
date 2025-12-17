'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'
import type { SocialLinks } from './frameData'
import { SheetHandle } from './SheetHandle'

// TikTok icon (not in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

// Twitter/X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

interface ConnectSheetProps {
  isOpen: boolean
  onClose: () => void
  business: {
    name: string
    tagline?: string
    image?: string
  }
  socialLinks?: SocialLinks
}

// Social platform config
const SOCIAL_PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: TikTokIcon,
    color: 'bg-black',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'bg-[#1877F2]',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: Youtube,
    color: 'bg-[#FF0000]',
  },
  {
    id: 'twitter',
    label: 'X',
    icon: XIcon,
    color: 'bg-black',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-[#0A66C2]',
  },
] as const

export function ConnectSheet({
  isOpen,
  onClose,
  business,
  socialLinks,
}: ConnectSheetProps) {
  // Filter to only show platforms with links
  const activePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => socialLinks?.[platform.id as keyof SocialLinks]
  )

  // Split into rows of 3
  const rows: typeof activePlatforms[] = []
  for (let i = 0; i < activePlatforms.length; i += 3) {
    rows.push(activePlatforms.slice(i, i + 3))
  }

  const handlePlatformClick = (platformId: string) => {
    const url = socialLinks?.[platformId as keyof SocialLinks]
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
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
              <h2 className="text-white text-base font-semibold">Connect</h2>
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
              {/* Social Platforms Grid */}
              {activePlatforms.length > 0 ? (
                <div className="flex flex-col gap-4 pointer-events-auto">
                  {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-6 pointer-events-auto">
                      {row.map((platform) => (
                        <motion.button
                          key={platform.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlatformClick(platform.id)
                          }}
                          className="flex flex-col items-center gap-1.5 w-16 pointer-events-auto cursor-pointer"
                        >
                          <div className={`w-11 h-11 ${platform.color} rounded-full flex items-center justify-center pointer-events-none`}>
                            <platform.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white/60 text-[10px] font-medium pointer-events-none">
                            {platform.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/40 text-sm">No social links configured</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
