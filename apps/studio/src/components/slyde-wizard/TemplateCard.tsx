'use client'

import { motion } from 'framer-motion'
import {
  Home,
  Building2,
  UserCircle,
  Calculator,
  Calendar,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { SlydeTemplate } from './templates'

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  'building-2': Building2,
  'user-circle': UserCircle,
  calculator: Calculator,
  calendar: Calendar,
  sparkles: Sparkles,
}

interface TemplateCardProps {
  template: SlydeTemplate
  isSelected: boolean
  onClick: () => void
}

/**
 * TemplateCard - Individual template option in the wizard
 *
 * Shows icon, name, description, and frame preview hint.
 * Selected state shows gradient border/background.
 * Supports light and dark mode.
 */
export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  const Icon = ICON_MAP[template.icon] || Sparkles

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full p-4 rounded-xl text-left transition-all
        ${isSelected
          ? 'bg-gradient-to-br from-blue-600/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-500/20 border-2 border-blue-500'
          : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10'
        }
      `}
    >
      {/* Icon + Name */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          ${isSelected ? 'bg-blue-500/20 dark:bg-blue-500/30' : 'bg-gray-200 dark:bg-white/10'}
        `}>
          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-500 dark:text-white/70'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{template.name}</h3>
          <p className="text-sm text-gray-500 dark:text-white/50 line-clamp-2">{template.description}</p>
        </div>
      </div>

      {/* Preview hint */}
      <div className={`
        text-xs px-2 py-1 rounded-md inline-block
        ${isSelected ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-300' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40'}
      `}>
        {template.previewHint}
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}
