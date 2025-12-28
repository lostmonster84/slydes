'use client'

import { useEffect, useState } from 'react'
import { Map, ChevronDown, ChevronUp, Wrench } from 'lucide-react'
import { usePlan, type PlanType } from '@/hooks/usePlan'
import { UrlToSlydeGenerator } from './UrlToSlydeGenerator'

/**
 * Dev-only control panel for testing plan tiers and demo generation
 *
 * Only renders on localhost. Includes:
 * - Plan tier testing (Free/Pro)
 * - URL to Slyde Generator for sales demos
 *
 * Uses the usePlan hook for instant updates across all components.
 * All plan state is managed via React Context (PlanProvider in layout).
 */
export function DevPanel() {
  const [isClient, setIsClient] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const { plan, setPlan } = usePlan()

  // Only run on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render on server or in production
  if (!isClient) return null
  if (typeof window === 'undefined') return null
  if (window.location.hostname !== 'localhost') return null

  const handleSetPlan = (newPlan: PlanType) => {
    setPlan(newPlan)
    // No reload needed - React Context updates all consumers instantly
  }

  const handleReset = () => {
    // Reset to default (pro - highest tier for dev)
    setPlan('pro')
  }

  // Plan tier config for buttons
  const tiers: { value: PlanType; label: string }[] = [
    { value: 'free', label: 'Free' },
    { value: 'creator', label: 'Creator' },
    { value: 'pro', label: 'Pro' },
  ]

  return (
    <div className="mx-3 mb-3">
      {/* Collapsible Dev Panel */}
      <div className="rounded-lg border-2 border-dashed border-red-500/50 bg-red-50 dark:bg-red-500/10 overflow-hidden">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-red-100/50 dark:hover:bg-red-500/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">
              Dev Tools
            </span>
            <span className="text-[10px] text-gray-500 dark:text-white/40 capitalize">
              ({plan})
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-red-500 dark:text-red-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-red-500 dark:text-red-400" />
          )}
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-3 pb-3 space-y-3">
            {/* Roadmap Link - Opens HQ Admin */}
            <a
              href="http://localhost:3000/admin/roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 transition-colors"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Roadmap (HQ)</span>
            </a>

            <div className="text-xs text-gray-600 dark:text-white/60">
              Plan: <span className="font-semibold text-gray-900 dark:text-white capitalize">{plan}</span>
            </div>

            <div className="flex gap-1">
              {tiers.map((tier) => (
                <button
                  key={tier.value}
                  onClick={() => handleSetPlan(tier.value)}
                  className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
                    plan === tier.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full px-2 py-1 text-[10px] font-medium text-red-500 hover:text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 rounded transition-colors"
            >
              Reset to Real
            </button>

            {/* Demo Generator - Nested accordion */}
            <div className="p-2 rounded border border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Demo Generator
                </div>
                {showGenerator ? (
                  <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
                )}
              </button>

              {showGenerator && (
                <div className="mt-2">
                  <UrlToSlydeGenerator />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
