'use client'

import { ArrowLeft, Sparkles } from 'lucide-react'
import { useWizard } from '../WizardContext'
import { BusinessTypeCard } from '../components/BusinessTypeCard'
import { TEMPLATE_LIST, type BusinessType } from '@/lib/templates'

export function BusinessTypeStep() {
  const { state, actions, canProceed } = useWizard()

  const handleSelect = (type: BusinessType) => {
    actions.setBusinessType(type)
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          What type of business are you?
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          This helps us set up the perfect template for you
        </p>
      </div>

      {/* Business Type Grid */}
      <div className="grid grid-cols-3 gap-3">
        {TEMPLATE_LIST.map((template) => (
          <BusinessTypeCard
            key={template.id}
            template={template}
            isSelected={state.businessType === template.id}
            onSelect={() => handleSelect(template.id)}
          />
        ))}
      </div>

      {/* Selected template description */}
      {state.template && (
        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">{state.template.name}:</span>{' '}
            {state.template.description}
          </p>
          <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            Suggested sections: {state.template.sections.map(s => s.name).join(', ')}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={actions.prevStep}
          className="
            flex items-center justify-center gap-2 rounded-xl border border-gray-200
            bg-white px-6 py-4 font-medium text-gray-700
            transition-colors hover:bg-gray-50
            dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:hover:bg-[#3c3c3e]
          "
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={actions.nextStep}
          disabled={!canProceed}
          className={`
            flex-1 rounded-xl py-4 text-lg font-semibold transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/10 dark:text-white/30'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
