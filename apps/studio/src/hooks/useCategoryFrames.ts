'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'
import { useSlydes } from './useSlydes'
import type { Frame } from './useFrames'
import type { FrameData, CTAType, CTAIconType } from '@/components/slyde-demo/frameData'
import type { FrameTemplate } from '@/components/slyde-wizard/templates'

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

  // Handle CTA (check if key exists, not just if value is truthy)
  if ('cta' in frameData) {
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
  addFramesFromTemplate: (categoryPublicId: string, frames: FrameTemplate[]) => Promise<boolean>
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

      // Store frames (empty array if no frames yet - user will click "Add Frame")
      setRawFramesByCategory(prev => ({ ...prev, [categoryPublicId]: frames || [] }))
      const frameDataList = (frames || []).map(f => frameToFrameData(f, accentColor))
      setFramesByCategory(prev => ({ ...prev, [categoryPublicId]: frameDataList }))
    } catch (err) {
      console.error('Error loading frames:', err)
      setError(err instanceof Error ? err : new Error('Failed to load frames'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, slydesLoading, findSlydeByPublicId, supabase, accentColor])

  // Add a new frame to a category
  const addFrame = useCallback(async (categoryPublicId: string): Promise<string | null> => {
    if (!organization) {
      console.error('addFrame: No organization available')
      return null
    }

    const slyde = findSlydeByPublicId(categoryPublicId)
    if (!slyde) {
      console.error('addFrame: Slyde not found for categoryPublicId:', categoryPublicId, 'Available slydes:', slydes.map(s => s.public_id))
      return null
    }

    const existingFrames = rawFramesByCategory[categoryPublicId] || []
    const nextIndex = existingFrames.length + 1
    const tempId = `temp-${Date.now()}`

    // Optimistic: create temp frame immediately
    const tempFrame: FrameData = {
      id: tempId,
      order: nextIndex,
      templateType: 'custom',
      title: '',
      subtitle: '',
      heartCount: 0,
      background: { type: 'video', src: '', startTime: 0 },
      accentColor,
      cta: { text: 'Call', icon: 'call', action: undefined },
    }
    setFramesByCategory(prev => ({
      ...prev,
      [categoryPublicId]: [...(prev[categoryPublicId] || []), tempFrame],
    }))

    try {
      const insertPayload = {
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
      }

      // First insert without .single() to see raw response
      const insertResult = await supabase
        .from('frames')
        .insert(insertPayload)
        .select()

      console.log('Insert result:', {
        data: insertResult.data,
        error: insertResult.error,
        count: insertResult.count,
        status: insertResult.status,
        statusText: insertResult.statusText,
      })

      if (insertResult.error) {
        console.error('Supabase error adding frame:', {
          message: insertResult.error.message,
          code: insertResult.error.code,
          details: insertResult.error.details,
          hint: insertResult.error.hint,
          insertPayload,
        })
        throw insertResult.error
      }

      const newFrame = insertResult.data?.[0]
      if (!newFrame) {
        console.error('Insert returned no data - RLS may be blocking insert', { insertPayload })
        throw new Error('Insert returned no data - RLS may be blocking insert')
      }

      // Replace temp with real frame
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: [...(prev[categoryPublicId] || []), newFrame],
      }))
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
          f.id === tempId ? frameToFrameData(newFrame, accentColor) : f
        ),
      }))

      return newFrame.id
    } catch (err) {
      // Log error with full details (Supabase errors are plain objects, not Error instances)
      const errorDetails = err instanceof Error
        ? { message: err.message, name: err.name }
        : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err)
      console.error('Error adding frame:', errorDetails)
      // Rollback: remove temp frame
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: (prev[categoryPublicId] || []).filter(f => f.id !== tempId),
      }))
      return null
    }
  }, [organization, findSlydeByPublicId, rawFramesByCategory, supabase, accentColor, slydes])

  // Add multiple frames from a template
  const addFramesFromTemplate = useCallback(async (
    categoryPublicId: string,
    frameTemplates: FrameTemplate[]
  ): Promise<boolean> => {
    if (!organization) {
      console.error('addFramesFromTemplate: No organization available')
      return false
    }

    const slyde = findSlydeByPublicId(categoryPublicId)
    if (!slyde) {
      console.error('addFramesFromTemplate: Slyde not found for categoryPublicId:', categoryPublicId)
      return false
    }

    if (frameTemplates.length === 0) {
      console.warn('addFramesFromTemplate: No frames to create')
      return true
    }

    try {
      // Map CTA type to icon for DB storage
      const typeToIcon: Record<string, string> = {
        'call': 'call',
        'link': 'view',
        'email': 'view',
        'directions': 'view',
        'info': 'view',
        'faq': 'view',
        'reviews': 'view',
        'frame': 'arrow',
        'list': 'list',
      }

      // Build insert payloads for all frames
      const insertPayloads = frameTemplates.map((template, index) => ({
        organization_id: organization.id,
        slyde_id: slyde.id,
        public_id: `frame-${Date.now()}-${index}`,
        frame_index: index + 1,
        template_type: template.templateType || 'custom',
        title: template.title || '',
        subtitle: template.subtitle || '',
        cta_text: template.cta?.text || null,
        cta_type: template.cta?.type || null,
        cta_icon: template.cta ? (typeToIcon[template.cta.type] || 'view') : null,
        cta_action: template.cta?.value || null,
        background_type: 'video', // Default to video, user will upload
      }))

      // Batch insert all frames
      const { data: newFrames, error } = await supabase
        .from('frames')
        .insert(insertPayloads)
        .select()

      if (error) {
        console.error('Error batch inserting frames:', error)
        throw error
      }

      if (!newFrames || newFrames.length === 0) {
        console.error('Batch insert returned no data - RLS may be blocking')
        throw new Error('Batch insert returned no data')
      }

      // Mark category as loaded and update state
      loadedCategories.current.add(categoryPublicId)
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: newFrames,
      }))
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: newFrames.map(f => frameToFrameData(f, accentColor)),
      }))

      return true
    } catch (err) {
      console.error('Error in addFramesFromTemplate:', err)
      return false
    }
  }, [organization, findSlydeByPublicId, supabase, accentColor])

  // Update a frame
  const updateFrame = useCallback(async (
    categoryPublicId: string,
    frameId: string,
    updates: Partial<FrameData>
  ) => {
    // Save old state for rollback
    const oldFrame = framesByCategory[categoryPublicId]?.find(f => f.id === frameId)

    // Optimistic: update state immediately
    setFramesByCategory(prev => ({
      ...prev,
      [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
        f.id === frameId ? { ...f, ...updates } : f
      ),
    }))

    const dbUpdates = frameDataToFrameUpdates(updates)

    // Skip DB call if no updates to send
    if (Object.keys(dbUpdates).length === 0) {
      return
    }

    try {
      const { data, error } = await supabase
        .from('frames')
        .update(dbUpdates)
        .eq('id', frameId)
        .select()

      if (error) throw error

      // Update raw frames with DB response (if we got data back)
      if (data && data.length > 0) {
        setRawFramesByCategory(prev => ({
          ...prev,
          [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
            f.id === frameId ? data[0] : f
          ),
        }))
      }
    } catch (err) {
      const errorDetails = err instanceof Error
        ? { message: err.message, name: err.name, stack: err.stack }
        : JSON.stringify(err, Object.getOwnPropertyNames(err as object))
      console.error('Error updating frame:', errorDetails, 'Updates:', dbUpdates, 'FrameId:', frameId)
      // Rollback: restore old frame
      if (oldFrame) {
        setFramesByCategory(prev => ({
          ...prev,
          [categoryPublicId]: (prev[categoryPublicId] || []).map(f =>
            f.id === frameId ? oldFrame : f
          ),
        }))
      }
      throw err
    }
  }, [supabase, framesByCategory])

  // Delete a frame
  const deleteFrame = useCallback(async (categoryPublicId: string, frameId: string) => {
    const rawFrames = rawFramesByCategory[categoryPublicId] || []
    const frames = framesByCategory[categoryPublicId] || []
    if (rawFrames.length <= 1) {
      console.warn('Cannot delete the last frame')
      return
    }

    // Save old state for rollback
    const deletedRawFrame = rawFrames.find(f => f.id === frameId)
    const deletedFrame = frames.find(f => f.id === frameId)

    // Optimistic: remove immediately
    setRawFramesByCategory(prev => ({
      ...prev,
      [categoryPublicId]: (prev[categoryPublicId] || []).filter(f => f.id !== frameId),
    }))
    setFramesByCategory(prev => ({
      ...prev,
      [categoryPublicId]: (prev[categoryPublicId] || []).filter(f => f.id !== frameId),
    }))

    try {
      const { error } = await supabase
        .from('frames')
        .delete()
        .eq('id', frameId)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting frame:', err)
      // Rollback: restore deleted frame
      if (deletedRawFrame) {
        setRawFramesByCategory(prev => ({
          ...prev,
          [categoryPublicId]: [...(prev[categoryPublicId] || []), deletedRawFrame],
        }))
      }
      if (deletedFrame) {
        setFramesByCategory(prev => ({
          ...prev,
          [categoryPublicId]: [...(prev[categoryPublicId] || []), deletedFrame],
        }))
      }
      throw err
    }
  }, [rawFramesByCategory, framesByCategory, supabase])

  // Reorder frames
  const reorderFrames = useCallback(async (categoryPublicId: string, frameIds: string[]) => {
    // Save old state for rollback
    const oldRawFrames = rawFramesByCategory[categoryPublicId] || []
    const oldFrames = framesByCategory[categoryPublicId] || []

    // Optimistic: update local state immediately
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
    } catch (err) {
      console.error('Error reordering frames:', err)
      // Rollback: restore old order
      setRawFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: oldRawFrames,
      }))
      setFramesByCategory(prev => ({
        ...prev,
        [categoryPublicId]: oldFrames,
      }))
      throw err
    }
  }, [supabase, rawFramesByCategory, framesByCategory])

  return {
    framesByCategory,
    isLoading: orgLoading || slydesLoading || isLoading,
    error,
    loadFramesForCategory,
    addFrame,
    addFramesFromTemplate,
    updateFrame,
    deleteFrame,
    reorderFrames,
  }
}
