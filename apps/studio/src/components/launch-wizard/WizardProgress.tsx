'use client'

import { Check } from 'lucide-react'
import { useWizard } from './WizardContext'

const STEPS = [
  { num: 1, label: 'Setup' },
  { num: 2, label: 'Type' },
  { num: 3, label: 'Hero' },
  { num: 4, label: 'Sections' },
  { num: 5, label: 'Contact' },
  { num: 6, label: 'Launch' },
]

interface WizardProgressProps {
  skipStep1?: boolean
}

export function WizardProgress({ skipStep1 = false }: WizardProgressProps) {
  const { state, actions } = useWizard()
  const { currentStep, completedSteps } = state

  const steps = skipStep1 ? STEPS.slice(1) : STEPS

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.num)
        const isCurrent = currentStep === step.num
        const isClickable = isCompleted || step.num < currentStep

        return (
          <div key={step.num} className="flex items-center">
            {/* Step circle */}
            <button
              onClick={() => isClickable && actions.setStep(step.num as 1 | 2 | 3 | 4 | 5 | 6)}
              disabled={!isClickable}
              className={`
                relative flex h-8 w-8 items-center justify-center rounded-full
                text-sm font-medium transition-all duration-200
                ${isCurrent
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-white/50'
                }
                ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              `}
            >
              {isCompleted && !isCurrent ? (
                <Check className="h-4 w-4" />
              ) : (
                step.num
              )}
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  mx-1 h-0.5 w-8 transition-colors duration-200
                  ${completedSteps.includes(step.num)
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-white/10'
                  }
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
