'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { DevicePreview } from '@/components/slyde-demo/DevicePreview'
import { HomeSlydeViewer } from '@/components/home-slyde/HomeSlydeViewer'
import { useOrders, formatCurrency } from '@/hooks/useOrders'
import { useCart } from '@/lib/useCart'
import { useEffectivePlan } from '@/hooks/useEffectivePlan'
import { UpgradeModal } from '@/components/billing/UpgradeModal'
import {
  Package,
  ShoppingCart,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Receipt,
  Clock,
  ChevronRight,
  Lock,
  Sparkles,
} from 'lucide-react'

/**
 * Shop Dashboard — Commerce Overview
 *
 * This page lets businesses:
 * - View products with commerce enabled (buy now / add to cart)
 * - See cart analytics
 * - Manage orders
 *
 * Shows teaser/upgrade prompt when not on Pro plan.
 * Cart is global across all Slydes per organization.
 */

export default function ShopPage() {
  const { canAccessCommerce, isLoading } = useEffectivePlan()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  // If not subscribed to Pro, show the teaser/upgrade page
  if (!canAccessCommerce) {
    return (
      <>
        <ShopTeaser onUpgrade={() => setShowUpgradeModal(true)} />
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          targetTier="pro"
          feature="Shop"
        />
      </>
    )
  }

  // Pro users see the full dashboard
  return <ShopDashboard />
}

/**
 * Teaser shown to free/creator users - marketing content about Shop features
 */
function ShopTeaser({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="shop" />

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Shop</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Products, orders & cart analytics</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl">
              {/* Hero */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 mb-6 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                    <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-cyan-300">Global Cart</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                    Sell products directly from your Slydes
                  </h2>

                  <p className="text-lg text-gray-600 dark:text-white/60 mb-8">
                    Add to cart buttons on any item. Customers can browse multiple Slydes, add products, and checkout in one go.
                  </p>

                  {/* Feature bullets */}
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Package, title: 'Any product, any Slyde', desc: 'Enable commerce on inventory items across all your content' },
                      { icon: ShoppingCart, title: 'Global cart', desc: 'Cart persists as users browse — no lost sales' },
                      { icon: DollarSign, title: 'Simple checkout', desc: 'Stripe-powered payments, zero friction' },
                      { icon: TrendingUp, title: 'Cart analytics', desc: 'See what gets added, abandoned, and purchased' },
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 dark:bg-white/10">
                          <feature.icon className="w-5 h-5 text-gray-600 dark:text-white/60" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{feature.title}</div>
                          <div className="text-sm text-gray-500 dark:text-white/50">{feature.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={onUpgrade}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                  >
                    <Lock className="w-4 h-4" />
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="mt-3 text-sm text-gray-500 dark:text-white/50">£50/month • Cancel anytime</p>
                </div>

                {/* Right: Phone Preview */}
                <div className="hidden md:flex justify-center lg:justify-start lg:pl-8">
                  <DevicePreview enableTilt={false}>
                    <HomeSlydeViewer />
                  </DevicePreview>
                </div>
              </div>

              {/* Blurred Stats Preview */}
              <div className="mt-16">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-gray-400 dark:text-white/40" />
                  <span className="text-sm font-medium text-gray-500 dark:text-white/50">Unlock with Pro plan</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 blur-[2px] pointer-events-none select-none">
                  <div className="p-6 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-sm text-gray-500 dark:text-white/50">Revenue</div>
                    <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">£2,450</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-white/40">After platform fee</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-sm text-gray-500 dark:text-white/50">Orders</div>
                    <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">47</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-white/40">This month</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-sm text-gray-500 dark:text-white/50">Conversion rate</div>
                    <div className="mt-1 text-3xl font-display font-bold text-gray-900 dark:text-white">8.2%</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-white/40">Cart → Checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}

/**
 * Full dashboard shown to Pro plan users
 */
function ShopDashboard() {
  const cart = useCart()
  const { orders, stats, isLoading } = useOrders()

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3)
  const hasOrders = orders.length > 0

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        {/* Sidebar */}
        <HQSidebarConnected activePage="shop" />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Shop</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">Products, orders & cart analytics</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Revenue"
                  value={hasOrders ? formatCurrency(stats.totalRevenue) : '—'}
                  sublabel={hasOrders ? 'After platform fee' : 'No sales yet'}
                  icon={DollarSign}
                  iconColor="text-emerald-500"
                  iconBg="bg-emerald-500/10"
                  href="/shop/orders"
                />
                <StatCard
                  label="Orders"
                  value={stats.totalOrders.toString()}
                  sublabel="Total orders"
                  icon={Receipt}
                  iconColor="text-blue-500"
                  iconBg="bg-blue-500/10"
                  href="/shop/orders"
                />
                <StatCard
                  label="Cart Items"
                  value={cart.itemCount > 0 ? cart.itemCount.toString() : '—'}
                  sublabel={cart.itemCount > 0 ? `Total: ${cart.totalFormatted}` : 'Demo cart empty'}
                  icon={ShoppingCart}
                  iconColor="text-cyan-500"
                  iconBg="bg-cyan-500/10"
                />
                <StatCard
                  label="Pending"
                  value={stats.pendingFulfillment.toString()}
                  sublabel="Awaiting fulfillment"
                  icon={Clock}
                  iconColor="text-blue-500"
                  iconBg="bg-blue-500/10"
                  href="/shop/orders"
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Recent Orders or Empty State */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                    {hasOrders && (
                      <Link
                        href="/shop/orders"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
                      >
                        View all
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10">
                      <p className="text-center text-gray-500 dark:text-white/50">Loading...</p>
                    </div>
                  ) : hasOrders ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10">
                      <div className="divide-y divide-gray-200 dark:divide-white/10">
                        {recentOrders.map((order) => {
                          const itemCount = order.line_items.reduce((sum, item) => sum + item.quantity, 0)
                          return (
                            <Link
                              key={order.id}
                              href="/shop/orders"
                              className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors dark:hover:bg-white/5"
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                order.status === 'paid'
                                  ? 'bg-blue-100 dark:bg-blue-500/15'
                                  : 'bg-emerald-100 dark:bg-emerald-500/15'
                              }`}>
                                {order.status === 'paid' ? (
                                  <Clock className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                                ) : (
                                  <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                  {order.customer_name || order.customer_email || 'Customer'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-white/50">
                                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(order.subtotal_cents, order.currency)}
                              </p>
                              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/40" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center dark:bg-white/10">
                        <Receipt className="w-8 h-8 text-gray-400 dark:text-white/40" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No orders yet</h3>
                      <p className="text-sm text-gray-500 dark:text-white/50 mb-4">
                        Orders will appear here when customers checkout
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400"
                      >
                        Set up a product
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Link
                      href="/shop/orders"
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-cyan-500/30 dark:hover:bg-cyan-500/5"
                    >
                      <Receipt className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                      <span className="font-medium text-gray-900 dark:text-white">All Orders</span>
                    </Link>
                    <Link
                      href="/shop/products"
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors dark:bg-[#2c2c2e] dark:border-white/10 dark:hover:border-cyan-500/30 dark:hover:bg-cyan-500/5"
                    >
                      <Package className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Products</span>
                    </Link>
                  </div>
                </div>

                {/* Right: Phone Preview */}
                <div className="hidden lg:flex justify-center">
                  <DevicePreview enableTilt={false}>
                    <HomeSlydeViewer />
                  </DevicePreview>
                </div>
              </div>

              {/* Feature bullets */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Package, title: 'Any product, any Slyde', desc: 'Enable commerce on inventory items' },
                  { icon: ShoppingCart, title: 'Global cart', desc: 'Cart persists across all Slydes' },
                  { icon: DollarSign, title: 'Simple checkout', desc: 'Stripe-powered, zero friction' },
                  { icon: TrendingUp, title: 'Track performance', desc: 'Revenue, orders, and AOV stats' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 dark:bg-white/10">
                      <feature.icon className="w-5 h-5 text-gray-600 dark:text-white/60" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</div>
                      <div className="text-xs text-gray-500 dark:text-white/50">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  iconColor,
  iconBg,
  href,
}: {
  label: string
  value: string
  sublabel: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  href?: string
}) {
  const content = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-white/50">{label}</p>
        <p className={`mt-1 text-2xl font-display font-bold ${value === '—' ? 'text-gray-300 dark:text-white/30' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-white/40">{sublabel}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  )

  const className = `p-5 rounded-2xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10 ${
    href ? 'hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer dark:hover:border-cyan-500/30 dark:hover:bg-cyan-500/5' : ''
  }`

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}
