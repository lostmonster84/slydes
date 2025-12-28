'use client'

import { useState, useEffect, useCallback } from 'react'

// Available features that can be toggled per vertical
const FEATURES = [
  {
    id: 'lists',
    name: 'Lists',
    description: 'Inventory management for items like vehicles, rooms, or services',
  },
  {
    id: 'shop',
    name: 'Shop',
    description: 'Commerce features including cart, checkout, and orders',
  },
]

interface Vertical {
  vertical_id: string
  name: string
  description: string | null
  icon: string | null
  display_order: number
  enabled: boolean
  features_enabled: {
    lists: boolean
    shop: boolean
  }
}

interface EditModalState {
  isOpen: boolean
  mode: 'create' | 'edit'
  vertical: Partial<Vertical> | null
}

export default function VerticalsPage() {
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<EditModalState>({ isOpen: false, mode: 'create', vertical: null })
  const [formData, setFormData] = useState({ vertical_id: '', name: '', description: '', icon: '✨', lists: false, shop: false })
  const [formError, setFormError] = useState<string | null>(null)
  const [formSaving, setFormSaving] = useState(false)

  // Load verticals from API
  const fetchVerticals = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/verticals')
      if (!response.ok) {
        throw new Error('Failed to fetch verticals')
      }
      const data = await response.json()
      setVerticals(data.verticals || [])
    } catch (err) {
      console.error('Error fetching verticals:', err)
      setError('Failed to load verticals.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVerticals()
  }, [fetchVerticals])

  const handleToggle = useCallback(async (verticalId: string, featureId: 'lists' | 'shop') => {
    const vertical = verticals.find(v => v.vertical_id === verticalId)
    if (!vertical) return

    const key = `${verticalId}-${featureId}`
    setSaving(key)
    setSaved(null)
    setError(null)

    const newFeatures = {
      ...vertical.features_enabled,
      [featureId]: !vertical.features_enabled[featureId],
    }

    try {
      const response = await fetch('/api/admin/verticals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical_id: verticalId,
          features_enabled: newFeatures,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setVerticals(prev => prev.map(v =>
        v.vertical_id === verticalId
          ? { ...v, features_enabled: newFeatures }
          : v
      ))

      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    } catch (err) {
      console.error('Error saving vertical default:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(null)
    }
  }, [verticals])

  const openCreateModal = () => {
    setFormData({ vertical_id: '', name: '', description: '', icon: '✨', lists: false, shop: false })
    setFormError(null)
    setEditModal({ isOpen: true, mode: 'create', vertical: null })
  }

  const openEditModal = (vertical: Vertical) => {
    setFormData({
      vertical_id: vertical.vertical_id,
      name: vertical.name,
      description: vertical.description || '',
      icon: vertical.icon || '✨',
      lists: vertical.features_enabled.lists,
      shop: vertical.features_enabled.shop,
    })
    setFormError(null)
    setEditModal({ isOpen: true, mode: 'edit', vertical })
  }

  const closeModal = () => {
    setEditModal({ isOpen: false, mode: 'create', vertical: null })
    setFormError(null)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSaving(true)

    try {
      if (editModal.mode === 'create') {
        // Validate
        if (!formData.vertical_id.trim() || !formData.name.trim()) {
          setFormError('ID and Name are required')
          setFormSaving(false)
          return
        }

        const response = await fetch('/api/admin/verticals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vertical_id: formData.vertical_id.toLowerCase().replace(/\s+/g, '-'),
            name: formData.name,
            description: formData.description || null,
            icon: formData.icon || '✨',
            features_enabled: { lists: formData.lists, shop: formData.shop },
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create vertical')
        }

        setVerticals(prev => [...prev, data.vertical])
      } else {
        // Edit existing
        const response = await fetch('/api/admin/verticals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vertical_id: formData.vertical_id,
            name: formData.name,
            description: formData.description || null,
            icon: formData.icon || '✨',
            features_enabled: { lists: formData.lists, shop: formData.shop },
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to update vertical')
        }

        setVerticals(prev => prev.map(v =>
          v.vertical_id === formData.vertical_id ? data.vertical : v
        ))
      }

      closeModal()
    } catch (err) {
      console.error('Form error:', err)
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setFormSaving(false)
    }
  }

  const handleDisable = async (verticalId: string) => {
    if (!confirm('Are you sure you want to disable this vertical? It will no longer appear in forms.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/verticals?id=${verticalId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable vertical')
      }

      setVerticals(prev => prev.map(v =>
        v.vertical_id === verticalId ? { ...v, enabled: false } : v
      ))
    } catch (err) {
      console.error('Disable error:', err)
      setError(err instanceof Error ? err.message : 'Failed to disable vertical')
    }
  }

  const handleEnable = async (verticalId: string) => {
    try {
      const response = await fetch('/api/admin/verticals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical_id: verticalId,
          enabled: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enable vertical')
      }

      setVerticals(prev => prev.map(v =>
        v.vertical_id === verticalId ? { ...v, enabled: true } : v
      ))
    } catch (err) {
      console.error('Enable error:', err)
      setError('Failed to enable vertical')
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Verticals</h1>
          <p className="text-[#98989d]">Manage industry verticals and their default features</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vertical
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex gap-3">
          <div className="text-blue-400 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium">How this works</p>
            <p className="text-[#98989d] text-sm mt-1">
              Verticals are industry categories that appear in forms and determine default features for new organizations.
              Add new verticals here without code changes. All forms will automatically update.
            </p>
          </div>
        </div>
      </div>

      {/* Verticals Grid */}
      <div className="grid gap-6">
        {verticals.length === 0 && (
          <div className="text-center py-12 bg-[#2c2c2e] rounded-xl border border-white/10">
            <p className="text-white/60 mb-4">No verticals configured yet.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Add your first vertical
            </button>
          </div>
        )}
        {verticals.map((vertical) => (
          <div
            key={vertical.vertical_id}
            className={`bg-[#2c2c2e] rounded-xl border overflow-hidden ${
              vertical.enabled ? 'border-white/10' : 'border-yellow-500/30 opacity-60'
            }`}
          >
            {/* Vertical Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4">
              <span className="text-2xl">{vertical.icon || '✨'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{vertical.name}</h2>
                  {!vertical.enabled && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#636366]">{vertical.description || 'No description'}</p>
                <p className="text-xs text-[#48484a] mt-0.5">ID: {vertical.vertical_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(vertical)}
                  className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Edit
                </button>
                {vertical.vertical_id !== 'other' && (
                  vertical.enabled ? (
                    <button
                      onClick={() => handleDisable(vertical.vertical_id)}
                      className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnable(vertical.vertical_id)}
                      className="px-3 py-1.5 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                    >
                      Enable
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Features */}
            <div className="px-6 py-4 space-y-4">
              {FEATURES.map((feature) => {
                const isEnabled = vertical.features_enabled?.[feature.id as 'lists' | 'shop'] ?? false
                const key = `${vertical.vertical_id}-${feature.id}`
                const isSaving = saving === key
                const justSaved = saved === key

                return (
                  <div key={feature.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{feature.name}</p>
                        <p className="text-xs text-[#636366]">{feature.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(vertical.vertical_id, feature.id as 'lists' | 'shop')}
                      disabled={isSaving}
                      className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                        isEnabled
                          ? 'bg-blue-500'
                          : 'bg-[#3a3a3c]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {isSaving && (
                          <svg className="w-3 h-3 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {justSaved && (
                          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-[#636366]">
          Note: Changes here only affect <strong>new</strong> organizations. Existing organizations keep their current settings.
          Disabled verticals won't appear in signup forms but existing organizations in that vertical are unaffected.
        </p>
      </div>

      {/* Create/Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-[#2c2c2e] rounded-2xl border border-white/10 w-full max-w-md mx-4 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {editModal.mode === 'create' ? 'Add New Vertical' : 'Edit Vertical'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  ID (slug)
                </label>
                <input
                  type="text"
                  value={formData.vertical_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, vertical_id: e.target.value }))}
                  disabled={editModal.mode === 'edit'}
                  placeholder="e.g., fitness"
                  className="w-full px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {editModal.mode === 'create' && (
                  <p className="text-xs text-[#636366] mt-1">Lowercase, no spaces. This cannot be changed later.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Fitness & Wellness"
                  className="w-full px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="💪"
                  className="w-full px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Gyms, fitness studios, wellness centers..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">
                  Default Features
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lists}
                      onChange={(e) => setFormData(prev => ({ ...prev, lists: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-[#1c1c1e] text-blue-500 focus:ring-blue-500/50"
                    />
                    <span className="text-sm text-white">Lists</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shop}
                      onChange={(e) => setFormData(prev => ({ ...prev, shop: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/20 bg-[#1c1c1e] text-blue-500 focus:ring-blue-500/50"
                    />
                    <span className="text-sm text-white">Shop</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {formSaving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {editModal.mode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
