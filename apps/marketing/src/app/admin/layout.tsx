'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface AdminLayoutProps {
  children: ReactNode
}

type NavItem = {
  href: string
  label: string
  icon: string
}

type NavSection = {
  label?: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { href: '/admin/hq', label: 'Overview', icon: 'home' },
      { href: '/admin/integrations', label: 'Integrations', icon: 'plug' },
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
      { href: '/admin/customers', label: 'Customers', icon: 'customers' },
      { href: '/admin/organizations', label: 'Organizations', icon: 'building' },
      { href: '/admin/waitlist', label: 'Waitlist', icon: 'users' },
    ],
  },
]

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
    default:
      return null
  }
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
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

  // Authenticated layout with side nav (Dark mode, Apple HIG)
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex">
      {/* Side Navigation - Apple HIG sidebar */}
      <aside
        className={`${
          isNavCollapsed ? 'w-16' : 'w-60'
        } bg-[#2c2c2e] text-white flex flex-col fixed h-full border-r border-white/10 transition-all duration-200`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <Image src="/logo.svg" alt="Slydes" width={32} height={32} />
            </div>
            {!isNavCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-base text-white">Slydes HQ</h1>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-4">
            {NAV_SECTIONS.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {section.label && !isNavCollapsed && (
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.label}
                  </p>
                )}
                {section.label && isNavCollapsed && (
                  <div className="mx-3 my-2 border-t border-white/10" />
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={isNavCollapsed ? item.label : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-leader-blue text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          } ${isNavCollapsed ? 'justify-center' : ''}`}
                        >
                          <NavIcon name={item.icon} />
                          {!isNavCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Collapse Toggle + Logout */}
        <div className="p-2 border-t border-white/10 space-y-1">
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            title={isNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all ${
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
            className={`flex items-center gap-3 px-3 py-2.5 w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all ${
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
    </div>
  )
}
