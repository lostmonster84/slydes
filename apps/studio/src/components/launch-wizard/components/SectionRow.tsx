'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Check, X, Pencil, GripVertical, Star,
  Flower, Heart, Truck, Info, Utensils, Calendar, Image, Phone,
  Scissors, Users, Package, User, Mail, Bed, Coffee, MapPin,
  Dumbbell, CreditCard, ShoppingBag, Home, Sparkles, Briefcase,
  Car, Ship, Anchor, Route, Link,
  type LucideIcon,
} from 'lucide-react'
import { type TemplateSection } from '@/lib/templates'

interface SectionRowProps {
  section: TemplateSection
  onToggle: () => void
  onRename: (newName: string) => void
  onRemove: () => void
}

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  flower: Flower,
  heart: Heart,
  truck: Truck,
  info: Info,
  utensils: Utensils,
  calendar: Calendar,
  image: Image,
  phone: Phone,
  scissors: Scissors,
  users: Users,
  package: Package,
  user: User,
  mail: Mail,
  bed: Bed,
  coffee: Coffee,
  'map-pin': MapPin,
  dumbbell: Dumbbell,
  'credit-card': CreditCard,
  'shopping-bag': ShoppingBag,
  home: Home,
  sparkles: Sparkles,
  briefcase: Briefcase,
  star: Star,
  // Transport & tours
  car: Car,
  ship: Ship,
  anchor: Anchor,
  route: Route,
  // Creator
  link: Link,
}

// Get Lucide icon by name
function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Star
}

export function SectionRow({ section, onToggle, onRename, onRemove }: SectionRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(section.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const Icon = getIcon(section.icon)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (editValue.trim()) {
      onRename(editValue.trim())
    } else {
      setEditValue(section.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(section.name)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`
        flex items-center gap-3 rounded-xl border p-3 transition-all
        ${section.enabled
          ? 'border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10'
          : 'border-gray-200 bg-white dark:border-white/10 dark:bg-[#2c2c2e]'
        }
      `}
    >
      {/* Drag handle (future enhancement) */}
      <div className="text-gray-300 dark:text-white/20">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`
          flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all
          ${section.enabled
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-300 bg-white dark:border-white/30 dark:bg-transparent'
          }
        `}
      >
        {section.enabled && <Check className="h-4 w-4" />}
      </button>

      {/* Icon */}
      <div className={`
        flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
        ${section.enabled
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
          : 'bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-white/40'
        }
      `}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="
              w-full rounded-md border border-blue-300 bg-white px-2 py-1
              text-sm font-medium text-gray-900
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
              dark:border-blue-500/50 dark:bg-[#1c1c1e] dark:text-white
            "
          />
        ) : (
          <span className={`
            block truncate text-sm font-medium
            ${section.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/50'}
          `}>
            {section.name}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onRemove}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
