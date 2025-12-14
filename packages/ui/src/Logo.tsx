'use client'

import { ReactNode } from 'react'

// ============================================
// SLYDES.IO LOGO - RISING CARDS
// ============================================
// Three frames rising upward with increasing opacity
// Bottom frame faded, top frame bold
// Suggests "swipe up to reveal" - the core product action
// ============================================

interface LogoMarkProps {
  size?: number
  className?: string
}

interface LogoProps {
  className?: string
  showDomain?: boolean
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
  // Allow custom Link component for framework compatibility
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>
}

// Default link that just renders an anchor tag
const DefaultLink = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) => (
  <a href={href} className={className}>{children}</a>
)

// The Logo Mark - Rising Cards
export function LogoMark({ size = 32, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="slydes-gradient" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* Bottom frame - faded, represents "below" */}
      <rect x="14" y="36" width="36" height="24" rx="4" fill="#2563EB" opacity="0.2" />
      {/* Middle frame - medium opacity */}
      <rect x="12" y="22" width="40" height="28" rx="5" fill="#2563EB" opacity="0.5" />
      {/* Top frame - bold, the "current" slide */}
      <rect x="10" y="6" width="44" height="32" rx="6" fill="url(#slydes-gradient)" />
      {/* Notch on top frame */}
      <rect x="24" y="6" width="16" height="4" rx="2" fill="white" opacity="0.3" />
    </svg>
  )
}

// Full Logo with Mark + Wordmark
export function Logo({
  className = '',
  showDomain = true,
  size = 'md',
  dark = false,
  LinkComponent = DefaultLink
}: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 40, text: 'text-2xl', gap: 'gap-3' },
  }
  const s = sizes[size]

  return (
    <LinkComponent
      href="/"
      className={`flex items-center ${s.gap} hover:opacity-80 transition-opacity ${className}`}
    >
      <LogoMark size={s.icon} />
      <span className={`font-display font-bold tracking-tight ${s.text}`}>
        <span className={dark ? 'text-white' : 'text-future-black'}>
          Slydes
        </span>
        {showDomain && (
          <span className={dark ? 'text-white/40' : 'text-gray-400'}>.io</span>
        )}
      </span>
    </LinkComponent>
  )
}

// Wordmark only (no icon)
export function LogoWordmark({
  className = '',
  showDomain = true,
  size = 'md',
  dark = false,
  LinkComponent = DefaultLink
}: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <LinkComponent
      href="/"
      className={`font-display font-bold tracking-tight hover:opacity-80 transition-opacity ${sizes[size]} ${className}`}
    >
      <span className={dark ? 'text-white' : 'text-future-black'}>
        Slydes
      </span>
      {showDomain && (
        <span className={dark ? 'text-white/40' : 'text-gray-400'}>.io</span>
      )}
    </LinkComponent>
  )
}

// Gradient wordmark variant
export function LogoGradient({ className = '', size = 'md', LinkComponent = DefaultLink }: Omit<LogoProps, 'dark' | 'showDomain'>) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 40, text: 'text-2xl', gap: 'gap-3' },
  }
  const s = sizes[size]

  return (
    <LinkComponent
      href="/"
      className={`flex items-center ${s.gap} hover:opacity-90 transition-opacity ${className}`}
    >
      <LogoMark size={s.icon} />
      <span className={`font-display font-bold tracking-tight bg-gradient-to-r from-leader-blue to-[#06B6D4] bg-clip-text text-transparent ${s.text}`}>
        Slydes.io
      </span>
    </LinkComponent>
  )
}
