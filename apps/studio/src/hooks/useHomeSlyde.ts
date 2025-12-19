'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'
import { useSlydes, type Slyde } from './useSlydes'
import type { FrameData, FAQItem, SocialLinks } from '@/components/slyde-demo/frameData'
import type { VideoFilterPreset, VideoSpeedPreset } from '@/lib/videoFilters'

// ============================================
// Types - matching DemoHomeSlyde for compatibility
// ============================================

export type BackgroundType = 'video' | 'image'

export type HomeSlydeCategory = {
  id: string
  icon: string
  name: string
  description: string
  childSlydeId: string
  hasInventory?: boolean
  inventoryCtaText?: string
  ctaText?: string
  listId?: string
}

export type HomeSlyde = {
  // Background
  backgroundType: BackgroundType
  videoSrc: string
  imageSrc?: string
  posterSrc?: string
  videoFilter?: VideoFilterPreset
  videoVignette?: boolean
  videoSpeed?: VideoSpeedPreset
  videoStartTime?: number

  // Categories (child slydes)
  categories: HomeSlydeCategory[]

  // Primary CTA
  primaryCta?: {
    text: string
    action: string
  }

  // UI toggles
  showCategoryIcons?: boolean
  showHearts?: boolean
  showShare?: boolean
  showSound?: boolean
  showReviews?: boolean

  // Social links
  socialLinks?: SocialLinks

  // FAQs
  homeFAQs?: FAQItem[]
  childFAQs?: Record<string, FAQItem[]>
  faqInbox?: any[]

  // Lists
  lists?: any[]

  // Music
  musicEnabled?: boolean
  musicCustomUrl?: string | null

  // Child frames (loaded separately)
  childFrames?: Record<string, FrameData[]>
}

const DEFAULT_HOME_SLYDE: HomeSlyde = {
  backgroundType: 'video',
  videoSrc: '',
  imageSrc: undefined,
  posterSrc: undefined,
  videoFilter: 'original',
  videoVignette: false,
  videoSpeed: 'normal',
  videoStartTime: 0,
  categories: [],
  primaryCta: undefined,
  showCategoryIcons: false,
  showHearts: true,
  showShare: true,
  showSound: true,
  showReviews: true,
  socialLinks: undefined,
  homeFAQs: [],
  childFAQs: {},
  faqInbox: [],
  lists: [],
  musicEnabled: true,
  musicCustomUrl: null,
  childFrames: {},
}

// ============================================
// Extended Slyde type with new columns
// ============================================

interface ExtendedSlyde extends Slyde {
  icon?: string
  order_index?: number
  has_inventory?: boolean
  inventory_cta_text?: string
}

// ============================================
// Hook Interface
// ============================================

interface UseHomeSlydeResult {
  data: HomeSlyde
  hydrated: boolean
  isLoading: boolean
  error: Error | null
  // Mutations
  updateHomeSlyde: (updates: Partial<HomeSlyde>) => Promise<void>
  addCategory: (category: Omit<HomeSlydeCategory, 'id' | 'childSlydeId'>) => Promise<string>
  updateCategory: (categoryId: string, updates: Partial<HomeSlydeCategory>) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  reorderCategories: (categoryIds: string[]) => Promise<void>
  publishAll: () => Promise<void>
}

/**
 * useHomeSlyde - Supabase-backed hook for Home Slyde data
 *
 * Replaces useDemoHomeSlyde (localStorage) with real database storage.
 * Data model:
 * - Home settings stored in organizations table columns
 * - Categories are child slydes with metadata (icon, order_index, etc.)
 * - Each category's frames are in the frames table
 */
export function useHomeSlyde(): UseHomeSlydeResult {
  const { organization, isLoading: orgLoading, refetch: refetchOrg } = useOrganization()
  const { slydes, isLoading: slydesLoading, createSlyde, updateSlyde, deleteSlyde, publishSlyde, refetch: refetchSlydes } = useSlydes()
  const [homeSlyde, setHomeSlyde] = useState<HomeSlyde>(DEFAULT_HOME_SLYDE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const supabase = createClient()

  // Build home slyde from organization + slydes
  useEffect(() => {
    if (orgLoading || slydesLoading) return
    if (!organization) {
      setIsLoading(false)
      setHydrated(true)
      return
    }

    // Type assertion for extended org fields
    const org = organization as any

    // Build categories from child slydes (sorted by order_index)
    const extSlydes = slydes as ExtendedSlyde[]
    const sortedSlydes = [...extSlydes].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))

    const categories: HomeSlydeCategory[] = sortedSlydes.map(slyde => ({
      id: slyde.public_id,
      icon: slyde.icon || '✨',
      name: slyde.title,
      description: slyde.description || '',
      childSlydeId: slyde.public_id,
      hasInventory: slyde.has_inventory ?? false,
      inventoryCtaText: slyde.inventory_cta_text,
    }))

    // Build video URL from stream UID
    const videoSrc = org.home_video_stream_uid
      ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${org.home_video_stream_uid}/manifest/video.m3u8`
      : ''

    setHomeSlyde({
      backgroundType: org.home_background_type || 'video',
      videoSrc,
      imageSrc: org.home_image_src || undefined,
      posterSrc: org.home_video_poster_url || undefined,
      videoFilter: org.home_video_filter || 'original',
      videoVignette: org.home_video_vignette ?? false,
      videoSpeed: org.home_video_speed || 'normal',
      videoStartTime: org.home_video_start_time ?? 0,
      categories,
      primaryCta: org.home_primary_cta_text
        ? { text: org.home_primary_cta_text, action: org.home_primary_cta_action || '' }
        : undefined,
      showCategoryIcons: org.home_show_category_icons ?? false,
      showHearts: org.home_show_hearts ?? true,
      showShare: org.home_show_share ?? true,
      showSound: org.home_show_sound ?? true,
      showReviews: org.home_show_reviews ?? true,
      socialLinks: org.home_social_links || undefined,
      homeFAQs: org.home_faqs || [],
      faqInbox: org.home_faq_inbox || [],
      musicEnabled: org.home_audio_enabled ?? true,
      musicCustomUrl: org.home_audio_r2_key ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${org.home_audio_r2_key}` : null,
      childFrames: {},
      lists: [],
    })

    setIsLoading(false)
    setHydrated(true)
  }, [organization, orgLoading, slydes, slydesLoading])

  // Update home slyde (organization-level settings)
  const updateHomeSlyde = useCallback(async (updates: Partial<HomeSlyde>) => {
    if (!organization) return

    // Map HomeSlyde fields to organization columns
    const orgUpdates: Record<string, any> = {}

    if (updates.backgroundType !== undefined) orgUpdates.home_background_type = updates.backgroundType
    if (updates.imageSrc !== undefined) orgUpdates.home_image_src = updates.imageSrc || null
    if (updates.posterSrc !== undefined) orgUpdates.home_video_poster_url = updates.posterSrc || null
    if (updates.videoFilter !== undefined) orgUpdates.home_video_filter = updates.videoFilter
    if (updates.videoVignette !== undefined) orgUpdates.home_video_vignette = updates.videoVignette
    if (updates.videoSpeed !== undefined) orgUpdates.home_video_speed = updates.videoSpeed
    if (updates.videoStartTime !== undefined) orgUpdates.home_video_start_time = updates.videoStartTime
    if (updates.showCategoryIcons !== undefined) orgUpdates.home_show_category_icons = updates.showCategoryIcons
    if (updates.showHearts !== undefined) orgUpdates.home_show_hearts = updates.showHearts
    if (updates.showShare !== undefined) orgUpdates.home_show_share = updates.showShare
    if (updates.showSound !== undefined) orgUpdates.home_show_sound = updates.showSound
    if (updates.showReviews !== undefined) orgUpdates.home_show_reviews = updates.showReviews
    if (updates.socialLinks !== undefined) orgUpdates.home_social_links = updates.socialLinks || {}
    if (updates.homeFAQs !== undefined) orgUpdates.home_faqs = updates.homeFAQs
    if (updates.faqInbox !== undefined) orgUpdates.home_faq_inbox = updates.faqInbox

    if (updates.primaryCta !== undefined) {
      orgUpdates.home_primary_cta_text = updates.primaryCta?.text || null
      orgUpdates.home_primary_cta_action = updates.primaryCta?.action || null
    }

    // Only update if we have changes
    if (Object.keys(orgUpdates).length > 0) {
      const { error } = await supabase
        .from('organizations')
        .update(orgUpdates)
        .eq('id', organization.id)

      if (error) {
        // Log detailed error for debugging
        console.error('Supabase update error:', error.message, error.code, error.details)
        // If the error is about missing columns, the migration hasn't been run yet
        if (error.message?.includes('column') || error.code === '42703') {
          console.warn('Migration 027 may not be applied yet. Some home settings will not persist.')
        } else {
          throw new Error(`Failed to update home settings: ${error.message}`)
        }
      }
    }

    // Update local state (always, even if DB update fails)
    setHomeSlyde(prev => ({ ...prev, ...updates }))
  }, [organization, supabase])

  // Add a new category (creates a child slyde)
  const addCategory = useCallback(async (category: Omit<HomeSlydeCategory, 'id' | 'childSlydeId'>): Promise<string> => {
    if (!organization) throw new Error('No organization')

    // Generate a URL-safe public_id
    const publicId = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      || `slyde-${Date.now()}`

    // Get next order index
    const maxOrder = Math.max(...slydes.map((s: any) => s.order_index ?? 0), -1)

    const { data: newSlyde, error } = await supabase
      .from('slydes')
      .insert({
        organization_id: organization.id,
        public_id: publicId,
        title: category.name,
        description: category.description || '',
        icon: category.icon || '✨',
        order_index: maxOrder + 1,
        has_inventory: category.hasInventory ?? false,
        inventory_cta_text: category.inventoryCtaText || null,
        published: false,
      })
      .select()
      .single()

    if (error) throw error
    if (!newSlyde) throw new Error('Failed to create slyde')

    // Refetch slydes to update local state
    await refetchSlydes()

    return newSlyde.public_id
  }, [organization, slydes, supabase, refetchSlydes])

  // Update category (updates child slyde)
  const updateCategory = useCallback(async (categoryPublicId: string, updates: Partial<HomeSlydeCategory>) => {
    const slyde = slydes.find(s => s.public_id === categoryPublicId)
    if (!slyde) return

    const slydeUpdates: Record<string, any> = {}
    if (updates.name !== undefined) slydeUpdates.title = updates.name
    if (updates.description !== undefined) slydeUpdates.description = updates.description
    if (updates.icon !== undefined) slydeUpdates.icon = updates.icon
    if (updates.hasInventory !== undefined) slydeUpdates.has_inventory = updates.hasInventory
    if (updates.inventoryCtaText !== undefined) slydeUpdates.inventory_cta_text = updates.inventoryCtaText

    await updateSlyde(slyde.id, slydeUpdates as any)
  }, [slydes, updateSlyde])

  // Delete category
  const deleteCategory = useCallback(async (categoryPublicId: string) => {
    const slyde = slydes.find(s => s.public_id === categoryPublicId)
    if (!slyde) return
    await deleteSlyde(slyde.id)
  }, [slydes, deleteSlyde])

  // Reorder categories
  const reorderCategories = useCallback(async (categoryPublicIds: string[]) => {
    const updates = categoryPublicIds.map((publicId, index) => {
      const slyde = slydes.find(s => s.public_id === publicId)
      return slyde ? { id: slyde.id, order_index: index } : null
    }).filter(Boolean)

    await Promise.all(
      updates.map(u => u && supabase.from('slydes').update({ order_index: u.order_index }).eq('id', u.id))
    )

    await refetchSlydes()
  }, [slydes, supabase, refetchSlydes])

  // Publish all slydes
  const publishAll = useCallback(async () => {
    await Promise.all(slydes.map(s => publishSlyde(s.id, true)))
  }, [slydes, publishSlyde])

  return {
    data: homeSlyde,
    hydrated,
    isLoading,
    error,
    updateHomeSlyde,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    publishAll,
  }
}
