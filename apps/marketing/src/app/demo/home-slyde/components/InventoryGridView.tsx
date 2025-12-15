'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { InventoryItem } from '../data/highlandMotorsData'

interface InventoryGridViewProps {
  categoryName: string
  items: InventoryItem[]
  onItemTap: (itemId: string) => void
  onBack: () => void
  accentColor: string
}

/**
 * InventoryGridView - Level 2: List format with square thumbnails
 *
 * Key rules from CATEGORY-INVENTORY-FLOW.md:
 * - Grids are NEVER an entry point
 * - Grids are only accessible from a Category Slyde
 * - Grids are shallow and utilitarian
 * - List layout with square thumbnails, minimal metadata
 */
export function InventoryGridView({
  categoryName,
  items,
  onItemTap,
  onBack,
  accentColor,
}: InventoryGridViewProps) {
  return (
    <div className="relative w-full h-full bg-[#0A0E27] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-10 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white font-semibold">{categoryName}</h2>
        </div>
        <span className="text-white/50 text-sm">{items.length} items</span>
      </div>

      {/* Vehicle List */}
      <div
        className="flex-1 overflow-y-auto p-3"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onItemTap(item.id)}
              className="group flex items-center gap-3 bg-white/5 rounded-xl p-2.5 text-left border border-white/10 active:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Square Thumbnail */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex-shrink-0 flex items-center justify-center">
                <span className="text-xl opacity-40">🚗</span>
              </div>

              {/* Vehicle Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  {item.title}
                </h3>
                <p className="text-white/50 text-[11px] truncate">
                  {item.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p
                    className="text-sm font-bold"
                    style={{ color: accentColor }}
                  >
                    {item.price}
                  </p>
                  {item.badge && (
                    <span className="text-[9px] text-white/40">{item.badge}</span>
                  )}
                </div>
              </div>

              {/* Chevron */}
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* Bottom padding for scroll */}
        <div className="h-4" />
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="w-24 h-1 rounded-full bg-white/30" />
      </div>
    </div>
  )
}
