'use client'

import { useState } from 'react'
import { ArrowLeft, LayoutGrid, Plus } from 'lucide-react'
import { useWizard } from '../WizardContext'
import { SectionRow } from '../components/SectionRow'

export function SectionsStep() {
  const { state, actions, canProceed, enabledSections } = useWizard()
  const [newSectionName, setNewSectionName] = useState('')
  const [showAddInput, setShowAddInput] = useState(false)

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      actions.addSection(newSectionName.trim())
      setNewSectionName('')
      setShowAddInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSection()
    } else if (e.key === 'Escape') {
      setNewSectionName('')
      setShowAddInput(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
          <LayoutGrid className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          What do you want to show?
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          These become your Slydes
        </p>
      </div>

      {/* Template suggestion */}
      {state.template && (
        <p className="text-center text-sm text-gray-500 dark:text-white/50">
          Suggested for {state.template.name}s:
        </p>
      )}

      {/* Sections List */}
      <div className="space-y-2">
        {state.sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            onToggle={() => actions.toggleSection(section.id)}
            onRename={(newName) => actions.renameSection(section.id, newName)}
            onRemove={() => actions.removeSection(section.id)}
          />
        ))}

        {/* Add section */}
        {showAddInput ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 p-3 dark:border-white/20">
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Slyde name"
              className="
                flex-1 rounded-md border border-gray-200 bg-white px-3 py-2
                text-sm text-gray-900 placeholder:text-gray-400
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
                dark:border-white/10 dark:bg-[#1c1c1e] dark:text-white dark:placeholder:text-white/40
              "
              autoFocus
            />
            <button
              onClick={handleAddSection}
              disabled={!newSectionName.trim()}
              className="
                rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white
                transition-colors hover:bg-blue-600
                disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-white/10
              "
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewSectionName('')
                setShowAddInput(false)
              }}
              className="rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="
              flex w-full items-center justify-center gap-2 rounded-xl border border-dashed
              border-gray-300 p-3 text-sm text-gray-500
              transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700
              dark:border-white/20 dark:text-white/50 dark:hover:border-white/30 dark:hover:bg-white/5 dark:hover:text-white/70
            "
          >
            <Plus className="h-4 w-4" />
            Add another Slyde
          </button>
        )}
      </div>

      {/* Help text */}
      <p className="text-center text-xs text-gray-400 dark:text-white/40">
        You can always add, remove, and reorder Slydes later in the editor
      </p>

      {/* Enabled count */}
      {!canProceed && (
        <p className="text-center text-sm text-amber-600 dark:text-amber-400">
          Select at least one Slyde to continue
        </p>
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
          Continue ({enabledSections.length} selected)
        </button>
      </div>
    </div>
  )
}
