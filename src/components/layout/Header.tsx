'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="group relative text-gray-600 hover:text-gray-900 transition-colors text-sm">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leader-blue transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/showcase" className="group relative text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Showcase
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leader-blue transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/founding-member" className="group relative text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Partners
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leader-blue transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/contact" className="group relative text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leader-blue transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/founding-member">
            <Button>Become a Partner</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ touchAction: 'manipulation' }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-2">
            <Link
              href="/how-it-works"
              className="block min-h-[44px] flex items-center text-gray-600 active:text-gray-900 active:bg-gray-50 transition-colors touch-manipulation rounded-lg px-2 -mx-2"
              onClick={() => setMobileMenuOpen(false)}
              style={{ touchAction: 'manipulation' }}
            >
              How It Works
            </Link>
            <Link
              href="/showcase"
              className="block min-h-[44px] flex items-center text-gray-600 active:text-gray-900 active:bg-gray-50 transition-colors touch-manipulation rounded-lg px-2 -mx-2"
              onClick={() => setMobileMenuOpen(false)}
              style={{ touchAction: 'manipulation' }}
            >
              Showcase
            </Link>
            <Link
              href="/founding-member"
              className="block min-h-[44px] flex items-center text-gray-600 active:text-gray-900 active:bg-gray-50 transition-colors touch-manipulation rounded-lg px-2 -mx-2"
              onClick={() => setMobileMenuOpen(false)}
              style={{ touchAction: 'manipulation' }}
            >
              Partners
            </Link>
            <Link
              href="/contact"
              className="block min-h-[44px] flex items-center text-gray-600 active:text-gray-900 active:bg-gray-50 transition-colors touch-manipulation rounded-lg px-2 -mx-2"
              onClick={() => setMobileMenuOpen(false)}
              style={{ touchAction: 'manipulation' }}
            >
              Contact
            </Link>
            <Link 
              href="/founding-member" 
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4"
            >
              <Button className="w-full">Become a Partner</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
