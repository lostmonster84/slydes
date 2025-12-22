'use client'

/**
 * UNIFIED STUDIO EDITOR - Tree-based single-screen experience
 * ============================================================
 *
 * ONE screen with collapsible hierarchy:
 * ▼ Home (settings)
 * ▼ Categories
 *     ▼ Vehicles (settings)
 *         Frame 1
 *         Frame 2
 *         + Add frame
 *     + Add category
 * ▼ Lists
 *     ▼ Our Fleet (list settings)
 *         ▼ BMW M3 (item settings)
 *             Frame 1
 *             Frame 2
 *         + Add item
 *     + Add list
 *
 * CONSTX Pattern: Navigator (left) + Preview (center) + Inspector (right)
 */

import { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react'
import confetti from 'canvas-confetti'
import { useSearchParams } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DevicePreview, DemoModeOverlay } from '@/components/slyde-demo'
import { HomeSlydeScreen } from '@/components/home-slyde/HomeSlydeScreen'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import { SlydeCover } from '@/components/slyde-demo/SlydeCover'
import type { FrameData, FAQItem, BusinessInfo, CTAIconType, CTAType, ListItem, ListData, SocialLinks } from '@/components/slyde-demo/frameData'
import type { LocationData } from '@slydes/types'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useOrganization, useSocialFollowers, useSlydes, useHomeSlyde, useCategoryFrames, type HomeSlydeCategory, type BackgroundType, type HomeSlyde } from '@/hooks'
import type { HomeSlydeData } from '@/components/home-slyde/data/highlandMotorsData'
import {
  UploadCloud,
  Video,
  Type,
  Building2,
  MousePointerClick,
  Plus,
  ExternalLink,
  Layers,
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
  Trash2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  Image as ImageIcon,
  Palette,
  Info,
  Phone,
  Book,
  List,
  Package,
  Pencil,
  Smartphone,
  AtSign,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  HelpCircle,
  GripVertical,
  ListTree,
  LayoutList,
  Link2,
  Check,
  Mail,
  ArrowRight,
  Music,
  Clapperboard,
  Play,
  type LucideIcon,
} from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'
import { BackgroundMediaInput } from '@/components/BackgroundMediaInput'
import { MusicSelector } from '@/components/audio/MusicSelector'
import { type VideoFilterPreset, type VideoSpeedPreset } from '@/lib/videoFilters'
import { InventoryGridView } from '@/components/home-slyde/InventoryGridView'
import type { InventoryItem } from '@/components/home-slyde/data/highlandMotorsData'
import { useFAQs } from '@/hooks/useFAQs'
import { useHomeFAQs } from '@/hooks/useHomeFAQs'
import { FeaturesSection } from '@/components/inspector/FeaturesSection'
import { PropertySection } from '@/components/inspector/PropertySection'

// HQ design tokens
const HQ_PRIMARY_GRADIENT = 'bg-gradient-to-r from-blue-600 to-cyan-500'
const HQ_PRIMARY_SHADOW = 'shadow-lg shadow-blue-500/15'

// Selection types
type SelectionType = 'home' | 'category' | 'categoryFrame' | 'list' | 'item' | 'itemFrame' | null

interface Selection {
  type: SelectionType
  categoryId?: string
  categoryFrameId?: string
  listId?: string
  itemId?: string
  itemFrameId?: string
}

// Category icons
const CATEGORY_ICONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'wrench', label: 'Services', Icon: Wrench },
  { id: 'car', label: 'Vehicles', Icon: Car },
  { id: 'tag', label: 'Offers', Icon: Tag },
  { id: 'map-pin', label: 'Location', Icon: MapPin },
  { id: 'star', label: 'Featured', Icon: Star },
  { id: 'heart', label: 'Favorites', Icon: Heart },
  { id: 'gift', label: 'Gifts', Icon: Gift },
  { id: 'camera', label: 'Gallery', Icon: Camera },
  { id: 'calendar', label: 'Events', Icon: Calendar },
  { id: 'users', label: 'Team', Icon: Users },
  { id: 'coffee', label: 'Food & Drink', Icon: Coffee },
  { id: 'home', label: 'Accommodation', Icon: HomeIcon },
  { id: 'shopping-bag', label: 'Shop', Icon: ShoppingBag },
  { id: 'sparkles', label: 'Special', Icon: Sparkles },
  { id: 'tent', label: 'Outdoor', Icon: Tent },
  { id: 'utensils', label: 'Dining', Icon: Utensils },
]

// CTA types - 1:1 mapping of icon to action (list handled by Inventory section)
// defaultText auto-populates button text when user selects a type
const CTA_TYPES: { value: CTAType; label: string; Icon: LucideIcon; inputType: 'tel' | 'url' | 'email' | 'frame-select' | null; placeholder?: string; defaultText: string }[] = [
  { value: 'call', label: 'Call', Icon: Phone, inputType: 'tel', placeholder: '+44 123 456 7890', defaultText: 'Call Now' },
  { value: 'link', label: 'Link', Icon: ExternalLink, inputType: 'url', placeholder: 'https://...', defaultText: 'Learn More' },
  { value: 'email', label: 'Email', Icon: Mail, inputType: 'email', placeholder: 'hello@example.com', defaultText: 'Email Us' },
  { value: 'directions', label: 'Directions', Icon: MapPin, inputType: 'url', placeholder: 'Google Maps link or address', defaultText: 'Get Directions' },
  { value: 'info', label: 'Info', Icon: Info, inputType: null, defaultText: 'More Info' },
  { value: 'faq', label: 'FAQ', Icon: HelpCircle, inputType: null, defaultText: 'FAQs' },
  { value: 'reviews', label: 'Reviews', Icon: Star, inputType: null, defaultText: 'See Reviews' },
  { value: 'frame', label: 'Go to Frame', Icon: ArrowRight, inputType: 'frame-select', defaultText: 'Continue' },
]

function getCategoryIcon(iconId: string): LucideIcon {
  return CATEGORY_ICONS.find((i) => i.id === iconId)?.Icon || Smartphone
}

// Render category icon as JSX to avoid "creating components during render" lint error
function CategoryIcon({ iconId, className }: { iconId: string; className?: string }) {
  const Icon = CATEGORY_ICONS.find((i) => i.id === iconId)?.Icon || Smartphone
  return <Icon className={className} />
}

// Size classes type
type SizeClasses = {
  text: string
  textSmall: string
  textXSmall: string
  textMeta: string
  padding: string
  paddingSmall: string
  icon: string
  iconSmall: string
  badge: string
}

// Sortable Section Row component
function SortableSectionRow({
  cat,
  isSelected,
  isExpanded,
  isEditing,
  catFrames,
  showCategoryIcons,
  editingValue,
  setEditingValue,
  editInputRef,
  updateCategory,
  cancelEditing,
  startEditing,
  deleteCategory,
  toggleCategory,
  selection,
  setSelection,
  expandedCategories,
  setExpandedCategories,
  loadCategoryFrames,
  setPreviewFrameIndex,
  setPreviewMode,
  sizes,
  children,
  shouldPulse,
}: {
  cat: HomeSlydeCategory
  isSelected: boolean
  isExpanded: boolean
  isEditing: boolean
  catFrames: FrameData[]
  showCategoryIcons: boolean
  editingValue: string
  setEditingValue: (v: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
  updateCategory: (id: string, updates: Partial<HomeSlydeCategory>) => void
  cancelEditing: () => void
  startEditing: (id: string, value: string) => void
  deleteCategory: (id: string) => void
  toggleCategory: (id: string) => void
  selection: Selection
  setSelection: (s: Selection) => void
  expandedCategories: Set<string>
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>
  loadCategoryFrames: (id: string) => void
  setPreviewFrameIndex: (i: number) => void
  setPreviewMode: (m: 'home' | 'cover' | 'category' | 'list' | 'item') => void
  sizes: SizeClasses
  children?: React.ReactNode
  shouldPulse?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Section Row - click to expand/select, hold+drag to reorder, double click name to rename */}
      <div
        onClick={() => {
          const wasSelected = selection.type === 'category' && selection.categoryId === cat.id
          if (wasSelected) {
            // Already selected - toggle collapse
            toggleCategory(cat.id)
          } else {
            // Not selected - select it, ensure expanded, show Cover
            setSelection({ type: 'category', categoryId: cat.id })
            setPreviewMode('cover') // Show Cover when selecting a Slyde
            loadCategoryFrames(cat.id)
            setPreviewFrameIndex(0)
            // Ensure expanded when selecting
            if (!expandedCategories.has(cat.id)) {
              setExpandedCategories(prev => new Set([...prev, cat.id]))
            }
          }
        }}
        className={`group w-full flex items-center gap-2 ${sizes.padding} rounded-xl text-left transition-all cursor-pointer ${
          isSelected
            ? 'bg-blue-50 dark:bg-white/10 text-gray-900 dark:text-white'
            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
        } ${isDragging ? 'cursor-grabbing' : ''} ${shouldPulse ? 'animate-pulse-hint' : ''}`}
      >
        <div className={`p-0.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
          <ChevronRight className={`${sizes.icon} ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
        </div>

        {showCategoryIcons && (
          <CategoryIcon iconId={cat.icon} className={`${sizes.icon} ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
        )}

        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editingValue.trim()) updateCategory(cat.id, { name: editingValue.trim() })
                cancelEditing()
              }
              if (e.key === 'Escape') cancelEditing()
            }}
            onBlur={() => {
              if (editingValue.trim()) updateCategory(cat.id, { name: editingValue.trim() })
              cancelEditing()
            }}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 px-1.5 py-0.5 ${sizes.text} bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none`}
          />
        ) : (
          <>
            <span
              className={`${sizes.text} font-medium truncate flex-1`}
              onDoubleClick={(e) => {
                e.stopPropagation()
                startEditing(cat.id, cat.name)
              }}
            >
              {cat.name}
            </span>
            <span className={`${sizes.textMeta} text-gray-400 dark:text-white/40`}>
              {catFrames.length}f
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteCategory(cat.id)
              }}
              onDoubleClick={(e) => e.stopPropagation()}
              className="p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className={sizes.iconSmall} />
            </button>
          </>
        )}
      </div>

      {/* Children (frames) */}
      {isExpanded && children}
    </div>
  )
}

// Sortable Frame Row component
function SortableFrameRow({
  frame,
  idx,
  categoryId,
  isFrameSelected,
  isFrameEditing,
  isFrameExpanded,
  hasInventory,
  connectedList,
  catFramesLength,
  editingValue,
  setEditingValue,
  editInputRef,
  updateCategoryFrame,
  cancelEditing,
  startEditing,
  deleteCategoryFrame,
  toggleFrame,
  setPreviewMode,
  setSelection,
  setPreviewFrameIndex,
  sizes,
  children,
  shouldPulse,
}: {
  frame: FrameData
  idx: number
  categoryId: string
  isFrameSelected: boolean
  isFrameEditing: boolean
  isFrameExpanded: boolean
  hasInventory: boolean
  connectedList: ListData | null | undefined
  catFramesLength: number
  editingValue: string
  setEditingValue: (v: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
  updateCategoryFrame: (catId: string, frameId: string, updates: Partial<FrameData>) => void
  cancelEditing: () => void
  startEditing: (id: string, value: string) => void
  deleteCategoryFrame: (catId: string, frameId: string) => void
  toggleFrame: (id: string) => void
  setPreviewMode: (mode: 'home' | 'category' | 'list' | 'item') => void
  setSelection: (s: Selection) => void
  setPreviewFrameIndex: (i: number) => void
  sizes: SizeClasses
  children?: React.ReactNode
  shouldPulse?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: frame.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Frame Row - click to select, hold+drag to reorder, double click name to rename */}
      <div
        onClick={() => {
          if (hasInventory) toggleFrame(frame.id)
          setPreviewMode('category')
          setSelection({ type: 'categoryFrame', categoryId, categoryFrameId: frame.id })
          setPreviewFrameIndex(idx)
        }}
        className={`group w-full flex items-center gap-2 ${sizes.paddingSmall} rounded-xl text-left transition-all cursor-pointer ${
          isFrameSelected
            ? 'bg-blue-50 dark:bg-white/10 text-gray-900 dark:text-white'
            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
        } ${isDragging ? 'cursor-grabbing' : ''} ${shouldPulse ? 'animate-pulse-hint' : ''}`}
      >
        {/* Chevron for frames with inventory */}
        {hasInventory ? (
          <div className={`p-0.5 transition-transform ${isFrameExpanded ? 'rotate-90' : ''}`}>
            <ChevronRight className={`${sizes.icon} ${isFrameSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
          </div>
        ) : (
          <div className="w-5" />
        )}

        <div className={`${sizes.badge} rounded flex items-center justify-center font-bold ${
          isFrameSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
        }`}>
          {idx + 1}
        </div>

        {isFrameEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editingValue.trim()) updateCategoryFrame(categoryId, frame.id, { title: editingValue.trim() })
                cancelEditing()
              }
              if (e.key === 'Escape') cancelEditing()
            }}
            onBlur={() => {
              if (editingValue.trim()) updateCategoryFrame(categoryId, frame.id, { title: editingValue.trim() })
              cancelEditing()
            }}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 px-1.5 py-0.5 ${sizes.textSmall} bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none`}
          />
        ) : (
          <>
            <span
              className={`${sizes.textSmall} font-medium truncate flex-1`}
              onDoubleClick={(e) => {
                e.stopPropagation()
                startEditing(frame.id, frame.title || `Frame ${idx + 1}`)
              }}
            >
              {frame.title || `Frame ${idx + 1}`}
            </span>
            {/* Inventory badge */}
            {hasInventory && connectedList && (
              <span className={`${sizes.textMeta} px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300`}>
                📦 {connectedList.items.length}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteCategoryFrame(categoryId, frame.id)
              }}
              onDoubleClick={(e) => e.stopPropagation()}
              disabled={catFramesLength <= 1}
              className={`p-0.5 rounded-lg transition-all ${
                catFramesLength <= 1
                  ? 'opacity-20 cursor-not-allowed'
                  : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
              }`}
            >
              <Trash2 className={sizes.iconSmall} />
            </button>
          </>
        )}
      </div>

      {/* Children (inventory items) */}
      {isFrameExpanded && hasInventory && children}
    </div>
  )
}

// List View Item component (memoized to avoid icon component creation during render)
const ListViewItem = memo(function ListViewItem({
  item,
  isSelected,
  onClick,
}: {
  item: {
    id: string
    type: 'home' | 'category' | 'categoryFrame' | 'list' | 'item' | 'itemFrame'
    name: string
    depth: number
    icon: string | null
    meta?: string
    image?: string
    frameIndex?: number
  }
  isSelected: boolean
  onClick: () => void
}) {
  const paddingLeft = item.depth * 12
  const iconClass = `w-3.5 h-3.5 shrink-0 ${
    isSelected && item.type === 'home' ? 'text-white' : isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400 dark:text-white/40'
  }`

  return (
    <div
      onClick={onClick}
      style={{ paddingLeft: `${paddingLeft + 8}px` }}
      className={`group flex items-center gap-2 pr-2 py-1 rounded-lg text-left transition-all cursor-pointer ${
        isSelected
          ? item.type === 'home'
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
            : 'bg-blue-50 dark:bg-white/10 text-gray-900 dark:text-white'
          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
      }`}
    >
      {/* Icon or frame number */}
      {item.type === 'categoryFrame' || item.type === 'itemFrame' ? (
        <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
        }`}>
          {(item.frameIndex ?? 0) + 1}
        </div>
      ) : item.type === 'item' && item.image ? (
        <img src={item.image} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
      ) : item.icon === 'home' ? (
        <HomeIcon className={iconClass} />
      ) : item.icon ? (
        <CategoryIcon iconId={item.icon} className={iconClass} />
      ) : (
        <Package className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400 dark:text-white/40'}`} />
      )}

      {/* Name */}
      <span className="text-[11px] font-medium truncate flex-1">
        {item.name}
      </span>

      {/* Meta badge */}
      {item.meta && (
        <span className={`text-[9px] shrink-0 ${
          item.meta.includes('📦')
            ? 'px-1 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
            : 'text-gray-400 dark:text-white/40'
        }`}>
          {item.meta}
        </span>
      )}
    </div>
  )
})

export function UnifiedStudioEditor() {
  const searchParams = useSearchParams()
  const { organization, isLoading: orgLoading } = useOrganization()
  const { saveInstagramHandle, fetchTikTokFollowers } = useSocialFollowers(organization?.id)
  const {
    data: homeSlyde,
    hydrated: homeSlydeHydrated,
    isLoading: homeSlydeLoading,
    updateHomeSlyde,
    addCategory: addHomeSlydeCategory,
    updateCategory: updateHomeSlydeCategory,
    deleteCategory: deleteHomeSlydeCategory,
    reorderCategories: reorderHomeSlydeCategories,
    publishAll,
  } = useHomeSlyde()
  const { slydes, publishSlyde } = useSlydes()

  // Category frames from Supabase
  const {
    framesByCategory: childFrames,
    loadFramesForCategory,
    addFrame: addCategoryFrameDB,
    updateFrame: updateCategoryFrameDB,
    deleteFrame: deleteCategoryFrameDB,
    reorderFrames: reorderCategoryFramesDB,
  } = useCategoryFrames()

  // DnD sensors for drag and drop reordering
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Brand profile - pulls from organization data
  const brandProfile = {
    businessName: organization?.name || 'Your Business',
    tagline: '',
    primaryColor: organization?.primary_color || '#2563EB',
    secondaryColor: organization?.secondary_color || '#06B6D4',
    logoUrl: organization?.logo_url || null,
  }

  // =============================================
  // CORE STATE
  // =============================================
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(homeSlyde.backgroundType || 'video')
  const [videoSrc, setVideoSrc] = useState(homeSlyde.videoSrc)
  const [imageSrc, setImageSrc] = useState(homeSlyde.imageSrc || '')
  const [videoFilter, setVideoFilter] = useState<VideoFilterPreset>(homeSlyde.videoFilter || 'original')
  const [videoVignette, setVideoVignette] = useState(homeSlyde.videoVignette ?? false)
  const [videoSpeed, setVideoSpeed] = useState<VideoSpeedPreset>(homeSlyde.videoSpeed || 'normal')
  const [videoStartTime, setVideoStartTime] = useState(homeSlyde.videoStartTime || 0)
  const [posterSrc, setPosterSrc] = useState(homeSlyde.posterSrc || '')
  const [brandName, setBrandName] = useState(brandProfile.businessName)
  const [tagline, setTagline] = useState(brandProfile.tagline)
  const [rating, setRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [about, setAbout] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [categories, setCategories] = useState<HomeSlydeCategory[]>(homeSlyde.categories)
  const [showCategoryIcons, setShowCategoryIcons] = useState(homeSlyde.showCategoryIcons ?? false)
  const [showHearts, setShowHearts] = useState(homeSlyde.showHearts ?? true)
  const [showShare, setShowShare] = useState(homeSlyde.showShare ?? true)
  const [showSound, setShowSound] = useState(homeSlyde.showSound ?? true)
  const [showReviews, setShowReviews] = useState(homeSlyde.showReviews ?? true)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(homeSlyde.socialLinks || {})
  const [lists, setLists] = useState<ListData[]>(homeSlyde.lists ?? [])
  // Music state
  const [musicEnabled, setMusicEnabled] = useState(homeSlyde.musicEnabled ?? true)
  const [musicCustomUrl, setMusicCustomUrl] = useState<string | null>(homeSlyde.musicCustomUrl ?? null)

  // Audio playback state (for preview)
  const [isMusicMuted, setIsMusicMuted] = useState(true)
  const [musicUnlocked, setMusicUnlocked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Audio source URL
  const audioSrc = musicCustomUrl || (musicEnabled ? 'https://pub-98abdd0a909a4a78b03fe6de579904ae.r2.dev/demo/slydesanthem.mp3' : null)

  const handleMusicToggle = useCallback(() => {
    const newMuted = !isMusicMuted
    setIsMusicMuted(newMuted)

    if (audioRef.current && audioSrc && musicEnabled) {
      audioRef.current.muted = newMuted
      if (!newMuted && !musicUnlocked) {
        setMusicUnlocked(true)
        audioRef.current.play().catch(() => {
          // Autoplay blocked
        })
      }
    }
  }, [isMusicMuted, audioSrc, musicEnabled, musicUnlocked])

  // =============================================
  // SHARE LINK STATE
  // =============================================
  const [linkCopied, setLinkCopied] = useState(false)
  const shareableLink = organization ? `slydes.io/${organization.slug}` : ''

  // =============================================
  // DEMO MODE STATE
  // =============================================
  const [showDemoMode, setShowDemoMode] = useState(false)

  const handleCopyLink = async () => {
    if (!shareableLink) return
    try {
      await navigator.clipboard.writeText(`https://${shareableLink}`)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = `https://${shareableLink}`
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // Publish all slydes for this organization
  const [isPublishing, setIsPublishing] = useState(false)
  const handlePublish = async () => {
    if (isPublishing) return

    setIsPublishing(true)
    try {
      // Save any pending changes first
      await persistHomeSlyde()

      // Publish all slydes (categories)
      await publishAll()

      // 🎉 Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
      })
    } catch (err) {
      console.error('Failed to publish:', err)
    } finally {
      setIsPublishing(false)
    }
  }

  // =============================================
  // TREE EXPANSION STATE
  // =============================================
  const [expandedSections, setExpandedSections] = useState({
    home: true,
    categories: true,
    lists: true,
  })
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [expandedFrames, setExpandedFrames] = useState<Set<string>>(new Set()) // For frames with inventory

  // =============================================
  // NAVIGATOR VIEW MODE (tree vs list)
  // =============================================
  const [navigatorViewMode, setNavigatorViewMode] = useState<'tree' | 'list'>('tree')

  // =============================================
  // NAVIGATOR SIZE (S/M/L)
  // =============================================
  const [navigatorSize, setNavigatorSize] = useState<'S' | 'M' | 'L'>('M')

  // Size classes for navigator and inspector elements
  const sizeClasses = {
    S: {
      // Navigator
      text: 'text-[13px]',
      textSmall: 'text-[12px]',
      textXSmall: 'text-[11px]',
      textMeta: 'text-[10px]',
      padding: 'px-2 py-2',
      paddingSmall: 'px-2 py-1.5',
      icon: 'w-4 h-4',
      iconSmall: 'w-3.5 h-3.5',
      badge: 'w-5 h-5 text-[10px]',
      // Inspector
      inspectorPadding: 'p-4',
      inspectorTitle: 'text-base',
      inspectorSectionTitle: 'text-[12px]',
      inspectorLabel: 'text-[12px]',
      inspectorInput: 'text-[13px] px-2.5 py-1.5',
      inspectorHint: 'text-[10px]',
      inspectorSectionPadding: 'px-3 py-2.5',
      inspectorContentPadding: 'p-3',
    },
    M: {
      // Navigator
      text: 'text-[15px]',
      textSmall: 'text-[14px]',
      textXSmall: 'text-[13px]',
      textMeta: 'text-[12px]',
      padding: 'px-3 py-2.5',
      paddingSmall: 'px-2.5 py-2',
      icon: 'w-5 h-5',
      iconSmall: 'w-4 h-4',
      badge: 'w-6 h-6 text-[11px]',
      // Inspector
      inspectorPadding: 'p-5',
      inspectorTitle: 'text-lg',
      inspectorSectionTitle: 'text-[13px]',
      inspectorLabel: 'text-[13px]',
      inspectorInput: 'text-sm px-3 py-2',
      inspectorHint: 'text-[11px]',
      inspectorSectionPadding: 'px-4 py-3',
      inspectorContentPadding: 'p-4',
    },
    L: {
      // Navigator
      text: 'text-[17px]',
      textSmall: 'text-[16px]',
      textXSmall: 'text-[15px]',
      textMeta: 'text-[13px]',
      padding: 'px-3 py-3',
      paddingSmall: 'px-3 py-2.5',
      icon: 'w-6 h-6',
      iconSmall: 'w-5 h-5',
      badge: 'w-7 h-7 text-[12px]',
      // Inspector
      inspectorPadding: 'p-6',
      inspectorTitle: 'text-xl',
      inspectorSectionTitle: 'text-[14px]',
      inspectorLabel: 'text-[14px]',
      inspectorInput: 'text-base px-3.5 py-2.5',
      inspectorHint: 'text-[12px]',
      inspectorSectionPadding: 'px-4 py-3.5',
      inspectorContentPadding: 'p-5',
    },
  }

  const sizes = sizeClasses[navigatorSize]

  // =============================================
  // SELECTION STATE (controls Inspector)
  // =============================================
  const [selection, setSelection] = useState<Selection>({ type: 'home' })

  // =============================================
  // PREVIEW MODE (controls what Preview shows - decoupled from selection)
  // - 'home' = show HomeSlydeScreen (default, stays here when editing sections)
  // - 'category' = show SlydeScreen with category frames (when editing frames)
  // - 'list' = show InventoryGridView
  // - 'item' = show item frames
  // =============================================
  const [previewMode, setPreviewMode] = useState<'home' | 'cover' | 'category' | 'list' | 'item'>('home')

  // =============================================
  // PREVIEW FRAME INDEX (syncs with selected frame)
  // =============================================
  const [previewFrameIndex, setPreviewFrameIndex] = useState(0)
  const [itemPreviewFrameIndex, setItemPreviewFrameIndex] = useState(0)

  // =============================================
  // INLINE EDITING STATE
  // =============================================
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  // NOTE: childFrames now comes from useCategoryFrames hook (framesByCategory)
  // The hook manages frames in Supabase instead of localStorage

  // =============================================
  // INSPECTOR SECTIONS STATE
  // =============================================
  const [inspectorSections, setInspectorSections] = useState<Record<string, boolean>>({
    brand: false,
    video: false,
    music: false,
    settings: false,
    socialMedia: false,
    content: false,
    style: false,
    info: false,
    faqs: false,
    homeFaqs: false,
    demoVideo: false,
    contactDetails: false,
    features: false,
    property: false,
  })

  // Track which onboarding sections have been visited (opened at least once)
  const [onboardingVisited, setOnboardingVisited] = useState<Record<string, boolean>>({
    music: false,
    demoPreview: false,
  })

  // =============================================
  // ONBOARDING FLOW - GPS-style guidance through first Slyde creation
  // =============================================
  // Principle: Always pulse the next action. If user wanders off, recalculate and guide them back.
  // This teaches them the pattern once - after that, they're on their own.
  // NOTE: Temporarily disabled - re-enable when onboarding is refined

  // Compute which element should pulse based on current state
  const getOnboardingPulseTarget = (): string | null => {
    // Disabled for now - pulses were getting in the way during development
    return null

    // PHASE 1: Home screen setup (only when viewing home)
    if (selection.type === 'home') {
      // Step 1: Business Info - need brand name
      if (!brandName || brandName.trim() === '') {
        return inspectorSections.brand ? 'home-brand-name-input' : 'home-brand-section'
      }

      // Step 2: Background - need video or image
      if (!videoSrc && !imageSrc) {
        return inspectorSections.video ? 'home-background-input' : 'home-background-section'
      }

      // Step 3: Music - show them music section (select Slydes Demo)
      if (!onboardingVisited.music) {
        return inspectorSections.music ? 'home-music-selector' : 'home-music-section'
      }

      // Step 4: Add Slyde - need at least one section
      if (categories.length === 0) {
        return 'add-section'
      }

      // Check if user has completed at least one frame - if so, show demo preview!
      // Complete = has title (background is optional - reduces friction)
      const hasCompleteFrame = categories.some(cat => {
        const frames = childFrames[cat.id] || []
        return frames.some(f => f.title?.trim())
      })
      if (hasCompleteFrame && !onboardingVisited.demoPreview) {
        return 'demo-preview'
      }

      // Step 4b: Section exists but is incomplete - pulse it to hint "click me"
      // Incomplete = no frames OR has frames without title
      for (const cat of categories) {
        const frames = childFrames[cat.id] || []
        const isIncomplete = frames.length === 0 || frames.some((f: FrameData) => !f.title?.trim())
        if (isIncomplete) {
          return `section-${cat.id}`
        }
      }
    }

    // PHASE 2: Category selected - name it, subtitle, then add frames
    if (selection.type === 'category' && selection.categoryId) {
      const cat = categories.find(c => c.id === selection.categoryId)

      // Step 6: Name the section (if still default name)
      if (cat?.name.startsWith('New Slyde')) {
        return 'category-name-input'
      }

      // Step 7: Add subtitle (if empty)
      if (cat && !cat?.description?.trim()) {
        return 'category-subtitle-input'
      }

      // Step 8: Add frame (if none exist)
      const catId = selection.categoryId!
      const selectedCatFrames: FrameData[] = childFrames[catId] || []
      if (selectedCatFrames.length === 0) {
        return 'add-frame'
      }

      // Step 9: Frame exists - pulse it to hint "click me to edit"
      for (const frame of selectedCatFrames) {
        if (!frame.title?.trim()) {
          return `frame-${frame.id}`
        }
      }
    }

    // PHASE 3: Frame editing - guide through content (title only, background optional)
    if (selection.type === 'categoryFrame' && selection.categoryId && selection.categoryFrameId) {
      const catFramesForSelection: FrameData[] = childFrames[selection.categoryId!] || []
      const selectedFrame = catFramesForSelection.find((f: FrameData) => f.id === selection.categoryFrameId)
      // Just need title - background is optional to reduce friction
      if (selectedFrame && (!selectedFrame?.title || selectedFrame?.title?.trim() === '')) {
        return inspectorSections.content ? 'frame-content-title-input' : 'frame-content-section'
      }
    }

    // PHASE 4: Guide user back to Home to see demo preview
    let hasCompleteFrame = false
    for (const cat of categories) {
      const frames: FrameData[] = childFrames[cat.id] || []
      if (frames.some((f: FrameData) => f.title?.trim())) {
        hasCompleteFrame = true
        break
      }
    }

    if (hasCompleteFrame && !onboardingVisited.demoPreview && selection.type !== 'home') {
      return 'nav-home'
    }

    // All done! No pulse needed - they've learned the pattern
    return null
  }

  const onboardingPulseTarget = getOnboardingPulseTarget()

  const toggleInspectorSection = (section: string) => {
    setInspectorSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Mark music as visited when they select a track (not just when they open the section)
  useEffect(() => {
    if (musicCustomUrl && !onboardingVisited.music) {
      setOnboardingVisited(v => ({ ...v, music: true }))
    }
  }, [musicCustomUrl, onboardingVisited.music])

  // Auto-expand section when onboarding needs to show add-frame button
  useEffect(() => {
    if (onboardingPulseTarget === 'add-frame' && selection.type === 'category' && selection.categoryId) {
      setExpandedCategories(prev => new Set([...prev, selection.categoryId!]))
    }
  }, [onboardingPulseTarget, selection])

  // Reset inspector sections when selection type changes
  useEffect(() => {
    const getDefaultSections = (type: Selection['type']) => {
      switch (type) {
        case 'home':
          // All sections closed by default - onboarding pulse guides user
          return { brand: false, video: false, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
        case 'category':
          // Slyde name/subtitle are always visible (not in collapsible), FAQ section closed
          return { brand: false, video: false, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
        case 'categoryFrame':
        case 'itemFrame':
          // All closed - onboarding pulse guides user through Content then Background
          return { brand: false, video: false, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
        case 'list':
          // List name is always visible (not in collapsible)
          return { brand: false, video: false, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
        case 'item':
          // Item fields are always visible (not in collapsible)
          return { brand: false, video: false, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
        default:
          return { brand: false, video: true, music: false, socialMedia: false, settings: false, content: false, style: false, info: false, faqs: false, homeFaqs: false, cta: false, inventory: false, demoVideo: false }
      }
    }
    setInspectorSections(getDefaultSections(selection.type))
  }, [selection.type])

  // =============================================
  // INITIALIZATION
  // =============================================
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!homeSlydeHydrated) return
    if (initializedRef.current) return
    initializedRef.current = true

    setBackgroundType(homeSlyde.backgroundType || 'video')
    setVideoSrc(homeSlyde.videoSrc)
    setImageSrc(homeSlyde.imageSrc || '')
    setVideoStartTime(homeSlyde.videoStartTime || 0)
    setPosterSrc(homeSlyde.posterSrc || '')
    setCategories(homeSlyde.categories)
    setLists(homeSlyde.lists ?? [])
    setShowCategoryIcons(homeSlyde.showCategoryIcons ?? false)
    setShowHearts(homeSlyde.showHearts ?? true)
    setShowShare(homeSlyde.showShare ?? true)
    setShowSound(homeSlyde.showSound ?? true)
    setShowReviews(homeSlyde.showReviews ?? true)
    setSocialLinks(homeSlyde.socialLinks || {})
    // Music
    setMusicEnabled(homeSlyde.musicEnabled ?? true)
    setMusicCustomUrl(homeSlyde.musicCustomUrl ?? null)
  }, [homeSlyde, homeSlydeHydrated])

  useEffect(() => {
    setBrandName(brandProfile.businessName)
    setTagline(brandProfile.tagline)
  }, [brandProfile.businessName, brandProfile.tagline])

  // =============================================
  // PERSISTENCE - Updates organization settings in Supabase
  // Categories are handled separately via addHomeSlydeCategory/updateHomeSlydeCategory
  // =============================================
  const persistHomeSlyde = useCallback(async () => {
    if (!organization) return

    const updates: Partial<HomeSlyde> = {
      backgroundType,
      imageSrc: imageSrc || undefined,
      posterSrc: posterSrc || undefined,
      videoFilter,
      videoVignette,
      videoSpeed,
      videoStartTime: videoStartTime || undefined,
      showCategoryIcons,
      showHearts,
      showShare,
      showSound,
      showReviews,
      socialLinks: Object.values(socialLinks).some(Boolean) ? socialLinks : undefined,
      homeFAQs: homeSlyde.homeFAQs,
      faqInbox: homeSlyde.faqInbox,
      musicEnabled,
    }

    try {
      await updateHomeSlyde(updates)
    } catch (err) {
      console.error('Failed to persist home slyde:', err)
    }
  }, [organization, backgroundType, imageSrc, posterSrc, videoFilter, videoVignette, videoSpeed, videoStartTime, showCategoryIcons, showHearts, showShare, showSound, showReviews, socialLinks, homeSlyde.homeFAQs, homeSlyde.faqInbox, musicEnabled, updateHomeSlyde])

  // Debounced persistence - save after 500ms of no changes
  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)
    persistTimeoutRef.current = setTimeout(persistHomeSlyde, 500)
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)
    }
  }, [persistHomeSlyde])

  // =============================================
  // TOGGLE FUNCTIONS
  // =============================================
  const toggleSection = (section: 'home' | 'categories' | 'lists') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const toggleList = (listId: string) => {
    setExpandedLists(prev => {
      const next = new Set(prev)
      if (next.has(listId)) next.delete(listId)
      else next.add(listId)
      return next
    })
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const toggleFrame = (frameId: string) => {
    setExpandedFrames(prev => {
      const next = new Set(prev)
      if (next.has(frameId)) next.delete(frameId)
      else next.add(frameId)
      return next
    })
  }

  // =============================================
  // INLINE EDITING
  // =============================================
  const startEditing = (id: string, currentValue: string) => {
    setEditingId(id)
    setEditingValue(currentValue)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingValue('')
  }

  // =============================================
  // CATEGORY CRUD - Now backed by Supabase slydes table
  // =============================================
  const addCategory = useCallback(async () => {
    if (categories.length >= 6) return
    const slydeNumber = categories.length + 1
    const newName = `New Slyde ${slydeNumber}`

    // Optimistic update - add placeholder immediately
    const tempId = `temp-${Date.now()}`
    const newCategory: HomeSlydeCategory = {
      id: tempId,
      childSlydeId: tempId,
      icon: 'sparkles',
      name: newName,
      description: '',
      hasInventory: false,
    }
    setCategories(prev => [...prev, newCategory])
    setExpandedSections(prev => ({ ...prev, categories: true }))

    try {
      const newPublicId = await addHomeSlydeCategory({
        icon: 'sparkles',
        name: newName,
        description: '',
        hasInventory: false,
      })
      // Replace temp with real ID
      setCategories(prev =>
        prev.map(c => c.id === tempId
          ? { ...c, id: newPublicId, childSlydeId: newPublicId }
          : c
        )
      )
    } catch (err) {
      console.error('Failed to add category:', err)
      // Revert optimistic update on error
      setCategories(prev => prev.filter(c => c.id !== tempId))
    }
  }, [categories.length, addHomeSlydeCategory])

  const updateCategory = useCallback(async (id: string, updates: Partial<HomeSlydeCategory>) => {
    // Save old state for rollback
    const oldCategory = categories.find(c => c.id === id)

    // Optimistic update for local state
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))

    try {
      await updateHomeSlydeCategory(id, updates)
    } catch (err) {
      console.error('Failed to update category:', err)
      // Rollback: restore old category
      if (oldCategory) {
        setCategories(prev => prev.map(c => c.id === id ? oldCategory : c))
      }
    }
  }, [updateHomeSlydeCategory, categories])

  const deleteCategory = useCallback(async (id: string) => {
    // Optimistic update for UI
    setCategories(prev => prev.filter(c => c.id !== id))
    // Note: Frames are deleted via DB cascade when slyde is deleted

    if (selection.categoryId === id) {
      setPreviewMode('home')
      setSelection({ type: 'home' })
    }

    try {
      await deleteHomeSlydeCategory(id)
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }, [selection.categoryId, deleteHomeSlydeCategory])

  // Reorder sections via drag-and-drop
  const handleSectionDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      // Optimistic reorder
      const newCategories = [...categories]
      const oldIndex = newCategories.findIndex(c => c.id === active.id)
      const newIndex = newCategories.findIndex(c => c.id === over.id)
      const reordered = arrayMove(newCategories, oldIndex, newIndex)
      setCategories(reordered)

      // Persist to database
      try {
        await reorderHomeSlydeCategories(reordered.map(c => c.id))
      } catch (err) {
        console.error('Failed to reorder categories:', err)
      }
    }
  }, [categories, reorderHomeSlydeCategories])

  // =============================================
  // CATEGORY FRAME CRUD - Now backed by Supabase via useCategoryFrames hook
  // =============================================

  // Load frames for a category from Supabase
  const loadCategoryFrames = useCallback((categoryId: string) => {
    loadFramesForCategory(categoryId)
  }, [loadFramesForCategory])

  // Add a new frame to a category
  const addCategoryFrame = useCallback(async (categoryId: string) => {
    await addCategoryFrameDB(categoryId)
  }, [addCategoryFrameDB])

  // Update a frame's data
  const updateCategoryFrame = useCallback(async (categoryId: string, frameId: string, updates: Partial<FrameData>) => {
    try {
      await updateCategoryFrameDB(categoryId, frameId, updates)
    } catch (err) {
      console.error('Failed to update frame:', err)
    }
  }, [updateCategoryFrameDB])

  // Delete a frame
  const deleteCategoryFrame = useCallback(async (categoryId: string, frameId: string) => {
    try {
      await deleteCategoryFrameDB(categoryId, frameId)
      if (selection.categoryFrameId === frameId) {
        setSelection({ type: 'category', categoryId })
      }
    } catch (err) {
      console.error('Failed to delete frame:', err)
    }
  }, [deleteCategoryFrameDB, selection.categoryFrameId])

  // Reorder frames within a category via drag-and-drop
  const handleFrameDragEnd = useCallback((categoryId: string) => async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const frames = childFrames[categoryId] || []
      const oldIndex = frames.findIndex(f => f.id === active.id)
      const newIndex = frames.findIndex(f => f.id === over.id)
      const reordered = arrayMove(frames, oldIndex, newIndex)
      try {
        await reorderCategoryFramesDB(categoryId, reordered.map(f => f.id))
      } catch (err) {
        console.error('Failed to reorder frames:', err)
      }
    }
  }, [childFrames, reorderCategoryFramesDB])

  // Handle URL params to auto-select category (from Slydes page "Edit" link)
  useEffect(() => {
    if (!homeSlydeHydrated) return
    const categoryId = searchParams.get('category')
    if (categoryId && categories.find(c => c.id === categoryId)) {
      // Auto-select the category from URL
      setSelection({ type: 'category', categoryId })
      setExpandedCategories(prev => new Set([...prev, categoryId]))
      setExpandedSections(prev => ({ ...prev, categories: true }))
      loadCategoryFrames(categoryId)
      setPreviewFrameIndex(0)
    }
  }, [homeSlydeHydrated, searchParams, categories])

  // =============================================
  // LIST CRUD
  // =============================================
  const addNewList = useCallback(() => {
    const newId = `list-${Date.now()}`
    const newList: ListData = { id: newId, name: 'New List', items: [] }
    setLists(prev => [...prev, newList])
    setSelection({ type: 'list', listId: newId })
    setExpandedSections(prev => ({ ...prev, lists: true }))
    setExpandedLists(prev => new Set(prev).add(newId))
    startEditing(newId, 'New List')
  }, [])

  const updateListById = useCallback((id: string, updates: Partial<ListData>) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }, [])

  const deleteListById = useCallback((id: string) => {
    setLists(prev => prev.filter(l => l.id !== id))
    // Reset selection if ANY selection within this list
    if (selection.listId === id) {
      setPreviewMode('home')
      setSelection({ type: 'home' })
    }
  }, [selection.listId])

  // =============================================
  // ITEM CRUD
  // =============================================
  const addItem = useCallback((listId: string) => {
    const newId = `item-${Date.now()}`
    const newItem: ListItem = { id: newId, title: 'New Item' }
    setLists(prev => prev.map(l => l.id === listId
      ? { ...l, items: [...l.items, newItem] }
      : l
    ))
    setSelection({ type: 'item', listId, itemId: newId })
    setExpandedItems(prev => new Set(prev).add(newId))
    startEditing(newId, 'New Item')
  }, [])

  const updateItem = useCallback((listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLists(prev => prev.map(l => l.id === listId
      ? { ...l, items: l.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
      : l
    ))
  }, [])

  const deleteItem = useCallback((listId: string, itemId: string) => {
    setLists(prev => prev.map(l => l.id === listId
      ? { ...l, items: l.items.filter(i => i.id !== itemId) }
      : l
    ))
    if (selection.itemId === itemId) {
      setSelection({ type: 'list', listId })
    }
  }, [selection.itemId])

  // =============================================
  // ITEM FRAME CRUD
  // =============================================
  const addItemFrame = useCallback((listId: string, itemId: string) => {
    const newId = `frame-${Date.now()}`
    // Find current item to get frame count
    const currentList = lists.find(l => l.id === listId)
    const currentItem = currentList?.items.find(i => i.id === itemId)
    const frameNumber = (currentItem?.frames?.length || 0) + 1
    const newTitle = `Frame ${frameNumber}`
    const newFrame: FrameData = {
      id: newId,
      order: frameNumber,
      templateType: 'custom',
      title: newTitle,
      subtitle: 'Add your subtitle here',
      heartCount: 0,
      background: { type: 'image', src: '' },
      accentColor: brandProfile.primaryColor,
    }
    setLists(prev => prev.map(l => l.id === listId
      ? {
          ...l,
          items: l.items.map(i => i.id === itemId
            ? { ...i, frames: [...(i.frames || []), newFrame] }
            : i
          ),
        }
      : l
    ))
    setSelection({ type: 'itemFrame', listId, itemId, itemFrameId: newId })
    startEditing(newId, newTitle)
  }, [lists, brandProfile.primaryColor])

  const updateItemFrame = useCallback((listId: string, itemId: string, frameId: string, updates: Partial<FrameData>) => {
    setLists(prev => prev.map(l => l.id === listId
      ? {
          ...l,
          items: l.items.map(i => i.id === itemId
            ? { ...i, frames: (i.frames || []).map(f => f.id === frameId ? { ...f, ...updates } : f) }
            : i
          ),
        }
      : l
    ))
  }, [])

  const deleteItemFrame = useCallback((listId: string, itemId: string, frameId: string) => {
    const list = lists.find(l => l.id === listId)
    const item = list?.items.find(i => i.id === itemId)
    if ((item?.frames?.length ?? 0) <= 1) return

    setLists(prev => prev.map(l => l.id === listId
      ? {
          ...l,
          items: l.items.map(i => i.id === itemId
            ? { ...i, frames: (i.frames || []).filter(f => f.id !== frameId) }
            : i
          ),
        }
      : l
    ))
    if (selection.itemFrameId === frameId) {
      setSelection({ type: 'item', listId, itemId })
    }
  }, [lists, selection.itemFrameId])

  // =============================================
  // DERIVED STATE
  // =============================================
  const selectedCategory = selection.categoryId ? categories.find(c => c.id === selection.categoryId) : null
  const selectedCategoryFrames = selection.categoryId ? (childFrames[selection.categoryId] || []) : []
  const selectedCategoryFrame = selection.categoryFrameId ? selectedCategoryFrames.find(f => f.id === selection.categoryFrameId) : null
  const selectedList = selection.listId ? lists.find(l => l.id === selection.listId) : null
  const selectedItem = selectedList && selection.itemId ? selectedList.items.find(i => i.id === selection.itemId) : null
  const selectedItemFrame = selectedItem && selection.itemFrameId ? selectedItem.frames?.find(f => f.id === selection.itemFrameId) : null

  // FAQs for selected category
  const { faqs: categoryFAQs, addFAQ, updateFAQ, deleteFAQ, reorderFAQs } = useFAQs(selection.categoryId || null)

  // Home-level FAQs
  const {
    faqs: homeFAQs,
    addFAQ: addHomeFAQ,
    updateFAQ: updateHomeFAQ,
    deleteFAQ: deleteHomeFAQ,
    reorderFAQs: reorderHomeFAQs
  } = useHomeFAQs()

  // State for editing FAQs (shared between Home and Section FAQs)
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null)
  const [editingFAQQuestion, setEditingFAQQuestion] = useState('')
  const [editingFAQAnswer, setEditingFAQAnswer] = useState('')

  // Preview data
  const previewData: HomeSlydeData = {
    businessName: brandName,
    tagline,
    accentColor: brandProfile.primaryColor,
    backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',
    videoSrc,
    posterSrc: posterSrc || undefined,
    rating,
    reviewCount,
    about,
    address,
    phone,
    categories: categories.map(c => ({
      id: c.id,
      label: c.name,
      icon: c.icon,
      description: c.description,
      frames: [],
    })),
    showCategoryIcons,
    showHearts,
    showShare,
    showSound,
    showReviews,
    socialLinks,
  }

  const businessInfo: BusinessInfo = {
    id: 'demo',
    name: brandName,
    tagline,
    location: address,
    rating,
    reviewCount,
    credentials: [],
    about,
    highlights: [],
    contact: {
      phone: selectedCategory?.contactPhone || phone || undefined,
      email: selectedCategory?.contactEmail || undefined,
      whatsapp: selectedCategory?.contactWhatsapp || undefined,
    },
    accentColor: brandProfile.primaryColor,
  }

  // Location data - per-slyde (falls back to org-level address)
  const locationData: LocationData = {
    address: selectedCategory?.locationAddress || address || undefined,
    lat: selectedCategory?.locationLat,
    lng: selectedCategory?.locationLng,
  }

  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)

  // =============================================
  // FLATTEN HIERARCHY FOR LIST VIEW
  // =============================================
  type FlatItem = {
    id: string
    type: 'home' | 'category' | 'categoryFrame' | 'list' | 'item' | 'itemFrame'
    name: string
    depth: number
    icon: string | null
    meta?: string
    // Selection props
    categoryId?: string
    categoryFrameId?: string
    listId?: string
    itemId?: string
    itemFrameId?: string
    // For frame numbering
    frameIndex?: number
    // Image for items
    image?: string
  }

  const flattenedItems = useMemo((): FlatItem[] => {
    const items: FlatItem[] = []

    // Home
    items.push({
      id: 'home',
      type: 'home',
      name: 'Home',
      depth: 0,
      icon: 'home',
    })

    // Categories and their frames
    categories.forEach((cat) => {
      const catFrames = childFrames[cat.id] || []
      items.push({
        id: cat.id,
        type: 'category',
        name: cat.name,
        depth: 1,
        icon: cat.icon,
        meta: `${catFrames.length}f`,
        categoryId: cat.id,
      })

      // Category frames
      catFrames.forEach((frame, idx) => {
        const connectedList = frame.listId ? lists.find(l => l.id === frame.listId) : null
        items.push({
          id: frame.id,
          type: 'categoryFrame',
          name: frame.title || `Frame ${idx + 1}`,
          depth: 2,
          icon: null,
          meta: connectedList ? `📦 ${connectedList.items.length}` : undefined,
          categoryId: cat.id,
          categoryFrameId: frame.id,
          frameIndex: idx,
          listId: frame.listId,
        })

        // If frame has connected inventory, show items
        if (connectedList) {
          connectedList.items.forEach((item) => {
            const itemFrames = item.frames || []
            items.push({
              id: item.id,
              type: 'item',
              name: item.title,
              depth: 3,
              icon: null,
              meta: itemFrames.length > 0 ? `${itemFrames.length}f` : undefined,
              categoryId: cat.id,
              listId: connectedList.id,
              itemId: item.id,
              image: item.image,
            })

            // Item frames
            itemFrames.forEach((itemFrame, frameIdx) => {
              items.push({
                id: itemFrame.id,
                type: 'itemFrame',
                name: itemFrame.title || `Frame ${frameIdx + 1}`,
                depth: 4,
                icon: null,
                categoryId: cat.id,
                listId: connectedList.id,
                itemId: item.id,
                itemFrameId: itemFrame.id,
                frameIndex: frameIdx,
              })
            })
          })
        }
      })
    })

    return items
  }, [categories, childFrames, lists])

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      {/* Background Audio (hidden) - for preview playback */}
      {audioSrc && musicEnabled && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          muted={isMusicMuted}
          playsInline
          style={{ display: 'none' }}
        />
      )}

      <div className="flex h-screen">
        <HQSidebarConnected activePage="home-slyde" />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Studio</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {categories.length} categories • {lists.length} lists • {totalItems} items
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Preview Mode Button */}
              <button
                onClick={() => setShowDemoMode(true)}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                  <Play className="w-3 h-3 ml-0.5" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white">
                  Preview
                </span>
              </button>

              {/* Share Link Pill - Always visible */}
              {shareableLink && (
                <button
                  onClick={handleCopyLink}
                  className={`group inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border transition-all ${
                    linkCopied
                      ? 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    linkCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  }`}>
                    {linkCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    linkCopied
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}>
                    {linkCopied ? 'Copied!' : shareableLink}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
              >
                <UploadCloud className={`w-4 h-4 ${isPublishing ? 'animate-pulse' : ''}`} />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </header>

          {/* 3-Column Layout */}
          <div className="flex-1 flex overflow-hidden">

            {/* NAVIGATOR - Collapsible Tree */}
            <div className={`${navigatorSize === 'S' ? 'w-72' : navigatorSize === 'M' ? 'w-80' : 'w-96'} border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#1c1c1e]/80 overflow-y-auto transition-all duration-200`}>
              {/* View Mode Toggle + Size Toggle */}
              <div className="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Navigator</span>
                <div className="flex items-center gap-2">
                  {/* Size Toggle */}
                  <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                    {(['S', 'M', 'L'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setNavigatorSize(size)}
                        className={`px-1.5 py-1 rounded-md transition-all text-[10px] font-semibold ${
                          navigatorSize === size
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                            : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                        }`}
                        title={`${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} text`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-white/5 rounded-lg">
                    <button
                      onClick={() => setNavigatorViewMode('tree')}
                      className={`p-1.5 rounded-md transition-all ${
                        navigatorViewMode === 'tree'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                          : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                      }`}
                      title="Tree view"
                    >
                      <ListTree className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setNavigatorViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${
                        navigatorViewMode === 'list'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                          : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
                      }`}
                      title="List view"
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">

                {/* ========== TREE VIEW ========== */}
                {navigatorViewMode === 'tree' && (
                  <>
                    {/* HOME SECTION */}
                    <div>
                      <div
                        onClick={() => {
                          setPreviewMode('home')
                          setSelection({ type: 'home' })
                        }}
                        className={`group w-full flex items-center gap-2 ${sizes.padding} rounded-xl text-left transition-all cursor-pointer ${
                          selection.type === 'home'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                        } ${onboardingPulseTarget === 'nav-home' ? 'animate-pulse-hint' : ''}`}
                      >
                        <HomeIcon className={`${sizes.icon} ${selection.type === 'home' ? 'text-white' : 'text-gray-400 dark:text-white/40'}`} />
                        <span className={`${sizes.text} font-medium flex-1`}>Home</span>
                      </div>
                    </div>

                    {/* SECTIONS */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 mt-3">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="w-full flex items-center justify-between px-2 py-1 mb-1"
                  >
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                      Slydes ({categories.length}/6)
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.categories ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedSections.categories && (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                      <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-0.5">
                          {categories.map((cat) => {
                            const isSelected = selection.type === 'category' && selection.categoryId === cat.id
                            const isExpanded = expandedCategories.has(cat.id)
                            const isEditing = editingId === cat.id
                            const catFrames = childFrames[cat.id] || []

                            return (
                              <SortableSectionRow
                                key={cat.id}
                                cat={cat}
                                isSelected={isSelected}
                                isExpanded={isExpanded}
                                isEditing={isEditing}
                                catFrames={catFrames}
                                showCategoryIcons={showCategoryIcons}
                                editingValue={editingValue}
                                setEditingValue={setEditingValue}
                                editInputRef={editInputRef}
                                updateCategory={updateCategory}
                                cancelEditing={cancelEditing}
                                startEditing={startEditing}
                                deleteCategory={deleteCategory}
                                toggleCategory={toggleCategory}
                                selection={selection}
                                setSelection={setSelection}
                                expandedCategories={expandedCategories}
                                setExpandedCategories={setExpandedCategories}
                                loadCategoryFrames={loadCategoryFrames}
                                setPreviewFrameIndex={setPreviewFrameIndex}
                                setPreviewMode={setPreviewMode}
                                sizes={sizes}
                                shouldPulse={onboardingPulseTarget === `section-${cat.id}`}
                              >
                                {/* Category Frames (nested) */}
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFrameDragEnd(cat.id)}>
                                  <SortableContext items={catFrames.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                    <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                      {catFrames.map((frame, idx) => {
                                        const isFrameSelected = selection.type === 'categoryFrame' && selection.categoryId === cat.id && selection.categoryFrameId === frame.id
                                        const isFrameEditing = editingId === frame.id
                                        const isFrameExpanded = expandedFrames.has(frame.id)
                                        const connectedList = frame.listId ? lists.find(l => l.id === frame.listId) : null
                                        const hasInventory = !!connectedList

                                        return (
                                          <SortableFrameRow
                                            key={frame.id}
                                            frame={frame}
                                            idx={idx}
                                            categoryId={cat.id}
                                            isFrameSelected={isFrameSelected}
                                            isFrameEditing={isFrameEditing}
                                            isFrameExpanded={isFrameExpanded}
                                            hasInventory={hasInventory}
                                            connectedList={connectedList}
                                            catFramesLength={catFrames.length}
                                            editingValue={editingValue}
                                            setEditingValue={setEditingValue}
                                            editInputRef={editInputRef}
                                            updateCategoryFrame={updateCategoryFrame}
                                            cancelEditing={cancelEditing}
                                            startEditing={startEditing}
                                            deleteCategoryFrame={deleteCategoryFrame}
                                            toggleFrame={toggleFrame}
                                            setPreviewMode={setPreviewMode}
                                            setSelection={setSelection}
                                            setPreviewFrameIndex={setPreviewFrameIndex}
                                            sizes={sizes}
                                            shouldPulse={onboardingPulseTarget === `frame-${frame.id}`}
                                          >

                                      {/* Inventory Items (nested under frame) */}
                                      {isFrameExpanded && hasInventory && (
                                        <div className="ml-6 pl-2 border-l border-cyan-200 dark:border-cyan-500/20 mt-0.5 space-y-0.5">
                                          {connectedList.items.map((item) => {
                                            const isItemSelected = selection.type === 'item' && selection.itemId === item.id
                                            const isItemExpanded = expandedItems.has(item.id)
                                            const itemFrames = item.frames || []

                                            return (
                                              <div key={item.id}>
                                                {/* Item Row */}
                                                <div
                                                  onClick={() => {
                                                    setItemPreviewFrameIndex(0) // Reset frame index for new item
                                                    setSelection({ type: 'item', listId: connectedList.id, itemId: item.id, categoryId: cat.id })
                                                  }}
                                                  className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                                                    isItemSelected
                                                      ? 'bg-blue-50 dark:bg-white/10 text-gray-900 dark:text-white'
                                                      : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                                  }`}
                                                >
                                                  {itemFrames.length > 0 ? (
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleItem(item.id)
                                                      }}
                                                      className={`p-0.5 rounded transition-transform ${isItemExpanded ? 'rotate-90' : ''}`}
                                                    >
                                                      <ChevronRight className={`w-4 h-4 ${isItemSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
                                                    </button>
                                                  ) : (
                                                    <div className="w-5" />
                                                  )}

                                                  {item.image ? (
                                                    <img src={item.image} alt="" className="w-5 h-5 rounded object-cover" />
                                                  ) : (
                                                    <Package className={`w-4 h-4 ${isItemSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-gray-400'}`} />
                                                  )}

                                                  <span className="text-[12px] font-medium truncate flex-1">
                                                    {item.title}
                                                  </span>
                                                  {itemFrames.length > 0 && (
                                                    <span className="text-[10px] text-gray-400 dark:text-white/40">
                                                      {itemFrames.length}f
                                                    </span>
                                                  )}
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation()
                                                      deleteItem(connectedList.id, item.id)
                                                    }}
                                                    className="p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                                                  >
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                  </button>
                                                </div>

                                                {/* Item Frames (nested under item) */}
                                                {isItemExpanded && itemFrames.length > 0 && (
                                                  <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                                    {itemFrames.map((itemFrame, frameIdx) => {
                                                      const isItemFrameSelected = selection.type === 'itemFrame' && selection.itemFrameId === itemFrame.id

                                                      return (
                                                        <div
                                                          key={itemFrame.id}
                                                          onClick={() => {
                                                            setSelection({ type: 'itemFrame', listId: connectedList.id, itemId: item.id, itemFrameId: itemFrame.id, categoryId: cat.id })
                                                            setItemPreviewFrameIndex(frameIdx)
                                                          }}
                                                          className={`group w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition-all cursor-pointer ${
                                                            isItemFrameSelected
                                                              ? 'bg-blue-50 dark:bg-white/10 text-gray-900 dark:text-white'
                                                              : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                                          }`}
                                                        >
                                                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold ${
                                                            isItemFrameSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                                                          }`}>
                                                            {frameIdx + 1}
                                                          </div>
                                                          <span className="text-[11px] font-medium truncate flex-1">
                                                            {itemFrame.title || `Frame ${frameIdx + 1}`}
                                                          </span>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation()
                                                              deleteItemFrame(connectedList.id, item.id, itemFrame.id)
                                                            }}
                                                            disabled={itemFrames.length <= 1}
                                                            className={`p-0.5 rounded transition-all ${
                                                              itemFrames.length <= 1
                                                                ? 'opacity-20 cursor-not-allowed'
                                                                : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500'
                                                            }`}
                                                          >
                                                            <Trash2 className="w-2 h-2" />
                                                          </button>
                                                        </div>
                                                      )
                                                    })}

                                                    {/* Add Item Frame */}
                                                    <button
                                                      onClick={() => addItemFrame(connectedList.id, item.id)}
                                                      className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-[10px]"
                                                    >
                                                      <Plus className="w-2.5 h-2.5" />
                                                      <span>Add frame</span>
                                                    </button>
                                                  </div>
                                                )}

                                                {/* Add frame when item expanded but no frames yet */}
                                                {isItemExpanded && itemFrames.length === 0 && (
                                                  <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5">
                                                    <button
                                                      onClick={() => addItemFrame(connectedList.id, item.id)}
                                                      className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-[10px]"
                                                    >
                                                      <Plus className="w-2.5 h-2.5" />
                                                      <span>Add frame</span>
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          })}

                                          {/* Add Item */}
                                          <button
                                            onClick={() => addItem(connectedList.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors text-[11px]"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span>Add item</span>
                                          </button>
                                        </div>
                                      )}
                                          </SortableFrameRow>
                                        )
                                      })}

                                      {/* Add Frame */}
                                      <button
                                        onClick={() => addCategoryFrame(cat.id)}
                                        className={`w-full flex items-center justify-center gap-1.5 ${sizes.paddingSmall} rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors ${onboardingPulseTarget === 'add-frame' && isSelected && catFrames.length === 0 ? 'animate-pulse-hint' : ''}`}
                                      >
                                        <Plus className={sizes.iconSmall} />
                                        <span className={`${sizes.textXSmall} font-medium`}>Add frame</span>
                                      </button>
                                    </div>
                                  </SortableContext>
                                </DndContext>
                              </SortableSectionRow>
                            )
                          })}

                          {/* Add Section */}
                          {categories.length < 6 && (
                            <button
                              onClick={addCategory}
                              disabled={orgLoading || !organization}
                              className={`w-full flex items-center justify-center gap-1.5 ${sizes.padding} rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${onboardingPulseTarget === 'add-section' ? 'animate-pulse-hint' : ''}`}
                            >
                              <Plus className={sizes.icon} />
                              <span className={`${sizes.textSmall} font-medium`}>Add Slyde</span>
                            </button>
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
                </>
                )}

                {/* ========== LIST VIEW ========== */}
                {navigatorViewMode === 'list' && (
                  <div className="space-y-0.5">
                    {flattenedItems.map((item) => {
                      // Determine if this item is selected
                      const isSelected =
                        (item.type === 'home' && selection.type === 'home') ||
                        (item.type === 'category' && selection.type === 'category' && selection.categoryId === item.categoryId) ||
                        (item.type === 'categoryFrame' && selection.type === 'categoryFrame' && selection.categoryFrameId === item.categoryFrameId) ||
                        (item.type === 'item' && selection.type === 'item' && selection.itemId === item.itemId) ||
                        (item.type === 'itemFrame' && selection.type === 'itemFrame' && selection.itemFrameId === item.itemFrameId)

                      // Handle click - sections stay on Home preview, frames/items switch preview
                      const handleClick = () => {
                        if (item.type === 'home') {
                          setPreviewMode('home')
                          setSelection({ type: 'home' })
                        } else if (item.type === 'category') {
                          // Sections = metadata, stay on Home preview
                          setSelection({ type: 'category', categoryId: item.categoryId })
                          loadCategoryFrames(item.categoryId!)
                          setPreviewFrameIndex(0)
                        } else if (item.type === 'categoryFrame') {
                          // Frames = content, switch preview
                          setPreviewMode('category')
                          setSelection({ type: 'categoryFrame', categoryId: item.categoryId, categoryFrameId: item.categoryFrameId })
                          setPreviewFrameIndex(item.frameIndex ?? 0)
                        } else if (item.type === 'item') {
                          setPreviewMode('item')
                          setItemPreviewFrameIndex(0)
                          setSelection({ type: 'item', listId: item.listId, itemId: item.itemId, categoryId: item.categoryId })
                        } else if (item.type === 'itemFrame') {
                          setPreviewMode('item')
                          setSelection({ type: 'itemFrame', listId: item.listId, itemId: item.itemId, itemFrameId: item.itemFrameId, categoryId: item.categoryId })
                          setItemPreviewFrameIndex(item.frameIndex ?? 0)
                        }
                      }

                      return (
                        <ListViewItem
                          key={item.id}
                          item={item}
                          isSelected={isSelected}
                          onClick={handleClick}
                        />
                      )
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* PREVIEW - Phone */}
            <div className="flex-1 flex items-center justify-center bg-gray-100/50 dark:bg-[#1c1c1e]/50 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_50%)]" />
              <div
                className={`relative z-50 isolate pointer-events-auto ${onboardingPulseTarget === 'demo-preview' ? 'animate-pulse-hint rounded-[3rem]' : ''}`}
                onClick={() => {
                  // Fire confetti when user clicks the demo preview (onboarding complete!)
                  if (onboardingPulseTarget === 'demo-preview') {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#2563eb', '#06b6d4', '#8b5cf6', '#ec4899'],
                    })
                  }
                  setOnboardingVisited(v => ({ ...v, demoPreview: true }))
                }}
              >
                <DevicePreview enableTilt={false}>
                  {/* Home Preview - shown when previewMode is 'home' */}
                  {previewMode === 'home' && (
                    <HomeSlydeScreen
                      data={previewData}
                      backgroundType={backgroundType}
                      imageSrc={imageSrc}
                      videoFilter={videoFilter}
                      videoVignette={videoVignette}
                      videoSpeed={videoSpeed}
                      onCategoryTap={(categoryId) => {
                        // Tapping a category in preview = show its Cover
                        setExpandedCategories(prev => new Set([...prev, categoryId]))
                        setSelection({ type: 'category', categoryId })
                        setPreviewMode('cover')
                        loadCategoryFrames(categoryId)
                      }}
                    />
                  )}

                  {/* Cover Preview - shown when a Slyde/category is selected */}
                  {previewMode === 'cover' && selectedCategory && (
                    <SlydeCover
                      name={selectedCategory.name}
                      description={selectedCategory.description}
                      backgroundType={selectedCategory.coverBackgroundType}
                      videoSrc={selectedCategory.coverVideoStreamUid
                        ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${selectedCategory.coverVideoStreamUid}/manifest/video.m3u8`
                        : undefined}
                      imageSrc={selectedCategory.coverImageUrl}
                      posterSrc={selectedCategory.coverPosterUrl}
                      videoFilter={selectedCategory.coverVideoFilter}
                      videoVignette={selectedCategory.coverVideoVignette}
                      videoSpeed={selectedCategory.coverVideoSpeed}
                      locationData={selectedCategory.locationAddress ? {
                        address: selectedCategory.locationAddress,
                        lat: selectedCategory.locationLat,
                        lng: selectedCategory.locationLng,
                      } : undefined}
                      business={businessInfo}
                      socialLinks={socialLinks}
                      faqs={categoryFAQs}
                      accentColor={brandProfile.primaryColor}
                      onExplore={() => {
                        // Swipe up on Cover = enter frames mode
                        setPreviewMode('category')
                        // Select first frame if exists
                        const firstFrame = selectedCategoryFrames[0]
                        if (firstFrame) {
                          setSelection({ type: 'categoryFrame', categoryId: selection.categoryId, categoryFrameId: firstFrame.id })
                        }
                      }}
                      onBack={() => {
                        // Back from Cover = return to Home
                        setPreviewMode('home')
                        setSelection({ type: 'home' })
                      }}
                      showBack={true}
                    />
                  )}

                  {/* Category/Frame Preview - only when editing frames (not sections) */}
                  {previewMode === 'category' && selection.type === 'categoryFrame' && selectedCategory && (
                    selectedCategoryFrames.length > 0 ? (
                      <SlydeScreen
                        frames={selectedCategoryFrames}
                        business={businessInfo}
                        faqs={categoryFAQs}
                        context="category"
                        initialFrameIndex={previewFrameIndex}
                        onFrameChange={setPreviewFrameIndex}
                        autoAdvance={false}
                        onBack={() => {
                          // Back from frames = return to Cover
                          setPreviewMode('cover')
                          setSelection({ type: 'category', categoryId: selection.categoryId })
                        }}
                        onListView={(frame) => {
                          // When "View All" CTA is clicked, select the list
                          if (frame.listId) {
                            setExpandedLists(prev => new Set([...prev, frame.listId!]))
                            setPreviewMode('list')
                            setSelection({ type: 'list', listId: frame.listId, categoryId: selection.categoryId })
                          }
                        }}
                        audioSrc={audioSrc || undefined}
                        audioEnabled={musicEnabled}
                        isMuted={isMusicMuted}
                        onMuteToggle={handleMusicToggle}
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                        {/* Back button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewMode('cover')
                            setSelection({ type: 'category', categoryId: selection.categoryId })
                          }}
                          className="absolute top-4 left-4 z-50 flex items-center gap-1 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm font-medium">Back</span>
                        </button>
                        <Layers className="w-12 h-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">No frames yet</p>
                        <p className="text-gray-500 text-sm">Click "Add frame" to create one</p>
                      </div>
                    )
                  )}

                  {/* List Preview - Shows InventoryGridView as a sheet overlay */}
                  {previewMode === 'list' && selectedList && (
                    <div className="relative w-full h-full bg-gray-900">
                      <InventoryGridView
                        isOpen={true}
                        categoryName={selectedList.name}
                        items={selectedList.items.map(item => ({
                          id: item.id,
                          title: item.title,
                          subtitle: item.subtitle || '',
                          price: item.price || '',
                          image: item.image || '',
                          frames: (item.frames || []) as any,
                        }))}
                        onItemTap={(itemId) => {
                          // Expand the item in navigator and select it
                          setExpandedItems(prev => new Set([...prev, itemId]))
                          setPreviewMode('item')
                          setSelection({ type: 'item', listId: selectedList.id, itemId, categoryId: selection.categoryId })
                        }}
                        onClose={() => {
                          // Go back to home
                          setPreviewMode('home')
                          setSelection({ type: 'home' })
                        }}
                        accentColor={brandProfile.primaryColor}
                      />
                    </div>
                  )}

                  {/* Item Preview - Shows SlydeScreen if item has frames */}
                  {previewMode === 'item' && selectedItem && (
                    selectedItem.frames && selectedItem.frames.length > 0 ? (
                      <SlydeScreen
                        frames={selectedItem.frames}
                        business={businessInfo}
                        faqs={[]}
                        context="category"
                        initialFrameIndex={itemPreviewFrameIndex}
                        onFrameChange={setItemPreviewFrameIndex}
                        autoAdvance={false}
                        onBack={() => {
                          // Go back to list or home
                          if (selection.listId) {
                            setPreviewMode('list')
                            setSelection({ type: 'list', listId: selection.listId, categoryId: selection.categoryId })
                          } else {
                            setPreviewMode('home')
                            setSelection({ type: 'home' })
                          }
                        }}
                        audioSrc={audioSrc || undefined}
                        audioEnabled={musicEnabled}
                        isMuted={isMusicMuted}
                        onMuteToggle={handleMusicToggle}
                        locationData={locationData}
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                        {/* Back button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selection.listId) {
                              setPreviewMode('list')
                              setSelection({ type: 'list', listId: selection.listId, categoryId: selection.categoryId })
                            } else {
                              setPreviewMode('home')
                              setSelection({ type: 'home' })
                            }
                          }}
                          className="absolute top-4 left-4 z-50 flex items-center gap-1 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm font-medium">Back</span>
                        </button>
                        {selectedItem.image ? (
                          <img src={selectedItem.image} alt="" className="w-24 h-24 rounded-2xl object-cover mb-4" />
                        ) : (
                          <Package className="w-12 h-12 text-cyan-500 mb-4" />
                        )}
                        <p className="text-white font-medium">{selectedItem.title}</p>
                        {selectedItem.subtitle && <p className="text-gray-400 text-sm">{selectedItem.subtitle}</p>}
                        {selectedItem.price && <p className="text-cyan-400 font-semibold mt-2">{selectedItem.price}</p>}
                        <p className="text-gray-500 text-xs mt-3">No frames - add one to preview</p>
                      </div>
                    )
                  )}
                </DevicePreview>
              </div>
            </div>

            {/* INSPECTOR - Contextual Editor */}
            <div className={`${navigatorSize === 'S' ? 'w-80' : navigatorSize === 'M' ? 'w-96' : 'w-[28rem]'} border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 overflow-y-auto transition-all duration-200`}>

              {/* HOME INSPECTOR */}
              {selection.type === 'home' && (
                <div className={`${sizes.inspectorPadding} space-y-4`}>
                  <h3 className={`${sizes.inspectorTitle} font-semibold text-gray-900 dark:text-white`}>Home Settings</h3>

                  {/* Business Info Section - Identity first */}
                  <div className={`rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden ${onboardingPulseTarget === 'home-brand-section' ? 'animate-pulse-hint' : ''}`}>
                    <button
                      onClick={() => toggleInspectorSection('brand')}
                      className={`w-full flex items-center justify-between ${sizes.inspectorSectionPadding} bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
                    >
                      <span className={`${sizes.inspectorSectionTitle} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
                        <Building2 className={`${sizes.icon} text-gray-500 dark:text-white/50`} />
                        Business Info
                      </span>
                      <ChevronDown className={`${sizes.icon} text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.brand ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.brand && (
                      <div className={`${sizes.inspectorContentPadding} space-y-3 border-t border-gray-200 dark:border-white/10`}>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>Business Name</label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 ${onboardingPulseTarget === 'home-brand-name-input' ? 'animate-pulse-hint' : ''}`}
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>Shown on home screen and profile pill</p>
                        </div>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>Tagline</label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40`}
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>Appears below your business name</p>
                        </div>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>About</label>
                          <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={3}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 resize-none`}
                            placeholder="Tell customers about your business..."
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>Shown when visitors tap your profile</p>
                        </div>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>Location</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40`}
                            placeholder="London, Highlands, etc."
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>City or area displayed in your profile</p>
                        </div>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>Phone</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40`}
                            placeholder="+44 123..."
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>Call button in your profile sheet</p>
                        </div>
                        <div>
                          <label className={`block ${sizes.inspectorLabel} font-medium text-gray-700 dark:text-white/70 mb-1.5`}>Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full ${sizes.inspectorInput} bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40`}
                            placeholder="hello@..."
                          />
                          <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40 mt-1`}>Email button in your profile sheet</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Section - Visual layer */}
                  <div className={`rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden ${onboardingPulseTarget === 'home-background-section' ? 'animate-pulse-hint' : ''}`}>
                    <button
                      onClick={() => toggleInspectorSection('video')}
                      className={`w-full flex items-center justify-between ${sizes.inspectorSectionPadding} bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
                    >
                      <span className={`${sizes.inspectorSectionTitle} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
                        <Video className={`${sizes.icon} text-gray-500 dark:text-white/50`} />
                        Background
                      </span>
                      <ChevronDown className={`${sizes.icon} text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.video ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.video && (
                      <div className={`${sizes.inspectorContentPadding} border-t border-gray-200 dark:border-white/10`}>
                        <BackgroundMediaInput
                          backgroundType={backgroundType}
                          onBackgroundTypeChange={setBackgroundType}
                          videoSrc={videoSrc}
                          onVideoSrcChange={setVideoSrc}
                          imageSrc={imageSrc}
                          onImageSrcChange={setImageSrc}
                          filter={videoFilter}
                          onFilterChange={setVideoFilter}
                          vignette={videoVignette}
                          onVignetteChange={setVideoVignette}
                          speed={videoSpeed}
                          onSpeedChange={setVideoSpeed}
                          startTime={videoStartTime}
                          onStartTimeChange={setVideoStartTime}
                          shouldPulseInput={onboardingPulseTarget === 'home-background-input'}
                        />
                      </div>
                    )}
                  </div>

                  {/* Music Section */}
                  <div className={`rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden ${onboardingPulseTarget === 'home-music-section' ? 'animate-pulse-hint' : ''}`}>
                    <button
                      onClick={() => toggleInspectorSection('music')}
                      className={`w-full flex items-center justify-between ${sizes.inspectorSectionPadding} bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
                    >
                      <span className={`${sizes.inspectorSectionTitle} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
                        <Music className={`${sizes.icon} text-gray-500 dark:text-white/50`} />
                        Music
                      </span>
                      <ChevronDown className={`${sizes.icon} text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.music ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.music && (
                      <div className={`${sizes.inspectorContentPadding} border-t border-gray-200 dark:border-white/10`}>
                        <MusicSelector
                          enabled={musicEnabled}
                          onEnabledChange={setMusicEnabled}
                          customUrl={musicCustomUrl}
                          onCustomUrlChange={setMusicCustomUrl}
                          shouldPulse={onboardingPulseTarget === 'home-music-selector'}
                        />
                      </div>
                    )}
                  </div>

                  {/* Social Media Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('socialMedia')}
                      className={`w-full flex items-center justify-between ${sizes.inspectorSectionPadding} bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}
                    >
                      <span className={`${sizes.inspectorSectionTitle} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
                        <AtSign className={`${sizes.icon} text-gray-500 dark:text-white/50`} />
                        Social Media
                      </span>
                      <ChevronDown className={`${sizes.icon} text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.socialMedia ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.socialMedia && (
                      <div className={`${sizes.inspectorContentPadding} space-y-3 border-t border-gray-200 dark:border-white/10`}>
                        <p className={`${sizes.inspectorHint} text-gray-500 dark:text-white/40`}>
                          Add your social profiles. The Connect button will appear when at least one link is set.
                        </p>

                        {/* Instagram */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <Instagram className="w-3.5 h-3.5" />
                            Instagram
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={socialLinks.instagram || ''}
                              onChange={(e) => {
                                setSocialLinks(prev => ({ ...prev, instagram: e.target.value || undefined }))
                                if (e.target.value) {
                                  saveInstagramHandle(e.target.value)
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                              placeholder="https://instagram.com/yourbusiness"
                            />
                            <input
                              type="number"
                              defaultValue={organization?.instagram_followers || ''}
                              onChange={(e) => {
                                const followers = e.target.value ? parseInt(e.target.value, 10) : undefined
                                if (socialLinks.instagram) {
                                  saveInstagramHandle(socialLinks.instagram, followers)
                                }
                              }}
                              className="w-24 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Followers"
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">Helps us tailor your experience</p>
                        </div>

                        {/* TikTok */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                            TikTok
                            {organization?.tiktok_followers && (
                              <span className="ml-auto text-[10px] text-blue-500 font-medium">
                                {organization.tiktok_followers.toLocaleString()} followers
                              </span>
                            )}
                          </label>
                          <input
                            type="url"
                            value={socialLinks.tiktok || ''}
                            onChange={(e) => {
                              setSocialLinks(prev => ({ ...prev, tiktok: e.target.value || undefined }))
                              // Auto-fetch follower count when URL is entered
                              if (e.target.value) {
                                fetchTikTokFollowers(e.target.value)
                              }
                            }}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            placeholder="https://tiktok.com/@yourbusiness"
                          />
                        </div>

                        {/* Facebook */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <Facebook className="w-3.5 h-3.5" />
                            Facebook
                          </label>
                          <input
                            type="url"
                            value={socialLinks.facebook || ''}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value || undefined }))}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            placeholder="https://facebook.com/yourbusiness"
                          />
                        </div>

                        {/* YouTube */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <Youtube className="w-3.5 h-3.5" />
                            YouTube
                          </label>
                          <input
                            type="url"
                            value={socialLinks.youtube || ''}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value || undefined }))}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            placeholder="https://youtube.com/@yourbusiness"
                          />
                        </div>

                        {/* Twitter/X */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            X (Twitter)
                          </label>
                          <input
                            type="url"
                            value={socialLinks.twitter || ''}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value || undefined }))}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            placeholder="https://x.com/yourbusiness"
                          />
                        </div>

                        {/* LinkedIn */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={socialLinks.linkedin || ''}
                            onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value || undefined }))}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            placeholder="https://linkedin.com/company/yourbusiness"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('settings')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Display
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.settings ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.settings && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <p className="text-[11px] text-gray-500 dark:text-white/40">Control which elements appear on your home screen</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show section icons</span>
                          <Toggle enabled={showCategoryIcons} onChange={setShowCategoryIcons} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show hearts</span>
                          <Toggle enabled={showHearts} onChange={setShowHearts} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show share</span>
                          <Toggle enabled={showShare} onChange={setShowShare} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show sound</span>
                          <Toggle enabled={showSound} onChange={setShowSound} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show reviews</span>
                          <Toggle enabled={showReviews} onChange={setShowReviews} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Home FAQs Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('homeFaqs')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Home FAQ ({homeFAQs.length})
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.homeFaqs ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.homeFaqs && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <p className="text-[12px] text-gray-500 dark:text-white/50">
                          Business-wide questions shown in the Home info button (ⓘ)
                        </p>

                        {/* Home FAQ List */}
                        {homeFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className={`rounded-lg border ${
                              editingFAQId === faq.id
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5'
                                : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5'
                            } overflow-hidden`}
                          >
                            {editingFAQId === faq.id ? (
                              /* Edit mode */
                              <div className="p-3 space-y-3">
                                <div>
                                  <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Question</label>
                                  <input
                                    type="text"
                                    value={editingFAQQuestion}
                                    onChange={(e) => setEditingFAQQuestion(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                                    placeholder="What's your question?"
                                    autoFocus
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Answer</label>
                                  <textarea
                                    value={editingFAQAnswer}
                                    onChange={(e) => setEditingFAQAnswer(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40 resize-none"
                                    placeholder="Provide a helpful answer..."
                                  />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <button
                                    onClick={() => {
                                      deleteHomeFAQ(faq.id)
                                      setEditingFAQId(null)
                                    }}
                                    className="px-3 py-1.5 text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    Delete
                                  </button>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setEditingFAQId(null)}
                                      className="px-3 py-1.5 text-[12px] text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateHomeFAQ(faq.id, {
                                          question: editingFAQQuestion,
                                          answer: editingFAQAnswer,
                                        })
                                        setEditingFAQId(null)
                                      }}
                                      className="px-3 py-1.5 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Display mode */
                              <button
                                onClick={() => {
                                  setEditingFAQId(faq.id)
                                  setEditingFAQQuestion(faq.question)
                                  setEditingFAQAnswer(faq.answer)
                                }}
                                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <div className="flex items-start gap-2">
                                  <GripVertical className="w-4 h-4 text-gray-300 dark:text-white/20 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                                      {faq.question || 'Untitled question'}
                                    </p>
                                    <p className="text-[12px] text-gray-500 dark:text-white/50 truncate mt-0.5">
                                      {faq.answer || 'No answer yet'}
                                    </p>
                                  </div>
                                  <Pencil className="w-3.5 h-3.5 text-gray-400 dark:text-white/30 flex-shrink-0" />
                                </div>
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add Home FAQ Button */}
                        <button
                          onClick={() => {
                            const newId = addHomeFAQ({ question: '', answer: '' })
                            setEditingFAQId(newId)
                            setEditingFAQQuestion('')
                            setEditingFAQAnswer('')
                          }}
                          className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg text-[13px] text-gray-500 dark:text-white/50 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-600 dark:hover:text-white/60 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add FAQ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION INSPECTOR */}
              {selection.type === 'category' && selectedCategory && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Section</h3>
                    <button
                      onClick={() => deleteCategory(selectedCategory.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Slyde Name</label>
                      <input
                        type="text"
                        value={selectedCategory.name}
                        onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40 ${onboardingPulseTarget === 'category-name-input' ? 'animate-pulse-hint' : ''}`}
                      />
                      <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">The main title shown in the slydes drawer</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Slyde Subtitle</label>
                      <input
                        type="text"
                        value={selectedCategory.description || ''}
                        onChange={(e) => updateCategory(selectedCategory.id, { description: e.target.value })}
                        placeholder="e.g. Browse our latest offers"
                        className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40 ${onboardingPulseTarget === 'category-subtitle-input' ? 'animate-pulse-hint' : ''}`}
                      />
                      <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Appears below the name in the drawer</p>
                    </div>

                    {showCategoryIcons && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Icon</label>
                        <div className="grid grid-cols-4 gap-2">
                          {CATEGORY_ICONS.map(({ id, Icon }) => (
                            <button
                              key={id}
                              onClick={() => updateCategory(selectedCategory.id, { icon: id })}
                              className={`p-3 rounded-xl border-2 transition-all ${
                                selectedCategory.icon === id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                  : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                              }`}
                            >
                              <Icon className={`w-5 h-5 mx-auto ${
                                selectedCategory.icon === id
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cover Background Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleInspectorSection('cover')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                            Cover Background
                          </span>
                          {(selectedCategory.coverVideoStreamUid || selectedCategory.coverImageUrl) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                              Set
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.cover ? '' : '-rotate-90'}`} />
                      </button>
                      {inspectorSections.cover && (
                        <div className="p-4 border-t border-gray-200 dark:border-white/10">
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mb-3">
                            The landing page shown when users tap this Slyde
                          </p>
                          <BackgroundMediaInput
                            context="frame"
                            backgroundType={selectedCategory.coverBackgroundType || 'video'}
                            onBackgroundTypeChange={(type) => updateCategory(selectedCategory.id, { coverBackgroundType: type })}
                            videoSrc={selectedCategory.coverVideoStreamUid ? `https://customer-${process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH}.cloudflarestream.com/${selectedCategory.coverVideoStreamUid}/manifest/video.m3u8` : ''}
                            onVideoSrcChange={(src) => {
                              // Extract stream UID from Cloudflare HLS URL
                              const match = src.match(/cloudflarestream\.com\/([^/]+)\/manifest/)
                              const streamUid = match ? match[1] : undefined
                              updateCategory(selectedCategory.id, {
                                coverBackgroundType: 'video',
                                coverVideoStreamUid: streamUid,
                                coverImageUrl: undefined,
                              })
                            }}
                            imageSrc={selectedCategory.coverBackgroundType === 'image' ? (selectedCategory.coverImageUrl || '') : ''}
                            onImageSrcChange={(src) => updateCategory(selectedCategory.id, {
                              coverBackgroundType: 'image',
                              coverImageUrl: src,
                              coverVideoStreamUid: undefined,
                            })}
                            filter={selectedCategory.coverVideoFilter || 'original'}
                            onFilterChange={(filter) => updateCategory(selectedCategory.id, { coverVideoFilter: filter })}
                            vignette={selectedCategory.coverVideoVignette || false}
                            onVignetteChange={(vignette) => updateCategory(selectedCategory.id, { coverVideoVignette: vignette })}
                            speed={selectedCategory.coverVideoSpeed || 'normal'}
                            onSpeedChange={(speed) => updateCategory(selectedCategory.id, { coverVideoSpeed: speed })}
                          />
                        </div>
                      )}
                    </div>

                    {/* Contact Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleInspectorSection('contact')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                            Contact Details
                          </span>
                          {(selectedCategory.contactPhone || selectedCategory.contactEmail || selectedCategory.contactWhatsapp) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                              Set
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.contact ? '' : '-rotate-90'}`} />
                      </button>
                      {inspectorSections.contact && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <p className="text-[11px] text-gray-500 dark:text-white/40">
                            Shown in the Info sheet for this Slyde
                          </p>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Phone</label>
                            <input
                              type="tel"
                              value={selectedCategory.contactPhone || ''}
                              onChange={(e) => updateCategory(selectedCategory.id, { contactPhone: e.target.value })}
                              placeholder="+44 1234 567890"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Email</label>
                            <input
                              type="email"
                              value={selectedCategory.contactEmail || ''}
                              onChange={(e) => updateCategory(selectedCategory.id, { contactEmail: e.target.value })}
                              placeholder="hello@example.com"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">WhatsApp</label>
                            <input
                              type="tel"
                              value={selectedCategory.contactWhatsapp || ''}
                              onChange={(e) => updateCategory(selectedCategory.id, { contactWhatsapp: e.target.value })}
                              placeholder="+44 7123 456789"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                            />
                            <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">
                              Include country code for WhatsApp links
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location Section */}
                    <FeaturesSection
                      isExpanded={inspectorSections.features}
                      onToggle={() => toggleInspectorSection('features')}
                      locationAddress={selectedCategory.locationAddress}
                      onLocationAddressChange={(address) => updateCategory(selectedCategory.id, { locationAddress: address })}
                    />

                    {/* FAQs Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleInspectorSection('faqs')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Section FAQ ({categoryFAQs.length})
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${inspectorSections.faqs ? '' : '-rotate-90'}`} />
                      </button>
                      {inspectorSections.faqs && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <p className="text-[12px] text-gray-500 dark:text-white/50">
                            Questions shown in the info button (ⓘ) for this section
                          </p>

                          {/* FAQ List */}
                          {categoryFAQs.map((faq, index) => (
                            <div
                              key={faq.id}
                              className={`rounded-lg border ${
                                editingFAQId === faq.id
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/5'
                                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5'
                              } overflow-hidden`}
                            >
                              {editingFAQId === faq.id ? (
                                /* Edit mode */
                                <div className="p-3 space-y-3">
                                  <div>
                                    <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Question</label>
                                    <input
                                      type="text"
                                      value={editingFAQQuestion}
                                      onChange={(e) => setEditingFAQQuestion(e.target.value)}
                                      className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40"
                                      placeholder="What's your question?"
                                      autoFocus
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1">Answer</label>
                                    <textarea
                                      value={editingFAQAnswer}
                                      onChange={(e) => setEditingFAQAnswer(e.target.value)}
                                      rows={3}
                                      className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leader-blue/40 resize-none"
                                      placeholder="Provide a helpful answer..."
                                    />
                                  </div>
                                  <div className="flex items-center justify-between pt-2">
                                    <button
                                      onClick={() => {
                                        deleteFAQ(faq.id)
                                        setEditingFAQId(null)
                                      }}
                                      className="px-3 py-1.5 text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                      Delete
                                    </button>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => setEditingFAQId(null)}
                                        className="px-3 py-1.5 text-[12px] text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          updateFAQ(faq.id, {
                                            question: editingFAQQuestion,
                                            answer: editingFAQAnswer,
                                          })
                                          setEditingFAQId(null)
                                        }}
                                        className="px-3 py-1.5 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Display mode */
                                <button
                                  onClick={() => {
                                    setEditingFAQId(faq.id)
                                    setEditingFAQQuestion(faq.question)
                                    setEditingFAQAnswer(faq.answer)
                                  }}
                                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-start gap-2">
                                    <GripVertical className="w-4 h-4 text-gray-300 dark:text-white/20 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                                        {faq.question || 'Untitled question'}
                                      </p>
                                      <p className="text-[12px] text-gray-500 dark:text-white/50 truncate mt-0.5">
                                        {faq.answer || 'No answer yet'}
                                      </p>
                                    </div>
                                    <Pencil className="w-3.5 h-3.5 text-gray-400 dark:text-white/30 flex-shrink-0" />
                                  </div>
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add FAQ Button */}
                          <button
                            onClick={() => {
                              const newId = addFAQ({ question: '', answer: '' })
                              setEditingFAQId(newId)
                              setEditingFAQQuestion('')
                              setEditingFAQAnswer('')
                            }}
                            className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg text-[13px] text-gray-500 dark:text-white/50 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-600 dark:hover:text-white/60 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add FAQ
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* CATEGORY FRAME INSPECTOR */}
              {selection.type === 'categoryFrame' && selectedCategoryFrame && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frame Editor</h3>
                  </div>

                  {/* Content Section - What does this frame say? */}
                  <div className={`rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden ${onboardingPulseTarget === 'frame-content-section' ? 'animate-pulse-hint' : ''}`}>
                    <button
                      onClick={() => toggleInspectorSection('content')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Content
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.content ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.content && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                          <input
                            type="text"
                            value={selectedCategoryFrame.title || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { title: e.target.value })}
                            className={`w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 ${onboardingPulseTarget === 'frame-content-title-input' ? 'animate-pulse-hint' : ''}`}
                          />
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Main heading shown on this frame</p>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={selectedCategoryFrame.subtitle || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                          />
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Supporting text below the title</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Background Section - Visual layer */}
                  <div className={`rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden ${onboardingPulseTarget === 'frame-background-section' ? 'animate-pulse-hint' : ''}`}>
                    <button
                      onClick={() => toggleInspectorSection('video')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Background
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.video ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.video && (
                      <div className="p-4 border-t border-gray-200 dark:border-white/10">
                        <BackgroundMediaInput
                          context="frame"
                          backgroundType={selectedCategoryFrame.background?.type || 'video'}
                          onBackgroundTypeChange={(type) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, type }
                          })}
                          videoSrc={selectedCategoryFrame.background?.type === 'video' ? (selectedCategoryFrame.background?.src || '') : ''}
                          onVideoSrcChange={(src) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, type: 'video', src }
                          })}
                          imageSrc={selectedCategoryFrame.background?.type === 'image' ? (selectedCategoryFrame.background?.src || '') : ''}
                          onImageSrcChange={(src) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, type: 'image', src }
                          })}
                          filter={selectedCategoryFrame.background?.filter || 'original'}
                          onFilterChange={(filter) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, filter }
                          })}
                          vignette={selectedCategoryFrame.background?.vignette || false}
                          onVignetteChange={(vignette) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, vignette }
                          })}
                          speed={selectedCategoryFrame.background?.speed || 'normal'}
                          onSpeedChange={(speed) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, speed }
                          })}
                          startTime={selectedCategoryFrame.background?.startTime || 0}
                          onStartTimeChange={(startTime) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                            background: { ...selectedCategoryFrame.background, startTime }
                          })}
                          shouldPulseInput={onboardingPulseTarget === 'frame-background-input'}
                        />
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('cta')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        CTA Button
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.cta ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.cta && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Enable CTA button</span>
                          <Toggle
                            enabled={!!selectedCategoryFrame.cta}
                            onChange={(enabled) => {
                              if (enabled) {
                                updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { text: 'Learn More', type: 'link', value: '' } })
                              } else {
                                updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: undefined })
                              }
                            }}
                          />
                        </div>
                        {selectedCategoryFrame.cta && (() => {
                          // Determine current type from new type field or legacy action field
                          const currentType = selectedCategoryFrame.cta.type ||
                            (selectedCategoryFrame.cta.action?.startsWith('http') ? 'link' :
                             selectedCategoryFrame.cta.action === 'info' ? 'info' :
                             selectedCategoryFrame.cta.action === 'faq' ? 'faq' :
                             selectedCategoryFrame.cta.action === 'reviews' ? 'reviews' :
                             selectedCategoryFrame.cta.action === 'list' ? 'list' : 'link') as CTAType
                          const selectedCtaType = CTA_TYPES.find(t => t.value === currentType) || CTA_TYPES[1] // default to 'link'

                          return (
                          <>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button text</label>
                              <input
                                type="text"
                                value={selectedCategoryFrame.cta.text}
                                onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, text: e.target.value } })}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Type</label>
                              <div className="grid grid-cols-4 gap-2">
                                {CTA_TYPES.map(({ value, label, Icon, defaultText }) => (
                                  <button
                                    key={value}
                                    onClick={() => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                      cta: { ...selectedCategoryFrame.cta!, type: value, icon: value as CTAIconType, value: '', text: defaultText }
                                    })}
                                    className={`py-2 px-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                                      currentType === value
                                        ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                                    title={label}
                                  >
                                    <Icon className={`w-4 h-4 ${currentType === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} />
                                    <span className={`text-[10px] ${currentType === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-white/50'}`}>{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Dynamic input based on type */}
                            {selectedCtaType.inputType === 'tel' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Phone Number</label>
                                <input
                                  type="tel"
                                  value={selectedCategoryFrame.cta.value || ''}
                                  onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, value: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'url' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                                  {currentType === 'directions' ? 'Maps Link or Address' : 'URL'}
                                </label>
                                <input
                                  type="url"
                                  value={selectedCategoryFrame.cta.value || selectedCategoryFrame.cta.action || ''}
                                  onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, value: e.target.value, action: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'email' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Email Address</label>
                                <input
                                  type="email"
                                  value={selectedCategoryFrame.cta.value || ''}
                                  onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, value: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'frame-select' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Target Frame</label>
                                <select
                                  value={selectedCategoryFrame.cta.value || ''}
                                  onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, value: e.target.value } })}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                >
                                  <option value="">Select a frame...</option>
                                  {selectedCategoryFrames.map((frame, idx) => (
                                    <option key={frame.id} value={idx.toString()}>
                                      Frame {idx + 1}: {frame.title || 'Untitled'}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        )})()}
                      </div>
                    )}
                  </div>

                  {/* Info Sheet Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('info')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Info Sheet
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.info ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.info && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <p className="text-[12px] text-gray-500 dark:text-white/50">
                          Content shown when users tap the ⓘ Info button on this frame.
                        </p>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Headline</label>
                          <input
                            type="text"
                            value={selectedCategoryFrame.infoContent?.headline || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                              infoContent: { ...selectedCategoryFrame.infoContent, headline: e.target.value, description: selectedCategoryFrame.infoContent?.description || '', items: selectedCategoryFrame.infoContent?.items || [] }
                            })}
                            placeholder="e.g. The Full Experience"
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Description</label>
                          <textarea
                            value={selectedCategoryFrame.infoContent?.description || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                              infoContent: { headline: selectedCategoryFrame.infoContent?.headline || '', description: e.target.value, items: selectedCategoryFrame.infoContent?.items || [] }
                            })}
                            rows={3}
                            placeholder="Detailed description for this frame..."
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">List Items (one per line)</label>
                          <textarea
                            value={selectedCategoryFrame.infoContent?.items?.join('\n') || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                              infoContent: {
                                headline: selectedCategoryFrame.infoContent?.headline || '',
                                description: selectedCategoryFrame.infoContent?.description || '',
                                items: e.target.value.split('\n').filter(Boolean)
                              }
                            })}
                            rows={4}
                            placeholder={"Rooftop tent\nKitchen setup\nBedding\nChairs & table"}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 resize-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Section - Only shows when org vertical is 'property' */}
                  {organization?.vertical === 'property' && (
                    <PropertySection
                      isExpanded={inspectorSections.property}
                      onToggle={() => toggleInspectorSection('property')}
                      property={selectedCategoryFrame.property}
                      onPropertyChange={(property) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { property })}
                    />
                  )}

                  {/* Delete Frame Button */}
                  <button
                    onClick={() => deleteCategoryFrame(selection.categoryId!, selectedCategoryFrame.id)}
                    disabled={selectedCategoryFrames.length <= 1}
                    className="w-full py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete This Frame
                  </button>

                  {/* List Section - Only shows when Lists feature is enabled */}
                  {organization?.features_enabled?.lists && (
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('inventory')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        List
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedCategoryFrame.listId && (
                          <span className="text-[11px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">Connected</span>
                        )}
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.inventory ? '' : '-rotate-90'}`} />
                      </div>
                    </button>
                    {inspectorSections.inventory && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        {lists.length === 0 ? (
                          <div className="text-center py-2">
                            <p className="text-[12px] text-gray-500 dark:text-white/50 mb-2">
                              Create a List to connect inventory to this frame
                            </p>
                            <button
                              onClick={() => {
                                // Create a new list and auto-connect it
                                const newList = {
                                  id: crypto.randomUUID(),
                                  name: 'New List',
                                  items: []
                                }
                                setLists(prev => [...prev, newList])
                                updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                  listId: newList.id,
                                  inventoryCtaText: 'View All',
                                  cta: {
                                    text: 'View All',
                                    icon: 'list' as const,
                                    action: 'list',
                                    listId: newList.id
                                  }
                                })
                                setExpandedSections(prev => ({ ...prev, lists: true }))
                              }}
                              className="text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                            >
                              + Create a list
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-white/60">Connect inventory list</span>
                              <Toggle
                                enabled={!!selectedCategoryFrame.listId}
                                onChange={(enabled) => {
                                  if (enabled && lists.length > 0) {
                                    updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                      listId: lists[0].id,
                                      inventoryCtaText: 'View All',
                                      cta: {
                                        text: 'View All',
                                        icon: 'list' as const,
                                        action: 'list',
                                        listId: lists[0].id
                                      }
                                    })
                                  } else {
                                    updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                      listId: undefined,
                                      inventoryCtaText: undefined,
                                      cta: undefined
                                    })
                                  }
                                }}
                              />
                            </div>
                            {selectedCategoryFrame.listId && (
                              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-white/10">
                                <div>
                                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Connected List</label>
                                  <select
                                    value={selectedCategoryFrame.listId || ''}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      if (val === '__create_new__') {
                                        // Create a new list and connect it
                                        const newList = {
                                          id: crypto.randomUUID(),
                                          name: 'New List',
                                          items: []
                                        }
                                        setLists(prev => [...prev, newList])
                                        updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                          listId: newList.id,
                                          cta: {
                                            text: selectedCategoryFrame.inventoryCtaText || 'View All',
                                            icon: 'list' as const,
                                            action: 'list',
                                            listId: newList.id
                                          }
                                        })
                                        // Expand lists section and select the new list
                                        setExpandedSections(prev => ({ ...prev, lists: true }))
                                      } else {
                                        const newListId = val || undefined
                                        updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                          listId: newListId,
                                          cta: newListId ? {
                                            text: selectedCategoryFrame.inventoryCtaText || 'View All',
                                            icon: 'list' as const,
                                            action: 'list',
                                            listId: newListId
                                          } : undefined
                                        })
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                  >
                                    <option value="">Select a list...</option>
                                    {lists.map((list) => (
                                      <option key={list.id} value={list.id}>
                                        {list.name} ({list.items.length} items)
                                      </option>
                                    ))}
                                    <option value="__create_new__" className="text-blue-600 dark:text-cyan-400">+ Create new list</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">List Name</label>
                                  <input
                                    type="text"
                                    value={lists.find(l => l.id === selectedCategoryFrame.listId)?.name || ''}
                                    onChange={(e) => {
                                      const listId = selectedCategoryFrame.listId
                                      if (listId) {
                                        setLists(prev => prev.map(l =>
                                          l.id === listId ? { ...l, name: e.target.value } : l
                                        ))
                                      }
                                    }}
                                    placeholder="e.g. Our Vehicles, Menu Items..."
                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                  />
                                  <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Name your inventory list</p>
                                </div>
                                <div>
                                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">CTA Button Text</label>
                                  <input
                                    type="text"
                                    value={selectedCategoryFrame.inventoryCtaText ?? ''}
                                    onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                      inventoryCtaText: e.target.value || undefined,
                                      cta: selectedCategoryFrame.cta ? {
                                        ...selectedCategoryFrame.cta,
                                        text: e.target.value || 'View All'
                                      } : undefined
                                    })}
                                    placeholder="e.g. View All, Browse Items..."
                                    className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                  />
                                  <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Button text that opens the inventory list</p>
                                </div>
                                <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                                  <button
                                    onClick={() => {
                                      const listId = selectedCategoryFrame.listId
                                      if (listId && confirm('Delete this list? This will also disconnect it from this frame.')) {
                                        // Disconnect from frame first
                                        updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                          listId: undefined,
                                          inventoryCtaText: undefined,
                                          cta: undefined
                                        })
                                        // Then delete the list
                                        setLists(prev => prev.filter(l => l.id !== listId))
                                      }
                                    }}
                                    className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    Delete List
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}

              {/* LIST INSPECTOR */}
              {selection.type === 'list' && selectedList && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">List Settings</h3>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">List Name</label>
                    <input
                      type="text"
                      value={selectedList.name}
                      onChange={(e) => updateListById(selectedList.id, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. Our Vehicles, Hair Products"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Internal name for organizing your lists</p>
                  </div>

                  {/* List Items */}
                  <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                        Items ({selectedList.items.length})
                      </span>
                      <button
                        onClick={() => addItem(selectedList.id)}
                        className="text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        + Add Item
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedList.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(selectedList.id, item.id, { title: e.target.value })}
                                className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                placeholder="Item title"
                              />
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                onChange={(e) => updateItem(selectedList.id, item.id, { subtitle: e.target.value })}
                                className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                placeholder="Subtitle (optional)"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.price || ''}
                                  onChange={(e) => updateItem(selectedList.id, item.id, { price: e.target.value })}
                                  className="w-1/2 px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                  placeholder="£18.50"
                                />
                              </div>
                              <input
                                type="text"
                                value={item.image || ''}
                                onChange={(e) => updateItem(selectedList.id, item.id, { image: e.target.value })}
                                className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                placeholder="Image URL (optional)"
                              />
                            </div>
                            <button
                              onClick={() => deleteItem(selectedList.id, item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {selectedList.items.length === 0 && (
                        <div className="text-center py-6 text-gray-400 dark:text-white/40 text-sm">
                          No items yet. Click "+ Add Item" to create one.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete List */}
                  <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => deleteListById(selectedList.id)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete List
                    </button>
                  </div>
                </div>
              )}

              {/* ITEM INSPECTOR */}
              {selection.type === 'item' && selectedList && selectedItem && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Details</h3>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Item Title</label>
                    <input
                      type="text"
                      value={selectedItem.title}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { title: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. BMW M3 Competition"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Main name shown in the inventory list</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={selectedItem.subtitle || ''}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. 2023 Model • 12,000 miles"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Secondary info below the title</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Price</label>
                    <input
                      type="text"
                      value={selectedItem.price || ''}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { price: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="£45,000"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Displayed on the item card</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={selectedItem.image || ''}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { image: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="https://..."
                    />
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Thumbnail shown in the inventory list</p>
                  </div>

                  {/* Item Slyde Section */}
                  <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                        Item Frames
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-white/40">
                        {(selectedItem.frames?.length ?? 0)} frames
                      </span>
                    </div>
                    <button
                      onClick={() => addItemFrame(selectedList.id, selectedItem.id)}
                      className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 text-white text-sm font-medium rounded-xl ${HQ_PRIMARY_GRADIENT} ${HQ_PRIMARY_SHADOW} hover:opacity-90 transition-opacity`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Frame
                    </button>
                  </div>

                  {/* Delete Item */}
                  <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => deleteItem(selectedList.id, selectedItem.id)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Item
                    </button>
                  </div>
                </div>
              )}

              {/* ITEM FRAME INSPECTOR */}
              {selection.type === 'itemFrame' && selectedList && selectedItem && selectedItemFrame && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frame Editor</h3>
                  </div>

                  {/* Background Section - Gold standard from Home editor */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('video')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Background
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.video ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.video && (
                      <div className="p-4 border-t border-gray-200 dark:border-white/10">
                        <BackgroundMediaInput
                          context="frame"
                          backgroundType={selectedItemFrame.background?.type || 'video'}
                          onBackgroundTypeChange={(type) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, type }
                          })}
                          videoSrc={selectedItemFrame.background?.type === 'video' ? (selectedItemFrame.background?.src || '') : ''}
                          onVideoSrcChange={(src) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, type: 'video', src }
                          })}
                          imageSrc={selectedItemFrame.background?.type === 'image' ? (selectedItemFrame.background?.src || '') : ''}
                          onImageSrcChange={(src) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, type: 'image', src }
                          })}
                          filter={selectedItemFrame.background?.filter || 'original'}
                          onFilterChange={(filter) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, filter }
                          })}
                          vignette={selectedItemFrame.background?.vignette || false}
                          onVignetteChange={(vignette) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, vignette }
                          })}
                          speed={selectedItemFrame.background?.speed || 'normal'}
                          onSpeedChange={(speed) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, speed }
                          })}
                          startTime={selectedItemFrame.background?.startTime || 0}
                          onStartTimeChange={(startTime) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                            background: { ...selectedItemFrame.background, startTime }
                          })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('content')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Content
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.content ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.content && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                          <input
                            type="text"
                            value={selectedItemFrame.title || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                          />
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Main heading shown on this frame</p>
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={selectedItemFrame.subtitle || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                          />
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">Supporting text below the title</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('cta')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        CTA Button
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.cta ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.cta && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Enable CTA button</span>
                          <Toggle
                            enabled={!!selectedItemFrame.cta}
                            onChange={(enabled) => {
                              if (enabled) {
                                updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { text: 'Learn More', type: 'link', value: '' } })
                              } else {
                                updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: undefined })
                              }
                            }}
                          />
                        </div>
                        {selectedItemFrame.cta && (() => {
                          // Determine current type from new type field or legacy action field
                          const currentType = selectedItemFrame.cta.type ||
                            (selectedItemFrame.cta.action?.startsWith('http') ? 'link' :
                             selectedItemFrame.cta.action === 'info' ? 'info' :
                             selectedItemFrame.cta.action === 'faq' ? 'faq' :
                             selectedItemFrame.cta.action === 'reviews' ? 'reviews' :
                             selectedItemFrame.cta.action === 'list' ? 'list' : 'link') as CTAType
                          const selectedCtaType = CTA_TYPES.find(t => t.value === currentType) || CTA_TYPES[1] // default to 'link'

                          return (
                          <>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button text</label>
                              <input
                                type="text"
                                value={selectedItemFrame.cta.text}
                                onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, text: e.target.value } })}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Type</label>
                              <div className="grid grid-cols-4 gap-2">
                                {CTA_TYPES.map(({ value, label, Icon, defaultText }) => (
                                  <button
                                    key={value}
                                    onClick={() => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                                      cta: { ...selectedItemFrame.cta!, type: value, icon: value as CTAIconType, value: '', text: defaultText }
                                    })}
                                    className={`py-2 px-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                                      currentType === value
                                        ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                                    title={label}
                                  >
                                    <Icon className={`w-4 h-4 ${currentType === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} />
                                    <span className={`text-[10px] ${currentType === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-white/50'}`}>{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Dynamic input based on type */}
                            {selectedCtaType.inputType === 'tel' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Phone Number</label>
                                <input
                                  type="tel"
                                  value={selectedItemFrame.cta.value || ''}
                                  onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, value: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'url' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                                  {currentType === 'directions' ? 'Maps Link or Address' : 'URL'}
                                </label>
                                <input
                                  type="url"
                                  value={selectedItemFrame.cta.value || selectedItemFrame.cta.action || ''}
                                  onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, value: e.target.value, action: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'email' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Email Address</label>
                                <input
                                  type="email"
                                  value={selectedItemFrame.cta.value || ''}
                                  onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, value: e.target.value } })}
                                  placeholder={selectedCtaType.placeholder}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                />
                              </div>
                            )}
                            {selectedCtaType.inputType === 'frame-select' && (
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Target Frame</label>
                                <select
                                  value={selectedItemFrame.cta.value || ''}
                                  onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, value: e.target.value } })}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                                >
                                  <option value="">Select a frame...</option>
                                  {(selectedItem.frames || []).map((frame, idx) => (
                                    <option key={frame.id} value={idx.toString()}>
                                      Frame {idx + 1}: {frame.title || 'Untitled'}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        )})()}
                      </div>
                    )}
                  </div>

                  {/* Info Sheet Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('info')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Info Sheet
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.info ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.info && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <p className="text-[12px] text-gray-500 dark:text-white/50">
                          Content shown when users tap the ⓘ Info button on this frame.
                        </p>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Headline</label>
                          <input
                            type="text"
                            value={selectedItemFrame.infoContent?.headline || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                              infoContent: { ...selectedItemFrame.infoContent, headline: e.target.value, description: selectedItemFrame.infoContent?.description || '', items: selectedItemFrame.infoContent?.items || [] }
                            })}
                            placeholder="e.g. Specifications"
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Description</label>
                          <textarea
                            value={selectedItemFrame.infoContent?.description || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                              infoContent: { headline: selectedItemFrame.infoContent?.headline || '', description: e.target.value, items: selectedItemFrame.infoContent?.items || [] }
                            })}
                            rows={3}
                            placeholder="Detailed description..."
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">List Items (one per line)</label>
                          <textarea
                            value={selectedItemFrame.infoContent?.items?.join('\n') || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                              infoContent: {
                                headline: selectedItemFrame.infoContent?.headline || '',
                                description: selectedItemFrame.infoContent?.description || '',
                                items: e.target.value.split('\n').filter(Boolean)
                              }
                            })}
                            rows={4}
                            placeholder={"Feature 1\nFeature 2\nFeature 3"}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-leader-blue focus:ring-2 focus:ring-leader-blue/40 resize-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delete Frame Button */}
                  <button
                    onClick={() => deleteItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id)}
                    disabled={(selectedItem.frames?.length ?? 0) <= 1}
                    className="w-full py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete This Frame
                  </button>
                </div>
              )}

              {/* NO SELECTION */}
              {selection.type === null && (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <Settings className="w-12 h-12 text-gray-300 dark:text-white/20 mb-3" />
                  <p className="text-gray-500 dark:text-white/50">Select something to edit</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Demo Mode Overlay */}
      <DemoModeOverlay
        isOpen={showDemoMode}
        onClose={() => setShowDemoMode(false)}
        homeData={previewData}
        categoryFrames={childFrames}
        musicEnabled={musicEnabled}
        musicUrl={musicCustomUrl}
        backgroundType={backgroundType}
        imageSrc={imageSrc}
        videoFilter={videoFilter}
        videoVignette={videoVignette}
        videoSpeed={videoSpeed}
        businessInfo={businessInfo}
        socialLinks={socialLinks}
      />
    </div>
  )
}
