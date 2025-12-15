'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DevicePreview } from '@/components/slyde-demo'
import { HomeSlydeScreen } from '@/app/demo/home-slyde/components/HomeSlydeScreen'
import { HQSidebar } from '@/components/hq/HQSidebar'
import { useDemoBrand } from '@/lib/demoBrand'
import { useDemoBusiness } from '@/lib/demoBusiness'
import {
  useDemoHomeSlyde,
  writeDemoHomeSlyde,
  type DemoHomeSlyde,
  type DemoHomeSlydeCategory,
} from '@/lib/demoHomeSlyde'
import { highlandMotorsData, type HomeSlydeData } from '@/app/demo/home-slyde/data/highlandMotorsData'
import {
  UploadCloud,
  Video,
  Type,
  LayoutGrid,
  Building2,
  MousePointerClick,
  GripVertical,
  Plus,
  Trash2,
  Pencil,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react'

// HQ design tokens
const HQ_PRIMARY_GRADIENT = 'bg-gradient-to-r from-blue-600 to-cyan-500'
const HQ_PRIMARY_SHADOW = 'shadow-lg shadow-blue-500/15'

type InspectorTab = 'video' | 'brand' | 'info' | 'cta'

const TABS: { id: InspectorTab; label: string; Icon: typeof Video }[] = [
  { id: 'video', label: 'Video', Icon: Video },
  { id: 'brand', label: 'Brand', Icon: Type },
  { id: 'info', label: 'Info', Icon: Building2 },
  { id: 'cta', label: 'CTA', Icon: MousePointerClick },
]

export function HomeSlydeEditorClient() {
  const brandProfile = useDemoBrand()
  const homeSlyde = useDemoHomeSlyde()
  const demoBusiness = useDemoBusiness()

  // Plan state (synced with localStorage for HQ consistency)
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
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

  // Local editor state (mirrors homeSlyde but with additional brand fields)
  const [videoSrc, setVideoSrc] = useState(homeSlyde.videoSrc)
  const [posterSrc, setPosterSrc] = useState(homeSlyde.posterSrc || '')
  const [brandName, setBrandName] = useState(brandProfile.businessName)
  const [tagline, setTagline] = useState(brandProfile.tagline)
  const [rating, setRating] = useState(highlandMotorsData.rating || 4.9)
  const [reviewCount, setReviewCount] = useState(highlandMotorsData.reviewCount || 847)
  const [about, setAbout] = useState(highlandMotorsData.about || '')
  const [address, setAddress] = useState(highlandMotorsData.address || '')
  const [hours, setHours] = useState(highlandMotorsData.hours || '')
  const [phone, setPhone] = useState(highlandMotorsData.phone || '')
  const [email, setEmail] = useState(highlandMotorsData.email || '')
  const [website, setWebsite] = useState(highlandMotorsData.website || '')
  const [categories, setCategories] = useState<DemoHomeSlydeCategory[]>(homeSlyde.categories)
  const [primaryCtaEnabled, setPrimaryCtaEnabled] = useState(!!homeSlyde.primaryCta)
  const [primaryCtaText, setPrimaryCtaText] = useState(homeSlyde.primaryCta?.text || 'Book Now')
  const [primaryCtaAction, setPrimaryCtaAction] = useState(homeSlyde.primaryCta?.action || '')

  const [activeTab, setActiveTab] = useState<InspectorTab>('video')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // Sync from localStorage when homeSlyde changes
  useEffect(() => {
    setVideoSrc(homeSlyde.videoSrc)
    setPosterSrc(homeSlyde.posterSrc || '')
    setCategories(homeSlyde.categories)
    if (homeSlyde.primaryCta) {
      setPrimaryCtaEnabled(true)
      setPrimaryCtaText(homeSlyde.primaryCta.text)
      setPrimaryCtaAction(homeSlyde.primaryCta.action)
    }
  }, [homeSlyde])

  // Sync brand from demoBrand
  useEffect(() => {
    setBrandName(brandProfile.businessName)
    setTagline(brandProfile.tagline)
  }, [brandProfile.businessName, brandProfile.tagline])

  // Write changes to localStorage
  const persistHomeSlyde = useCallback(() => {
    const next: DemoHomeSlyde = {
      videoSrc,
      posterSrc: posterSrc || undefined,
      categories,
      primaryCta: primaryCtaEnabled ? { text: primaryCtaText, action: primaryCtaAction } : undefined,
    }
    writeDemoHomeSlyde(next)
  }, [videoSrc, posterSrc, categories, primaryCtaEnabled, primaryCtaText, primaryCtaAction])

  // Auto-persist on changes
  useEffect(() => {
    const timeout = setTimeout(persistHomeSlyde, 300)
    return () => clearTimeout(timeout)
  }, [persistHomeSlyde])

  // Build HomeSlydeData for preview
  const previewData: HomeSlydeData = {
    businessName: brandName,
    tagline,
    accentColor: brandProfile.secondaryColor || '#22D3EE',
    backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',
    videoSrc,
    posterSrc: posterSrc || undefined,
    rating,
    reviewCount,
    about,
    address,
    hours,
    phone,
    email,
    website,
    categories: categories.map((c) => ({
      id: c.id,
      label: c.name,
      icon: c.icon,
      description: c.description,
      frames: [],
    })),
    primaryCta: primaryCtaEnabled ? { text: primaryCtaText, action: primaryCtaAction } : undefined,
  }

  const brandAccent = brandProfile.secondaryColor || '#22D3EE'
  const businessInitial = brandName.charAt(0).toUpperCase()

  // Category CRUD
  const addCategory = useCallback(() => {
    if (categories.length >= 6) return
    const newId = `cat-${Date.now()}`
    setCategories((prev) => [
      ...prev,
      { id: newId, icon: '✨', name: 'New Category', description: '', childSlydeId: 'camping', hasInventory: false },
    ])
    setEditingCategoryId(newId)
    setShowCategoryModal(true)
  }, [categories.length])

  const updateCategory = useCallback((id: string, updates: Partial<DemoHomeSlydeCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const moveCategory = useCallback((fromIndex: number, toIndex: number) => {
    setCategories((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const editingCategory = editingCategoryId ? categories.find((c) => c.id === editingCategoryId) : null

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* HQ Sidebar */}
        <HQSidebar
          activePage="home-slyde"
          plan={plan}
          onPlanChange={setPlan}
          slydeCount={demoBusiness.slydesCount}
          inboxCount={demoBusiness.enquiriesCount}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ background: brandAccent }}
                >
                  {businessInitial}
                </div>
                <span className="font-display font-bold tracking-tight text-gray-900 dark:text-white truncate">
                  {brandName}
                </span>
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                  Editing
                </span>
                <span className="text-sm text-gray-700 dark:text-white/80">Home Slyde</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/${encodeURIComponent(demoBusiness.id)}`}
                className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Preview
              </Link>
              <button
                type="button"
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
              >
                <UploadCloud className="w-4 h-4" />
                Publish
              </button>
            </div>
          </header>

          {/* Main Editor */}
          <div className="flex-1 flex overflow-hidden">
        {/* Canvas - Phone Preview */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-[#1c1c1e] dark:via-[#232326] dark:to-[#1c1c1e]">
          <DevicePreview enableTilt={false}>
            <HomeSlydeScreen data={previewData} onCategoryTap={() => {}} />
          </DevicePreview>
          <p className="mt-4 text-sm text-gray-500 dark:text-white/50 font-mono">
            Live Preview
          </p>
        </main>

        {/* Inspector Panel */}
        <aside className="w-[400px] border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 flex flex-col shrink-0">
          {/* Tab Bar */}
          <div className="p-4 border-b border-gray-200/80 dark:border-white/10">
            <div className="relative flex items-center h-9 rounded-lg bg-gray-100 p-0.5 dark:bg-white/[0.08] shadow-inner">
              {/* Sliding indicator */}
              <div
                className="absolute top-0.5 bottom-0.5 rounded-md bg-white shadow-sm transition-all duration-200 ease-out dark:bg-[#3a3a3c]"
                style={{
                  width: `calc(${100 / TABS.length}% - 2px)`,
                  left: `calc(${TABS.findIndex((t) => t.id === activeTab) * (100 / TABS.length)}% + 2px)`,
                }}
              />
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 text-[12px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70'
                  }`}
                >
                  <tab.Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* VIDEO TAB */}
            {activeTab === 'video' && (
              <>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                    Home Slyde Video
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600 dark:text-white/60">
                    9:16 vertical video, 10-30 seconds. Autoplay muted.
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Video URL
                  </label>
                  <input
                    type="text"
                    value={videoSrc}
                    onChange={(e) => setVideoSrc(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                    placeholder="/videos/brand.mp4"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Poster Image (fallback)
                  </label>
                  <input
                    type="text"
                    value={posterSrc}
                    onChange={(e) => setPosterSrc(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                    placeholder="https://..."
                  />
                  <p className="mt-1.5 text-[12px] text-gray-500 dark:text-white/40">
                    Shown while video loads or if autoplay is blocked.
                  </p>
                </div>
              </>
            )}

            {/* BRAND TAB */}
            {activeTab === 'brand' && (
              <>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Reviews
                    </label>
                    <input
                      type="number"
                      value={reviewCount}
                      onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow"
                    />
                  </div>
                </div>
              </>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                    Business Information
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600 dark:text-white/60">
                    Shown when users tap the info button.
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    About
                  </label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm resize-none"
                    placeholder="Tell customers about your business..."
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                    placeholder="123 Main Street, City, Postcode"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Hours
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                    placeholder="Mon-Fri 9am-5pm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="+44 123 456 7890"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="hello@business.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Website
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                    placeholder="yourwebsite.com"
                  />
                </div>
              </>
            )}

            {/* CTA TAB */}
            {activeTab === 'cta' && (
              <>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <div className="text-[13px] font-semibold text-gray-900 dark:text-white">
                    Primary CTA
                  </div>
                  <div className="mt-1 text-[12px] text-gray-600 dark:text-white/60">
                    Optional full-width button at bottom of drawer.
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between py-1">
                  <label className="text-[13px] font-medium text-gray-700 dark:text-white/70">
                    Show Primary CTA
                  </label>
                  <button
                    onClick={() => setPrimaryCtaEnabled(!primaryCtaEnabled)}
                    className={`relative w-[51px] h-[31px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      primaryCtaEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'
                    }`}
                    role="switch"
                    aria-pressed={primaryCtaEnabled}
                  >
                    <div
                      className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-transform duration-200 ease-out ${
                        primaryCtaEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                      }`}
                    />
                  </button>
                </div>

                {primaryCtaEnabled && (
                  <>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={primaryCtaText}
                        onChange={(e) => setPrimaryCtaText(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        placeholder="Book Now"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Action URL
                      </label>
                      <input
                        type="text"
                        value={primaryCtaAction}
                        onChange={(e) => setPrimaryCtaAction(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        placeholder="https://booking.example.com"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* CATEGORIES SECTION - Separate from tabs */}
          <div className="border-t border-gray-200 dark:border-white/10">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-gray-500 dark:text-white/50" />
                  <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                    Categories
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-white/40">
                    ({categories.length}/6)
                  </span>
                </div>
                {categories.length < 6 && (
                  <button
                    onClick={addCategory}
                    className="flex items-center gap-1 px-2 py-1 text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm dark:bg-[#2c2c2e]/70 dark:border-white/10 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="cursor-grab text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-lg">
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-white/50 truncate">
                          {cat.hasInventory ? 'Has inventory' : cat.description || 'No description'}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingCategoryId(cat.id)
                            setShowCategoryModal(true)
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 dark:text-white/50 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {categories.length === 0 && (
                  <div className="py-6 text-center text-[13px] text-gray-500 dark:text-white/40">
                    No categories yet. Add your first category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
        </div>
      </div>

      {/* Category Edit Modal */}
      <AnimatePresence>
        {showCategoryModal && editingCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCategoryModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Category
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={editingCategory.icon}
                      onChange={(e) => updateCategory(editingCategory.id, { icon: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-2xl text-center"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => updateCategory(editingCategory.id, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingCategory.description}
                    onChange={(e) => updateCategory(editingCategory.id, { description: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                    Links to Child Slyde
                  </label>
                  <select
                    value={editingCategory.childSlydeId}
                    onChange={(e) => updateCategory(editingCategory.id, { childSlydeId: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="camping">Camping Experience</option>
                    <option value="just-drive">Just Drive</option>
                  </select>
                </div>

                {/* Inventory Toggle - PAID FEATURE */}
                <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <label className="text-[13px] font-medium text-gray-700 dark:text-white/70">
                        Has Inventory
                      </label>
                      <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">
                        Enable to show an inventory grid after the Category Slyde
                      </p>
                    </div>
                    <button
                      onClick={() => updateCategory(editingCategory.id, { hasInventory: !editingCategory.hasInventory })}
                      className={`relative w-[51px] h-[31px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                        editingCategory.hasInventory ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'
                      }`}
                      role="switch"
                      aria-pressed={editingCategory.hasInventory}
                    >
                      <div
                        className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-transform duration-200 ease-out ${
                          editingCategory.hasInventory ? 'translate-x-[22px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>

                  {editingCategory.hasInventory && (
                    <div className="mt-3">
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                        Inventory CTA Text
                      </label>
                      <input
                        type="text"
                        value={editingCategory.inventoryCtaText || ''}
                        onChange={(e) => updateCategory(editingCategory.id, { inventoryCtaText: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm"
                        placeholder="View All 12 Vehicles"
                      />
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-white/40">
                        Shown as a button on the last frame of the Category Slyde
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/demo/editor-mockup?slyde=${editingCategory.childSlydeId}`}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    <Layers className="w-4 h-4" />
                    Edit Child Slyde Frames
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-2">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
