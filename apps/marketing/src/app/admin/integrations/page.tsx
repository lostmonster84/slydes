'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  IntegrationCard,
  StripeIcon,
  SupabaseIcon,
  CloudflareIcon,
  ResendIcon,
  AnthropicIcon,
  AnalyticsIcon,
  R2Icon,
} from '../_components/IntegrationCard'
import { StatusBadge } from '../_components/StatusBadge'

type IntegrationStatus = {
  status: 'healthy' | 'warning' | 'error'
  message: string
  lastChecked: string
  details?: Record<string, unknown>
}

type HealthData = {
  timestamp: string
  overall: 'healthy' | 'degraded' | 'unhealthy'
  integrations: {
    stripe: IntegrationStatus
    supabase: IntegrationStatus
    cloudflareStream: IntegrationStatus
    cloudflareImages: IntegrationStatus
    cloudflareR2: IntegrationStatus
    resend: IntegrationStatus
    anthropic: IntegrationStatus
    analytics: IntegrationStatus
  }
}

const INTEGRATION_INFO = {
  stripe: {
    name: 'Stripe',
    description: 'Payment processing, subscriptions, and billing portal',
    icon: <StripeIcon />,
    critical: true,
    docs: 'https://stripe.com/docs',
    envVars: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
  },
  supabase: {
    name: 'Supabase',
    description: 'Database, authentication, and real-time subscriptions',
    icon: <SupabaseIcon />,
    critical: true,
    docs: 'https://supabase.com/docs',
    envVars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  },
  cloudflareStream: {
    name: 'Cloudflare Stream',
    description: 'Video uploads, processing, and playback',
    icon: <CloudflareIcon />,
    critical: true,
    docs: 'https://developers.cloudflare.com/stream',
    envVars: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_STREAM_TOKEN'],
  },
  cloudflareImages: {
    name: 'Cloudflare Images',
    description: 'Image uploads, optimization, and delivery',
    icon: <CloudflareIcon />,
    critical: false,
    docs: 'https://developers.cloudflare.com/images',
    envVars: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_IMAGES_TOKEN'],
  },
  cloudflareR2: {
    name: 'Cloudflare R2',
    description: 'Object storage for audio files and background music',
    icon: <R2Icon />,
    critical: false,
    docs: 'https://developers.cloudflare.com/r2',
    envVars: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_R2_ACCESS_KEY_ID', 'CLOUDFLARE_R2_SECRET_ACCESS_KEY', 'CLOUDFLARE_R2_BUCKET_NAME'],
  },
  resend: {
    name: 'Resend',
    description: 'Transactional emails and audience management',
    icon: <ResendIcon />,
    critical: false,
    docs: 'https://resend.com/docs',
    envVars: ['RESEND_API_KEY'],
  },
  anthropic: {
    name: 'Anthropic',
    description: 'AI assistant for Ask HQ chat',
    icon: <AnthropicIcon />,
    critical: false,
    docs: 'https://docs.anthropic.com',
    envVars: ['ANTHROPIC_API_KEY'],
  },
  analytics: {
    name: 'Analytics',
    description: 'Event ingestion and reporting (internal)',
    icon: <AnalyticsIcon />,
    critical: false,
    docs: null,
    envVars: [],
  },
}

export default function IntegrationsPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const fetchHealth = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/health')
      if (res.ok) {
        const data = await res.json()
        setHealth(data)
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  const integrationKeys = Object.keys(INTEGRATION_INFO) as (keyof typeof INTEGRATION_INFO)[]
  const criticalIntegrations = integrationKeys.filter((k) => INTEGRATION_INFO[k].critical)
  const otherIntegrations = integrationKeys.filter((k) => !INTEGRATION_INFO[k].critical)

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Monitor external service connections</p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={isRefreshing}
          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-[#3a3a3c] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? 'Checking...' : 'Refresh All'}
        </button>
      </div>

      {/* Summary */}
      {health && (
        <div className="mb-8 p-4 bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <StatusBadge status="healthy" size="sm" pulse={false} />
              <span className="text-sm text-gray-500 dark:text-[#98989d]">
                {Object.values(health.integrations).filter((i) => i.status === 'healthy').length} Healthy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="warning" size="sm" pulse={false} />
              <span className="text-sm text-gray-500 dark:text-[#98989d]">
                {Object.values(health.integrations).filter((i) => i.status === 'warning').length} Warning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="error" size="sm" pulse={false} />
              <span className="text-sm text-gray-500 dark:text-[#98989d]">
                {Object.values(health.integrations).filter((i) => i.status === 'error').length} Error
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Critical Integrations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          Critical Services
          <span className="text-xs font-normal text-gray-400 dark:text-[#636366] bg-gray-100 dark:bg-[#3a3a3c] px-2 py-0.5 rounded">
            Required for operation
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalIntegrations.map((key) => {
            const info = INTEGRATION_INFO[key]
            const status = health?.integrations[key]

            return (
              <div
                key={key}
                className="cursor-pointer"
                onClick={() => setSelectedIntegration(selectedIntegration === key ? null : key)}
              >
                <IntegrationCard
                  name={info.name}
                  status={status?.status ?? 'warning'}
                  message={status?.message ?? 'Checking...'}
                  icon={info.icon}
                  lastChecked={status?.lastChecked}
                  critical
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Other Integrations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Other Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherIntegrations.map((key) => {
            const info = INTEGRATION_INFO[key]
            const status = health?.integrations[key]

            return (
              <div
                key={key}
                className="cursor-pointer"
                onClick={() => setSelectedIntegration(selectedIntegration === key ? null : key)}
              >
                <IntegrationCard
                  name={info.name}
                  status={status?.status ?? 'warning'}
                  message={status?.message ?? 'Checking...'}
                  icon={info.icon}
                  lastChecked={status?.lastChecked}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Integration Details Panel */}
      {selectedIntegration && (
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-[#98989d]">
                {INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].description}
              </p>
            </div>
            <button
              onClick={() => setSelectedIntegration(null)}
              className="text-gray-400 dark:text-[#636366] hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Current Status */}
            {health?.integrations[selectedIntegration as keyof typeof health.integrations] && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-[#98989d] mb-2">Current Status</h4>
                <div className={`rounded-lg p-3 ${
                  health.integrations[selectedIntegration as keyof typeof health.integrations].status === 'error'
                    ? 'bg-red-500/10 border border-red-500/30'
                    : health.integrations[selectedIntegration as keyof typeof health.integrations].status === 'warning'
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-green-500/10 border border-green-500/30'
                }`}>
                  <p className={`text-sm font-medium ${
                    health.integrations[selectedIntegration as keyof typeof health.integrations].status === 'error'
                      ? 'text-red-400'
                      : health.integrations[selectedIntegration as keyof typeof health.integrations].status === 'warning'
                      ? 'text-amber-400'
                      : 'text-green-400'
                  }`}>
                    {health.integrations[selectedIntegration as keyof typeof health.integrations].message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">
                    Last checked: {new Date(health.integrations[selectedIntegration as keyof typeof health.integrations].lastChecked).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Environment Variables */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-[#98989d] mb-2">Required Environment Variables</h4>
              <div className="bg-gray-100 dark:bg-[#3a3a3c] rounded-lg p-3">
                {INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].envVars.length > 0 ? (
                  <ul className="space-y-1">
                    {INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].envVars.map((env) => (
                      <li key={env} className="font-mono text-sm text-gray-500 dark:text-[#98989d]">
                        {env}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-[#636366]">No external configuration required</p>
                )}
              </div>
            </div>

            {/* Documentation Link */}
            {INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].docs && (
              <div>
                <a
                  href={INTEGRATION_INFO[selectedIntegration as keyof typeof INTEGRATION_INFO].docs!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  View Documentation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
