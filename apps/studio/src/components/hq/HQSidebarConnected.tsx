'use client'

/**
 * HQSidebarConnected - Sidebar connected to Supabase
 *
 * This version uses real organization data from Supabase.
 * Falls back gracefully when organization is not yet loaded.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, TrendingUp, Smartphone, BarChart3, Inbox, Palette, Settings, LogOut, Menu, X, Layers, Lightbulb, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { FeatureSuggestionModal } from './FeatureSuggestionModal'
import { useOrganization } from '@/hooks/useOrganization'
import { useSlydes } from '@/hooks/useSlydes'

interface HQSidebarConnectedProps {
  activePage: 'dashboard' | 'home-slyde' | 'slydes' | 'analytics' | 'shop' | 'inbox' | 'brand' | 'settings'
}

export function HQSidebarConnected({ activePage }: HQSidebarConnectedProps) {
  const router = useRouter()
  const { organization, organizations, isLoading: orgLoading, switchOrganization } = useOrganization()
  const { slydes, isLoading: slydesLoading } = useSlydes()

  const [collapsed, setCollapsed] = useState(false)
  const [collapsedHydrated, setCollapsedHydrated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [featureModalOpen, setFeatureModalOpen] = useState(false)

  // Plan state (demo - will be from Stripe later)
  const [plan, setPlan] = useState<'free' | 'creator'>('free')
  const isCreator = plan === 'creator'

  // Persist plan preference
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_demo_plan')
      if (stored === 'free' || stored === 'creator') setPlan(stored)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_demo_plan', plan)
    } catch {
      // ignore
    }
  }, [plan])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [activePage])

  // Persist collapsed state
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_sidebar_collapsed')
      if (stored === 'true') setCollapsed(true)
    } catch {
      // ignore
    }
    setCollapsedHydrated(true)
  }, [])

  useEffect(() => {
    if (!collapsedHydrated) return
    try {
      window.localStorage.setItem('slydes_sidebar_collapsed', String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed, collapsedHydrated])

  // Derive business info from organization
  const activeBusiness = organization
    ? {
        id: organization.id,
        name: organization.name,
        domain: `${organization.slug}.slydes.io`,
        initials: organization.name.charAt(0).toUpperCase(),
        gradient: 'from-blue-600 to-cyan-500',
        logoUrl: organization.logo_url,
      }
    : {
        id: 'loading',
        name: 'Loading...',
        domain: '...',
        initials: '?',
        gradient: 'from-gray-400 to-gray-500',
        logoUrl: null,
      }

  const slydeCount = slydes.length

  const navItems = [
    { id: 'dashboard', label: 'Momentum', href: '/dashboard', icon: TrendingUp },
    { id: 'home-slyde', label: 'Studio', href: '/', icon: Smartphone },
    { id: 'slydes', label: 'Slydes', href: '/slydes', icon: Layers, badge: slydeCount > 0 ? slydeCount : undefined },
    { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { id: 'shop', label: 'Shop', href: '/shop', icon: ShoppingBag },
    { id: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox, comingSoon: true },
  ]

  const bottomNavItems = [
    { id: 'brand', label: 'Brand', href: '/brand', icon: Palette },
    { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
  ]

  // Shared sidebar content
  const sidebarContent = (isMobile: boolean) => (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-mark.svg"
            alt="Slydes"
            width={32}
            height={32}
            className="w-8 h-8 shrink-0"
          />
          {(isMobile || !collapsed) && (
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-xl leading-tight">
                <span className="text-gray-900 dark:text-white">Slydes</span>
                <span className="text-gray-400 dark:text-white/40">.io</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-white/50 -mt-0.5">Studio</span>
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
      {/* Mobile hamburger trigger */}
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

        {/* Mobile nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.comingSoon ? '#' : item.href}
                onClick={(e) => {
                  if (item.comingSoon) {
                    e.preventDefault()
                    return
                  }
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  item.comingSoon
                    ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-white/40'
                    : isActive
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
                {item.comingSoon && (
                  <span className="ml-auto text-[10px] font-semibold text-gray-400 dark:text-white/50">Coming soon</span>
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

        {/* Suggest a feature - Mobile */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              setMobileOpen(false)
              setFeatureModalOpen(true)
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-600 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all dark:from-cyan-500/15 dark:to-blue-500/15 dark:border-cyan-500/30 dark:text-cyan-400"
          >
            <Lightbulb className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">Suggest a feature</span>
          </button>
        </div>

        {/* Mobile business switcher */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
          >
            {activeBusiness.logoUrl ? (
              <img
                src={activeBusiness.logoUrl}
                alt={activeBusiness.name}
                className="w-9 h-9 rounded-xl object-cover shadow-sm shrink-0"
              />
            ) : (
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeBusiness.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}>
                {activeBusiness.initials}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{activeBusiness.name}</div>
              <div className="text-xs text-gray-500 dark:text-white/50 truncate">{activeBusiness.domain}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex ${collapsed ? 'w-[72px]' : 'w-72'} bg-white border-r border-gray-200 flex-col dark:bg-[#2c2c2e] dark:border-white/10 transition-all duration-300 shrink-0 ${!collapsedHydrated ? 'opacity-0' : 'opacity-100'}`}>
        {sidebarContent(false)}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                href={item.comingSoon ? '#' : item.href}
                onClick={(e) => {
                  if (item.comingSoon) {
                    e.preventDefault()
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative ${
                  item.comingSoon
                    ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-white/40'
                    : isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white cursor-pointer'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && !item.comingSoon && (
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
                    {item.comingSoon && (
                      <span className="ml-auto text-[11px] text-gray-400 dark:text-white/50">
                        Coming soon
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}

          <div className="my-3 border-t border-gray-200 dark:border-white/10" />

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


        {/* Suggest a feature - Desktop */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setFeatureModalOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-600 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all dark:from-cyan-500/15 dark:to-blue-500/15 dark:border-cyan-500/30 dark:text-cyan-400 ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Suggest a feature' : undefined}
          >
            <Lightbulb className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-semibold text-sm">Suggest a feature</span>}
          </button>
        </div>

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

        {/* User Profile / Business Switcher */}
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
              {activeBusiness.logoUrl ? (
                <img
                  src={activeBusiness.logoUrl}
                  alt={activeBusiness.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeBusiness.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {activeBusiness.initials}
                </div>
              )}
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
                  className="absolute bottom-full mb-2 z-[100] w-72 max-h-[calc(100vh-120px)] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-y-auto dark:border-white/10 dark:bg-[#2c2c2e] left-0"
                  role="menu"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-white/10">
                    <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60">Account</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{activeBusiness.name}</div>
                    <div className="text-xs text-gray-500 dark:text-white/50">{activeBusiness.domain}</div>
                  </div>

                  {/* Organization Switcher (if multiple orgs) */}
                  {organizations.length > 1 && (
                    <div className="p-2 border-b border-gray-200 dark:border-white/10">
                      <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60 px-3 py-2">Switch Organization</div>
                      {organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            switchOrganization(org.id)
                            setAccountMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            org.id === organization?.id
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-cyan-300'
                              : 'text-gray-700 hover:bg-gray-50 dark:text-white/80 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{org.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-2 border-b border-gray-200 dark:border-white/10">
                    <Link
                      href="/brand"
                      onClick={() => setAccountMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/80 dark:hover:bg-white/5"
                      role="menuitem"
                    >
                      <Palette className="w-4 h-4" aria-hidden="true" />
                      Brand
                    </Link>
                    <Link
                      href="/settings"
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
                        setAccountMenuOpen(false)
                        void handleSignOut()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:text-white/80 dark:hover:bg-white/5"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Feature Suggestion Modal */}
      <FeatureSuggestionModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
      />
    </>
  )
}
