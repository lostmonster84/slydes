'use client'

import { useCallback } from 'react'
import { useDemoHomeSlyde, writeChildFAQs, readChildFAQs } from '@/lib/demoHomeSlyde'
import type { FAQItem } from '@/components/slyde-demo'

interface UseFAQsResult {
  faqs: FAQItem[]
  isLoading: boolean
  // FAQ mutations
  addFAQ: (faq: Omit<FAQItem, 'id'>) => string
  updateFAQ: (faqId: string, updates: Partial<FAQItem>) => void
  deleteFAQ: (faqId: string) => void
  reorderFAQs: (fromIndex: number, toIndex: number) => void
}

/**
 * useFAQs - Hook for managing FAQs per category (Child Slyde)
 *
 * FAQs are stored per-category and displayed in InfoSheet.
 * Currently uses localStorage via useDemoHomeSlyde.
 * Will be migrated to Supabase in the future.
 *
 * @param categoryId - The category ID to manage FAQs for (null = no category selected)
 */
export function useFAQs(categoryId: string | null): UseFAQsResult {
  const { data, hydrated } = useDemoHomeSlyde()
  const faqs = categoryId ? (data.childFAQs?.[categoryId] ?? []) : []

  // Use fresh reads from localStorage to avoid stale closure issues
  const addFAQ = useCallback((faq: Omit<FAQItem, 'id'>): string => {
    if (!categoryId) return ''
    const currentFaqs = readChildFAQs(categoryId)
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
    }
    writeChildFAQs(categoryId, [...currentFaqs, newFaq])
    return newFaq.id
  }, [categoryId])

  const updateFAQ = useCallback((faqId: string, updates: Partial<FAQItem>) => {
    if (!categoryId) return
    const currentFaqs = readChildFAQs(categoryId)
    writeChildFAQs(
      categoryId,
      currentFaqs.map(f => f.id === faqId ? { ...f, ...updates } : f)
    )
  }, [categoryId])

  const deleteFAQ = useCallback((faqId: string) => {
    if (!categoryId) return
    const currentFaqs = readChildFAQs(categoryId)
    writeChildFAQs(
      categoryId,
      currentFaqs.filter(f => f.id !== faqId)
    )
  }, [categoryId])

  const reorderFAQs = useCallback((fromIndex: number, toIndex: number) => {
    if (!categoryId || fromIndex === toIndex) return
    const currentFaqs = readChildFAQs(categoryId)
    const newFaqs = [...currentFaqs]
    const [moved] = newFaqs.splice(fromIndex, 1)
    newFaqs.splice(toIndex, 0, moved)
    writeChildFAQs(categoryId, newFaqs)
  }, [categoryId])

  return {
    faqs,
    isLoading: !hydrated,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
  }
}
