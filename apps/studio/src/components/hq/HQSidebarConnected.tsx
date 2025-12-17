'use client'

/**
 * HQSidebarConnected - Sidebar connected to Supabase
 *
 * This version uses real organization data from Supabase.
 * Falls back gracefully when organization is not yet loaded.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { TrendingUp, Smartphone, BarChart3, Palette, Settings, LogOut, Menu, X, Layers, Lightbulb, ShoppingBag, List, HelpCircle, Map, Sun, Moon, Monitor, Link2, Check, Share2, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { FeatureSuggestionModal } from './FeatureSuggestionModal'
import { useOrganization } from '@/hooks/useOrganization'
import { useSlydes } from '@/hooks/useSlydes'
import { useLists } from '@/hooks/useLists'
import { useDemoHomeSlyde } from '@/lib/demoHomeSlyde'
import { usePlan } from '@/hooks/usePlan'
import { DevPanel } from '@/components/dev/DevPanel'

interface HQSidebarConnectedProps {
  activePage: 'dashboard' | 'home-slyde' | 'slydes' | 'lists' | 'faqs' | 'analytics' | 'shop' | 'brand' | 'settings' | 'inbox' | 'affiliates'
}

export function HQSidebarConnected({ activePage }: HQSidebarConnectedProps) {
  const router = useRouter()
  const { organization, organizations, isLoading: orgLoading, switchOrganization } = useOrganization()
  const { slydes, isLoading: slydesLoading } = useSlydes()
  const { lists } = useLists()
  const { data: homeSlyde } = useDemoHomeSlyde()

  const [collapsed, setCollapsed] = useState(false)
  const [collapsedHydrated, setCollapsedHydrated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [featureModalOpen, setFeatureModalOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [linkCopied, setLinkCopied] = useState(false)
  const { plan, isPaid } = usePlan()
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)

  // Get the shareable link - use org slug for now (username feature coming soon)
  const shareableLink = organization ? `slydes.io/${organization.slug}` : ''

  const handleCopyLink = async () => {
    if (!shareableLink) return
    try {
      await navigator.clipboard.writeText(`https://${shareableLink}`)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = `https://${shareableLink}`
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

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

  // Theme persistence and application
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('slydes_theme') as 'light' | 'dark' | 'system' | null
      if (stored) setTheme(stored)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('slydes_theme', theme)
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

  // Close account menu on click outside / Escape (avoid full-screen overlay that can block the editor)
  useEffect(() => {
    if (!accountMenuOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return
      if (accountMenuRef.current?.contains(target)) return
      if (accountButtonRef.current?.contains(target)) return
      setAccountMenuOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountMenuOpen])

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
  const listCount = lists.length
  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)
  const faqCount = Object.values(homeSlyde.childFAQs ?? {}).reduce((acc, faqs) => acc + faqs.length, 0)

  // Dashboard (standalone at top) - Paid users see "Momentum AI"
  const dashboardItem = { id: 'dashboard', label: isPaid ? 'Momentum AI' : 'Momentum', href: '/dashboard', icon: TrendingUp }

  // Editor group - these are the content creation tools
  const editorItems = [
    { id: 'home-slyde', label: 'Studio', href: '/', icon: Smartphone },
    { id: 'slydes', label: 'Slydes', href: '/slydes', icon: Layers, badge: slydeCount > 0 ? slydeCount : undefined },
    { id: 'lists', label: 'Lists', href: '/lists', icon: List, badge: listCount > 0 ? listCount : undefined },
    { id: 'faqs', label: 'FAQs', href: '/faqs', icon: HelpCircle, badge: faqCount > 0 ? faqCount : undefined },
  ]

  // Business tools
  const navItems: Array<{ id: string; label: string; href: string; icon: typeof BarChart3; badge?: number; comingSoon?: boolean; inProgress?: boolean }> = [
    { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { id: 'shop', label: 'Shop', href: '/shop', icon: ShoppingBag, inProgress: true },
  ]

  // Admin tools (only shown in dev or for admin users)
  const adminItems = process.env.NODE_ENV === 'development' ? [
    { id: 'affiliates', label: 'Affiliates', href: '/admin/affiliates', icon: Users },
  ] : []

  // Brand and Settings are in the account dropdown menu only

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
          {/* Momentum (Dashboard) */}
          <Link
            href={dashboardItem.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activePage === dashboardItem.id
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 dark:from-blue-500/15 dark:to-cyan-500/15 dark:text-cyan-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10'
            }`}
          >
            <dashboardItem.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium truncate">{dashboardItem.label}</span>
          </Link>

          <div className="my-3 border-t border-gray-200 dark:border-white/10" />

          {/* Editor Group */}
          <div className="px-3 pt-1 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Editor</span>
          </div>
          {editorItems.map((item) => {
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
              </Link>
            )
          })}

          <div className="my-3 border-t border-gray-200 dark:border-white/10" />

          {/* Insights Group */}
          <div className="px-3 pt-1 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Insights</span>
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            const isDisabled = item.comingSoon || item.inProgress
            return (
              <Link
                key={item.id}
                href={isDisabled ? '#' : item.href}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault()
                    return
                  }
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isDisabled
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
                {item.inProgress && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">In Progress</span>
                )}
                {item.comingSoon && (
                  <span className="ml-auto text-[10px] font-semibold text-gray-400 dark:text-white/50">Coming soon</span>
                )}
              </Link>
            )
          })}

          {/* Admin Group - only in dev */}
          {adminItems.length > 0 && (
            <>
              <div className="my-3 border-t border-gray-200 dark:border-white/10" />
              <div className="px-3 pt-1 pb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Admin</span>
              </div>
              {adminItems.map((item) => {
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
            </>
          )}
        </nav>

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

        {/* Mobile Share Link */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10">
          <div className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            Share Your Slydes
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-white/80 truncate border border-gray-200 dark:border-white/10">
              {shareableLink || 'Loading...'}
            </div>
            <button
              onClick={handleCopyLink}
              disabled={!shareableLink}
              className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                linkCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
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
      <aside className={`hidden md:flex ${collapsed ? 'w-[72px]' : 'w-72'} bg-white border-r border-gray-200 flex-col dark:bg-[#2c2c2e] dark:border-white/10 transition-all duration-300 shrink-0`}>
        {sidebarContent(false)}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Momentum (Dashboard) */}
          <Link
            href={dashboardItem.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative cursor-pointer ${
              activePage === dashboardItem.id
                ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
            }`}
            title={collapsed ? dashboardItem.label : undefined}
          >
            {activePage === dashboardItem.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full" />
            )}
            <dashboardItem.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{dashboardItem.label}</span>}
          </Link>

          <div className="my-3 border-t border-gray-200 dark:border-white/10" />

          {/* Editor Group */}
          {!collapsed && (
            <div className="px-3 pt-1 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Editor</span>
            </div>
          )}
          {editorItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative cursor-pointer ${
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
                  </>
                )}
              </Link>
            )
          })}

          <div className="my-3 border-t border-gray-200 dark:border-white/10" />

          {/* Insights Group */}
          {!collapsed && (
            <div className="px-3 pt-1 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Insights</span>
            </div>
          )}
          {navItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            const isDisabled = item.comingSoon || item.inProgress

            return (
              <Link
                key={item.id}
                href={isDisabled ? '#' : item.href}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault()
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-white/40'
                    : isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white cursor-pointer'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && !isDisabled && (
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
                    {item.inProgress && (
                      <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                        In Progress
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

          {/* Admin Group - only in dev */}
          {adminItems.length > 0 && (
            <>
              <div className="my-3 border-t border-gray-200 dark:border-white/10" />
              {!collapsed && (
                <div className="px-3 pt-1 pb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">Admin</span>
                </div>
              )}
              {adminItems.map((item) => {
                const isActive = activePage === item.id
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white cursor-pointer'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 cursor-pointer'
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
            </>
          )}

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

        {/* Dev Control Panel - localhost only */}
        {!collapsed && <DevPanel />}

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>

        {/* User Profile / Business Switcher */}
        <div className="p-3 border-t border-gray-200 dark:border-white/10">
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountMenuOpen((v) => !v)}
            ref={accountButtonRef}
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
                <div
                  ref={accountMenuRef}
                  className="absolute bottom-full mb-2 z-[100] w-72 max-h-[calc(100vh-120px)] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-y-auto dark:border-white/10 dark:bg-[#2c2c2e] left-0"
                  role="menu"
                >
                  {/* Share Link - PROMINENT at top */}
                  <div className="p-3 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10">
                    <div className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                      Share Your Slydes
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white dark:bg-black/20 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-white/80 truncate border border-gray-200 dark:border-white/10">
                        {shareableLink || 'Loading...'}
                      </div>
                      <button
                        onClick={handleCopyLink}
                        disabled={!shareableLink}
                        className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 ${
                          linkCopied
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Link2 className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

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

                  {/* Theme Toggle */}
                  <div className="p-2 border-b border-gray-200 dark:border-white/10">
                    <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-white/60 px-3 py-2">Theme</div>
                    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg mx-2">
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
