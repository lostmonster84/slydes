'use client'

import { type WizardTemplate } from '@/lib/templates'

interface BusinessTypeCardProps {
  template: WizardTemplate
  isSelected: boolean
  onSelect: () => void
}

export function BusinessTypeCard({ template, isSelected, onSelect }: BusinessTypeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex flex-col items-center justify-center rounded-xl p-4
        transition-all duration-200
        ${isSelected
          ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102 dark:bg-[#2c2c2e] dark:text-white dark:hover:bg-[#3c3c3e]'
        }
        border ${isSelected ? 'border-transparent' : 'border-gray-200 dark:border-white/10'}
      `}
    >
      {/* Icon */}
      <span className="text-3xl mb-2" role="img" aria-label={template.name}>
        {template.icon}
      </span>

      {/* Name */}
      <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
        {template.name}
      </span>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600 shadow-md">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  )
}
