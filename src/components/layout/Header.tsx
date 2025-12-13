'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  // Only the homepage has a dark hero
  const isHomepage = pathname === '/'
  // Use dark styling on homepage when not scrolled, OR when mobile menu is open
  const useDarkMode = (isHomepage && !scrolled) || mobileMenuOpen
  // Header background should be dark when menu is open (on any page)
  const headerIsDark = mobileMenuOpen || (isHomepage && !scrolled)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        headerIsDark 
          ? 'bg-future-black border-b border-white/10' 
          : 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo dark={useDarkMode} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/how-it-works" 
            className={`group relative transition-colors text-sm ${
              useDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            How It Works
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
              useDarkMode ? 'bg-white' : 'bg-leader-blue'
            }`} />
          </Link>
          <Link 
            href="/showcase" 
            className={`group relative transition-colors text-sm ${
              useDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Showcase
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
              useDarkMode ? 'bg-white' : 'bg-leader-blue'
            }`} />
          </Link>
          <Link 
            href="/contact" 
            className={`group relative transition-colors text-sm ${
              useDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
              useDarkMode ? 'bg-white' : 'bg-leader-blue'
            }`} />
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a href="/#waitlist">
            <Button 
              className={useDarkMode ? '!bg-white !text-future-black hover:!bg-gray-100' : ''}
            >
              Join Waitlist
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation ${
            useDarkMode ? 'text-white' : 'text-gray-600'
          }`}
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

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-[100] overflow-y-auto"
            style={{ backgroundColor: '#0A0E27' }}
          >
            <motion.nav 
              className="flex flex-col min-h-full px-8 pt-8 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {/* Main Links */}
              <div className="space-y-2">
                {[
                  { href: '/how-it-works', label: 'How It Works' },
                  { href: '/showcase', label: 'Showcase' },
                  { href: '/contact', label: 'Contact' },
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-4 text-3xl font-bold text-white hover:text-electric-cyan transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div 
                className="my-8 h-px bg-white/10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              />

              {/* Secondary Links */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Link
                  href="/affiliates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg text-white/60 hover:text-white transition-colors"
                >
                  Affiliate Program
                </Link>
                <Link
                  href="/investors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg text-white/60 hover:text-white transition-colors"
                >
                  Investors
                </Link>
              </motion.div>

              {/* CTA at bottom */}
              <motion.div 
                className="mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <a 
                  href="/#waitlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button size="lg" className="w-full text-lg">
                    Join Waitlist
                  </Button>
                </a>
                <p className="text-center text-white/40 text-sm mt-4">
                  No spam. Just launch updates.
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
