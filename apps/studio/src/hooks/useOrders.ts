'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrganization } from './useOrganization'

export interface OrderLineItem {
  id: string
  title: string
  subtitle?: string
  price: string
  price_cents: number
  quantity: number
}

export interface Order {
  id: string
  organization_id: string
  stripe_checkout_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string | null
  customer_name: string | null
  line_items: OrderLineItem[]
  subtotal_cents: number
  platform_fee_cents: number
  seller_payout_cents: number
  currency: string
  status: 'paid' | 'fulfilled' | 'refunded' | 'cancelled'
  fulfilled_at: string | null
  created_at: string
  updated_at: string
}

export interface OrderStats {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  pendingFulfillment: number
}

interface UseOrdersReturn {
  orders: Order[]
  stats: OrderStats
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
}

export function useOrders(): UseOrdersReturn {
  const { organization, isLoading: orgLoading } = useOrganization()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    if (!organization) {
      setOrders([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'))
    } finally {
      setIsLoading(false)
    }
  }, [organization, supabase])

  // Fetch on mount and when organization changes
  useEffect(() => {
    if (!orgLoading) {
      fetchOrders()
    }
  }, [organization, orgLoading, fetchOrders])

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    const updates: Partial<Order> = { status }

    // If marking as fulfilled, set the timestamp
    if (status === 'fulfilled') {
      updates.fulfilled_at = new Date().toISOString()
    }

    const { data, error: updateError } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) throw updateError

    setOrders(prev => prev.map(o => o.id === orderId ? data : o))
  }, [supabase])

  // Calculate stats
  const stats: OrderStats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.seller_payout_cents, 0),
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0
      ? Math.round(orders.reduce((sum, order) => sum + order.subtotal_cents, 0) / orders.length)
      : 0,
    pendingFulfillment: orders.filter(o => o.status === 'paid').length,
  }

  return {
    orders,
    stats,
    isLoading: orgLoading || isLoading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  }
}

/**
 * Format cents to currency string
 */
export function formatCurrency(cents: number, currency: string = 'gbp'): string {
  const amount = cents / 100
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  })
  return formatter.format(amount)
}

/**
 * Format date to relative or absolute string
 */
export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
