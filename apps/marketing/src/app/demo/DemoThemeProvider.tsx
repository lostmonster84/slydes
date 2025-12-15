'use client'

import { useEffect, useMemo, useState } from 'react'

type DemoTheme = 'light' | 'dark'

const STORAGE_KEY = 'slydes-demo-theme'

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
      />
    </svg>
  )
}

export function DemoThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DemoTheme>(() => {
    // Important: initialize synchronously on the client to avoid a light-mode flash.
    if (typeof window === 'undefined') return 'light'
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') return stored
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  // Apply theme to <html> while inside /demo
  useEffect(() => {
    const root = document.documentElement
    const previousHadDark = root.classList.contains('dark')

    root.classList.toggle('dark', theme === 'dark')
    // Helps form controls + scrollbars match theme in supported browsers
    root.style.colorScheme = theme

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }

    return () => {
      // When leaving /demo, restore prior state to avoid impacting the marketing site.
      root.classList.toggle('dark', previousHadDark)
      root.style.colorScheme = ''
    }
  }, [theme])

  const toggleLabel = useMemo(() => (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'), [theme])

  return (
    <>
      {children}

      {/* Global demo theme toggle (fixed, non-intrusive) */}
      <div className="fixed bottom-5 right-5 z-[100]">
        <button
          type="button"
          aria-label={toggleLabel}
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur hover:bg-white transition-colors dark:border-white/10 dark:bg-[#2c2c2e]/90 dark:text-white"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white">
            {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </span>
          <span className="hidden sm:block">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </>
  )
}

export default DemoThemeProvider


