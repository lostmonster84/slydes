'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'

export interface Frame {
  id: string
  organization_id: string
  slyde_id: string
  public_id: string
  frame_index: number
  template_type: string | null
  title: string | null
  video_stream_uid: string | null
  video_poster_url: string | null
  video_status: 'processing' | 'ready' | 'failed' | null
  video_status_updated_at: string | null
  media_type: 'video' | 'image' | null
  image_url: string | null
  image_id: string | null
  image_variant: string | null
  created_at: string
  updated_at: string
}

interface UseFramesReturn {
  frames: Frame[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createFrame: (data: {
    public_id: string
    frame_index: number
    template_type?: string
    title?: string
  }) => Promise<Frame | null>
  updateFrame: (id: string, updates: Partial<Frame>) => Promise<void>
  deleteFrame: (id: string) => Promise<void>
  reorderFrames: (frameIds: string[]) => Promise<void>
}

export function useFrames(slydeId: string | null): UseFramesReturn {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [frames, setFrames] = useState<Frame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchFrames = useCallback(async () => {
    if (!organization || !slydeId) {
      setFrames([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('frames')
        .select('*')
        .eq('slyde_id', slydeId)
        .eq('organization_id', organization.id)
        .order('frame_index', { ascending: true })

      if (fetchError) throw fetchError

      setFrames(data || [])
    } catch (err) {
      console.error('Error fetching frames:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch frames'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, slydeId, supabase])

  useEffect(() => {
    if (!orgLoading) {
      fetchFrames()
    }
  }, [organization, orgLoading, slydeId, fetchFrames])

  const createFrame = useCallback(async (data: {
    public_id: string
    frame_index: number
    template_type?: string
    title?: string
  }): Promise<Frame | null> => {
    if (!organization || !slydeId) throw new Error('No organization or slyde selected')

    const { data: newFrame, error } = await supabase
      .from('frames')
      .insert({
        organization_id: organization.id,
        slyde_id: slydeId,
        public_id: data.public_id,
        frame_index: data.frame_index,
        template_type: data.template_type || null,
        title: data.title || null,
      })
      .select()
      .single()

    if (error) throw error

    if (newFrame) {
      setFrames(prev => [...prev, newFrame].sort((a, b) => a.frame_index - b.frame_index))
    }

    return newFrame
  }, [organization, slydeId, supabase])

  const updateFrame = useCallback(async (id: string, updates: Partial<Frame>) => {
    const { data, error } = await supabase
      .from('frames')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    setFrames(prev => prev.map(f => f.id === id ? data : f).sort((a, b) => a.frame_index - b.frame_index))
  }, [supabase])

  const deleteFrame = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('frames')
      .delete()
      .eq('id', id)

    if (error) throw error

    setFrames(prev => prev.filter(f => f.id !== id))
  }, [supabase])

  const reorderFrames = useCallback(async (frameIds: string[]) => {
    // Update frame_index for each frame based on new order
    const updates = frameIds.map((id, index) => ({
      id,
      frame_index: index + 1,
    }))

    // Batch update - run all updates in parallel
    const results = await Promise.all(
      updates.map(({ id, frame_index }) =>
        supabase
          .from('frames')
          .update({ frame_index })
          .eq('id', id)
          .select()
          .single()
      )
    )

    // Check for errors
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      throw errors[0].error
    }

    // Update local state
    const updatedFrames = results.map(r => r.data!).filter(Boolean)
    setFrames(prev => {
      const frameMap = new Map(prev.map(f => [f.id, f]))
      updatedFrames.forEach(f => frameMap.set(f.id, f))
      return Array.from(frameMap.values()).sort((a, b) => a.frame_index - b.frame_index)
    })
  }, [supabase])

  return {
    frames,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchFrames,
    createFrame,
    updateFrame,
    deleteFrame,
    reorderFrames,
  }
}

/**
 * Hook to get a single frame by ID
 */
export function useFrame(frameId: string | null): {
  frame: Frame | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  updateFrame: (updates: Partial<Frame>) => Promise<void>
} {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [frame, setFrame] = useState<Frame | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchFrame = useCallback(async () => {
    if (!organization || !frameId) {
      setFrame(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('frames')
        .select('*')
        .eq('id', frameId)
        .eq('organization_id', organization.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setFrame(null)
        } else {
          throw fetchError
        }
      } else {
        setFrame(data)
      }
    } catch (err) {
      console.error('Error fetching frame:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch frame'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, frameId, supabase])

  useEffect(() => {
    if (!orgLoading) {
      fetchFrame()
    }
  }, [organization, orgLoading, frameId, fetchFrame])

  const updateFrame = useCallback(async (updates: Partial<Frame>) => {
    if (!frameId) throw new Error('No frame selected')

    const { data, error } = await supabase
      .from('frames')
      .update(updates)
      .eq('id', frameId)
      .select()
      .single()

    if (error) throw error

    setFrame(data)
  }, [frameId, supabase])

  return {
    frame,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchFrame,
    updateFrame,
  }
}
