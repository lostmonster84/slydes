'use client'

import { useState } from 'react'
import { Loader2, Check, List, ShoppingBag } from 'lucide-react'
import { useOrganization } from '@/hooks/useOrganization'

interface FeatureToggle {
  id: 'lists' | 'shop'
  name: string
  description: string
  icon: typeof List
  comingSoon?: boolean
}

const FEATURES: FeatureToggle[] = [
  {
    id: 'lists',
    name: 'Lists',
    description: 'Manage collections of items like vehicles, room types, or services. Great for dealerships, hotels, and rental fleets.',
    icon: List,
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'Enable commerce features including product catalog, cart, and checkout.',
    icon: ShoppingBag,
    comingSoon: true,
  },
]

export function FeaturesSettingsForm() {
  const { organization, updateOrganization } = useOrganization()
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const featuresEnabled = organization?.features_enabled || { lists: false, shop: false }

  const handleToggle = async (featureId: 'lists' | 'shop') => {
    if (!organization) return

    setSaving(featureId)
    setSaved(null)

    try {
      const newFeatures = {
        ...featuresEnabled,
        [featureId]: !featuresEnabled[featureId],
      }

      await updateOrganization({
        features_enabled: newFeatures,
      })

      setSaved(featureId)
      setTimeout(() => setSaved(null), 2000)
    } catch (error) {
      console.error('Failed to update feature:', error)
    } finally {
      setSaving(null)
    }
  }

  if (!organization) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-white/60">
        <p>No organization found. Please set up your organization first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Features</h3>
        <p className="text-sm text-gray-500 dark:text-white/60">
          Enable or disable optional features for your account.
        </p>
      </div>

      <div className="space-y-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          const isEnabled = featuresEnabled[feature.id] ?? false
          const isSaving = saving === feature.id
          const justSaved = saved === feature.id

          return (
            <div
              key={feature.id}
              className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-leader-blue/10' : 'bg-gray-100 dark:bg-white/10'}`}>
                    <Icon className={`w-5 h-5 ${isEnabled ? 'text-leader-blue' : 'text-gray-400 dark:text-white/40'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      {feature.comingSoon && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(feature.id)}
                  disabled={isSaving || feature.comingSoon}
                  className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                    isEnabled
                      ? 'bg-leader-blue'
                      : 'bg-gray-200 dark:bg-white/20'
                  } ${feature.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {isSaving && (
                      <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                    )}
                    {justSaved && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-white/10">
        <p className="text-xs text-gray-400 dark:text-white/40">
          Changes take effect immediately. Disabled features are hidden from your sidebar but data is preserved.
        </p>
      </div>
    </div>
  )
}
