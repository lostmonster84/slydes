'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, LayoutDashboard, Smartphone, BarChart3, Inbox, Palette, Settings, Check, Plus, LogOut, Menu, X, Home } from 'lucide-react'

interface HQSidebarProps {
  activePage: 'dashboard' | 'home-slyde' | 'slydes' | 'analytics' | 'inbox' | 'brand' | 'settings'
  plan: 'free' | 'creator'
  onPlanChange: (plan: 'free' | 'creator') => void
  slydeCount?: number
  inboxCount?: number
}

export function HQSidebar({ activePage, plan, onPlanChange, slydeCount = 2, inboxCount = 3 }: HQSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isCreator = plan === 'creator'
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [activeBusinessId, setActiveBusinessId] = useState<'wildtrax' | 'northshore' | 'cafeluna'>('wildtrax')
  const [businessHydrated, setBusinessHydrated] = useState(false)

  // Close mobile drawer on route change (when clicking a nav link)
  useEffect(() => {
    setMobileOpen(false)
  }, [activePage])

  const businesses = [
    { id: 'wildtrax' as const, name: 'WildTrax', domain: 'wildtrax.slydes.io', initials: 'W', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'northshore' as const, name: 'Northshore Realty', domain: 'northshore.slydes.io', initials: 'N', gradient: 'from-blue-600 to-cyan-500' },
    { id: 'cafeluna' as const, name: 'Cafe Luna', domain: 'cafeluna.slydes.io', initials: 'C', gradient: 'from-slate-700 to-slate-900' },
  ]

  const activeBusiness = businesses.find((b) => b.id === activeBusinessId) ?? businesses[0]

  // Persist collapsed state
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_sidebar_collapsed')
      if (stored === 'true') setCollapsed(true)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_sidebar_collapsed', String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  // Persist active business (demo)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_demo_business')
      if (stored === 'wildtrax' || stored === 'northshore' || stored === 'cafeluna') {
        setActiveBusinessId(stored)
      }
    } catch {
      // ignore
    }
    setBusinessHydrated(true)
  }, [])

  useEffect(() => {
    if (!businessHydrated) return
    try {
      window.localStorage.setItem('slydes_demo_business', activeBusinessId)
      window.dispatchEvent(new Event('slydes_demo_business_change'))
    } catch {
      // ignore
    }
  }, [activeBusinessId, businessHydrated])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/demo/hq-dashboard', icon: LayoutDashboard },
    { id: 'home-slyde', label: 'Home Slyde', href: '/demo/editor-home-slyde', icon: Home },
    // Slydes = Child Slydes list (Category Slydes + Item Slydes)
    { id: 'slydes', label: 'Slydes', href: '/demo/hq-mockup', icon: Smartphone, badge: slydeCount },
    { id: 'analytics', label: 'Analytics', href: '/demo/hq-analytics', icon: BarChart3, locked: !isCreator },
    { id: 'inbox', label: 'Inbox', href: '/demo/hq-inbox', icon: Inbox, badge: inboxCount },
  ]

  const bottomNavItems = [
    { id: 'brand', label: 'Brand', href: '/demo/hq-brand', icon: Palette },
    { id: 'settings', label: 'Settings', href: '/demo/hq-settings', icon: Settings },
  ]

  // Shared sidebar content (used in both desktop and mobile)
  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0">
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="slydes-gradient-sidebar" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <rect x="14" y="36" width="36" height="24" rx="4" fill="#2563EB" opacity="0.2" />
              <rect x="12" y="22" width="40" height="28" rx="5" fill="#2563EB" opacity="0.5" />
              <rect x="10" y="6" width="44" height="32" rx="6" fill="url(#slydes-gradient-sidebar)" />
              <rect x="24" y="6" width="16" height="4" rx="2" fill="white" opacity="0.3" />
            </svg>
          </div>
          {(isMobile || !collapsed) && (
            <div className="min-w-0 flex-1">
              <div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Slydes</div>
              <div className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">HQ</div>
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger trigger — fixed position, visible only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg dark:bg-[#2c2c2e]/90 dark:border-white/10"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col dark:bg-[#2c2c2e] dark:border-white/10 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent(true)}

        {/* Mobile nav (always expanded) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 dark:from-blue-500/15 dark:to-cyan-500/15 dark:text-cyan-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-cyan-500'
                      : 'bg-gray-200 text-gray-600 dark:bg-white/15 dark:text-white/70'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.locked && (
                  <span className="ml-auto text-[10px] font-semibold text-gray-400 dark:text-white/40">Locked</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile bottom nav */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 dark:from-blue-500/15 dark:to-cyan-500/15 dark:text-cyan-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Mobile plan toggle */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          <div className="p-1 bg-gray-100 rounded-xl flex dark:bg-white/10">
            <button
              onClick={() => onPlanChange('free')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                plan === 'free'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => onPlanChange('creator')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                plan === 'creator'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70'
              }`}
            >
              Creator
            </button>
          </div>
          {!isCreator && (
            <Link
              href="/demo/hq-settings"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block w-full py-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Upgrade to Creator
            </Link>
          )}
        </div>

        {/* Mobile business switcher */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeBusiness.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
              {activeBusiness.initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{activeBusiness.name}</div>
              <div className="text-xs text-gray-500 dark:text-white/50 truncate">{activeBusiness.domain}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className={`hidden md:flex ${collapsed ? 'w-[72px]' : 'w-72'} bg-white border-r border-gray-200 flex-col dark:bg-[#2c2c2e] dark:border-white/10 transition-all duration-300 shrink-0`}>
        
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0">
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="slydes-gradient-desktop" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <rect x="14" y="36" width="36" height="24" rx="4" fill="#2563EB" opacity="0.2" />
                <rect x="12" y="22" width="40" height="28" rx="5" fill="#2563EB" opacity="0.5" />
                <rect x="10" y="6" width="44" height="32" rx="6" fill="url(#slydes-gradient-desktop)" />
                <rect x="24" y="6" width="16" height="4" rx="2" fill="white" opacity="0.3" />
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Slydes</div>
                <div className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">HQ</div>
              </div>
            )}
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer relative ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">
                      {item.badge}
                    </span>
                  )}
                  {item.locked && (
                    <span className="ml-auto text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/20 dark:text-white/80">
                      Locked
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-gray-200 dark:border-white/10" />

        {/* Bottom nav items */}
        {bottomNavItems.map((item) => {
          const isActive = activePage === item.id
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer relative ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Plan Card */}
      {!collapsed && (
        <div className="p-3">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-sm dark:border-white/10 dark:bg-[#2c2c2e] dark:from-[#2c2c2e] dark:via-[#2a2a2c] dark:to-[#2c2c2e] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />

            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider border border-blue-100 dark:bg-blue-500/12 dark:text-cyan-300 dark:border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
              Plan
            </div>
            <div className="mt-2 text-base font-display font-bold text-gray-900 dark:text-white">{isCreator ? 'Creator' : 'Free'}</div>
            <div className="mt-1 text-xs text-gray-600 dark:text-white/70">
              {isCreator ? '10 Slydes • Analytics • No watermark' : '1 Slyde • Watermark'}
            </div>
            
            {/* Demo toggle */}
            <div className="mt-3 flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-black/20 dark:border dark:border-white/10">
              <button
                onClick={() => onPlanChange('free')}
                className={`flex-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  !isCreator
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)] dark:border dark:border-white/10'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => onPlanChange('creator')}
                className={`flex-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isCreator
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-[#3a3a3c] dark:text-white dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)] dark:border dark:border-white/10'
                    : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                Creator
              </button>
            </div>

            {!isCreator && (
              <Link
                href="/demo/hq-settings"
                className="mt-3 block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm rounded-xl text-center hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
              >
                Upgrade to Creator
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountMenuOpen((v) => !v)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer dark:hover:bg-white/10 ${collapsed ? 'justify-center' : ''}`}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            title={collapsed ? `${activeBusiness.name} • Account menu` : undefined}
          >
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeBusiness.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {activeBusiness.initials}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-gray-900 truncate dark:text-white">{activeBusiness.name}</div>
                  <div className="text-xs text-gray-500 truncate dark:text-white/50">{activeBusiness.domain}</div>
                </div>
                <svg className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {accountMenuOpen && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setAccountMenuOpen(false)} />
              <div
                className={`absolute bottom-full mb-2 z-[100] w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden dark:border-white/10 dark:bg-[#2c2c2e] ${
                  collapsed ? 'left-0' : 'right-0'
                }`}
                role="menu"
              >
                <div className="p-4 border-b border-gray-200 dark:border-white/10">
                  <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60">Account</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{activeBusiness.name}</div>
                  <div className="text-xs text-gray-500 dark:text-white/50">{activeBusiness.domain}</div>
                </div>

                <div className="p-2">
                  <div className="px-2 py-2 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60">Switch business</div>
                  {businesses.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setActiveBusinessId(b.id)
                        setAccountMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                        b.id === activeBusinessId ? 'bg-blue-50 dark:bg-blue-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                      role="menuitem"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${b.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                        {b.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-semibold truncate ${b.id === activeBusinessId ? 'text-blue-700 dark:text-cyan-300' : 'text-gray-900 dark:text-white'}`}>
                          {b.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/50 truncate">{b.domain}</div>
                      </div>
                      {b.id === activeBusinessId && <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400" aria-hidden="true" />}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      // demo-only: no real flow
                      setAccountMenuOpen(false)
                    }}
                    className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/70 dark:hover:bg-white/5"
                    role="menuitem"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Add business
                    <span className="ml-auto text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/15 dark:text-white/70">Demo</span>
                  </button>
                </div>

                <div className="p-2 border-t border-gray-200 dark:border-white/10">
                  <Link
                    href="/demo/hq-brand"
                    onClick={() => setAccountMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/80 dark:hover:bg-white/5"
                    role="menuitem"
                  >
                    <Palette className="w-4 h-4" aria-hidden="true" />
                    Brand
                  </Link>
                  <Link
                    href="/demo/hq-settings"
                    onClick={() => setAccountMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/80 dark:hover:bg-white/5"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      // demo-only: no auth yet
                      setAccountMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/80 dark:hover:bg-white/5"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Log out
                    <span className="ml-auto text-[11px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-white/15 dark:text-white/70">Demo</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
    </>
  )
}

