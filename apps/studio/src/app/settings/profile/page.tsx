'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, User, Building2, Globe, Check } from 'lucide-react'

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  company_website: string | null
  avatar_url: string | null
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    company_website: '',
  })

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
      <div className="min-h-screen bg-future-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-future-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/settings"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only">Back to Settings</span>
            </Link>
            <h1 className="text-xl font-display font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
                <p className="text-white/60 text-sm">
                  Your profile picture is synced from your sign-in provider
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-white/80 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/60 cursor-not-allowed"
                />
                <p className="text-xs text-white/40 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-white/80 mb-2">
                  Company name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company_website" className="block text-sm font-medium text-white/80 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    id="company_website"
                    name="company_website"
                    type="text"
                    value={formData.company_website}
                    onChange={handleChange}
                    placeholder="example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            {saved && (
              <span className="flex items-center gap-2 text-green-400 text-sm">
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
      </main>
    </div>
  )
}
