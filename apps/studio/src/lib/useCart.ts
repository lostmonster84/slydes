'use client'

import { useState, useEffect, useCallback } from 'react'
import type { InventoryItem } from '@/components/home-slyde/data/highlandMotorsData'

/**
 * Cart item with quantity tracking
 */
export interface CartItem {
  id: string
  title: string
  subtitle: string
  price: string
  price_cents: number
  quantity: number
  image?: string
}

/**
 * Cart state and actions
 */
export interface CartState {
  items: CartItem[]
  itemCount: number
  totalCents: number
  totalFormatted: string
}

export interface CartActions {
  addItem: (item: InventoryItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

export type UseCartResult = CartState & CartActions & {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CART_STORAGE_KEY = 'slydes_cart'

/**
 * Parse price string to cents
 * "£28,995" -> 2899500
 * "$45.00" -> 4500
 */
function parsePriceToCents(price: string): number {
  // Remove currency symbols and commas, keep digits and decimal
  const cleaned = price.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  if (isNaN(num)) return 0
  // If no decimal, assume whole pounds/dollars
  if (!cleaned.includes('.')) {
    return Math.round(num * 100)
  }
  return Math.round(num * 100)
}

/**
 * Format cents to currency string
 */
function formatCents(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`
}

/**
 * useCart - Global cart hook with localStorage persistence
 *
 * Cart persists across page navigation and browser sessions.
 * Syncs across tabs via storage events.
 */
export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage when items change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('slydes-cart-update', { detail: items }))
    } catch {
      // Ignore storage errors
    }
  }, [items, hydrated])

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            setItems(parsed)
          }
        } catch {
          // Ignore
        }
      }
    }

    const handleCustom = (e: CustomEvent<CartItem[]>) => {
      setItems(e.detail)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('slydes-cart-update', handleCustom as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('slydes-cart-update', handleCustom as EventListener)
    }
  }, [])

  // Add item to cart
  const addItem = useCallback((item: InventoryItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        // Increase quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      // Add new item
      const priceCents = item.price_cents || parsePriceToCents(item.price)
      return [
        ...prev,
        {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          price: item.price,
          price_cents: priceCents,
          quantity: 1,
          image: item.image,
        },
      ]
    })
    // Toast notification handles feedback - don't auto-open drawer
  }, [])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  // Update quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      )
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([])
    setIsOpen(false)
  }, [])

  // Computed values
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalCents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0)
  const totalFormatted = formatCents(totalCents)

  return {
    items,
    itemCount,
    totalCents,
    totalFormatted,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
  }
}
