'use client'

import { useCallback } from 'react'
import { useDemoHomeSlyde, writeHomeFAQs, readHomeFAQs } from '@/lib/demoHomeSlyde'
import type { FAQItem } from '@/components/slyde-demo'

interface UseHomeFAQsResult {
  faqs: FAQItem[]
  isLoading: boolean
  // FAQ mutations
  addFAQ: (faq: Omit<FAQItem, 'id'>) => string
  updateFAQ: (faqId: string, updates: Partial<FAQItem>) => void
  deleteFAQ: (faqId: string) => void
  reorderFAQs: (fromIndex: number, toIndex: number) => void
}

/**
 * useHomeFAQs - Hook for managing Home-level FAQs
 *
 * FAQs shown in the Home InfoSheet (business-wide questions).
 * Currently uses localStorage via useDemoHomeSlyde.
 * Will be migrated to Supabase in the future.
 */
export function useHomeFAQs(): UseHomeFAQsResult {
  const { data, hydrated } = useDemoHomeSlyde()
  const faqs = data.homeFAQs ?? []

  // Use fresh reads from localStorage to avoid stale closure issues
  const addFAQ = useCallback((faq: Omit<FAQItem, 'id'>): string => {
    const currentFaqs = readHomeFAQs()
    const newFaq: FAQItem = {
      ...faq,
      id: `home-faq-${Date.now()}`,
    }
    writeHomeFAQs([...currentFaqs, newFaq])
    return newFaq.id
  }, [])

  const updateFAQ = useCallback((faqId: string, updates: Partial<FAQItem>) => {
    const currentFaqs = readHomeFAQs()
    writeHomeFAQs(
      currentFaqs.map(f => f.id === faqId ? { ...f, ...updates } : f)
    )
  }, [])

  const deleteFAQ = useCallback((faqId: string) => {
    const currentFaqs = readHomeFAQs()
    writeHomeFAQs(currentFaqs.filter(f => f.id !== faqId))
  }, [])

  const reorderFAQs = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const currentFaqs = readHomeFAQs()
    const newFaqs = [...currentFaqs]
    const [moved] = newFaqs.splice(fromIndex, 1)
    newFaqs.splice(toIndex, 0, moved)
    writeHomeFAQs(newFaqs)
  }, [])

  return {
    faqs,
    isLoading: !hydrated,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
  }
}
