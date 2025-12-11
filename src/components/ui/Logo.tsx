'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
  showDomain?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', showDomain = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <Link 
      href="/" 
      className={`font-bold tracking-tight hover:opacity-80 transition-opacity ${sizeClasses[size]} ${className}`}
    >
      <span className="text-future-black">
        Slydes
      </span>
      {showDomain && (
        <span className="text-gray-400 font-normal">.io</span>
      )}
    </Link>
  )
}

// Gradient version - ONLY use if explicitly asked
export function LogoGradient({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <Link 
      href="/" 
      className={`font-bold tracking-tight hover:opacity-90 transition-opacity ${sizeClasses[size]} ${className}`}
    >
      <span className="bg-gradient-to-r from-future-black via-leader-blue to-electric-cyan bg-clip-text text-transparent">
        Slydes
      </span>
    </Link>
  )
}

// Mark only (for favicon, app icon, etc)
export function LogoMark({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      className={className}
    >
      {/* Stylized S */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A0E27" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      <path 
        d="M24 8C24 8 20 4 14 4C8 4 4 8 4 12C4 16 8 18 14 20C20 22 24 24 24 28C24 32 20 36 14 36C8 36 4 32 4 32"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        transform="translate(2, -2) scale(0.85)"
      />
    </svg>
  )
}

