'use client'

import { ChevronDown, MapPin } from 'lucide-react'

interface FeaturesSectionProps {
  /** Whether the section is expanded */
  isExpanded: boolean
  /** Toggle section expansion */
  onToggle: () => void
  /** Location address */
  locationAddress?: string
  /** Update location address */
  onLocationAddressChange?: (address: string) => void
}

/**
 * FeaturesSection - Location input for the inspector
 *
 * Just the location address - contact details are at the org/Home level.
 * Pattern: "Add address → Location button appears. Leave empty → hidden."
 */
export function FeaturesSection({
  isExpanded,
  onToggle,
  locationAddress,
  onLocationAddressChange,
}: FeaturesSectionProps) {

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500 dark:text-white/50" />
          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
            Location
          </span>
          {locationAddress && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
              Set
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
          <div className="space-y-1.5">
            <input
              type="text"
              value={locationAddress || ''}
              onChange={(e) => onLocationAddressChange?.(e.target.value)}
              placeholder="123 Main St, City, Country"
              className="w-full px-3 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
            />
            <p className="text-[10px] text-gray-500 dark:text-white/40">
              {locationAddress
                ? '✓ Location button will appear in action stack'
                : 'Add address to show Location button'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
