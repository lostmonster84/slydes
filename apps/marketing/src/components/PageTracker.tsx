'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Tracks page visits for analytics.
 * Add this to your root layout to track all pages.
 */
export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return

    // Don't track localhost/dev
    if (typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1')) {
      return
    }

    // Send tracking request (fire and forget)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {
      // Silently fail - don't break the page if tracking fails
    })
  }, [pathname])

  return null
}
