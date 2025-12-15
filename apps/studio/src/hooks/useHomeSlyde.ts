'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'
import { useSlydes } from './useSlydes'
import { useFrames } from './useFrames'
import type { FrameData } from '@/components/slyde-demo/frameData'

// Types matching the demo data structure for backwards compatibility
export type HomeSlydeCategory = {
  id: string
  icon: string
  name: string
  description: string
  childSlydeId: string
  hasInventory?: boolean
  inventoryCtaText?: string
}

export type HomeSlyde = {
  videoSrc: string
  posterSrc?: string
  categories: HomeSlydeCategory[]
  primaryCta?: {
    text: string
    action: string
  }
  showCategoryIcons?: boolean
  showHearts?: boolean
  showShare?: boolean
  showSound?: boolean
  showReviews?: boolean
  childFrames?: Record<string, FrameData[]>
}

const DEFAULT_HOME_SLYDE: HomeSlyde = {
  videoSrc: '',
  posterSrc: undefined,
  categories: [],
  primaryCta: undefined,
  showCategoryIcons: false,
  showHearts: true,
  showShare: true,
  showSound: true,
  showReviews: true,
  childFrames: {},
}

interface UseHomeSlydeResult {
  data: HomeSlyde
  hydrated: boolean
  isLoading: boolean
  error: Error | null
  // Mutations
  updateHomeSlyde: (updates: Partial<HomeSlyde>) => Promise<void>
  addCategory: (category: Omit<HomeSlydeCategory, 'id'>) => Promise<string>
  updateCategory: (categoryId: string, updates: Partial<HomeSlydeCategory>) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  reorderCategories: (categoryIds: string[]) => Promise<void>
}

/**
 * useHomeSlyde - Supabase-backed hook for Home Slyde data
 *
 * This replaces useDemoHomeSlyde with real database storage.
 * Data model:
 * - Home video comes from organization.home_video_stream_uid
 * - Categories are child slydes with type='category'
 * - Each category's frames are in the frames table
 */
export function useHomeSlyde(): UseHomeSlydeResult {
  const { organization, isLoading: orgLoading } = useOrganization()
  const { slydes, isLoading: slydesLoading, createSlyde, updateSlyde, deleteSlyde } = useSlydes()
  const [homeSlyde, setHomeSlyde] = useState<HomeSlyde>(DEFAULT_HOME_SLYDE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Track child frames for all categories
  const [allChildFrames, setAllChildFrames] = useState<Record<string, FrameData[]>>({})

  // Build home slyde from organization + slydes
  useEffect(() => {
    if (orgLoading || slydesLoading) return
    if (!organization) {
      setIsLoading(false)
      setHydrated(true)
      return
    }

    // Find the home slyde (type = 'home' or first published slyde)
    const homeType = slydes.find(s => s.title === 'Home') // MVP: assume 'Home' titled slyde

    // Categories are child slydes (not home)
    const categorySlydes = slydes.filter(s => s.title !== 'Home')

    // Build categories from child slydes
    const categories: HomeSlydeCategory[] = categorySlydes.map(slyde => ({
      id: slyde.id,
      icon: 'sparkles', // TODO: Store icon in slyde metadata
      name: slyde.title,
      description: slyde.description || '',
      childSlydeId: slyde.id,
      hasInventory: false, // TODO: Store in metadata
      inventoryCtaText: undefined,
    }))

    setHomeSlyde({
      videoSrc: organization.home_video_stream_uid
        ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${organization.home_video_stream_uid}/manifest/video.m3u8`
        : '',
      posterSrc: organization.home_video_poster_url || undefined,
      categories,
      primaryCta: undefined, // TODO: Store in organization metadata
      showCategoryIcons: false,
      showHearts: true,
      showShare: true,
      showSound: true,
      showReviews: true,
      childFrames: allChildFrames,
    })

    setIsLoading(false)
    setHydrated(true)
  }, [organization, orgLoading, slydes, slydesLoading, allChildFrames])

  // Update home slyde (organization-level settings)
  const updateHomeSlyde = useCallback(async (updates: Partial<HomeSlyde>) => {
    if (!organization) return
    const supabase = createClient()

    // Update organization for video/poster
    if (updates.videoSrc !== undefined || updates.posterSrc !== undefined) {
      const { error } = await supabase
        .from('organizations')
        .update({
          // TODO: Upload video to Cloudflare, store stream UID
          home_video_poster_url: updates.posterSrc || null,
        })
        .eq('id', organization.id)

      if (error) throw error
    }

    // Update local state optimistically
    setHomeSlyde(prev => ({ ...prev, ...updates }))
  }, [organization])

  // Add a new category (creates a child slyde)
  const addCategory = useCallback(async (category: Omit<HomeSlydeCategory, 'id'>): Promise<string> => {
    // Generate a URL-safe public_id from the name
    const publicId = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      || `category-${Date.now()}`

    const newSlyde = await createSlyde({
      public_id: publicId,
      title: category.name,
      description: category.description,
    })
    if (!newSlyde) throw new Error('Failed to create slyde')
    return newSlyde.id
  }, [createSlyde])

  // Update category (updates child slyde)
  const updateCategory = useCallback(async (categoryId: string, updates: Partial<HomeSlydeCategory>) => {
    await updateSlyde(categoryId, {
      title: updates.name,
      description: updates.description,
    })
  }, [updateSlyde])

  // Delete category (deletes child slyde and its frames)
  const deleteCategoryFn = useCallback(async (categoryId: string) => {
    await deleteSlyde(categoryId)
  }, [deleteSlyde])

  // Reorder categories (update order in slydes table)
  const reorderCategories = useCallback(async (categoryIds: string[]) => {
    // TODO: Add order column to slydes table
    // For now, this is a no-op
  }, [])

  return {
    data: homeSlyde,
    hydrated,
    isLoading,
    error,
    updateHomeSlyde,
    addCategory,
    updateCategory,
    deleteCategory: deleteCategoryFn,
    reorderCategories,
  }
}
