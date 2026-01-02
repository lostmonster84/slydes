'use client'

import * as React from 'react'
import { ChevronRight, Book, ExternalLink, Phone, Layers, List, Mail, MapPin, Info, HelpCircle, Star, ArrowRight } from 'lucide-react'

// Legacy icon types (kept for backward compatibility)
export type CTAIconType = 'book' | 'call' | 'view' | 'arrow' | 'menu' | 'list'

// New CTA types (1:1 icon-to-action mapping)
export type CTAType = 'call' | 'link' | 'email' | 'directions' | 'info' | 'faq' | 'reviews' | 'frame' | 'list'

export type CTAButtonProps = {
  text: string
  icon?: CTAIconType | CTAType
  /**
   * Either a Tailwind background class (e.g. "bg-red-600")
   * or a CSS color/gradient string (e.g. "linear-gradient(...)").
   */
  accentColor?: string
  onClick?: () => void
  className?: string
}

// Combined icon mapping (supports both legacy and new types)
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  // Legacy icons
  book: Book,
  call: Phone,
  view: ExternalLink,
  arrow: ChevronRight,
  menu: Layers,
  list: List,
  // New CTA type icons
  link: ExternalLink,
  email: Mail,
  directions: MapPin,
  info: Info,
  faq: HelpCircle,
  reviews: Star,
  frame: ArrowRight,
}

export const CTAButton: React.FC<CTAButtonProps> = ({ text, icon = 'arrow', accentColor = 'bg-red-600', onClick, className }) => {
  const Icon = ICONS[icon] ?? ChevronRight
  const isTailwindBg = typeof accentColor === 'string' && accentColor.trim().startsWith('bg-')

  return (
    <button
      type="button"
      className={[
        'w-full',
        isTailwindBg ? accentColor : '',
        'text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg',
        'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]',
        className ?? '',
      ].join(' ')}
      style={isTailwindBg ? undefined : { background: accentColor }}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      <Icon className="w-4 h-4" />
      {text}
    </button>
  )
}

export default CTAButton
