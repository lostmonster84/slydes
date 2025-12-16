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

          {/* Sheet - iOS style */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-[20px] z-50 flex flex-col"
            style={{ maxHeight: '70vh' }}
          >
            {/* iOS Handle */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose()
                }
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-2 pb-3">
                <div className="w-9 h-[5px] rounded-full bg-white/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="w-8" /> {/* Spacer for centering */}
                <h2 className="text-white text-[17px] font-semibold">Categories</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </motion.div>

            {/* iOS Grouped List */}
            <div
              className="flex-1 overflow-y-auto px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              <div className="bg-[#2c2c2e] rounded-xl overflow-hidden">
                {categories.map((category, index) => {
                  const IconComponent = category.icon ? getCategoryIcon(category.icon) : Sparkles
                  return (
                    <div key={category.id}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCategoryTap(category.id)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/5 transition-colors"
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
                          <div className="text-white text-[15px] font-medium">
                            {category.label}
                          </div>
                          {category.description && (
                            <div className="text-white/50 text-[13px] truncate">
                              {category.description}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 flex-shrink-0" />
                      </button>
                      {/* iOS separator - inset */}
                      {index < categories.length - 1 && (
                        <div className={`h-[0.5px] bg-white/10 ${showIcons ? 'ml-[72px]' : 'ml-4'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact Buttons - Circular floating style */}
            <div className="px-4 pt-4 pb-6">
              <div className="flex justify-center gap-6">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Phone className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <span className="text-white/60 text-[11px]">Call</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Mail className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <span className="text-white/60 text-[11px]">Email</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <span className="text-white/60 text-[11px]">Message</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
