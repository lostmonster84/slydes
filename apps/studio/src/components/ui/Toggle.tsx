'use client'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
}

/**
 * Toggle - iOS-style switch component
 *
 * CONSTX: Standardized toggle used across all HQ editors.
 * - 51x31px switch with 27px knob
 * - Blue when ON, gray when OFF
 * - Optional label + description layout
 */
export function Toggle({ enabled, onChange, label, description }: ToggleProps) {
  const toggle = (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
        enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'
      }`}
      role="switch"
      aria-pressed={enabled}
    >
      <div
        className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-transform duration-200 ease-out ${
          enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  )

  // Simple toggle without label
  if (!label) {
    return toggle
  }

  // Toggle with label and optional description
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <label className="text-[13px] font-medium text-gray-700 dark:text-white/70">{label}</label>
        {description && (
          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">{description}</p>
        )}
      </div>
      {toggle}
    </div>
  )
}
