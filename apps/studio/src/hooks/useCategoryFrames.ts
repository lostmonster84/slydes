'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'
import { useSlydes } from './useSlydes'
import type { Frame } from './useFrames'
import type { FrameData, CTAType, CTAIconType } from '@/components/slyde-demo/frameData'

// ============================================
// Type Converters - Frame <-> FrameData
// ============================================

/**
 * Convert DB Frame to UI FrameData
 */
export function frameToFrameData(frame: Frame, accentColor: string): FrameData {
  // Build background source
  let backgroundSrc = ''
  if (frame.media_type === 'video' && frame.video_stream_uid) {
    const cfAccountHash = process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH
    backgroundSrc = `https://customer-${cfAccountHash}.cloudflarestream.com/${frame.video_stream_uid}/manifest/video.m3u8`
  } else if (frame.media_type === 'image' && frame.image_url) {
    backgroundSrc = frame.image_url
  }

  // Map template type
  const validTemplateTypes = ['hook', 'how', 'who', 'what', 'proof', 'trust', 'action', 'slydes', 'custom'] as const
  const templateType = validTemplateTypes.includes(frame.template_type as any)
    ? (frame.template_type as typeof validTemplateTypes[number])
    : 'custom'

  // Map CTA icon
  const validCtaIcons = ['book', 'call', 'view', 'arrow', 'menu', 'list'] as const
  const ctaIcon = validCtaIcons.includes(frame.cta_icon as any)
    ? (frame.cta_icon as typeof validCtaIcons[number])
    : 'call'

  return {
    id: frame.id,
    order: frame.frame_index,
    templateType,
    title: frame.title ?? '',
    subtitle: frame.subtitle ?? '',
    heartCount: 0,
    background: {
      type: (frame.background_type ?? frame.media_type ?? 'video') as 'video' | 'image',
      src: backgroundSrc,
      startTime: 0,
    },
    accentColor: frame.accent_color ?? accentColor,
    demoVideoUrl: frame.demo_video_url ?? undefined,
    cta: frame.cta_text ? {
      text: frame.cta_text,
      icon: ctaIcon,
      action: frame.cta_action ?? undefined,
    } : undefined,
  }
}

/**
 * Convert UI FrameData updates to DB Frame updates
 */
export function frameDataToFrameUpdates(frameData: Partial<FrameData>): Partial<Frame> {
  const updates: Partial<Frame> = {}

  if (frameData.title !== undefined) updates.title = frameData.title || null
  if (frameData.subtitle !== undefined) updates.subtitle = frameData.subtitle || null
  if (frameData.templateType !== undefined) updates.template_type = frameData.templateType || null
  if (frameData.accentColor !== undefined) updates.accent_color = frameData.accentColor || null
  if (frameData.demoVideoUrl !== undefined) updates.demo_video_url = frameData.demoVideoUrl || null

  // Handle CTA
  if (frameData.cta !== undefined) {
    if (frameData.cta) {
      updates.cta_text = frameData.cta.text || null
      updates.cta_icon = frameData.cta.icon || null
      updates.cta_action = frameData.cta.action || null
      // Map icon to type for DB
      const iconToType: Record<string, string> = {
        'call': 'call',
        'book': 'book',
        'view': 'link',
        'arrow': 'link',
        'menu': 'menu',
        'list': 'list',
      }
      updates.cta_type = frameData.cta.icon ? (iconToType[frameData.cta.icon] || 'link') : 'link'
    } else {
      updates.cta_text = null
      updates.cta_icon = null
      updates.cta_action = null
      updates.cta_type = null
    }
  }

  // Handle background
  if (frameData.background !== undefined) {
    updates.background_type = frameData.background.type || null
    // Note: video_stream_uid and image_url are set separately via media upload
  }

  return updates
}

// ============================================
// Hook Interface
// ============================================

interface UseCategoryFramesReturn {
  // Frame data by category public_id
  framesByCategory: Record<string, FrameData[]>
  isLoading: boolean
  error: Error | null

  // Load frames for a category
  loadFramesForCategory: (categoryPublicId: string) => Promise<void>

  // CRUD operations
  addFrame: (categoryPublicId: string) => Promise<string | null>
  updateFrame: (categoryPublicId: string, frameId: string, updates: Partial<FrameData>) => Promise<void>
  deleteFrame: (categoryPublicId: string, frameId: string) => Promise<void>
  reorderFrames: (categoryPublicId: string, frameIds: string[]) => Promise<void>
}

/**
 * useCategoryFrames - Manages frames for all categories in the editor
 *
 * Replaces localStorage-based frame storage with Supabase.
 * Frames are loaded on-demand when a category is expanded.
 */
export function useCategoryFrames(): UseCategoryFramesReturn {
  const { organization, isLoading: orgLoading } = useOrganization()
  const { slydes, isLoading: slydesLoading } = useSlydes()
  const [framesByCategory, setFramesByCategory] = useState<Record<string, FrameData[]>>({})
  const [rawFramesByCategory, setRawFramesByCategory] = useState<Record<string, Frame[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()
  const loadedCategories = useRef<Set<string>>(new Set())

  // Get accent color from organization
  const accentColor = organization?.primary_color || '#2563EB'

  // Find slyde by public_id
  const findSlydeByPublicId = useCallback((publicId: string) => {
    return slydes.find(s => s.public_id === publicId)
  }, [slydes])

  // Load frames for a category
  const loadFramesForCategory = useCallback(async (categoryPublicId: string) => {
    if (!organization || slydesLoading) return
    if (loadedCategories.current.has(categoryPublicId)) return // Already loaded

    const slyde = findSlydeByPublicId(categoryPublicId)
    if (!slyde) {
      console.warn(`Slyde not found for category: ${categoryPublicId}`)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data: frames, error: fetchError } = await supabase
        .from('frames')
        .select('*')
        .eq('slyde_id', slyde.id)
        .eq('organization_id', organization.id)
        .order('frame_index', { ascending: true })

      if (fetchError) throw fetchError

      loadedCategories.current.add(categoryPublicId)

      if (frames && frames.length > 0) {
        // Store raw frames
        setRawFramesByCategory(prev => ({ ...prev, [categoryPublicId]: frames }))
        // Convert to FrameData
        const frameDataList = frames.map(f => frameToFrameData(f, accentColor))
        setFramesByCategory(prev => ({ ...prev, [categoryPublicId]: frameDataList }))
      } else {
        // No frames yet - create a starter frame
        const starterFrame = await createStarterFrame(slyde.id, categoryPublicId)
        if (starterFrame) {
          setRawFramesByCategory(prev => ({ ...prev, [categoryPublicId]: [starterFrame] }))
          setFramesByCategory(prev => ({
            ...prev,
            [categoryPublicId]: [frameToFrameData(starterFrame, accentColor)]
          }))
        }
      }
    } catch (err) {
      console.error('Error loading frames:', err)
      setError(err instanceof Error ? err : new Error('Failed to load frames'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, slydesLoading, findSlydeByPublicId, supabase, accentColor])

  // Create a starter frame for new categories
  const createStarterFrame = async (slydeId: string, categoryPublicId: string): Promise<Frame | null> => {
    if (!organization) return null

    const { data: newFrame, error } = await supabase
      .from('frames')
      .insert({
        organization_id: organization.id,
        slyde_id: slydeId,
        public_id: `frame-${Date.now()}`,
        frame_index: 1,
        template_type: 'hook',
        title: '',
        subtitle: '',
        cta_type: 'call',
        cta_icon: 'call',
        cta_text: 'Call',
        background_type: 'video',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating starter frame:', error)
      return null
    }

    return newFrame
  }

  // Add a new frame to a category
  const addFrame = useCallback(async (categoryPublicId: string): Promise<string | null> => {
    if (!organization) return null

    const slyde = findSlydeByPublicId(categoryPublicId)
    if (!slyde) return null

    const existingFrames = rawFramesByCategory[categoryPublicId] || []
    const nextIndex = existingFrames.length + 1

    try {
      const { data: newFrame, error } = await supabase
        .from('frames')
        .insert({
          organization_id: organization.id,
          slyde_id: slyde.id,
          public_id: `frame-${Date.now()}`,
          frame_index: nextIndex,
          template_type: 'custom',
          title: '',
          subtitle: '',
          cta_type: 'call',
          cta_icon: 'call',
          cta_text: 'Call',
          background_type: 'video',
        })
        .select()
        .single()

      if (error) throw error

      // Update state
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: [...(prev[categoryPublicId] || []), newFrame],
      }))
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: [...(prev[categoryPublicId] || []), frameToFrameData(newFrame, accentColor)],
      }))

      return newFrame.id
    } catch (err) {
      console.error('Error adding frame:', err)
      return null
    }
  }, [organization, findSlydeByPublicId, rawFramesByCategory, supabase, accentColor])

  // Update a frame
  const updateFrame = useCallback(async (
    categoryPublicId: string,
    frameId: string,
    updates: Partial<FrameData>
  ) => {
    const dbUpdates = frameDataToFrameUpdates(updates)

    try {
      const { data, error } = await supabase
        .from('frames')
        .update(dbUpdates)
        .eq('id', frameId)
        .select()
        .single()

      if (error) throw error

      // Update raw frames
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
          f.id === frameId ? data : f
        ),
      }))

      // Update FrameData
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
          f.id === frameId ? { ...f, ...updates } : f
        ),
      }))
    } catch (err) {
      console.error('Error updating frame:', err)
      throw err
    }
  }, [supabase])

  // Delete a frame
  const deleteFrame = useCallback(async (categoryPublicId: string, frameId: string) => {
    const frames = rawFramesByCategory[categoryPublicId] || []
    if (frames.length <= 1) {
      console.warn('Cannot delete the last frame')
      return
    }

    try {
      const { error } = await supabase
        .from('frames')
        .delete()
        .eq('id', frameId)

      if (error) throw error

      // Update state
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).filter(f => f.id !== frameId),
      }))
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).filter(f => f.id !== frameId),
      }))
    } catch (err) {
      console.error('Error deleting frame:', err)
      throw err
    }
  }, [rawFramesByCategory, supabase])

  // Reorder frames
  const reorderFrames = useCallback(async (categoryPublicId: string, frameIds: string[]) => {
    try {
      // Update DB
      await Promise.all(
        frameIds.map((id, index) =>
          supabase
            .from('frames')
            .update({ frame_index: index + 1 })
            .eq('id', id)
        )
      )

      // Update local state
      setRawFramesByCategory(prev => {
        const frames = prev[categoryPublicId] || []
        const reordered = frameIds
          .map(id => frames.find(f => f.id === id))
          .filter(Boolean) as Frame[]
        reordered.forEach((f, i) => { f.frame_index = i + 1 })
        return { ...prev, [categoryPublicId]: reordered }
      })

      setFramesByCategory(prev => {
        const frames = prev[categoryPublicId] || []
        const reordered = frameIds
          .map(id => frames.find(f => f.id === id))
          .filter(Boolean) as FrameData[]
        reordered.forEach((f, i) => { f.order = i + 1 })
        return { ...prev, [categoryPublicId]: reordered }
      })
    } catch (err) {
      console.error('Error reordering frames:', err)
      throw err
    }
  }, [supabase])

  return {
    framesByCategory,
    isLoading: orgLoading || slydesLoading || isLoading,
    error,
    loadFramesForCategory,
    addFrame,
    updateFrame,
    deleteFrame,
    reorderFrames,
  }
}
