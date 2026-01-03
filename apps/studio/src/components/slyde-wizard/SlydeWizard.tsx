'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import type { VerticalType } from '@slydes/types'
import { TemplateCard } from './TemplateCard'
import { getTemplatesForVertical, type SlydeTemplate } from './templates'

interface SlydeWizardProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: SlydeTemplate | null) => Promise<void>
  vertical: VerticalType | null
  isLoading?: boolean
}

/**
 * SlydeWizard - Modal for creating new Slydes from templates
 *
 * Shows vertical-specific templates with AIDA-optimized frame structures.
 * Quick Add (blank) is handled separately in the Navigator.
 */
export function SlydeWizard({
  isOpen,
  onClose,
  onSelectTemplate,
  vertical,
  isLoading = false,
}: SlydeWizardProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SlydeTemplate | null>(null)

  const templates = getTemplatesForVertical(vertical)
  const hasTemplates = templates.length > 0

  const handleCreate = async () => {
    if (!selectedTemplate) return
    await onSelectTemplate(selectedTemplate)
    setSelectedTemplate(null)
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedTemplate(null)
      onClose()
    }
  }

  // If no templates available for this vertical, show empty state
  if (!hasTemplates) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50"
              onClick={handleClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="w-full max-w-md"
              >
                <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 text-center">
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-3" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Templates Yet</h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-4">
                    Templates for your industry are coming soon. Use Quick Add for now.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white text-sm transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              <div className="relative bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex-shrink-0">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-white/60" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-cyan-500/20">
                    <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choose a Template</h2>
                    <p className="text-gray-500 dark:text-white/50 text-sm">
                      AIDA-optimized frames for maximum conversion
                    </p>
                  </div>
                </div>
              </div>

              {/* Templates Grid (scrollable) */}
              <div className="px-6 pb-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-3">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate?.id === template.id}
                      onClick={() => setSelectedTemplate(
                        selectedTemplate?.id === template.id ? null : template
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Footer with Create Button (only if template selected) */}
              {selectedTemplate && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-white/10 flex-shrink-0">
                  <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create {selectedTemplate.name}
                      </>
                    )}
                  </button>
                </div>
              )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
