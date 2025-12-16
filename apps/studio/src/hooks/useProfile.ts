'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEffectivePlan } from '@/lib/whitelist'
import type { PlanTier } from '@/lib/plans'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  company_name: string | null
  company_website: string | null
  avatar_url: string | null
  onboarding_completed: boolean
  current_organization_id: string | null
  plan: PlanTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'active' | 'cancelled' | 'past_due' | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          throw error
        }

        // Apply whitelist override for plan
        setProfile({
          ...data,
          plan: getEffectivePlan(data.email, data.plan ?? 'free'),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update profile')
      return { data: null, error }
    }
  }

  return { profile, loading, error, updateProfile }
}
