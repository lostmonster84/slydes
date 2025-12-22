'use client'

import { useCallback, useEffect } from 'react'
import { Rocket } from 'lucide-react'
import { useWizard } from '../WizardContext'
import { SlugInput } from '../components/SlugInput'

// Convert business name to slug
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
}

export function BusinessSetupStep() {
  const { state, actions, canProceed } = useWizard()
  const { businessSetup } = state

  // Auto-generate slug from name
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = nameToSlug(name)
    actions.setBusinessSetup({
      name,
      slug,
      slugAvailable: null, // Reset availability when name changes
    })
  }, [actions])

  const handleSlugChange = useCallback((slug: string) => {
    actions.setBusinessSetup({ slug })
  }, [actions])

  const handleAvailabilityChange = useCallback((available: boolean | null) => {
    actions.setBusinessSetup({ slugAvailable: available })
  }, [actions])

  const handleCheckingChange = useCallback((checking: boolean) => {
    actions.setBusinessSetup({ slugChecking: checking })
  }, [actions])

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Let&apos;s launch your Slyde
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          First, tell us about your business
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
            What&apos;s your business called?
          </label>
          <input
            type="text"
            value={businessSetup.name}
            onChange={handleNameChange}
            placeholder="e.g., Highland Blooms"
            className="
              w-full rounded-xl border border-gray-200 bg-white px-4 py-3
              text-gray-900 placeholder:text-gray-400
              transition-colors focus:border-leader-blue focus:outline-none focus:ring-2 focus:ring-leader-blue/40
              dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:placeholder:text-white/40
            "
            style={{ fontSize: '16px' }}
            autoComplete="organization"
            autoFocus
          />
        </div>

        {/* URL Slug */}
        <SlugInput
          value={businessSetup.slug}
          onChange={handleSlugChange}
          onAvailabilityChange={handleAvailabilityChange}
          isChecking={businessSetup.slugChecking}
          onCheckingChange={handleCheckingChange}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={actions.nextStep}
        disabled={!canProceed}
        className={`
          w-full rounded-xl py-4 text-lg font-semibold transition-all
          ${canProceed
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/10 dark:text-white/30'
          }
        `}
      >
        Continue
      </button>

      {/* Skip link */}
      <div className="text-center">
        <button
          onClick={() => {
            // Skip wizard entirely - go to blank editor
            actions.setComplete()
          }}
          className="text-sm text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60"
        >
          or start from scratch
        </button>
      </div>
    </div>
  )
}
