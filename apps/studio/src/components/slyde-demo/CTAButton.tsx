'use client'

import * as React from 'react'
import { ArrowRight, BookOpen, Calendar, Eye, Phone } from 'lucide-react'

export type CTAIconType = 'book' | 'call' | 'view' | 'arrow' | 'menu'

export type CTAButtonProps = {
  text: string
  icon?: CTAIconType
  /**
   * Either a Tailwind background class (e.g. "bg-red-600")
   * or a CSS color/gradient string (e.g. "linear-gradient(...)").
   */
  accentColor?: string
  onClick?: () => void
  className?: string
}

const ICONS: Record<CTAIconType, React.ComponentType<{ className?: string }>> = {
  book: Calendar,
  call: Phone,
  view: Eye,
  arrow: ArrowRight,
  menu: BookOpen,
}

export const CTAButton: React.FC<CTAButtonProps> = ({ text, icon = 'arrow', accentColor = 'bg-red-600', onClick, className }) => {
  const Icon = ICONS[icon] ?? ArrowRight
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

