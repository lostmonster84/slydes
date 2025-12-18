'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon, Monitor } from 'lucide-react'
import { AskHQ } from './_components/AskHQ'

interface AdminLayoutProps {
  children: ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: string
  badge?: number
  badgeColor?: 'purple' | 'blue' | 'red' | 'green'
  healthDot?: 'healthy' | 'degraded' | 'unhealthy'
}

type NavSection = {
  label?: string
  items: NavItem[]
}

type NavBadges = {
  triageCount: number
  waitlistTodayCount: number
  messagesUnreadCount: number
  healthStatus: 'healthy' | 'degraded' | 'unhealthy' | null
}

// Nav sections are generated dynamically to include badge counts
function getNavSections(badges: NavBadges): NavSection[] {
  return [
    {
      items: [
        {
          href: '/admin/hq',
          label: 'Overview',
          icon: 'home',
          healthDot: badges.healthStatus && badges.healthStatus !== 'healthy' ? badges.healthStatus : undefined,
        },
        { href: '/admin/integrations', label: 'Integrations', icon: 'plug' },
      ],
    },
    {
      label: 'Product',
      items: [
        { href: '/admin/messages', label: 'Messages', icon: 'messages', badge: badges.messagesUnreadCount > 0 ? badges.messagesUnreadCount : undefined, badgeColor: 'green' },
        { href: '/admin/roadmap', label: 'Roadmap', icon: 'roadmap', badge: badges.triageCount > 0 ? badges.triageCount : undefined, badgeColor: 'purple' },
      ],
    },
    {
      label: 'Business',
      items: [
        { href: '/admin/business', label: 'Metrics', icon: 'chart' },
        { href: '/admin/revenue', label: 'Revenue', icon: 'currency' },
      ],
    },
    {
      label: 'CRM',
      items: [
        { href: '/admin/users', label: 'Users', icon: 'user' },
        { href: '/admin/customers', label: 'Customers', icon: 'customers' },
        { href: '/admin/organizations', label: 'Organizations', icon: 'building' },
        { href: '/admin/affiliates', label: 'Affiliates', icon: 'megaphone' },
        { href: '/admin/waitlist', label: 'Waitlist', icon: 'users', badge: badges.waitlistTodayCount > 0 ? badges.waitlistTodayCount : undefined, badgeColor: 'blue' },
      ],
    },
    {
      label: 'Assets',
      items: [
        { href: '/admin/sounds', label: 'Sounds', icon: 'music' },
      ],
    },
  ]
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case 'plug':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'chart':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    case 'currency':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'customers':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    case 'building':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    case 'roadmap':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    case 'user':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'messages':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'music':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    default:
      return null
  }
}

const ROADMAP_STORAGE_KEY = 'slydes_hq_roadmap'

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [triageCount, setTriageCount] = useState(0)
  const [waitlistTodayCount, setWaitlistTodayCount] = useState(0)
  const [messagesUnreadCount, setMessagesUnreadCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'unhealthy' | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark')
  const pathname = usePathname()
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/health')
      if (response.ok) {
        setIsAuthenticated(true)
      } else if (response.status === 401) {
        setIsAuthenticated(false)
      } else {
        // Other error, might still be authenticated
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Load triage count from localStorage
  useEffect(() => {
    const loadTriageCount = () => {
      try {
        const stored = localStorage.getItem(ROADMAP_STORAGE_KEY)
        if (stored) {
          const items = JSON.parse(stored)
          const count = items.filter((item: { status: string }) => item.status === 'triage').length
          setTriageCount(count)
        }
      } catch {
        // ignore
      }
    }

    loadTriageCount()

    // Listen for storage changes (when roadmap page updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ROADMAP_STORAGE_KEY) {
        loadTriageCount()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also poll periodically in case changes happen in the same tab
    const interval = setInterval(loadTriageCount, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Fetch waitlist today count and health status
  useEffect(() => {
    const fetchNavBadgeData = async () => {
      try {
        // Fetch waitlist data for today's count
        const waitlistRes = await fetch('/api/admin/waitlist')
        if (waitlistRes.ok) {
          const waitlistData = await waitlistRes.json()
          setWaitlistTodayCount(waitlistData.todayCount || 0)
        }
      } catch {
        // Ignore errors, badge just won't show
      }

      try {
        // Fetch messages unread count
        const messagesRes = await fetch('/api/admin/messages?status=new')
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json()
          setMessagesUnreadCount(messagesData.unreadCount || 0)
        }
      } catch {
        // Ignore errors
      }

      try {
        // Fetch health status
        const healthRes = await fetch('/api/admin/health')
        if (healthRes.ok) {
          const healthData = await healthRes.json()
          setHealthStatus(healthData.overall || 'healthy')
        }
      } catch {
        // Ignore errors
      }
    }

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchNavBadgeData()
      // Refresh every 60 seconds
      const interval = setInterval(fetchNavBadgeData, 60000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Theme persistence and application
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_hq_theme') as 'light' | 'dark' | 'system' | null
      if (stored) setTheme(stored)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_hq_theme', theme)
    } catch {
      // ignore
    }

    // Apply theme to document
    const root = document.documentElement
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Something went wrong')
    }
  }

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setIsAuthenticated(false)
    router.push('/admin/hq')
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-leader-blue border-t-transparent rounded-full" />
      </div>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4">
                <Image src="/logo.svg" alt="Slydes" width={56} height={56} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Slydes HQ</h1>
              <p className="text-gray-500">Enter password to access admin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/20 outline-none transition-all"
                autoFocus
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-future-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Access HQ
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated layout with side nav (Dark/Light mode, Apple HIG)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex">
      {/* Side Navigation - Apple HIG sidebar */}
      <aside
        className={`${
          isNavCollapsed ? 'w-16' : 'w-60'
        } bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white flex flex-col fixed h-full border-r border-gray-200 dark:border-white/10 transition-all duration-200`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <Image src="/logo.svg" alt="Slydes" width={32} height={32} />
            </div>
            {!isNavCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-base text-gray-900 dark:text-white">Slydes HQ</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-4">
            {getNavSections({ triageCount, waitlistTodayCount, messagesUnreadCount, healthStatus }).map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {section.label && !isNavCollapsed && (
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {section.label}
                  </p>
                )}
                {section.label && isNavCollapsed && (
                  <div className="mx-3 my-2 border-t border-gray-200 dark:border-white/10" />
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    const badgeColorClass = item.badgeColor === 'blue' ? 'bg-blue-500' :
                                            item.badgeColor === 'red' ? 'bg-red-500' :
                                            item.badgeColor === 'green' ? 'bg-green-500' :
                                            'bg-purple-500'
                    const healthDotClass = item.healthDot === 'unhealthy' ? 'bg-red-500' :
                                           item.healthDot === 'degraded' ? 'bg-amber-500' :
                                           null
                    return (
                      <li key={item.href} className="relative">
                        <Link
                          href={item.href}
                          title={isNavCollapsed ? item.label : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-leader-blue text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                          } ${isNavCollapsed ? 'justify-center' : ''}`}
                        >
                          <span className="relative">
                            <NavIcon name={item.icon} />
                            {/* Health dot indicator */}
                            {healthDotClass && (
                              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${healthDotClass} rounded-full ring-2 ring-white dark:ring-[#2c2c2e]`} />
                            )}
                          </span>
                          {!isNavCollapsed && (
                            <>
                              <span className="font-medium text-sm">{item.label}</span>
                              {item.badge && (
                                <span className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold ${badgeColorClass} text-white rounded-full min-w-[18px] text-center`}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {isNavCollapsed && item.badge && (
                            <span className={`absolute -top-1 -right-1 px-1 py-0.5 text-[9px] font-bold ${badgeColorClass} text-white rounded-full min-w-[14px] text-center`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Theme Toggle */}
        {!isNavCollapsed && (
          <div className="px-3 pb-2">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Theme</div>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                  theme === 'light'
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                  theme === 'system'
                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Auto
              </button>
            </div>
          </div>
        )}

        {/* Collapse Toggle + Logout */}
        <div className="p-2 border-t border-gray-200 dark:border-white/10 space-y-1">
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            title={isNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-all ${
              isNavCollapsed ? 'justify-center' : ''
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isNavCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!isNavCollapsed && <span className="font-medium text-sm">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            title={isNavCollapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-all ${
              isNavCollapsed ? 'justify-center' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isNavCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isNavCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-200`}>
        {children}
      </main>

      {/* Ask HQ Chat */}
      <AskHQ />
    </div>
  )
}
