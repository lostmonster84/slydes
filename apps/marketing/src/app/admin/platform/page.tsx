'use client'

import { useState, useEffect, useCallback } from 'react'

interface PlatformFeatures {
  onboardingPulse: boolean
}

const FEATURES = [
  {
    id: 'onboardingPulse',
    name: 'Onboarding Pulse',
    description: 'Guided UI hints that pulse to teach new users the Studio editor flow',
    category: 'UX',
  },
]

export default function PlatformSettingsPage() {
  const [features, setFeatures] = useState<PlatformFeatures>({ onboardingPulse: false })
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/platform-settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setFeatures(data.features || { onboardingPulse: false })
      setUpdatedAt(data.updatedAt)
    } catch (err) {
      console.error('Error fetching platform settings:', err)
      setError('Failed to load platform settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleToggle = useCallback(async (featureId: keyof PlatformFeatures) => {
    setSaving(featureId)
    setSaved(null)
    setError(null)

    const newValue = !features[featureId]

    try {
      const response = await fetch('/api/admin/platform-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: { [featureId]: newValue },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      const data = await response.json()
      setFeatures(data.features)
      setSaved(featureId)
      setTimeout(() => setSaved(null), 2000)
    } catch (err) {
      console.error('Error saving platform setting:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(null)
    }
  }, [features])

  if (loading) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="text-gray-500 dark:text-[#98989d]">Global feature toggles that affect all users</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex gap-3">
          <div className="text-blue-400 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-medium">Platform-wide controls</p>
            <p className="text-gray-500 dark:text-[#98989d] text-sm mt-1">
              These settings apply to ALL users across the platform. Use with care.
              Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Toggles</h2>
          {updatedAt && (
            <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="divide-y divide-white/10">
          {FEATURES.map((feature) => {
            const isEnabled = features[feature.id as keyof PlatformFeatures] ?? false
            const isSaving = saving === feature.id
            const justSaved = saved === feature.id

            return (
              <div key={feature.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">{feature.name}</span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-900 dark:text-white/60 rounded">
                      {feature.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 dark:text-[#636366] mt-0.5">{feature.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status indicator */}
                  {isSaving && (
                    <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {justSaved && (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(feature.id as keyof PlatformFeatures)}
                    disabled={isSaving}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      isEnabled ? 'bg-green-500' : 'bg-[#48484a]'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Future: Add more platform settings here */}
      <div className="mt-8 p-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-center">
        <p className="text-gray-400 dark:text-[#636366] text-sm">
          More platform settings coming soon (maintenance mode, feature flags, etc.)
        </p>
      </div>
    </div>
  )
}
