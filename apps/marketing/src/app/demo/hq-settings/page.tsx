'use client'

import { useEffect, useState } from 'react'
import { HQSidebar } from '@/components/hq/HQSidebar'
import { Lock, Check, Download, ExternalLink, AlertTriangle, CreditCard, Webhook, FileDown } from 'lucide-react'

/**
 * Slydes HQ — Settings
 * 
 * Account, billing, and integrations.
 * Following CONSTX.md for consistency.
 */

const BILLING_HISTORY = [
  { date: 'Dec 1, 2025', amount: '£25.00', status: 'Paid' },
  { date: 'Nov 1, 2025', amount: '£25.00', status: 'Paid' },
  { date: 'Oct 1, 2025', amount: '£25.00', status: 'Paid' },
]

const WEBHOOK_EVENTS = [
  { id: 'enquiry.new', label: 'New enquiry received', enabled: true },
  { id: 'slyde.published', label: 'Slyde published', enabled: true },
  { id: 'slyde.viewed', label: 'Slyde viewed (batch)', enabled: false },
]

export default function HQSettingsPage() {
  const [plan, setPlan] = useState<'free' | 'creator'>('creator')
  const [webhookUrl, setWebhookUrl] = useState('https://your-site.com/webhook')
  const [webhookEvents, setWebhookEvents] = useState(WEBHOOK_EVENTS)

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

  const toggleWebhookEvent = (id: string) => {
    setWebhookEvents(events => 
      events.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <HQSidebar 
          activePage="settings" 
          plan={plan} 
          onPlanChange={setPlan}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Settings</h1>
              <p className="text-sm text-gray-500 dark:text-white/50">Manage your account, billing, and integrations</p>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl space-y-8">
              
              {/* Account Section */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                  <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Account</div>
                  <div className="mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="text-lg font-display font-bold">Profile</div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Profile Card */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                      W
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">WildTrax</div>
                      <div className="text-sm text-gray-500 dark:text-white/50">james@wildtrax.com</div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                      Edit profile
                    </button>
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-white/10">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Password</div>
                      <div className="text-sm text-gray-500 dark:text-white/50">••••••••••••</div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan & Billing Section */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                  <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Subscription</div>
                  <div className="mt-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <div className="text-lg font-display font-bold">Plan & Billing</div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Current Plan */}
                  <div className="relative overflow-hidden rounded-2xl border-2 border-blue-600 dark:border-cyan-400">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold dark:bg-blue-500/10 dark:text-cyan-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400" />
                            Current plan
                          </div>
                          <h3 className="mt-3 text-2xl font-display font-bold text-gray-900 dark:text-white">
                            {isCreator ? 'Creator' : 'Free'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                            {isCreator ? 'For people who care about results' : 'Try the format'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
                            {isCreator ? '£25' : '£0'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-white/50">/month</div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className={`w-4 h-4 ${isCreator ? 'text-emerald-500' : 'text-gray-400'}`} />
                          <span className="text-gray-600 dark:text-white/70">
                            {isCreator ? 'Up to 10 Slydes' : '1 Slyde'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className={`w-4 h-4 ${isCreator ? 'text-emerald-500' : 'text-gray-400'}`} />
                          <span className="text-gray-600 dark:text-white/70">Full mobile experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {isCreator ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`${isCreator ? 'text-gray-600 dark:text-white/70' : 'text-gray-400 dark:text-white/40'}`}>
                            No watermark
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {isCreator ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`${isCreator ? 'text-gray-600 dark:text-white/70' : 'text-gray-400 dark:text-white/40'}`}>
                            Analytics
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        {isCreator ? (
                          <>
                            <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                              Manage subscription
                            </button>
                            <button className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-sm hover:text-gray-900 transition-colors dark:text-white/60 dark:hover:text-white">
                              Cancel plan
                            </button>
                          </>
                        ) : (
                          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15">
                            Upgrade to Creator — £25/month
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method - Creator only */}
                  {isCreator && (
                    <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">VISA</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</div>
                          <div className="text-xs text-gray-500 dark:text-white/50">Expires 12/27</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                        Update
                      </button>
                    </div>
                  )}

                  {/* Billing History - Creator only */}
                  {isCreator && (
                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Billing history</h4>
                      <div className="space-y-2">
                        {BILLING_HISTORY.map((invoice, i) => (
                          <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/5">
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-900 dark:text-white">{invoice.date}</div>
                              <div className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{invoice.amount}</div>
                              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full dark:bg-emerald-500/15 dark:text-emerald-300">
                                {invoice.status}
                              </span>
                            </div>
                            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white">
                              <Download className="w-4 h-4" />
                              PDF
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Integrations Section - Creator only */}
              <div className={`bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10 ${!isCreator ? 'opacity-60' : ''}`}>
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                  <div className="text-xs font-semibold text-gray-500 dark:text-white/60">Developer</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Webhook className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <div className="text-lg font-display font-bold">Integrations</div>
                    {!isCreator && <Lock className="w-4 h-4 text-gray-400 ml-auto" />}
                  </div>
                </div>
                <div className="p-6">
                  {!isCreator ? (
                    <div className="text-center py-8">
                      <Lock className="w-10 h-10 mx-auto text-gray-400 dark:text-white/40" />
                      <p className="mt-4 text-sm text-gray-600 dark:text-white/60">Webhooks and exports are available on Creator</p>
                      <button className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15">
                        Upgrade to Creator
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Webhooks */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Webhooks</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-white/50 mb-1.5">Endpoint URL</label>
                            <input
                              type="url"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-inner text-gray-900 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] dark:focus-visible:ring-cyan-400/30 dark:focus-visible:ring-offset-[#2c2c2e]"
                              placeholder="https://your-site.com/webhook"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 dark:text-white/50 mb-2">Events to send</label>
                            <div className="space-y-2">
                              {webhookEvents.map((event) => (
                                <label key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors dark:bg-white/5 dark:hover:bg-white/10">
                                  <input
                                    type="checkbox"
                                    checked={event.enabled}
                                    onChange={() => toggleWebhookEvent(event.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-white/30 dark:bg-white/10"
                                  />
                                  <span className="text-sm text-gray-900 dark:text-white">{event.label}</span>
                                  <code className="ml-auto text-xs text-gray-500 font-mono dark:text-white/50">{event.id}</code>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
                              Test webhook
                            </button>
                            <button className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-white/90">
                              Save
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Export */}
                      <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Export data</h4>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100 hover:bg-blue-100 transition-colors dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20">
                            <FileDown className="w-4 h-4" />
                            Export enquiries (CSV)
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100 hover:bg-blue-100 transition-colors dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20">
                            <FileDown className="w-4 h-4" />
                            Export analytics (CSV)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-3xl border border-red-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-red-500/30">
                <div className="p-6 border-b border-red-200 dark:border-red-500/30">
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400">Danger zone</div>
                  <div className="mt-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div className="text-lg font-display font-bold text-gray-900 dark:text-white">Delete Account</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 dark:text-white/60 mb-4">
                    Permanently delete your account and all Slydes. This action cannot be undone.
                    {isCreator && ' Your subscription will be cancelled immediately.'}
                  </p>
                  <button className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-sm border border-red-200 hover:bg-red-100 transition-colors dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/20 dark:hover:bg-red-500/20">
                    Delete my account
                  </button>
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

