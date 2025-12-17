'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useOrders, formatCurrency, formatOrderDate, type Order } from '@/hooks/useOrders'
import { usePlan } from '@/hooks/usePlan'
import {
  ArrowLeft,
  Receipt,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ChevronRight,
  RefreshCw,
  Lock,
  Sparkles,
} from 'lucide-react'

/**
 * Shop Orders — Order Management Dashboard
 *
 * Lists all orders placed through Slydes.
 * Shows revenue stats, order history, and fulfillment status.
 * Requires Creator plan - redirects to /shop if not subscribed.
 */

export default function ShopOrdersPage() {
  const router = useRouter()
  const { orders, stats, isLoading, refetch } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { isFree, isPro } = usePlan()

  // Redirect to shop (which shows teaser) if not on Creator plan
  useEffect(() => {
    if (isFree) {
      router.push('/shop')
    }
  }, [isFree, router])

  // Show nothing while checking plan or if free
  if (isFree) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="shop" />

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                  Orders
                </h1>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
              title="Refresh orders"
            >
              <RefreshCw className={`w-5 h-5 text-gray-500 dark:text-white/60 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Revenue"
                  value={formatCurrency(stats.totalRevenue)}
                  sublabel="Total revenue"
                  icon={DollarSign}
                  iconColor="text-emerald-500"
                  iconBg="bg-emerald-500/10"
                />
                <StatCard
                  label="Orders"
                  value={stats.totalOrders.toString()}
                  sublabel="Total orders"
                  icon={Receipt}
                  iconColor="text-blue-500"
                  iconBg="bg-blue-500/10"
                />
                <StatCard
                  label="AOV"
                  value={stats.totalOrders > 0 ? formatCurrency(stats.averageOrderValue) : '—'}
                  sublabel="Average order value"
                  icon={TrendingUp}
                  iconColor="text-purple-500"
                  iconBg="bg-purple-500/10"
                />
                <StatCard
                  label="Pending"
                  value={stats.pendingFulfillment.toString()}
                  sublabel="Awaiting fulfillment"
                  icon={Clock}
                  iconColor="text-amber-500"
                  iconBg="bg-amber-500/10"
                />
              </div>

              {/* Orders List */}
              {isLoading ? (
                <div className="text-center py-16">
                  <RefreshCw className="w-8 h-8 text-gray-400 dark:text-white/40 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-white/50">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="divide-y divide-gray-200 dark:divide-white/10">
                    {orders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onClick={() => setSelectedOrder(order)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Order Detail Slide-over */}
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Sub-components
------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string
  value: string
  sublabel: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-white/50">{label}</p>
          <p className="mt-1 text-2xl font-display font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-white/40">{sublabel}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center dark:bg-white/10">
        <Receipt className="w-10 h-10 text-gray-400 dark:text-white/40" />
      </div>
      <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
        No orders yet
      </h2>
      <p className="text-gray-500 dark:text-white/50 mb-6 max-w-sm mx-auto">
        When customers purchase products through your Slydes, orders will appear here.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      >
        <ShoppingBag className="w-4 h-4" />
        Back to Shop
      </Link>
    </div>
  )
}

function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
  const itemCount = order.line_items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors dark:hover:bg-white/5 flex items-center gap-4"
    >
      {/* Status indicator */}
      <div className="shrink-0">
        <StatusBadge status={order.status} />
      </div>

      {/* Order info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {order.customer_name || order.customer_email || 'Customer'}
          </span>
          <span className="text-xs text-gray-400 dark:text-white/40">
            {formatOrderDate(order.created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-white/50 truncate">
          {itemCount} item{itemCount !== 1 ? 's' : ''} •{' '}
          {order.line_items.map((item) => item.title).join(', ')}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(order.subtotal_cents, order.currency)}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/40 shrink-0" />
    </button>
  )
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const config = {
    paid: {
      icon: Clock,
      label: 'Paid',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    },
    fulfilled: {
      icon: CheckCircle2,
      label: 'Fulfilled',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
    refunded: {
      icon: XCircle,
      label: 'Refunded',
      className: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60',
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    },
  }

  const { icon: Icon, label, className } = config[status]

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  )
}

function OrderDetailPanel({ order, onClose }: { order: Order; onClose: () => void }) {
  const { updateOrderStatus } = useOrders()
  const [updating, setUpdating] = useState(false)

  const handleMarkFulfilled = async () => {
    setUpdating(true)
    try {
      await updateOrderStatus(order.id, 'fulfilled')
    } catch (err) {
      console.error('Failed to update order:', err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#2c2c2e] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Details</h2>
            <p className="text-sm text-gray-500 dark:text-white/50">
              {formatOrderDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-2">Status</h3>
            <StatusBadge status={order.status} />
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-2">Customer</h3>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.customer_name || 'Guest'}
            </p>
            {order.customer_email && (
              <p className="text-sm text-gray-500 dark:text-white/50">{order.customer_email}</p>
            )}
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-3">Items</h3>
            <div className="space-y-3">
              {order.line_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-gray-400 dark:text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white/50">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(order.subtotal_cents, order.currency)}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40">
              You keep 100% — Slydes takes no commission
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        {order.status === 'paid' && (
          <div className="p-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={handleMarkFulfilled}
              disabled={updating}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              Mark as Fulfilled
            </button>
          </div>
        )}
      </div>
    </>
  )
}
