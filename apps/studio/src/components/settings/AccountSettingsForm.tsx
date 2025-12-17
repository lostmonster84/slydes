'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AtSign, LogOut, Trash2, Check, X, AlertTriangle } from 'lucide-react'

interface Profile {
  id: string
  email: string | null
  username: string | null
}

export function AccountSettingsForm() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  // Username state
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'saved'>('idle')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [savingUsername, setSavingUsername] = useState(false)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, email, username')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setUsername(data.username || '')
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  // Debounced username availability check
  const checkUsernameAvailability = useCallback(async (value: string) => {
    if (!value || value === profile?.username) {
      setUsernameStatus('idle')
      setUsernameError(null)
      return
    }

    setUsernameStatus('checking')
    setUsernameError(null)

    try {
      const res = await fetch(`/api/account/username?username=${encodeURIComponent(value)}`)
      const data = await res.json()

      if (data.available) {
        setUsernameStatus('available')
        setUsernameError(null)
      } else {
        setUsernameStatus(data.error?.includes('taken') ? 'taken' : 'invalid')
        setUsernameError(data.error)
      }
    } catch {
      setUsernameStatus('invalid')
      setUsernameError('Failed to check availability')
    }
  }, [profile?.username])

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && username !== profile?.username) {
        checkUsernameAvailability(username)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, checkUsernameAvailability, profile?.username])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
    setUsername(value)
    setUsernameStatus('idle')
  }

  const handleSaveUsername = async () => {
    if (usernameStatus !== 'available') return

    setSavingUsername(true)

    try {
      const res = await fetch('/api/account/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      const data = await res.json()

      if (data.success) {
        setUsernameStatus('saved')
        setProfile(prev => prev ? { ...prev, username } : null)
        setTimeout(() => setUsernameStatus('idle'), 3000)
      } else {
        setUsernameError(data.error)
        setUsernameStatus('invalid')
      }
    } catch {
      setUsernameError('Failed to save username')
      setUsernameStatus('invalid')
    }

    setSavingUsername(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmUsername: deleteConfirmText })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/login?deleted=true')
      } else {
        setDeleteError(data.error)
      }
    } catch {
      setDeleteError('Failed to delete account')
    }

    setDeleting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-leader-blue" />
      </div>
    )
  }

  const usernamePreview = username || 'yourusername'

  return (
    <div className="space-y-8">
      {/* Username Section */}
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Username</h2>
        <p className="text-gray-500 dark:text-white/60 text-sm mb-4">
          Your unique Slydes URL: <span className="text-leader-blue font-mono">slydes.io/{usernamePreview}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
              Choose your username
            </label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/40" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="yourusername"
                maxLength={30}
                className="w-full bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue focus:border-transparent transition-all font-mono"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                )}
                {usernameStatus === 'available' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                  <X className="w-5 h-5 text-red-500" />
                )}
                {usernameStatus === 'saved' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-red-500 text-sm mt-2">{usernameError}</p>
            )}
            {usernameStatus === 'saved' && (
              <p className="text-green-500 text-sm mt-2">Username saved!</p>
            )}
            <p className="text-gray-400 dark:text-white/40 text-xs mt-2">
              3-30 characters. Lowercase letters, numbers, hyphens, and underscores only.
            </p>
          </div>

          <button
            onClick={handleSaveUsername}
            disabled={usernameStatus !== 'available' || savingUsername}
            className="flex items-center gap-2 bg-leader-blue text-white font-medium py-2.5 px-5 rounded-xl hover:bg-leader-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingUsername ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save username'
            )}
          </button>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Sign Out</h2>
        <p className="text-gray-500 dark:text-white/60 text-sm mb-4">
          Sign out of your Slydes account on this device.
        </p>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-medium py-2.5 px-5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <p className="text-red-600/80 dark:text-red-400/80 text-sm mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-red-500 text-white font-medium py-2.5 px-5 rounded-xl hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete account
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                Type your {profile?.username ? 'username' : 'email'} to confirm: <span className="font-mono">{profile?.username || profile?.email}</span>
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={profile?.username || profile?.email || ''}
                className="w-full bg-white dark:bg-white/5 border border-red-300 dark:border-red-500/30 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
              />
              {deleteError && (
                <p className="text-red-500 text-sm mt-2">{deleteError}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deleteConfirmText}
                className="flex items-center gap-2 bg-red-500 text-white font-medium py-2.5 px-5 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Permanently delete
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                  setDeleteError(null)
                }}
                className="text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
