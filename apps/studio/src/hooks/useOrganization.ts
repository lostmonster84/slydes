'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { VerticalType } from '@slydes/types'

export interface Organization {
  id: string
  owner_id: string
  name: string
  slug: string
  website: string | null
  business_type: string | null
  vertical: VerticalType | null
  logo_url: string | null
  primary_color: string
  secondary_color: string | null
  brand_font: string | null
  brand_voice: string | null
  home_video_stream_uid: string | null
  home_video_poster_url: string | null
  instagram_handle: string | null
  instagram_followers: number | null
  instagram_updated_at: string | null
  tiktok_handle: string | null
  tiktok_followers: number | null
  tiktok_updated_at: string | null
  // Background music
  home_audio_r2_key: string | null
  home_audio_library_id: string | null
  home_audio_enabled: boolean
  // Feature toggles (from vertical defaults, can be overridden per-slyde)
  features_enabled: {
    lists?: boolean
    shop?: boolean
    socialStack?: {
      location?: boolean
      info?: boolean
      share?: boolean
      heart?: boolean
      connect?: boolean
    }
    sections?: {
      contact?: boolean
      faqs?: boolean
      demoVideo?: boolean
    }
  } | null
  created_at: string
  updated_at: string
}

interface UseOrganizationReturn {
  organization: Organization | null
  organizations: Organization[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  updateOrganization: (updates: Partial<Organization>) => Promise<void>
  createOrganization: (data: { name: string; slug: string; business_type?: string }) => Promise<Organization | null>
  switchOrganization: (orgId: string) => Promise<void>
}

export function useOrganization(): UseOrganizationReturn {
  const { user, isLoading: userLoading } = useUser()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchOrganizations = useCallback(async () => {
    if (!user) {
      setOrganizations([])
      setOrganization(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Get user's profile to find current organization
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_organization_id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      // Get all organizations user belongs to
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (orgsError) throw orgsError

      setOrganizations(orgs || [])

      // Set current organization
      if (orgs && orgs.length > 0) {
        const currentOrgId = profile?.current_organization_id
        const currentOrg = currentOrgId
          ? orgs.find(o => o.id === currentOrgId) || orgs[0]
          : orgs[0]
        setOrganization(currentOrg)
      } else {
        setOrganization(null)
      }
    } catch (err) {
      console.error('Error fetching organizations:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch organizations'))
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase])

  // Fetch on mount and when user changes
  useEffect(() => {
    if (!userLoading) {
      fetchOrganizations()
    }
  }, [user, userLoading, fetchOrganizations])

  const updateOrganization = useCallback(async (updates: Partial<Organization>) => {
    if (!organization) throw new Error('No organization selected')

    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', organization.id)
      .select()
      .single()

    if (error) throw error

    setOrganization(data)
    setOrganizations(prev => prev.map(o => o.id === data.id ? data : o))
  }, [organization, supabase])

  const createOrganization = useCallback(async (data: {
    name: string
    slug: string
    business_type?: string
  }): Promise<Organization | null> => {
    if (!user) throw new Error('Must be logged in to create organization')

    // Fetch vertical defaults for this business type (includes socialStack and sections)
    let featuresEnabled: Organization['features_enabled'] = {
      lists: false,
      shop: false,
      socialStack: { location: true, info: true, share: true, heart: false, connect: true },
      sections: { contact: true, faqs: false, demoVideo: false }
    }
    if (data.business_type) {
      const { data: verticalDefault } = await supabase
        .from('vertical_defaults')
        .select('features_enabled')
        .eq('vertical_id', data.business_type)
        .single()

      if (verticalDefault?.features_enabled) {
        featuresEnabled = verticalDefault.features_enabled as Organization['features_enabled']
      }
    }

    const { data: newOrg, error } = await supabase
      .from('organizations')
      .insert({
        owner_id: user.id,
        name: data.name,
        slug: data.slug.toLowerCase(),
        business_type: data.business_type || null,
        primary_color: '#2563EB',
        secondary_color: '#06B6D4',
        features_enabled: featuresEnabled,
      })
      .select()
      .single()

    if (error) throw error

    if (newOrg) {
      setOrganizations(prev => [newOrg, ...prev])
      setOrganization(newOrg)
    }

    return newOrg
  }, [user, supabase])

  const switchOrganization = useCallback(async (orgId: string) => {
    if (!user) throw new Error('Must be logged in')

    const org = organizations.find(o => o.id === orgId)
    if (!org) throw new Error('Organization not found')

    // Update profile with new current org
    const { error } = await supabase
      .from('profiles')
      .update({ current_organization_id: orgId })
      .eq('id', user.id)

    if (error) throw error

    setOrganization(org)
  }, [user, organizations, supabase])

  return {
    organization,
    organizations,
    isLoading: userLoading || isLoading,
    error,
    refetch: fetchOrganizations,
    updateOrganization,
    createOrganization,
    switchOrganization,
  }
}
