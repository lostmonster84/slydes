'use client'

import { useEffect, useState } from 'react'
import { HQSidebar } from '@/components/hq/HQSidebar'
import Link from 'next/link'
import { useDemoBusiness } from '@/lib/demoBusiness'

/**
 * Slydes HQ — Visual Mockup
 * 
 * This is NOT a working demo. This is a picture.
 * A beautiful, high-fidelity visual of what Slydes HQ should look like.
 * 
 * No functionality. Pure design.
 */

export default function HQMockupPage() {
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
  const demoBusiness = useDemoBusiness()

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

  const isCreator = plan === 'creator'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      {/* Full-screen mockup container */}
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <HQSidebar 
          activePage="slydes" 
          plan={plan} 
          onPlanChange={setPlan}
          slydeCount={demoBusiness.slydesCount}
          inboxCount={demoBusiness.enquiriesCount}
        />

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Bar */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Your Slydes</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {demoBusiness.hasSlydes
                  ? `${demoBusiness.slydesCount} ${demoBusiness.slydesCount === 1 ? 'experience' : 'experiences'} • ${demoBusiness.framesTotal} frames total`
                  : 'No Slydes yet • create your first one'}
              </p>
            </div>
            <Link
              href="/demo/editor-mockup?slyde=new"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Slyde
            </Link>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl">
            
            {!demoBusiness.hasSlydes ? (
              <div className="max-w-3xl">
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="p-6">
                    <div className="text-sm text-gray-600 dark:text-white/60">
                      You’re signed in as <span className="font-semibold text-gray-900 dark:text-white">{demoBusiness.name}</span>.
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                      Create your first Slyde.
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                      Use the starter flow and publish when it feels right.
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        href="/demo/editor-mockup?slyde=new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                      >
                        Create Slyde (starter)
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        href="/demo/hq-dashboard"
                        className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 dark:border-white/15 dark:bg-white/[0.03]">
                  <div className="text-sm font-display font-bold text-gray-900 dark:text-white">Quick structure</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-white/60">
                    <div className="p-3 rounded-xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Slyde</div>
                      <div className="font-semibold text-gray-900 dark:text-white">Shareable experience</div>
                      <div className="text-xs text-gray-500 dark:text-white/50 mt-1">The link you send</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="text-xs text-gray-500 dark:text-white/50 mb-1">Frames</div>
                      <div className="font-semibold text-gray-900 dark:text-white">Vertical screens</div>
                      <div className="text-xs text-gray-500 dark:text-white/50 mt-1">Hook → How → Proof → Action</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>

            {/* Slydes Summary (keep this screen about Slydes) */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Published</div>
                <div className="text-2xl font-mono font-bold mb-1">{isCreator ? '2 / 10' : '1 / 1'}</div>
                <div className="text-sm text-gray-500 dark:text-white/60">{isCreator ? 'Creator limit' : 'Free limit'}</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Drafts</div>
                <div className="text-2xl font-mono font-bold mb-1">2</div>
                <div className="text-sm text-gray-500 dark:text-white/60">Unpublished changes</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Frames</div>
                <div className="text-2xl font-mono font-bold mb-1">12</div>
                <div className="text-sm text-gray-500 dark:text-white/60">Across all Slydes</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm relative overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/30 to-cyan-50/50 dark:from-blue-500/10 dark:via-white/0 dark:to-cyan-500/10" />
                <div className="relative">
                  <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Upgrade</div>
                  <div className="text-lg font-display font-bold mb-1 text-gray-900 dark:text-white">{isCreator ? "You're on Creator" : 'Creator'}</div>
                  <div className="text-sm text-gray-500 dark:text-white/60">
                    {isCreator ? 'No watermark • analytics on Dashboard • up to 10 Slydes' : 'Up to 10 Slydes • no watermark • analytics'}
                  </div>
                </div>
              </div>
            </div>

            {/* Slydes grid (keep it clean + balanced) */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Slyde Card 1 - Camping */}
              <div className="col-span-12 lg:col-span-6 group relative bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-white/20 dark:hover:shadow-blue-500/10">
                <div className="flex p-6 gap-6">
                  
                  {/* Phone Preview */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.5rem] p-1.5 shadow-2xl">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
                      <div className="w-full h-full rounded-[1.25rem] overflow-hidden relative">
                        {/* Fake video background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400')] bg-cover bg-center opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-[8px] bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded-full inline-block mb-1">⭐ 5-Star Rated</div>
                          <div className="text-white text-sm font-bold leading-tight">Wake Up</div>
                          <div className="text-white/80 text-xs">Here</div>
                        </div>

                        {/* Social stack */}
                        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❤️</span>
                          </div>
                          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Published badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full dark:bg-emerald-500/15 dark:border-emerald-500/30">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-emerald-700 font-medium dark:text-emerald-300">Live</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-display font-bold text-gray-900 mb-1 dark:text-white">Camping</h3>
                        <p className="text-sm text-gray-500 dark:text-white/60">Land Rover Defender + Rooftop Tent</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10">
                        <svg className="w-5 h-5 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Meta (keep Slydes screen about management, not analytics) */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-white/60">6 frames</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8m4-4H8" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-white/60">Last edited 2h</span>
                      </div>
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                      <span className="text-xs text-gray-500 dark:text-white/50">slydes.io/wildtrax/</span>
                      <span className="text-xs text-gray-900 font-medium dark:text-white">camping</span>
                      <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors dark:hover:bg-white/10">
                        <svg className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto">
                      <Link
                        href="/demo/editor-mockup?slyde=camping"
                        className="flex-1 py-2.5 px-4 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-white/90 text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        href="/demo-slyde?slyde=camping"
                        className="py-2.5 px-4 bg-gray-100 text-gray-800 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15 text-center"
                      >
                        Preview
                      </Link>
                      <Link
                        href="/demo-slyde?slyde=camping"
                        className="py-2.5 px-4 bg-gray-100 text-gray-800 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15 text-center"
                      >
                        Share
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slyde Card 2 - Just Drive */}
              <div className="col-span-12 lg:col-span-6 group relative bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-white/20 dark:hover:shadow-blue-500/10">
                <div className="flex p-6 gap-6">
                  
                  {/* Phone Preview */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.5rem] p-1.5 shadow-2xl">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
                      <div className="w-full h-full rounded-[1.25rem] overflow-hidden relative">
                        {/* Fake video background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400')] bg-cover bg-center opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <div className="text-[8px] bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded-full inline-block mb-1">⭐ 5-Star Rated</div>
                          <div className="text-white text-sm font-bold leading-tight">Just</div>
                          <div className="text-white/80 text-xs">Drive</div>
                        </div>

                        {/* Social stack */}
                        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❤️</span>
                          </div>
                          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Published badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full dark:bg-emerald-500/15 dark:border-emerald-500/30">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-emerald-700 font-medium dark:text-emerald-300">Live</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-display font-bold text-gray-900 mb-1 dark:text-white">Just Drive</h3>
                        <p className="text-sm text-gray-500 dark:text-white/60">Land Rover Day Hire</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10">
                        <svg className="w-5 h-5 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Meta (keep Slydes screen about management, not analytics) */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-white/60">6 frames</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v8m4-4H8" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-white/60">Last edited 1d</span>
                      </div>
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-4 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                      <span className="text-xs text-gray-500 dark:text-white/50">slydes.io/wildtrax/</span>
                      <span className="text-xs text-gray-900 font-medium dark:text-white">just-drive</span>
                      <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors dark:hover:bg-white/10">
                        <svg className="w-3.5 h-3.5 text-gray-400 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto">
                      <Link
                        href="/demo/editor-mockup?slyde=just-drive"
                        className="flex-1 py-2.5 px-4 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-white/90 text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        href="/demo-slyde?slyde=just-drive"
                        className="py-2.5 px-4 bg-gray-100 text-gray-800 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15 text-center"
                      >
                        Preview
                      </Link>
                      <Link
                        href="/demo-slyde?slyde=just-drive"
                        className="py-2.5 px-4 bg-gray-100 text-gray-800 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15 text-center"
                      >
                        Share
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keep this screen focused on Slydes (Dashboard handles analytics/inbox). */}

              {/* Create New Card */}
              <div className="col-span-12 relative">
                <div className="p-8 rounded-3xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group dark:border-white/20 dark:hover:border-white/30">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-white/10">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create New Slyde</h3>
                    <p className="text-sm text-gray-500 dark:text-white/60 max-w-md">
                      Start from scratch or use a template. Build immersive mobile experiences in minutes.
                    </p>
                  </div>
                </div>
              </div>

            </div>
              </>
            )}
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow effects (subtle, Apple-like) */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}

