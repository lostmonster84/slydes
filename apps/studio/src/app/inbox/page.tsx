'use client'

import { useEffect, useState } from 'react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import Link from 'next/link'
import { useDemoBusiness } from '@/lib/demoBusiness'
import { usePlan } from '@/hooks/usePlan'

/**
 * Slydes HQ — Inbox (Picture)
 *
 * Purpose: enquiry capture + handoff (NOT a CRM).
 * Kept separate from Dashboard per "Dashboard Scope (v1)".
 */

export default function HQInboxPage() {
  const { isPaid } = usePlan()
  const demoBusiness = useDemoBusiness()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <HQSidebarConnected activePage="inbox" />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Inbox</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Enquiries capture + handoff (not a CRM)</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                Export all
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15">
                Connect webhook
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl">
            {!demoBusiness.hasEnquiries ? (
              <div className="max-w-3xl">
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="p-6">
                    <div className="text-sm text-gray-600 dark:text-white/60">
                      Inbox for <span className="font-semibold text-gray-900 dark:text-white">{demoBusiness.name}</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                      No enquiries yet.
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-white/60">
                      Add an Enquiry CTA to a Slyde and share it. When someone reaches out, it will appear here for handoff.
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                      >
                        Create a Slyde
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        href="/"
                        className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                      >
                        View example
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 dark:border-white/15 dark:bg-white/[0.03]">
                  <div className="text-sm font-display font-bold text-gray-900 dark:text-white">Handoff rules</div>
                  <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-white/60">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-white/50 mt-0.5">1</span>
                      <span>Reply happens in your email client (not inside Slydes).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-white/50 mt-0.5">2</span>
                      <span>Export or webhook is allowed (handoff), but no pipelines or automation.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-12 gap-6">
              {/* List */}
              <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="p-5 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-white/50 font-semibold">Enquiries</div>
                      <div className="mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                        </svg>
                        <div className="text-lg font-display font-bold text-gray-900 dark:text-white">New messages</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-white/60 mt-1">Reply from your email inbox. Export or webhook for handoff.</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/15 dark:text-cyan-300 dark:border-blue-500/20">
                      {demoBusiness.enquiriesCount} new
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {[
                    { name: 'Sarah M.', meta: 'The Kitchen Table', time: '2h', unread: true },
                    { name: 'James L.', meta: 'Highland Retreat', time: '1d', unread: true },
                    { name: 'Ella R.', meta: 'WildTrax', time: '3d', unread: false },
                    { name: 'Ava K.', meta: 'The Grand Hall', time: '5d', unread: false },
                  ].map((e) => (
                    <div
                      key={e.name}
                      className={`p-4 rounded-2xl border ${
                        e.name === 'Sarah M.'
                          ? 'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10'
                          : e.unread
                            ? 'border-blue-200/70 bg-blue-50/40 dark:border-blue-500/25 dark:bg-blue-500/10'
                            : 'border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            {e.unread && (
                              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shrink-0" aria-hidden="true" />
                            )}
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{e.name}</div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-white/50 truncate">{e.meta}</div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-white/40">{e.time}</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-white/50 truncate">
                        {e.unread ? 'Unread • captured via Enquiry action' : 'Replied • captured via Enquiry action'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail */}
              <div className="col-span-12 lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="p-5 border-b border-gray-200 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-white/50 font-semibold">Selected</div>
                  <div className="mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-3 8a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    <div className="text-lg font-display font-bold text-gray-900 dark:text-white">Sarah M. — The Kitchen Table</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-white/60 mt-1">Reply happens in your email client (handoff, not CRM).</div>
                </div>

                <div className="p-6">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10">
                    <div className="text-sm text-gray-700 dark:text-white/70">
                      "Can I book a table for 4 this Saturday? Around 7pm would be perfect. Any tasting menus available?"
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-white/50">
                      Captured: email • phone • party size • preferred date
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:sarah@example.com?subject=${encodeURIComponent('Enquiry: The Kitchen Table')}&body=${encodeURIComponent(
                        "Hi Sarah,\n\nThanks for your enquiry about booking a table.\n\nWe'd love to have you! Let me check availability for Saturday at 7pm.\n\n— The Kitchen Table\n\n---\nEnquiry details:\nParty size: 4\nMessage: Can I book a table for 4 this Saturday?"
                      )}`}
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                    >
                      Reply (email)
                    </a>
                    <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                      Copy details
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20">
                      Export
                    </button>
                    <div className="ml-auto text-xs text-gray-500 dark:text-white/50">No pipelines • no stages • no automation</div>
                  </div>
                </div>
              </div>
            </div>
            )}
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}


