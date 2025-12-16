'use client'

import { useEffect, useState, useCallback } from 'react'
import { useDemoHomeSlyde, writeDemoHomeSlyde } from '@/lib/demoHomeSlyde'
import type { ListData, ListItem, FrameData } from '@/components/slyde-demo/frameData'

interface UseListsResult {
  lists: ListData[]
  isLoading: boolean
  // List mutations
  addList: (list: Omit<ListData, 'id'>) => string
  updateList: (listId: string, updates: Partial<ListData>) => void
  deleteList: (listId: string) => void
  reorderLists: (fromIndex: number, toIndex: number) => void
  // Item mutations
  addItem: (listId: string, item: Omit<ListItem, 'id'>) => string
  updateItem: (listId: string, itemId: string, updates: Partial<ListItem>) => void
  deleteItem: (listId: string, itemId: string) => void
  reorderItems: (listId: string, fromIndex: number, toIndex: number) => void
  // Frame mutations (for Item Frames - recursive editing)
  addItemFrame: (listId: string, itemId: string, frame?: Partial<Omit<FrameData, 'id' | 'order'>>) => string
  updateItemFrame: (listId: string, itemId: string, frameId: string, updates: Partial<FrameData>) => void
  deleteItemFrame: (listId: string, itemId: string, frameId: string) => boolean // returns false if last frame
  reorderItemFrames: (listId: string, itemId: string, fromIndex: number, toIndex: number) => void
}

/**
 * useLists - Hook for managing Lists (inventory/products)
 *
 * Currently uses localStorage via useDemoHomeSlyde.
 * Will be migrated to Supabase in the future.
 */
export function useLists(): UseListsResult {
  const { data, hydrated } = useDemoHomeSlyde()
  const lists = data.lists ?? []

  const addList = useCallback((list: Omit<ListData, 'id'>): string => {
    const newList: ListData = {
      ...list,
      id: `list-${Date.now()}`,
      items: list.items ?? [],
    }
    writeDemoHomeSlyde({
      ...data,
      lists: [...lists, newList],
    })
    return newList.id
  }, [data, lists])

  const updateList = useCallback((listId: string, updates: Partial<ListData>) => {
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId ? { ...l, ...updates } : l),
    })
  }, [data, lists])

  const deleteList = useCallback((listId: string) => {
    writeDemoHomeSlyde({
      ...data,
      lists: lists.filter(l => l.id !== listId),
    })
  }, [data, lists])

  const addItem = useCallback((listId: string, item: Omit<ListItem, 'id'>): string => {
    const newItem: ListItem = {
      ...item,
      id: `item-${Date.now()}`,
    }
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? { ...l, items: [...l.items, newItem] }
        : l
      ),
    })
    return newItem.id
  }, [data, lists])

  const updateItem = useCallback((listId: string, itemId: string, updates: Partial<ListItem>) => {
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
        : l
      ),
    })
  }, [data, lists])

  const deleteItem = useCallback((listId: string, itemId: string) => {
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? { ...l, items: l.items.filter(i => i.id !== itemId) }
        : l
      ),
    })
  }, [data, lists])

  const reorderLists = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const newLists = [...lists]
    const [moved] = newLists.splice(fromIndex, 1)
    newLists.splice(toIndex, 0, moved)
    writeDemoHomeSlyde({
      ...data,
      lists: newLists,
    })
  }, [data, lists])

  const reorderItems = useCallback((listId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => {
        if (l.id !== listId) return l
        const newItems = [...l.items]
        const [moved] = newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, moved)
        return { ...l, items: newItems }
      }),
    })
  }, [data, lists])

  // =============================================
  // FRAME CRUD (for Item Frames - recursive editing)
  // =============================================

  const addItemFrame = useCallback((listId: string, itemId: string, frame?: Partial<Omit<FrameData, 'id' | 'order'>>): string => {
    const list = lists.find(l => l.id === listId)
    const item = list?.items.find(i => i.id === itemId)
    const existingFrames = item?.frames ?? []

    const newFrame: FrameData = {
      title: 'New Frame',
      templateType: 'custom',
      heartCount: 0,
      faqCount: 0,
      background: { type: 'image', src: '' },
      accentColor: '#2563EB',
      ...frame,
      id: `frame-${Date.now()}`,
      order: existingFrames.length,
    }

    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? {
            ...l,
            items: l.items.map(i => i.id === itemId
              ? { ...i, frames: [...(i.frames ?? []), newFrame] }
              : i
            )
          }
        : l
      ),
    })
    return newFrame.id
  }, [data, lists])

  const updateItemFrame = useCallback((listId: string, itemId: string, frameId: string, updates: Partial<FrameData>) => {
    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? {
            ...l,
            items: l.items.map(i => i.id === itemId
              ? {
                  ...i,
                  frames: (i.frames ?? []).map(f => f.id === frameId ? { ...f, ...updates } : f)
                }
              : i
            )
          }
        : l
      ),
    })
  }, [data, lists])

  const deleteItemFrame = useCallback((listId: string, itemId: string, frameId: string): boolean => {
    const list = lists.find(l => l.id === listId)
    const item = list?.items.find(i => i.id === itemId)
    const existingFrames = item?.frames ?? []

    // Prevent deleting last frame
    if (existingFrames.length <= 1) return false

    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => l.id === listId
        ? {
            ...l,
            items: l.items.map(i => i.id === itemId
              ? {
                  ...i,
                  frames: (i.frames ?? []).filter(f => f.id !== frameId).map((f, idx) => ({ ...f, order: idx }))
                }
              : i
            )
          }
        : l
      ),
    })
    return true
  }, [data, lists])

  const reorderItemFrames = useCallback((listId: string, itemId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    writeDemoHomeSlyde({
      ...data,
      lists: lists.map(l => {
        if (l.id !== listId) return l
        return {
          ...l,
          items: l.items.map(i => {
            if (i.id !== itemId) return i
            const newFrames = [...(i.frames ?? [])]
            const [moved] = newFrames.splice(fromIndex, 1)
            newFrames.splice(toIndex, 0, moved)
            // Update order property
            return { ...i, frames: newFrames.map((f, idx) => ({ ...f, order: idx })) }
          })
        }
      }),
    })
  }, [data, lists])

  return {
    lists,
    isLoading: !hydrated,
    addList,
    updateList,
    deleteList,
    reorderLists,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    // Frame mutations
    addItemFrame,
    updateItemFrame,
    deleteItemFrame,
    reorderItemFrames,
  }
}
