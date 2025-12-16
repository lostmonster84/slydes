'use client'

import Link from 'next/link'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { ArrowLeft, Package, Plus } from 'lucide-react'

/**
 * Shop Products — Coming Soon
 *
 * Lists all inventory items with commerce enabled.
 * Future: Filter by commerce mode (buy_now vs add_to_cart)
 */

export default function ShopProductsPage() {
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
                <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Products</h1>
                <p className="text-sm text-gray-500 dark:text-white/60">Items with commerce enabled</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full dark:bg-amber-500/15 dark:text-amber-400">
              Coming Soon
            </span>
          </header>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl">
              {/* Empty state */}
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center dark:bg-white/10">
                  <Package className="w-10 h-10 text-gray-400 dark:text-white/40" />
                </div>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  No products yet
                </h2>
                <p className="text-gray-500 dark:text-white/50 mb-6 max-w-sm mx-auto">
                  Enable commerce on inventory items in the Item Slyde editor to see them here.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Create a product
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
