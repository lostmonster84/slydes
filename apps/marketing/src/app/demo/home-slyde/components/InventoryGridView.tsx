'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { InventoryItem } from '../data/highlandMotorsData'

interface InventoryGridViewProps {
  categoryName: string
  items: InventoryItem[]
  onItemTap: (itemId: string) => void
  onBack: () => void
  accentColor: string
}

/**
 * InventoryGridView - Level 2: Card-based grid (earned, not default)
 *
 * Key rules from CATEGORY-INVENTORY-FLOW.md:
 * - Grids are NEVER an entry point
 * - Grids are only accessible from a Category Slyde
 * - Grids are shallow and utilitarian
 * - Card-based layout, minimal metadata
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => onItemTap(item.id)}
              className="group relative bg-white/5 rounded-xl overflow-hidden text-left border border-white/10 hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-800 relative">
                {/* Badge */}
                {item.badge && (
                  <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {item.badge}
                  </div>
                )}

                {/* Car icon placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🚗</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-2.5">
                <h3 className="text-white text-xs font-semibold truncate">
                  {item.title}
                </h3>
                <p className="text-white/50 text-[10px] truncate mt-0.5">
                  {item.subtitle}
                </p>
                <p
                  className="text-sm font-bold mt-1.5"
                  style={{ color: accentColor }}
                >
                  {item.price}
                </p>
              </div>

              {/* Hover indicator */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accentColor }}
              />
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
