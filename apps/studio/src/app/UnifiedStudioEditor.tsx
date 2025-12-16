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

import { useState, useCallback, useEffect, useRef } from 'react'
import { DevicePreview } from '@/components/slyde-demo'
import { HomeSlydeScreen } from '@/components/home-slyde/HomeSlydeScreen'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import type { FrameData, FAQItem, BusinessInfo, CTAIconType, ListItem, ListData } from '@/components/slyde-demo/frameData'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useOrganization } from '@/hooks'
import {
  useDemoHomeSlyde,
  writeDemoHomeSlyde,
  readChildFrames,
  writeChildFrames,
  deleteChildFrames,
  type DemoHomeSlyde,
  type DemoHomeSlydeCategory,
} from '@/lib/demoHomeSlyde'
import { highlandMotorsData, type HomeSlydeData } from '@/components/home-slyde/data/highlandMotorsData'
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
  type LucideIcon,
} from 'lucide-react'
import { Toggle } from '@/components/ui/Toggle'

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

// CTA button icons
const CTA_ICONS: { value: CTAIconType; label: string; Icon: LucideIcon }[] = [
  { value: 'book', label: 'Book', Icon: Book },
  { value: 'call', label: 'Call', Icon: Phone },
  { value: 'view', label: 'View', Icon: ExternalLink },
  { value: 'arrow', label: 'Arrow', Icon: ChevronRight },
  { value: 'menu', label: 'Menu', Icon: Layers },
  { value: 'list', label: 'List', Icon: List },
]

function getCategoryIcon(iconId: string): LucideIcon {
  return CATEGORY_ICONS.find((i) => i.id === iconId)?.Icon || Sparkles
}

export function UnifiedStudioEditor() {
  const { organization, isLoading: orgLoading } = useOrganization()
  const { data: homeSlyde, hydrated: homeSlydeHydrated } = useDemoHomeSlyde()

  // Brand profile
  const brandProfile = {
    businessName: organization?.name || 'Your Business',
    tagline: '',
    primaryColor: organization?.primary_color || '#2563EB',
    secondaryColor: '#22D3EE',
    logoUrl: organization?.logo_url || null,
  }

  // =============================================
  // CORE STATE
  // =============================================
  const [videoSrc, setVideoSrc] = useState(homeSlyde.videoSrc)
  const [posterSrc, setPosterSrc] = useState(homeSlyde.posterSrc || '')
  const [brandName, setBrandName] = useState(brandProfile.businessName)
  const [tagline, setTagline] = useState(brandProfile.tagline)
  const [rating, setRating] = useState(highlandMotorsData.rating || 4.9)
  const [reviewCount, setReviewCount] = useState(highlandMotorsData.reviewCount || 847)
  const [about, setAbout] = useState(highlandMotorsData.about || '')
  const [address, setAddress] = useState(highlandMotorsData.address || '')
  const [hours, setHours] = useState('')
  const [phone, setPhone] = useState(highlandMotorsData.phone || '')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [categories, setCategories] = useState<DemoHomeSlydeCategory[]>(homeSlyde.categories)
  const [primaryCtaEnabled, setPrimaryCtaEnabled] = useState(!!homeSlyde.primaryCta)
  const [primaryCtaText, setPrimaryCtaText] = useState(homeSlyde.primaryCta?.text || 'Book Now')
  const [primaryCtaAction, setPrimaryCtaAction] = useState(homeSlyde.primaryCta?.action || '')
  const [showCategoryIcons, setShowCategoryIcons] = useState(homeSlyde.showCategoryIcons ?? false)
  const [showHearts, setShowHearts] = useState(homeSlyde.showHearts ?? true)
  const [showShare, setShowShare] = useState(homeSlyde.showShare ?? true)
  const [showSound, setShowSound] = useState(homeSlyde.showSound ?? true)
  const [showReviews, setShowReviews] = useState(homeSlyde.showReviews ?? true)
  const [lists, setLists] = useState<ListData[]>(homeSlyde.lists ?? [])

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

  // =============================================
  // SELECTION STATE
  // =============================================
  const [selection, setSelection] = useState<Selection>({ type: 'home' })

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

  // =============================================
  // CHILD FRAMES STATE (Category Slydes)
  // =============================================
  const [childFrames, setChildFrames] = useState<Record<string, FrameData[]>>({})

  // =============================================
  // INSPECTOR SECTIONS STATE
  // =============================================
  const [inspectorSections, setInspectorSections] = useState<Record<string, boolean>>({
    brand: true,
    video: false,
    cta: false,
    settings: false,
    content: true,
    style: false,
    info: false,
  })

  const toggleInspectorSection = (section: string) => {
    setInspectorSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // =============================================
  // INITIALIZATION
  // =============================================
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!homeSlydeHydrated) return
    if (initializedRef.current) return
    initializedRef.current = true

    setVideoSrc(homeSlyde.videoSrc)
    setPosterSrc(homeSlyde.posterSrc || '')
    setCategories(homeSlyde.categories)
    setLists(homeSlyde.lists ?? [])
    setShowCategoryIcons(homeSlyde.showCategoryIcons ?? false)
    setShowHearts(homeSlyde.showHearts ?? true)
    setShowShare(homeSlyde.showShare ?? true)
    setShowSound(homeSlyde.showSound ?? true)
    setShowReviews(homeSlyde.showReviews ?? true)
    if (homeSlyde.primaryCta) {
      setPrimaryCtaEnabled(true)
      setPrimaryCtaText(homeSlyde.primaryCta.text)
      setPrimaryCtaAction(homeSlyde.primaryCta.action)
    }
  }, [homeSlyde, homeSlydeHydrated])

  useEffect(() => {
    setBrandName(brandProfile.businessName)
    setTagline(brandProfile.tagline)
  }, [brandProfile.businessName, brandProfile.tagline])

  // =============================================
  // PERSISTENCE
  // =============================================
  const persistHomeSlyde = useCallback(() => {
    const next: DemoHomeSlyde = {
      videoSrc,
      posterSrc: posterSrc || undefined,
      categories,
      primaryCta: primaryCtaEnabled ? { text: primaryCtaText, action: primaryCtaAction } : undefined,
      showCategoryIcons,
      showHearts,
      showShare,
      showSound,
      showReviews,
      childFrames: homeSlyde.childFrames,
      lists,
    }
    writeDemoHomeSlyde(next)
  }, [videoSrc, posterSrc, categories, primaryCtaEnabled, primaryCtaText, primaryCtaAction, showCategoryIcons, showHearts, showShare, showSound, showReviews, lists, homeSlyde.childFrames])

  useEffect(() => {
    const timeout = setTimeout(persistHomeSlyde, 300)
    return () => clearTimeout(timeout)
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
  // CATEGORY CRUD
  // =============================================
  const addCategory = useCallback(() => {
    if (categories.length >= 6) return
    const newId = `cat-${Date.now()}`
    setCategories(prev => [
      ...prev,
      { id: newId, icon: 'sparkles', name: 'New Category', description: '', childSlydeId: 'default', hasInventory: false },
    ])
    setSelection({ type: 'category', categoryId: newId })
    setExpandedSections(prev => ({ ...prev, categories: true }))
    startEditing(newId, 'New Category')
  }, [categories.length])

  const updateCategory = useCallback((id: string, updates: Partial<DemoHomeSlydeCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    deleteChildFrames(id)
    setChildFrames(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    if (selection.categoryId === id) {
      setSelection({ type: 'home' })
    }
  }, [selection.categoryId])

  // =============================================
  // CATEGORY FRAME CRUD
  // =============================================
  const loadCategoryFrames = useCallback((categoryId: string) => {
    if (childFrames[categoryId]) return // Already loaded
    const savedFrames = readChildFrames(categoryId)
    if (savedFrames && savedFrames.length > 0) {
      setChildFrames(prev => ({ ...prev, [categoryId]: savedFrames }))
    } else {
      // Create starter frames
      const starterFrames: FrameData[] = [
        {
          id: '1',
          order: 1,
          templateType: 'hook',
          title: 'Frame 1',
          subtitle: '',
          heartCount: 0,
          faqCount: 0,
          background: { type: 'image', src: '' },
          accentColor: brandProfile.secondaryColor,
        },
      ]
      setChildFrames(prev => ({ ...prev, [categoryId]: starterFrames }))
    }
  }, [childFrames, brandProfile.secondaryColor])

  const addCategoryFrame = useCallback((categoryId: string) => {
    const frames = childFrames[categoryId] || []
    const newId = `frame-${Date.now()}`
    const newFrame: FrameData = {
      id: newId,
      order: frames.length + 1,
      templateType: 'custom',
      title: 'New Frame',
      subtitle: '',
      heartCount: 0,
      faqCount: 0,
      background: { type: 'image', src: '' },
      accentColor: brandProfile.secondaryColor,
    }
    setChildFrames(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), newFrame],
    }))
    setSelection({ type: 'categoryFrame', categoryId, categoryFrameId: newId })
    startEditing(newId, 'New Frame')
  }, [childFrames, brandProfile.secondaryColor])

  const updateCategoryFrame = useCallback((categoryId: string, frameId: string, updates: Partial<FrameData>) => {
    setChildFrames(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).map(f => f.id === frameId ? { ...f, ...updates } : f),
    }))
  }, [])

  const deleteCategoryFrame = useCallback((categoryId: string, frameId: string) => {
    const frames = childFrames[categoryId] || []
    if (frames.length <= 1) return
    setChildFrames(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter(f => f.id !== frameId),
    }))
    if (selection.categoryFrameId === frameId) {
      setSelection({ type: 'category', categoryId })
    }
  }, [childFrames, selection.categoryFrameId])

  // Persist category frames
  useEffect(() => {
    Object.entries(childFrames).forEach(([categoryId, frames]) => {
      if (frames.length > 0) {
        writeChildFrames(categoryId, frames)
      }
    })
  }, [childFrames])

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
    const newFrame: FrameData = {
      id: newId,
      order: 1,
      templateType: 'custom',
      title: 'New Frame',
      subtitle: '',
      heartCount: 0,
      faqCount: 0,
      background: { type: 'image', src: '' },
      accentColor: brandProfile.secondaryColor,
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
    startEditing(newId, 'New Frame')
  }, [brandProfile.secondaryColor])

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

  // Preview data
  const previewData: HomeSlydeData = {
    businessName: brandName,
    tagline,
    accentColor: brandProfile.secondaryColor,
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
    primaryCta: primaryCtaEnabled ? { text: primaryCtaText, action: primaryCtaAction } : undefined,
    showCategoryIcons,
    showHearts,
    showShare,
    showSound,
    showReviews,
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
    contact: { phone },
    accentColor: brandProfile.secondaryColor,
  }

  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                onClick={() => window.open(`/preview`, '_blank')}
              >
                Preview
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity ${HQ_PRIMARY_SHADOW} ${HQ_PRIMARY_GRADIENT}`}
              >
                <UploadCloud className="w-4 h-4" />
                Publish
              </button>
            </div>
          </header>

          {/* 3-Column Layout */}
          <div className="flex-1 flex overflow-hidden">

            {/* NAVIGATOR - Collapsible Tree */}
            <div className="w-72 border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#1c1c1e]/80 overflow-y-auto">
              <div className="p-4 space-y-1">

                {/* ========== HOME SECTION ========== */}
                <div>
                  <div
                    onClick={() => setSelection({ type: 'home' })}
                    className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      selection.type === 'home'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                    }`}
                  >
                    <HomeIcon className={`w-4 h-4 ${selection.type === 'home' ? 'text-white' : 'text-gray-400 dark:text-white/40'}`} />
                    <span className="text-[13px] font-medium flex-1">Home</span>
                  </div>
                </div>

                {/* ========== CATEGORIES SECTION ========== */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 mt-3">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="w-full flex items-center justify-between px-2 py-1 mb-1"
                  >
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                      Categories ({categories.length}/6)
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.categories ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedSections.categories && (
                    <div className="space-y-0.5">
                      {categories.map((cat) => {
                        const isSelected = selection.type === 'category' && selection.categoryId === cat.id
                        const isExpanded = expandedCategories.has(cat.id)
                        const isEditing = editingId === cat.id
                        const catFrames = childFrames[cat.id] || []
                        const IconComponent = getCategoryIcon(cat.icon)

                        return (
                          <div key={cat.id}>
                            {/* Category Row */}
                            <div
                              onClick={() => {
                                setSelection({ type: 'category', categoryId: cat.id })
                                loadCategoryFrames(cat.id)
                                setPreviewFrameIndex(0) // Reset to first frame when switching categories
                              }}
                              className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleCategory(cat.id)
                                  loadCategoryFrames(cat.id)
                                }}
                                className={`p-0.5 rounded transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              >
                                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white/70' : 'text-gray-400'}`} />
                              </button>

                              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />

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
                                  className="flex-1 px-1.5 py-0.5 text-[13px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                />
                              ) : (
                                <>
                                  <span
                                    className="text-[13px] font-medium truncate flex-1"
                                    onDoubleClick={(e) => {
                                      e.stopPropagation()
                                      startEditing(cat.id, cat.name)
                                    }}
                                  >
                                    {cat.name}
                                  </span>
                                  <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                    {catFrames.length}f
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteCategory(cat.id)
                                    }}
                                    className={`p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                      isSelected
                                        ? 'text-white/70 hover:text-white hover:bg-white/20'
                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                                    }`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Category Frames (nested) */}
                            {isExpanded && (
                              <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                {catFrames.map((frame, idx) => {
                                  const isFrameSelected = selection.type === 'categoryFrame' && selection.categoryFrameId === frame.id
                                  const isFrameEditing = editingId === frame.id

                                  return (
                                    <div
                                      key={frame.id}
                                      onClick={() => {
                                        setSelection({ type: 'categoryFrame', categoryId: cat.id, categoryFrameId: frame.id })
                                        setPreviewFrameIndex(idx)
                                      }}
                                      className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                                        isFrameSelected
                                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                                        isFrameSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
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
                                              if (editingValue.trim()) updateCategoryFrame(cat.id, frame.id, { title: editingValue.trim() })
                                              cancelEditing()
                                            }
                                            if (e.key === 'Escape') cancelEditing()
                                          }}
                                          onBlur={() => {
                                            if (editingValue.trim()) updateCategoryFrame(cat.id, frame.id, { title: editingValue.trim() })
                                            cancelEditing()
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex-1 px-1.5 py-0.5 text-[12px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                        />
                                      ) : (
                                        <>
                                          <span className="text-[12px] font-medium truncate flex-1">
                                            {frame.title || `Frame ${idx + 1}`}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              deleteCategoryFrame(cat.id, frame.id)
                                            }}
                                            disabled={catFrames.length <= 1}
                                            className={`p-0.5 rounded-lg transition-all ${
                                              catFrames.length <= 1
                                                ? 'opacity-20 cursor-not-allowed'
                                                : `opacity-0 group-hover:opacity-100 ${
                                                    isFrameSelected
                                                      ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                  }`
                                            }`}
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )
                                })}

                                {/* Add Frame */}
                                <button
                                  onClick={() => addCategoryFrame(cat.id)}
                                  className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span className="text-[11px] font-medium">Add frame</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {/* Add Category */}
                      {categories.length < 6 && (
                        <button
                          onClick={addCategory}
                          className="w-full flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">Add category</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ========== LISTS SECTION ========== */}
                <div className="pt-3 border-t border-gray-200 dark:border-white/10 mt-3">
                  <button
                    onClick={() => toggleSection('lists')}
                    className="w-full flex items-center justify-between px-2 py-1 mb-1"
                  >
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                      Lists ({lists.length})
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.lists ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedSections.lists && (
                    <div className="space-y-0.5">
                      {lists.map((list) => {
                        const isListSelected = selection.type === 'list' && selection.listId === list.id
                        const isListExpanded = expandedLists.has(list.id)
                        const isListEditing = editingId === list.id

                        return (
                          <div key={list.id}>
                            {/* List Row */}
                            <div
                              onClick={() => setSelection({ type: 'list', listId: list.id })}
                              className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                isListSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleList(list.id)
                                }}
                                className={`p-0.5 rounded transition-transform ${isListExpanded ? 'rotate-90' : ''}`}
                              >
                                <ChevronRight className={`w-4 h-4 ${isListSelected ? 'text-white/70' : 'text-gray-400'}`} />
                              </button>

                              <List className={`w-4 h-4 ${isListSelected ? 'text-white' : 'text-gray-400'}`} />

                              {isListEditing ? (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (editingValue.trim()) updateListById(list.id, { name: editingValue.trim() })
                                      cancelEditing()
                                    }
                                    if (e.key === 'Escape') cancelEditing()
                                  }}
                                  onBlur={() => {
                                    if (editingValue.trim()) updateListById(list.id, { name: editingValue.trim() })
                                    cancelEditing()
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 px-1.5 py-0.5 text-[13px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                />
                              ) : (
                                <>
                                  <span
                                    className="text-[13px] font-medium truncate flex-1"
                                    onDoubleClick={(e) => {
                                      e.stopPropagation()
                                      startEditing(list.id, list.name)
                                    }}
                                  >
                                    {list.name}
                                  </span>
                                  <span className={`text-[10px] ${isListSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                    {list.items.length}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteListById(list.id)
                                    }}
                                    className={`p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                      isListSelected
                                        ? 'text-white/70 hover:text-white hover:bg-white/20'
                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                                    }`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Items (nested) */}
                            {isListExpanded && (
                              <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                {list.items.map((item) => {
                                  const isItemSelected = selection.type === 'item' && selection.itemId === item.id
                                  const isItemExpanded = expandedItems.has(item.id)
                                  const isItemEditing = editingId === item.id
                                  const itemFrames = item.frames || []

                                  return (
                                    <div key={item.id}>
                                      {/* Item Row */}
                                      <div
                                        onClick={() => setSelection({ type: 'item', listId: list.id, itemId: item.id })}
                                        className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                          isItemSelected
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
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
                                            <ChevronRight className={`w-4 h-4 ${isItemSelected ? 'text-white/70' : 'text-gray-400'}`} />
                                          </button>
                                        ) : (
                                          <div className="w-5" />
                                        )}

                                        {item.image ? (
                                          <img src={item.image} alt="" className="w-6 h-6 rounded-lg object-cover" />
                                        ) : (
                                          <Package className={`w-4 h-4 ${isItemSelected ? 'text-white' : 'text-gray-400'}`} />
                                        )}

                                        {isItemEditing ? (
                                          <input
                                            ref={editInputRef}
                                            type="text"
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                if (editingValue.trim()) updateItem(list.id, item.id, { title: editingValue.trim() })
                                                cancelEditing()
                                              }
                                              if (e.key === 'Escape') cancelEditing()
                                            }}
                                            onBlur={() => {
                                              if (editingValue.trim()) updateItem(list.id, item.id, { title: editingValue.trim() })
                                              cancelEditing()
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 px-1.5 py-0.5 text-[13px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                          />
                                        ) : (
                                          <>
                                            <span className="text-[13px] font-medium truncate flex-1">
                                              {item.title}
                                            </span>
                                            {itemFrames.length > 0 && (
                                              <span className={`text-[10px] ${isItemSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                                {itemFrames.length}f
                                              </span>
                                            )}
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                deleteItem(list.id, item.id)
                                              }}
                                              className={`p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                                isItemSelected
                                                  ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                              }`}
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </>
                                        )}
                                      </div>

                                      {/* Item Frames (nested) */}
                                      {isItemExpanded && itemFrames.length > 0 && (
                                        <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                          {itemFrames.map((frame, idx) => {
                                            const isFrameSelected = selection.type === 'itemFrame' && selection.itemFrameId === frame.id

                                            return (
                                              <div
                                                key={frame.id}
                                                onClick={() => {
                                                  setSelection({ type: 'itemFrame', listId: list.id, itemId: item.id, itemFrameId: frame.id })
                                                  setItemPreviewFrameIndex(idx)
                                                }}
                                                className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                                                  isFrameSelected
                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                                }`}
                                              >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                                                  isFrameSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                                                }`}>
                                                  {idx + 1}
                                                </div>
                                                <span className="text-[12px] font-medium truncate flex-1">
                                                  {frame.title || `Frame ${idx + 1}`}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteItemFrame(list.id, item.id, frame.id)
                                                  }}
                                                  disabled={itemFrames.length <= 1}
                                                  className={`p-0.5 rounded-lg transition-all ${
                                                    itemFrames.length <= 1
                                                      ? 'opacity-20 cursor-not-allowed'
                                                      : `opacity-0 group-hover:opacity-100 ${
                                                          isFrameSelected
                                                            ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                            : 'text-gray-400 hover:text-red-500'
                                                        }`
                                                  }`}
                                                >
                                                  <Trash2 className="w-2.5 h-2.5" />
                                                </button>
                                              </div>
                                            )
                                          })}

                                          {/* Add Item Frame */}
                                          <button
                                            onClick={() => addItemFrame(list.id, item.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span className="text-[11px] font-medium">Add frame</span>
                                          </button>
                                        </div>
                                      )}

                                      {/* Add frame button when item expanded but has 0 frames */}
                                      {isItemExpanded && itemFrames.length === 0 && (
                                        <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5">
                                          <button
                                            onClick={() => addItemFrame(list.id, item.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span className="text-[11px] font-medium">Add frame</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}

                                {/* Add Item */}
                                <button
                                  onClick={() => addItem(list.id)}
                                  className="w-full flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-medium">Add item</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {/* Add List */}
                      <button
                        onClick={addNewList}
                        className="w-full flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Add list</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* PREVIEW - Phone */}
            <div className="flex-1 flex items-center justify-center bg-gray-100/50 dark:bg-[#1c1c1e]/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_50%)]" />
              <div className="relative z-10">
                <DevicePreview>
                  {/* Home Preview */}
                  {selection.type === 'home' && (
                    <HomeSlydeScreen
                      data={previewData}
                      onCategoryTap={() => {}}
                    />
                  )}

                  {/* Category Preview */}
                  {(selection.type === 'category' || selection.type === 'categoryFrame') && selectedCategory && (
                    selectedCategoryFrames.length > 0 ? (
                      <SlydeScreen
                        frames={selectedCategoryFrames}
                        business={businessInfo}
                        faqs={[]}
                        context="category"
                        initialFrameIndex={previewFrameIndex}
                        onFrameChange={setPreviewFrameIndex}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                        <Layers className="w-12 h-12 text-gray-500 mb-4" />
                        <p className="text-gray-400">No frames yet</p>
                        <p className="text-gray-500 text-sm">Click "Add frame" to create one</p>
                      </div>
                    )
                  )}

                  {/* List Preview */}
                  {selection.type === 'list' && selectedList && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                      <List className="w-12 h-12 text-blue-500 mb-4" />
                      <p className="text-white font-medium">{selectedList.name}</p>
                      <p className="text-gray-400 text-sm">{selectedList.items.length} items</p>
                    </div>
                  )}

                  {/* Item Preview */}
                  {selection.type === 'item' && selectedItem && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                      {selectedItem.image ? (
                        <img src={selectedItem.image} alt="" className="w-24 h-24 rounded-2xl object-cover mb-4" />
                      ) : (
                        <Package className="w-12 h-12 text-cyan-500 mb-4" />
                      )}
                      <p className="text-white font-medium">{selectedItem.title}</p>
                      {selectedItem.subtitle && <p className="text-gray-400 text-sm">{selectedItem.subtitle}</p>}
                      {selectedItem.price && <p className="text-cyan-400 font-semibold mt-2">{selectedItem.price}</p>}
                      <p className="text-gray-500 text-xs mt-3">{selectedItem.frames?.length ?? 0} frames</p>
                    </div>
                  )}

                  {/* Item Frame Preview */}
                  {selection.type === 'itemFrame' && selectedItem && selectedItem.frames && selectedItem.frames.length > 0 && (
                    <SlydeScreen
                      frames={selectedItem.frames}
                      business={businessInfo}
                      faqs={[]}
                      context="category"
                      initialFrameIndex={itemPreviewFrameIndex}
                      onFrameChange={setItemPreviewFrameIndex}
                    />
                  )}

                  {/* Empty state */}
                  {selection.type === null && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                      <Smartphone className="w-12 h-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">Select something to preview</p>
                    </div>
                  )}
                </DevicePreview>
              </div>
            </div>

            {/* INSPECTOR - Contextual Editor */}
            <div className="w-80 border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 overflow-y-auto">

              {/* HOME INSPECTOR */}
              {selection.type === 'home' && (
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Home Settings</h3>

                  {/* Brand Section */}
                  <div>
                    <button
                      onClick={() => toggleInspectorSection('brand')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white/70">Brand</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.brand ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.brand && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Business Name</label>
                          <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Tagline</label>
                          <input
                            type="text"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Section */}
                  <div>
                    <button
                      onClick={() => toggleInspectorSection('video')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white/70">Video</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.video ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.video && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Video URL</label>
                          <input
                            type="text"
                            value={videoSrc}
                            onChange={(e) => setVideoSrc(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Poster Image URL</label>
                          <input
                            type="text"
                            value={posterSrc}
                            onChange={(e) => setPosterSrc(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Info Section */}
                  <div>
                    <button
                      onClick={() => toggleInspectorSection('info')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white/70">Business Info</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.info ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.info && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">About</label>
                          <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            placeholder="Tell customers about your business..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="123 Main Street, City"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Hours</label>
                          <input
                            type="text"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Mon-Fri 9am-5pm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Phone</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              placeholder="+44 123..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              placeholder="hello@..."
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Website</label>
                          <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="yourwebsite.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div>
                    <button
                      onClick={() => toggleInspectorSection('cta')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white/70">Primary CTA</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.cta ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.cta && (
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Enable CTA</span>
                          <Toggle enabled={primaryCtaEnabled} onChange={setPrimaryCtaEnabled} />
                        </div>
                        {primaryCtaEnabled && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Button Text</label>
                              <input
                                type="text"
                                value={primaryCtaText}
                                onChange={(e) => setPrimaryCtaText(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Action URL</label>
                              <input
                                type="text"
                                value={primaryCtaAction}
                                onChange={(e) => setPrimaryCtaAction(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="https://..."
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Settings Section */}
                  <div>
                    <button
                      onClick={() => toggleInspectorSection('settings')}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-white/70">Display</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.settings ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.settings && (
                      <div className="space-y-3 pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-white/60">Show category icons</span>
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
                </div>
              )}

              {/* CATEGORY INSPECTOR */}
              {selection.type === 'category' && selectedCategory && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category</h3>
                    <button
                      onClick={() => deleteCategory(selectedCategory.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Name</label>
                      <input
                        type="text"
                        value={selectedCategory.name}
                        onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Description</label>
                      <textarea
                        value={selectedCategory.description || ''}
                        onChange={(e) => updateCategory(selectedCategory.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                    </div>

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

                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-white/70">Has Inventory</span>
                          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Show inventory items from connected list</p>
                        </div>
                        <Toggle
                          enabled={!!selectedCategory.hasInventory}
                          onChange={(enabled) => updateCategory(selectedCategory.id, { hasInventory: enabled })}
                        />
                      </div>
                      {selectedCategory.hasInventory && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">CTA Button Text</label>
                            <input
                              type="text"
                              value={selectedCategory.ctaText || 'View All'}
                              onChange={(e) => updateCategory(selectedCategory.id, { ctaText: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Connected List</label>
                            {lists.length === 0 ? (
                              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/15 text-center">
                                <p className="text-[12px] text-gray-500 dark:text-white/40 mb-2">No lists created yet</p>
                                <button
                                  onClick={() => {
                                    addNewList()
                                    setExpandedSections(prev => ({ ...prev, lists: true }))
                                  }}
                                  className="text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                                >
                                  + Create a list first
                                </button>
                              </div>
                            ) : (
                              <select
                                value={selectedCategory.listId || ''}
                                onChange={(e) => updateCategory(selectedCategory.id, { listId: e.target.value || undefined })}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="">Select a list...</option>
                                {lists.map((list) => (
                                  <option key={list.id} value={list.id}>
                                    {list.name} ({list.items.length} items)
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
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
                            value={selectedCategoryFrame.title || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={selectedCategoryFrame.subtitle || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                          <input
                            type="text"
                            value={selectedCategoryFrame.badge || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { badge: e.target.value })}
                            placeholder="e.g. ⭐ 5-Star Rated"
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Background media</label>
                          <div className="flex gap-2 mb-2">
                            <button
                              onClick={() => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { background: { ...selectedCategoryFrame.background, type: 'video' } })}
                              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                selectedCategoryFrame.background?.type === 'video'
                                  ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                              }`}
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <Video className="w-4 h-4" />
                                <span className="font-semibold">Video</span>
                              </span>
                            </button>
                            <button
                              onClick={() => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { background: { ...selectedCategoryFrame.background, type: 'image' } })}
                              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                selectedCategoryFrame.background?.type === 'image'
                                  ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                              }`}
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span className="font-semibold">Image</span>
                              </span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={selectedCategoryFrame.background?.src || ''}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                              background: { type: selectedCategoryFrame.background?.type || 'image', src: e.target.value }
                            })}
                            placeholder="URL or upload..."
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Heart count</label>
                          <input
                            type="number"
                            value={selectedCategoryFrame.heartCount || 0}
                            onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { heartCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                          <p className="mt-1.5 text-[12px] text-gray-500 dark:text-white/40">
                            Popularity signal shown on the frame
                          </p>
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
                            enabled={!!selectedCategoryFrame.cta}
                            onChange={(enabled) => {
                              if (enabled) {
                                updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { text: 'Book Now', icon: 'book', action: '' } })
                              } else {
                                updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: undefined })
                              }
                            }}
                          />
                        </div>
                        {selectedCategoryFrame.cta && (
                          <>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button text</label>
                              <input
                                type="text"
                                value={selectedCategoryFrame.cta.text}
                                onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, text: e.target.value } })}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Icon</label>
                              <div className="grid grid-cols-6 gap-2">
                                {CTA_ICONS.map(({ value, label, Icon }) => (
                                  <button
                                    key={value}
                                    onClick={() => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, icon: value } })}
                                    className={`py-2.5 rounded-lg border text-center transition-all ${
                                      selectedCategoryFrame.cta?.icon === value
                                        ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                                    title={label}
                                  >
                                    <Icon className={`w-4 h-4 mx-auto ${selectedCategoryFrame.cta?.icon === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Action</label>
                              <select
                                value={selectedCategoryFrame.cta.action?.startsWith('http') ? 'url' : selectedCategoryFrame.cta.action || 'url'}
                                onChange={(e) => {
                                  const val = e.target.value
                                  if (val === 'url') {
                                    updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, action: '' } })
                                  } else {
                                    updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, action: val } })
                                  }
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="url">External URL</option>
                                <option value="info">Open Info Sheet</option>
                                <option value="faq">Open FAQ Sheet</option>
                                <option value="reviews">Go to Reviews</option>
                                <option value="list">Open List View</option>
                              </select>
                              {(selectedCategoryFrame.cta.action === '' || selectedCategoryFrame.cta.action?.startsWith('http')) && (
                                <input
                                  type="url"
                                  value={selectedCategoryFrame.cta.action || ''}
                                  onChange={(e) => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { cta: { ...selectedCategoryFrame.cta!, action: e.target.value } })}
                                  placeholder="https://..."
                                  className="w-full mt-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                              )}
                              {/* Connect to List */}
                              {selectedCategoryFrame.cta.action === 'list' && (
                                <div className="mt-3">
                                  <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Connect to List</label>
                                  {lists.length === 0 ? (
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/15 text-center">
                                      <p className="text-[12px] text-gray-500 dark:text-white/40 mb-2">No lists created yet</p>
                                      <button
                                        onClick={() => {
                                          addNewList()
                                          setExpandedSections(prev => ({ ...prev, lists: true }))
                                        }}
                                        className="text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                                      >
                                        + Create a list first
                                      </button>
                                    </div>
                                  ) : (
                                    <select
                                      value={selectedCategoryFrame.cta.listId || ''}
                                      onChange={(e) => {
                                        updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, {
                                          cta: { ...selectedCategoryFrame.cta!, listId: e.target.value || undefined }
                                        })
                                      }}
                                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                      <option value="">Select a list...</option>
                                      {lists.map((list) => (
                                        <option key={list.id} value={list.id}>
                                          {list.name} ({list.items.length} items)
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )}
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Style Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('style')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Style
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.style ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.style && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Accent Color</label>
                          <div className="grid grid-cols-6 gap-2">
                            {['#2563EB', '#06B6D4', '#0F172A', '#059669', '#475569', '#1D4ED8'].map((color) => (
                              <button
                                key={color}
                                onClick={() => updateCategoryFrame(selection.categoryId!, selectedCategoryFrame.id, { accentColor: color })}
                                className={`w-full aspect-square rounded-lg ${
                                  selectedCategoryFrame.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-[#2c2c2e]' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                          <button
                            onClick={() => deleteCategoryFrame(selection.categoryId!, selectedCategoryFrame.id)}
                            disabled={selectedCategoryFrames.length <= 1}
                            className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete This Frame
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. Our Vehicles, Hair Products"
                    />
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
                                <input
                                  type="text"
                                  value={item.badge || ''}
                                  onChange={(e) => updateItem(selectedList.id, item.id, { badge: e.target.value })}
                                  className="w-1/2 px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                  placeholder="Badge"
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
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. BMW M3 Competition"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={selectedItem.subtitle || ''}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="e.g. 2023 Model • 12,000 miles"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Price</label>
                      <input
                        type="text"
                        value={selectedItem.price || ''}
                        onChange={(e) => updateItem(selectedList.id, selectedItem.id, { price: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        placeholder="£45,000"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                      <input
                        type="text"
                        value={selectedItem.badge || ''}
                        onChange={(e) => updateItem(selectedList.id, selectedItem.id, { badge: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        placeholder="Best Seller"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={selectedItem.image || ''}
                      onChange={(e) => updateItem(selectedList.id, selectedItem.id, { image: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      placeholder="https://..."
                    />
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={selectedItemFrame.subtitle || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                          <input
                            type="text"
                            value={selectedItemFrame.badge || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { badge: e.target.value })}
                            placeholder="e.g. Best Seller"
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Background media</label>
                          <div className="flex gap-2 mb-2">
                            <button
                              onClick={() => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { background: { ...selectedItemFrame.background, type: 'video' } })}
                              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                selectedItemFrame.background?.type === 'video'
                                  ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                              }`}
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <Video className="w-4 h-4" />
                                <span className="font-semibold">Video</span>
                              </span>
                            </button>
                            <button
                              onClick={() => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { background: { ...selectedItemFrame.background, type: 'image' } })}
                              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                selectedItemFrame.background?.type === 'image'
                                  ? 'border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300'
                                  : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60'
                              }`}
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span className="font-semibold">Image</span>
                              </span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={selectedItemFrame.background?.src || ''}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, {
                              background: { type: selectedItemFrame.background?.type || 'image', src: e.target.value }
                            })}
                            placeholder="URL or upload..."
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Heart count</label>
                          <input
                            type="number"
                            value={selectedItemFrame.heartCount || 0}
                            onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { heartCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
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
                                updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { text: 'Book Now', icon: 'book', action: '' } })
                              } else {
                                updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: undefined })
                              }
                            }}
                          />
                        </div>
                        {selectedItemFrame.cta && (
                          <>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button text</label>
                              <input
                                type="text"
                                value={selectedItemFrame.cta.text}
                                onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, text: e.target.value } })}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Icon</label>
                              <div className="grid grid-cols-6 gap-2">
                                {CTA_ICONS.map(({ value, label, Icon }) => (
                                  <button
                                    key={value}
                                    onClick={() => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, icon: value } })}
                                    className={`py-2.5 rounded-lg border text-center transition-all ${
                                      selectedItemFrame.cta?.icon === value
                                        ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                    }`}
                                    title={label}
                                  >
                                    <Icon className={`w-4 h-4 mx-auto ${selectedItemFrame.cta?.icon === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Action</label>
                              <select
                                value={selectedItemFrame.cta.action?.startsWith('http') ? 'url' : selectedItemFrame.cta.action || 'url'}
                                onChange={(e) => {
                                  const val = e.target.value
                                  if (val === 'url') {
                                    updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, action: '' } })
                                  } else {
                                    updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, action: val } })
                                  }
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="url">External URL</option>
                                <option value="info">Open Info Sheet</option>
                                <option value="faq">Open FAQ Sheet</option>
                                <option value="reviews">Go to Reviews</option>
                              </select>
                              {(selectedItemFrame.cta.action === '' || selectedItemFrame.cta.action?.startsWith('http')) && (
                                <input
                                  type="url"
                                  value={selectedItemFrame.cta.action || ''}
                                  onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { cta: { ...selectedItemFrame.cta!, action: e.target.value } })}
                                  placeholder="https://..."
                                  className="w-full mt-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                              )}
                            </div>
                          </>
                        )}
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
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
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Style Section */}
                  <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleInspectorSection('style')}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500 dark:text-white/50" />
                        Style
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${inspectorSections.style ? '' : '-rotate-90'}`} />
                    </button>
                    {inspectorSections.style && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Accent Color</label>
                          <div className="grid grid-cols-6 gap-2">
                            {['#2563EB', '#06B6D4', '#0F172A', '#059669', '#475569', '#1D4ED8'].map((color) => (
                              <button
                                key={color}
                                onClick={() => updateItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id, { accentColor: color })}
                                className={`w-full aspect-square rounded-lg ${
                                  selectedItemFrame.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-[#2c2c2e]' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                          <button
                            onClick={() => deleteItemFrame(selectedList.id, selectedItem.id, selectedItemFrame.id)}
                            disabled={(selectedItem.frames?.length ?? 0) <= 1}
                            className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete This Frame
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
    </div>
  )
}
