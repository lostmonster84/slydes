'use client'

import { useEffect, useState } from 'react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { Upload, Lock, Check } from 'lucide-react'
import { readDemoBrandProfile, writeDemoBrandProfile } from '@/lib/demoBrand'

// Force dynamic rendering to avoid build-time Supabase calls
export const dynamic = 'force-dynamic'

/**
 * Slydes HQ — Brand Settings
 * 
 * Customize how your Slydes look and feel.
 * Following CONSTX.md for consistency.
 */

const FONT_OPTIONS = [
  { id: 'space-grotesk', name: 'Space Grotesk', sample: 'The quick brown fox' },
  { id: 'inter', name: 'Inter', sample: 'The quick brown fox' },
  { id: 'dm-sans', name: 'DM Sans', sample: 'The quick brown fox' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', sample: 'The quick brown fox' },
  { id: 'outfit', name: 'Outfit', sample: 'The quick brown fox' },
]

const VOICE_PRESETS = [
  { id: 'professional', name: 'Professional', desc: 'Formal, trustworthy, clean' },
  { id: 'friendly', name: 'Friendly', desc: 'Warm, approachable, conversational' },
  { id: 'bold', name: 'Bold', desc: 'Confident, direct, energetic' },
  { id: 'minimal', name: 'Minimal', desc: 'Short, punchy, no fluff' },
]

export default function HQBrandPage() {
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
  const [primaryColor, setPrimaryColor] = useState('#2563EB')
  const [secondaryColor, setSecondaryColor] = useState('#06B6D4')
  const [businessName, setBusinessName] = useState('WildTrax')
  const [tagline, setTagline] = useState('Adventure awaits')
  const [selectedFont, setSelectedFont] = useState('space-grotesk')
  const [selectedVoice, setSelectedVoice] = useState('bold')
  const [hasLogo, setHasLogo] = useState(true)
  const [savedTick, setSavedTick] = useState(0)

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

  // Load persisted brand profile (demo)
  useEffect(() => {
    const profile = readDemoBrandProfile()
    setBusinessName(profile.businessName)
    setTagline(profile.tagline)
    setPrimaryColor(profile.primaryColor)
    setSecondaryColor(profile.secondaryColor)
  }, [])

  // Auto-persist as you edit (demo)
  useEffect(() => {
    writeDemoBrandProfile({
      businessName,
      tagline,
      primaryColor,
      secondaryColor,
    })
  }, [businessName, tagline, primaryColor, secondaryColor])

  const isCreator = plan === 'creator'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <HQSidebarConnected activePage="brand" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Brand</h1>
              <p className="text-sm text-gray-500 dark:text-white/50">Customize how your Slydes look and feel</p>
            </div>
            <div className="flex items-center gap-3">
              {savedTick > 0 && (
                <div className="text-sm text-gray-500 dark:text-white/50">
                  Saved
                </div>
              )}
              <button
                onClick={() => setSavedTick((v) => v + 1)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
              >
                Save changes
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Settings */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Logo & Identity */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                      <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Identity</div>
                      <div className="mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="text-lg font-display font-bold">Logo & Identity</div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Logo</label>
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer dark:border-white/20 dark:hover:border-cyan-400"
                          onClick={() => setHasLogo(!hasLogo)}
                        >
                          {hasLogo ? (
                            <div className="flex items-center justify-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                                W
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">wildtrax-logo.png</div>
                                <div className="text-xs text-gray-500 dark:text-white/50">200 × 200px • 24KB</div>
                                <button className="mt-1 text-xs text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300">
                                  Replace
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto text-gray-400 dark:text-white/40" />
                              <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                                Drop your logo here or <span className="text-blue-600 dark:text-cyan-400">browse</span>
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-white/50">
                                Square format, min 200×200px, max 2MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Business name</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-inner text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#2c2c2e]"
                          placeholder="Your business name"
                        />
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                          Tagline <span className="text-gray-400 dark:text-white/40">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-inner text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#2c2c2e]"
                          placeholder="A short description (max 60 characters)"
                          maxLength={60}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-white/50 text-right">{tagline.length}/60</p>
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                      <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Appearance</div>
                      <div className="mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <div className="text-lg font-display font-bold">Colors</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Primary Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Primary color</label>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform dark:border-white/20"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <input
                              type="text"
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-inner text-gray-900 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#2c2c2e]"
                            />
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-white/50">Used for buttons and accents</p>
                        </div>

                        {/* Secondary Color */}
                        <div className={!isCreator ? 'opacity-60' : ''}>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                            Secondary color
                            {!isCreator && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                          </label>
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-white/20 ${isCreator ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-not-allowed'}`}
                              style={{ backgroundColor: secondaryColor }}
                            />
                            <input
                              type="text"
                              value={secondaryColor}
                              disabled={!isCreator}
                              onChange={(e) => setSecondaryColor(e.target.value)}
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-inner text-gray-900 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#2c2c2e] dark:disabled:bg-white/5"
                            />
                          </div>
                          {!isCreator && (
                            <p className="mt-2 text-xs text-blue-600 dark:text-cyan-400">
                              Available on Creator plan
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography - Creator Only */}
                  <div className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10 ${!isCreator ? 'opacity-60' : ''}`}>
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                      <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Typography</div>
                      <div className="mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                        <div className="text-lg font-display font-bold">Custom Fonts</div>
                        {!isCreator && <Lock className="w-4 h-4 text-gray-400 ml-auto" />}
                      </div>
                    </div>
                    <div className="p-6">
                      {!isCreator ? (
                        <div className="text-center py-6">
                          <Lock className="w-8 h-8 mx-auto text-gray-400 dark:text-white/40" />
                          <p className="mt-3 text-sm text-gray-600 dark:text-white/60">Custom fonts are available on Creator</p>
                          <a href="/settings" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                            Upgrade to Creator
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white/80">Display font</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FONT_OPTIONS.map((font) => (
                              <button
                                key={font.id}
                                onClick={() => setSelectedFont(font.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  selectedFont === font.id
                                    ? 'border-blue-600 bg-blue-50 dark:border-cyan-400 dark:bg-cyan-400/10'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-white/20 dark:hover:border-white/30'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{font.name}</span>
                                  {selectedFont === font.id && (
                                    <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                                  )}
                                </div>
                                <p className="mt-1 text-lg text-gray-600 dark:text-white/60" style={{ fontFamily: font.name }}>
                                  {font.sample}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voice & Tone - Creator Only */}
                  <div className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10 ${!isCreator ? 'opacity-60' : ''}`}>
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                      <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Content</div>
                      <div className="mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div className="text-lg font-display font-bold">Voice & Tone</div>
                        {!isCreator && <Lock className="w-4 h-4 text-gray-400 ml-auto" />}
                      </div>
                    </div>
                    <div className="p-6">
                      {!isCreator ? (
                        <div className="text-center py-6">
                          <Lock className="w-8 h-8 mx-auto text-gray-400 dark:text-white/40" />
                          <p className="mt-3 text-sm text-gray-600 dark:text-white/60">Voice presets are available on Creator</p>
                          <a href="/settings" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                            Upgrade to Creator
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600 dark:text-white/60">
                            Choose a voice preset to influence AI-generated copy suggestions
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {VOICE_PRESETS.map((voice) => (
                              <button
                                key={voice.id}
                                onClick={() => setSelectedVoice(voice.id)}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${
                                  selectedVoice === voice.id
                                    ? 'border-blue-600 bg-blue-50 dark:border-cyan-400 dark:bg-cyan-400/10'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-white/20 dark:hover:border-white/30'
                                }`}
                              >
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{voice.name}</div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-white/50">{voice.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Preview</div>
                        <div className="mt-1 text-lg font-display font-bold">Live Preview</div>
                      </div>
                      <div className="p-6">
                        {/* Mini Slyde Preview */}
                        <div className="relative mx-auto" style={{ width: '180px' }}>
                          {/* Phone Frame */}
                          <div className="relative bg-black rounded-[24px] p-2 shadow-xl">
                            {/* Screen */}
                            <div 
                              className="relative rounded-[18px] overflow-hidden"
                              style={{ aspectRatio: '9/16', background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}22)` }}
                            >
                              {/* Content */}
                              <div className="absolute inset-0 flex flex-col">
                                {/* Header area */}
                                <div className="p-3">
                                  {/* Profile Pill */}
                                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/90 dark:bg-black/50">
                                    <div 
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                                      style={{ backgroundColor: primaryColor }}
                                    >
                                      {businessName.charAt(0)}
                                    </div>
                                    <span className="text-[9px] font-semibold text-gray-900 dark:text-white">{businessName}</span>
                                  </div>
                                </div>

                                {/* Main content area */}
                                <div className="flex-1 flex items-center justify-center p-4">
                                  <div className="text-center">
                                    <div className="text-[10px] font-bold text-gray-900 dark:text-white">{tagline || 'Your tagline here'}</div>
                                  </div>
                                </div>

                                {/* CTA Button */}
                                <div className="p-3">
                                  <div 
                                    className="w-full py-2 rounded-lg text-center text-[9px] font-semibold text-white"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    Book now
                                  </div>
                                </div>

                                {/* Dots indicator */}
                                <div className="flex justify-center gap-1 pb-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-center text-gray-500 dark:text-white/50">
                          This is how your brand appears in Slydes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}

