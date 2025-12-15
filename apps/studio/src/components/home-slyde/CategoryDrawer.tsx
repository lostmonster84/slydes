'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Wrench,
  Car,
  Tag,
  MapPin,
  Star,
  Heart,
  Gift,
  Camera,
  Calendar,
  Users,
  Coffee,
  Home as HomeIcon,
  ShoppingBag,
  Sparkles,
  Tent,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

// Same icon map as the editor (CONSTX consistency)
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  car: Car,
  tag: Tag,
  'map-pin': MapPin,
  star: Star,
  heart: Heart,
  gift: Gift,
  camera: Camera,
  calendar: Calendar,
  users: Users,
  coffee: Coffee,
  home: HomeIcon,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  tent: Tent,
  utensils: Utensils,
}

function getCategoryIcon(iconId: string): LucideIcon {
  return CATEGORY_ICON_MAP[iconId] || Sparkles
}

interface CategoryItem {
  id: string
  icon?: string // Lucide icon ID (e.g., 'wrench', 'car')
  label: string
  description: string
}

interface CategoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  categories: CategoryItem[]
  onCategoryTap: (categoryId: string) => void
  businessName: string
  accentColor: string
  showIcons?: boolean
}

/**
 * CategoryDrawer - Carbon copy of AboutSheet style
 *
 * Shows categories list with contact buttons at bottom.
 * Simple design: Header shows "Categories", categories listed directly (no toggle).
 * AIDA: User tapped to explore → show categories immediately, no extra friction.
 */
export function CategoryDrawer({
  isOpen,
  onClose,
  categories,
  onCategoryTap,
  businessName,
  accentColor,
  showIcons = false,
}: CategoryDrawerProps) {
  const initial = businessName.charAt(0).toUpperCase()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-40"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-50 flex flex-col"
            style={{ maxHeight: '70vh' }}
          >
            {/* Drag Handle + Header */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose()
                }
              }}
              className="flex items-center justify-between px-4 py-4 border-b border-white/10 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3">
                {/* Business Logo */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: accentColor }}
                >
                  <span className="text-white text-base font-bold">{initial}</span>
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Categories</h2>
                  <p className="text-white/60 text-xs">{businessName}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>

            {/* Categories List - straight in, no toggle (AIDA: minimize friction) */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              {categories.map((category, index) => {
                const IconComponent = category.icon ? getCategoryIcon(category.icon) : Sparkles
                return (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCategoryTap(category.id)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/10 transition-colors ${
                      index < categories.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                  >
                    {/* Icon - conditionally rendered */}
                    {showIcons && (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${accentColor}20` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[14px] font-medium">
                        {category.label}
                      </div>
                      {category.description && (
                        <div className="text-white/40 text-[11px] truncate">
                          {category.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/25 flex-shrink-0" />
                  </button>
                )
              })}
            </div>

            {/* Contact Buttons - exact same as AboutSheet */}
            <div className="px-4 py-4 border-t border-white/10">
              <div className="flex items-center justify-evenly gap-4">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Call</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Email</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/70 text-[10px]">Message</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
