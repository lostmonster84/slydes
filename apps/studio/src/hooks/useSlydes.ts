'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'

export interface Slyde {
  id: string
  organization_id: string
  public_id: string
  title: string
  description: string | null
  published: boolean
  created_at: string
  updated_at: string
}

interface UseSlyde {
  slydes: Slyde[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createSlyde: (data: { public_id: string; title: string; description?: string }) => Promise<Slyde | null>
  updateSlyde: (id: string, updates: Partial<Slyde>) => Promise<void>
  deleteSlyde: (id: string) => Promise<void>
  publishSlyde: (id: string, published: boolean) => Promise<void>
}

export function useSlydes(): UseSlyde {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [slydes, setSlydes] = useState<Slyde[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchSlydes = useCallback(async () => {
    if (!organization) {
      setSlydes([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('slydes')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setSlydes(data || [])
    } catch (err) {
      console.error('Error fetching slydes:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch slydes'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, supabase])

  useEffect(() => {
    if (!orgLoading) {
      fetchSlydes()
    }
  }, [organization, orgLoading, fetchSlydes])

  const createSlyde = useCallback(async (data: {
    public_id: string
    title: string
    description?: string
  }): Promise<Slyde | null> => {
    if (!organization) throw new Error('No organization selected')

    const { data: newSlyde, error } = await supabase
      .from('slydes')
      .insert({
        organization_id: organization.id,
        public_id: data.public_id,
        title: data.title,
        description: data.description || null,
        published: false,
      })
      .select()
      .single()

    if (error) throw error

    if (newSlyde) {
      setSlydes(prev => [newSlyde, ...prev])
    }

    return newSlyde
  }, [organization, supabase])

  const updateSlyde = useCallback(async (id: string, updates: Partial<Slyde>) => {
    const { data, error } = await supabase
      .from('slydes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    setSlydes(prev => prev.map(s => s.id === id ? data : s))
  }, [supabase])

  const deleteSlyde = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('slydes')
      .delete()
      .eq('id', id)

    if (error) throw error

    setSlydes(prev => prev.filter(s => s.id !== id))
  }, [supabase])

  const publishSlyde = useCallback(async (id: string, published: boolean) => {
    await updateSlyde(id, { published })
  }, [updateSlyde])

  return {
    slydes,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchSlydes,
    createSlyde,
    updateSlyde,
    deleteSlyde,
    publishSlyde,
  }
}

/**
 * Hook to get a single slyde by ID or public_id
 */
export function useSlyde(idOrPublicId: string | null): {
  slyde: Slyde | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [slyde, setSlyde] = useState<Slyde | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchSlyde = useCallback(async () => {
    if (!organization || !idOrPublicId) {
      setSlyde(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Try by UUID first, then by public_id
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrPublicId)

      const { data, error: fetchError } = await supabase
        .from('slydes')
        .select('*')
        .eq('organization_id', organization.id)
        .eq(isUuid ? 'id' : 'public_id', idOrPublicId)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Not found
          setSlyde(null)
        } else {
          throw fetchError
        }
      } else {
        setSlyde(data)
      }
    } catch (err) {
      console.error('Error fetching slyde:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch slyde'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, idOrPublicId, supabase])

  useEffect(() => {
    if (!orgLoading) {
      fetchSlyde()
    }
  }, [organization, orgLoading, idOrPublicId, fetchSlyde])

  return {
    slyde,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchSlyde,
  }
}
