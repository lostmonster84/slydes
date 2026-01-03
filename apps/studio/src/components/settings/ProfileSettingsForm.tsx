'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, User, Building2, Globe, Check, Home, Bed, Car, Sparkles, UtensilsCrossed, ChevronDown, Compass, PartyPopper } from 'lucide-react'
import { useOrganization } from '@/hooks/useOrganization'
import type { VerticalType } from '@slydes/types'

const VERTICAL_INFO: Record<string, { name: string; icon: typeof Home }> = {
  'restaurant-bar': { name: 'Restaurant / Bar / Cafe', icon: UtensilsCrossed },
  hotel: { name: 'Hotel / Lodge / Boutique Stay', icon: Bed },
  venue: { name: 'Venue / Event Space', icon: PartyPopper },
  adventure: { name: 'Tours / Adventures / Experiences', icon: Compass },
  wellness: { name: 'Spa / Wellness / Fitness', icon: Sparkles },
  other: { name: 'Other', icon: Building2 },
  // Legacy verticals (for existing users - shown in dropdown if currently set)
  property: { name: 'Property', icon: Home },
  hospitality: { name: 'Hospitality', icon: Bed },
  automotive: { name: 'Automotive', icon: Car },
  beauty: { name: 'Beauty & Wellness', icon: Sparkles },
  food: { name: 'Food & Drink', icon: UtensilsCrossed },
}

// Enabled verticals shown in the dropdown (experience-first)
const ENABLED_VERTICALS = [
  'restaurant-bar',
  'hotel',
  'venue',
  'adventure',
  'wellness',
  'other',
] as const

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  company_website: string | null
  avatar_url: string | null
}

export function ProfileSettingsForm() {
  const router = useRouter()
  const supabase = createClient()
  const { organization, updateOrganization } = useOrganization()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    company_website: '',
  })
  const [orgName, setOrgName] = useState('')
  const [savingOrgName, setSavingOrgName] = useState(false)
  const [orgNameSaved, setOrgNameSaved] = useState(false)
  const [selectedVertical, setSelectedVertical] = useState<string>('')
  const [savingVertical, setSavingVertical] = useState(false)
  const [verticalSaved, setVerticalSaved] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          company_name: data.company_name || '',
          company_website: data.company_website || '',
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  // Sync org name and vertical when organization loads
  useEffect(() => {
    if (organization) {
      setOrgName(organization.name)
      setSelectedVertical(organization.vertical || '')
    }
  }, [organization])

  const handleSaveOrgName = async () => {
    if (!orgName.trim() || orgName === organization?.name) return

    setSavingOrgName(true)
    try {
      await updateOrganization({ name: orgName.trim() })
      setOrgNameSaved(true)
      setTimeout(() => setOrgNameSaved(false), 3000)
    } catch (err) {
      console.error('Failed to update org name:', err)
    }
    setSavingOrgName(false)
  }

  const handleSaveVertical = async (newVertical: string) => {
    if (!newVertical || newVertical === organization?.vertical) return

    setSelectedVertical(newVertical)
    setSavingVertical(true)
    try {
      await updateOrganization({ vertical: newVertical as VerticalType })
      setVerticalSaved(true)
      setTimeout(() => setVerticalSaved(false), 3000)
    } catch (err) {
      console.error('Failed to update vertical:', err)
      // Revert on error
      setSelectedVertical(organization?.vertical || '')
    }
    setSavingVertical(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)

    setSaving(false)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Section */}
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-leader-blue/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-leader-blue" />
            </div>
          )}
          <div>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              Your profile picture is synced from your sign-in provider
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/40" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full bg-gray-100 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 px-4 text-gray-500 dark:text-white/60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Business Name (Organization) */}
      {organization && (
        <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Business Name</h2>
          <p className="text-gray-500 dark:text-white/60 text-sm mb-4">
            This is your business name shown throughout Slydes
          </p>
          <div className="space-y-4">
            {/* Organization Type (editable dropdown) */}
            <div>
              <label htmlFor="org_vertical" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                Organization type
              </label>
              <div className="relative">
                {selectedVertical && VERTICAL_INFO[selectedVertical] && (() => {
                  const VerticalIcon = VERTICAL_INFO[selectedVertical].icon
                  return <VerticalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-leader-blue" />
                })()}
                <select
                  id="org_vertical"
                  value={selectedVertical}
                  onChange={(e) => handleSaveVertical(e.target.value)}
                  disabled={savingVertical}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Show current vertical even if it's a legacy one */}
                  {selectedVertical && !ENABLED_VERTICALS.includes(selectedVertical as typeof ENABLED_VERTICALS[number]) && VERTICAL_INFO[selectedVertical] && (
                    <option value={selectedVertical}>{VERTICAL_INFO[selectedVertical].name}</option>
                  )}
                  {/* Show enabled verticals */}
                  {ENABLED_VERTICALS.map((verticalId) => {
                    const info = VERTICAL_INFO[verticalId]
                    if (!info) return null
                    return (
                      <option key={verticalId} value={verticalId}>
                        {info.name}
                      </option>
                    )
                  })}
                </select>
                {savingVertical ? (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                )}
              </div>
              {verticalSaved ? (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Organization type saved!
                </p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                  This determines which templates appear in the wizard
                </p>
              )}
            </div>

            <div>
              <label htmlFor="org_name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                Business name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/40" />
                <input
                  id="org_name"
                  type="text"
                  value={orgName}
                  onChange={(e) => {
                    setOrgName(e.target.value)
                    setOrgNameSaved(false)
                  }}
                  className="w-full bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
                />
              </div>
              {orgNameSaved && (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Business name saved!
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveOrgName}
              disabled={savingOrgName || !orgName.trim() || orgName === organization.name}
              className="flex items-center gap-2 bg-leader-blue text-white font-medium py-2.5 px-5 rounded-xl hover:bg-leader-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingOrgName ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save business name'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Company Info */}
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Company Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
              Legal company name
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/40" />
              <input
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="For billing purposes"
                className="w-full bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/40" />
              <input
                id="company_website"
                name="company_website"
                type="text"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="example.com"
                className="w-full bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-2 text-green-500 dark:text-green-400 text-sm">
            <Check className="w-4 h-4" />
            Changes saved
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-leader-blue text-white font-medium py-3 px-6 rounded-xl hover:bg-leader-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </form>
  )
}
