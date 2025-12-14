'use client'

import { ChevronRight, Home } from 'lucide-react'

type Level = 'home' | 'category' | 'inventory' | 'item'

interface FlowBreadcrumbProps {
  level: Level
  categoryName?: string
  itemName?: string
  onHome: () => void
  onCategory?: () => void
  onInventory?: () => void
}

/**
 * FlowBreadcrumb - Visual indicator of current position in hierarchy
 *
 * Shows: Home > Category > Inventory > Item
 * Tappable elements to jump back levels
 */
export function FlowBreadcrumb({
  level,
  categoryName,
  itemName,
  onHome,
  onCategory,
  onInventory,
}: FlowBreadcrumbProps) {
  const getLevelLabel = (lvl: Level): string => {
    switch (lvl) {
      case 'home':
        return 'Home Slyde'
      case 'category':
        return categoryName || 'Category'
      case 'inventory':
        return 'All Items'
      case 'item':
        return itemName || 'Item'
    }
  }

  const levels: { level: Level; clickable: boolean; onClick?: () => void }[] = [
    { level: 'home', clickable: level !== 'home', onClick: onHome },
  ]

  if (level === 'category' || level === 'inventory' || level === 'item') {
    levels.push({
      level: 'category',
      clickable: level !== 'category' && !!onCategory,
      onClick: onCategory,
    })
  }

  if (level === 'inventory' || level === 'item') {
    levels.push({
      level: 'inventory',
      clickable: level !== 'inventory' && !!onInventory,
      onClick: onInventory,
    })
  }

  if (level === 'item') {
    levels.push({
      level: 'item',
      clickable: false,
    })
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      {levels.map((item, index) => (
        <div key={item.level} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          )}
          <button
            onClick={item.clickable ? item.onClick : undefined}
            disabled={!item.clickable}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
              item.clickable
                ? 'text-white/60 hover:text-white hover:bg-white/10 cursor-pointer'
                : item.level === level
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'text-white/40 cursor-default'
            }`}
          >
            {item.level === 'home' && <Home className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">
              {getLevelLabel(item.level)}
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}
