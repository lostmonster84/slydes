'use client'

/**
 * HQ EDITOR LAYOUT PATTERN (CONSTX)
 * =================================
 *
 * Desktop editor layout follows a 3-column structure:
 *
 * ┌─────────────┬───────────────┬─────────────────┐
 * │ NAVIGATOR   │   PREVIEW     │   INSPECTOR     │
 * │ (Left)      │   (Center)    │   (Right)       │
 * │ w-72        │   flex-1      │   w-80          │
 * ├─────────────┼───────────────┼─────────────────┤
 * │ Selection   │ DevicePreview │ Dynamic form    │
 * │ list with   │ + live screen │ based on what's │
 * │ clickable   │               │ selected in the │
 * │ items       │               │ navigator       │
 * └─────────────┴───────────────┴─────────────────┘
 *
 * NAVIGATOR (Left Panel):
 * - w-72, border-r, bg-white/80 backdrop-blur-xl
 * - Contains selectable items (buttons/list items)
 * - Clicking an item updates the inspector
 * - Supports nested sections (e.g., Home + Categories)
 * - Drag-and-drop reordering where applicable
 *
 * PREVIEW (Center):
 * - flex-1, centered content
 * - DevicePreview component with live screen
 * - Shows real-time changes from inspector
 *
 * INSPECTOR (Right Panel):
 * - w-80, border-l, bg-white/80 backdrop-blur-xl
 * - Dynamic content based on navigator selection
 * - Collapsible sections (click header to expand/collapse)
 * - Section headers: icon + label + chevron
 * - Forms use consistent input styling
 *
 * This pattern is used across:
 * - Home Slyde Editor (this file)
 * - Child Slyde Editor (EditorMockupClient.tsx)
 * - Any future desktop editors in HQ
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { DevicePreview } from '@/components/slyde-demo'
import { HomeSlydeScreen } from '@/components/home-slyde/HomeSlydeScreen'
import { InventoryGridView } from '@/components/home-slyde/InventoryGridView'
import { SlydeScreen } from '@/components/slyde-demo/SlydeScreen'
import type { FrameData, FAQItem, BusinessInfo, FrameInfoContent, CTAIconType, ListItem, ListData } from '@/components/slyde-demo/frameData'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useOrganization } from '@/hooks'
import {
  useDemoHomeSlyde,
  writeDemoHomeSlyde,
  readChildFrames,
  writeChildFrames,
  deleteChildFrames,
  readLists,
  addList,
  updateList,
  deleteList,
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
  GripVertical,
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
  ArrowLeft,
  Image as ImageIcon,
  Palette,
  Info,
  Phone,
  Book,
  List,
  AtSign,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import type { SocialLinks } from '@/components/slyde-demo/frameData'
import { Toggle } from '@/components/ui/Toggle'

// HQ design tokens
const HQ_PRIMARY_GRADIENT = 'bg-gradient-to-r from-blue-600 to-cyan-500'
const HQ_PRIMARY_SHADOW = 'shadow-lg shadow-blue-500/15'

// Selection types: Home, Category, List, Item, or ItemFrame
type SelectionType = 'home' | 'category' | 'list' | 'frame' | 'item' | 'itemFrame'

interface Selection {
  type: SelectionType
  categoryId?: string  // Only set when type === 'category'
  listId?: string      // Only set when type === 'list'
  frameId?: string     // Only set when type === 'frame' (category frames)
  itemId?: string      // Only set when type === 'item'
  itemFrameId?: string // Only set when type === 'itemFrame'
}

// Curated Lucide icons for categories (CONSTX: consistent with HQ design)
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

// CTA button icons for frame editor (matches CTAIconType from frameData)
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

interface HomeSlydeEditorClientProps {
  initialCategoryId?: string
}

export function HomeSlydeEditorClient({ initialCategoryId }: HomeSlydeEditorClientProps) {
  // Use real organization data from Supabase
  const { organization, isLoading: orgLoading } = useOrganization()
  const { data: homeSlyde, hydrated: homeSlydeHydrated } = useDemoHomeSlyde()

  // Build brand profile from organization (fallback to defaults while loading)
  const brandProfile = {
    businessName: organization?.name || 'Your Business',
    tagline: '', // TODO: Add tagline to organizations table
    primaryColor: organization?.primary_color || '#2563EB',
    secondaryColor: '#22D3EE',
    logoUrl: organization?.logo_url || null,
  }

  // Editor state
  const [videoSrc, setVideoSrc] = useState(homeSlyde.videoSrc)
  const [posterSrc, setPosterSrc] = useState(homeSlyde.posterSrc || '')
  const [brandName, setBrandName] = useState(brandProfile.businessName)
  const [tagline, setTagline] = useState(brandProfile.tagline)
  const [rating, setRating] = useState(highlandMotorsData.rating || 4.9)
  const [reviewCount, setReviewCount] = useState(highlandMotorsData.reviewCount || 847)
  const [about, setAbout] = useState(highlandMotorsData.about || '')
  const [address, setAddress] = useState(highlandMotorsData.address || '')
  const [hours, setHours] = useState(highlandMotorsData.hours || '')
  const [phone, setPhone] = useState(highlandMotorsData.phone || '')
  const [email, setEmail] = useState(highlandMotorsData.email || '')
  const [website, setWebsite] = useState(highlandMotorsData.website || '')
  const [categories, setCategories] = useState<DemoHomeSlydeCategory[]>(homeSlyde.categories)
  const [primaryCtaEnabled, setPrimaryCtaEnabled] = useState(!!homeSlyde.primaryCta)
  const [primaryCtaText, setPrimaryCtaText] = useState(homeSlyde.primaryCta?.text || 'Book Now')
  const [primaryCtaAction, setPrimaryCtaAction] = useState(homeSlyde.primaryCta?.action || '')
  const [showCategoryIcons, setShowCategoryIcons] = useState(homeSlyde.showCategoryIcons ?? false)
  const [showHearts, setShowHearts] = useState(homeSlyde.showHearts ?? true)
  const [showShare, setShowShare] = useState(homeSlyde.showShare ?? true)
  const [showSound, setShowSound] = useState(homeSlyde.showSound ?? true)
  const [showReviews, setShowReviews] = useState(homeSlyde.showReviews ?? true)

  // Social links state for Connect button
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(homeSlyde.socialLinks ?? {})

  // Lists state - independent lists that can be connected via CTA
  const [lists, setLists] = useState<ListData[]>(homeSlyde.lists ?? [])

  // Selection state - what's shown in the right panel
  const [selection, setSelection] = useState<Selection>({ type: 'home' })

  // Editing level state - tracks which level of the hierarchy we're editing
  // home   → Edit Home Slyde (categories, video, branding)
  // child  → Edit Category Slyde (frames for a category)
  // list   → Edit List (items in a list)
  // item   → Edit Item Slyde (frames for a specific item)
  type EditingLevel = 'home' | 'child' | 'list' | 'item'
  const [editingLevel, setEditingLevel] = useState<EditingLevel>('home')
  const [editingChildId, setEditingChildId] = useState<string | null>(null)   // category ID when in child level
  const [editingListId, setEditingListId] = useState<string | null>(null)     // list ID when in list level
  const [editingItemId, setEditingItemId] = useState<string | null>(null)     // item ID when in item level

  // List View preview state
  const [listViewFrame, setListViewFrame] = useState<FrameData | null>(null)

  // Get current list being edited
  const editingList = editingListId ? lists.find(l => l.id === editingListId) : null
  // Get current item being edited
  const editingItem = editingList && editingItemId
    ? editingList.items.find(i => i.id === editingItemId)
    : null

  // Get the category being edited (for breadcrumb)
  const editingCategory = editingChildId ? categories.find(c => c.id === editingChildId) : null

  // Collapsible section state for Home inspector
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    video: false,
    info: false,
    cta: false,
    settings: false,
    socialMedia: false, // Social Media section
    content: true,  // Frame inspector: open by default
    style: false,   // Frame inspector
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Drag state
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<{ id: string; position: 'above' | 'below' } | null>(null)
  const categoryCardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const dragGhostRef = useRef<HTMLDivElement | null>(null)

  // Track whether initial data has been loaded (prevents sync effect from overwriting user input)
  const initializedRef = useRef(false)

  // Sync from localStorage - ONLY after hydration, and only once
  // This prevents the race condition where default data overwrites user edits
  useEffect(() => {
    // Wait for localStorage to hydrate before syncing
    if (!homeSlydeHydrated) return
    // Only sync once after hydration
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
    setSocialLinks(homeSlyde.socialLinks ?? {})
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

  // Auto-enter child editing mode if initialCategoryId is provided (from URL param)
  useEffect(() => {
    if (initialCategoryId && categories.some(c => c.id === initialCategoryId)) {
      setEditingLevel('child')
      setEditingChildId(initialCategoryId)
      setSelection({ type: 'category', categoryId: initialCategoryId })
    }
  }, [initialCategoryId, categories])

  // Persist changes (preserving existing childFrames from localStorage)
  const persistHomeSlyde = useCallback(() => {
    // Read current state to preserve childFrames
    const current = homeSlyde
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
      // Save social links for Connect button
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      // Preserve existing childFrames from localStorage
      childFrames: current.childFrames,
      // Save lists
      lists,
    }
    writeDemoHomeSlyde(next)
  }, [videoSrc, posterSrc, categories, primaryCtaEnabled, primaryCtaText, primaryCtaAction, showCategoryIcons, showHearts, showShare, showSound, showReviews, socialLinks, lists, homeSlyde])

  useEffect(() => {
    const timeout = setTimeout(persistHomeSlyde, 300)
    return () => clearTimeout(timeout)
  }, [persistHomeSlyde])

  // Build preview data
  const previewData: HomeSlydeData = {
    businessName: brandName,
    tagline,
    accentColor: brandProfile.secondaryColor || '#22D3EE',
    backgroundGradient: 'from-slate-900 via-slate-800 to-slate-900',
    videoSrc,
    posterSrc: posterSrc || undefined,
    rating,
    reviewCount,
    about,
    address,
    hours,
    phone,
    email,
    website,
    categories: categories.map((c) => ({
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

  const brandAccent = brandProfile.secondaryColor || '#22D3EE'
  const businessInitial = brandName.charAt(0).toUpperCase()

  // Category CRUD
  const addCategory = useCallback(() => {
    if (categories.length >= 6) return
    const newId = `cat-${Date.now()}`
    setCategories((prev) => [
      ...prev,
      { id: newId, icon: 'sparkles', name: 'New Category', description: '', childSlydeId: 'camping', hasInventory: false },
    ])
    setSelection({ type: 'category', categoryId: newId })
  }, [categories.length])

  const updateCategory = useCallback((id: string, updates: Partial<DemoHomeSlydeCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    // Also delete associated child frames from localStorage
    deleteChildFrames(id)
    // Clear from in-memory state too
    setChildFrames(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }, [])

  const moveCategoryNear = useCallback((fromId: string, targetId: string, position: 'above' | 'below') => {
    if (fromId === targetId) return
    setCategories((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === fromId)
      if (fromIndex < 0) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      const targetIndex = next.findIndex((c) => c.id === targetId)
      if (targetIndex < 0) {
        next.push(moved)
      } else {
        const insertIndex = position === 'below' ? targetIndex + 1 : targetIndex
        next.splice(insertIndex, 0, moved)
      }
      return next
    })
  }, [])

  const selectedCategory = selection.type === 'category' && selection.categoryId
    ? categories.find((c) => c.id === selection.categoryId)
    : null

  // ============================================
  // LIST CRUD
  // ============================================

  const addNewList = useCallback(() => {
    const newId = `list-${Date.now()}`
    const newList: ListData = {
      id: newId,
      name: 'New List',
      items: [],
    }
    setLists((prev) => [...prev, newList])
    setSelection({ type: 'list', listId: newId })
  }, [])

  const updateListById = useCallback((id: string, updates: Partial<ListData>) => {
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }, [])

  const deleteListById = useCallback((id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id))
    if (selection.type === 'list' && selection.listId === id) {
      setSelection({ type: 'home' })
    }
  }, [selection])

  const selectedList = selection.type === 'list' && selection.listId
    ? lists.find((l) => l.id === selection.listId)
    : null

  // ============================================
  // CHILD SLYDE (FRAMES) EDITING STATE
  // ============================================

  // Initial frames for a new child slyde
  const buildStarterFrames = useCallback((accentColor: string): FrameData[] => [
    {
      id: '1',
      order: 1,
      templateType: 'hook',
      title: 'Hook Frame',
      subtitle: 'Capture attention',
      badge: '⭐ Featured',
      heartCount: 2400,
      faqCount: 0,
      background: { type: 'video', src: 'https://videos.pexels.com/video-files/5309351/5309351-hd_1920_1080_25fps.mp4' },
      accentColor,
    },
    {
      id: '2',
      order: 2,
      templateType: 'how',
      title: 'How it works',
      subtitle: 'Explain the process',
      heartCount: 1800,
      faqCount: 0,
      background: { type: 'video', src: 'https://videos.pexels.com/video-files/5309380/5309380-hd_1920_1080_25fps.mp4' },
      accentColor,
    },
    {
      id: '3',
      order: 3,
      templateType: 'action',
      title: 'Take action',
      subtitle: 'Book now',
      badge: '🔥 Limited',
      heartCount: 3200,
      faqCount: 0,
      cta: { text: 'Book Now', icon: 'book', action: '' },
      background: { type: 'video', src: 'https://videos.pexels.com/video-files/5309435/5309435-hd_1920_1080_25fps.mp4' },
      accentColor,
    },
  ], [])

  // Frame state - stored per category (keyed by category id)
  const [childFrames, setChildFrames] = useState<Record<string, FrameData[]>>({})
  const [selectedFrameId, setSelectedFrameId] = useState<string>('1')
  const [previewFrameIndex, setPreviewFrameIndex] = useState(0)

  // Get frames for currently editing child
  const currentFrames = editingChildId ? (childFrames[editingChildId] || []) : []
  const selectedFrame = currentFrames.find(f => f.id === selectedFrameId) || currentFrames[0]

  // Get item frames for currently editing item
  const currentItemFrames = editingItem?.frames ?? []
  const selectedItemFrameId = selection.type === 'itemFrame' ? selection.itemFrameId : currentItemFrames[0]?.id
  const selectedItemFrame = currentItemFrames.find(f => f.id === selectedItemFrameId) || currentItemFrames[0]

  // Load frames when entering child edit mode (from localStorage or create starter frames)
  useEffect(() => {
    if (editingLevel === 'child' && editingChildId && !childFrames[editingChildId]) {
      // Try to load from localStorage first
      const savedFrames = readChildFrames(editingChildId)
      if (savedFrames && savedFrames.length > 0) {
        setChildFrames(prev => ({ ...prev, [editingChildId]: savedFrames }))
        setSelectedFrameId(savedFrames[0].id)
      } else {
        // Create starter frames if none exist
        const starterFrames = buildStarterFrames(brandProfile.secondaryColor || '#22D3EE')
        setChildFrames(prev => ({ ...prev, [editingChildId]: starterFrames }))
        setSelectedFrameId(starterFrames[0].id)
      }
      setPreviewFrameIndex(0)
    }
  }, [editingLevel, editingChildId, childFrames, buildStarterFrames, brandProfile.secondaryColor])

  // Persist frames to localStorage when they change (debounced)
  useEffect(() => {
    if (!editingChildId || !childFrames[editingChildId] || childFrames[editingChildId].length === 0) return
    const timeout = setTimeout(() => {
      writeChildFrames(editingChildId, childFrames[editingChildId])
    }, 300)
    return () => clearTimeout(timeout)
  }, [editingChildId, childFrames])

  // Frame CRUD
  const updateFrame = useCallback((frameId: string, updates: Partial<FrameData>) => {
    if (!editingChildId) return
    setChildFrames(prev => ({
      ...prev,
      [editingChildId]: (prev[editingChildId] || []).map(f =>
        f.id === frameId ? { ...f, ...updates } : f
      )
    }))
  }, [editingChildId])

  const addFrame = useCallback(() => {
    if (!editingChildId) return
    const frames = childFrames[editingChildId] || []
    const newId = String(Math.max(...frames.map(f => parseInt(f.id) || 0), 0) + 1)
    const newFrame: FrameData = {
      id: newId,
      order: frames.length + 1,
      templateType: 'how',
      title: 'New Frame',
      subtitle: '',
      heartCount: 1000,
      faqCount: 0,
      background: { type: 'video', src: '' },
      accentColor: brandProfile.secondaryColor || '#22D3EE',
    }
    setChildFrames(prev => ({
      ...prev,
      [editingChildId]: [...(prev[editingChildId] || []), newFrame]
    }))
    setSelectedFrameId(newId)
  }, [editingChildId, childFrames, brandProfile.secondaryColor])

  const deleteFrame = useCallback((frameId: string) => {
    if (!editingChildId) return
    const frames = childFrames[editingChildId] || []
    if (frames.length <= 1) return // Don't delete last frame
    setChildFrames(prev => ({
      ...prev,
      [editingChildId]: (prev[editingChildId] || []).filter(f => f.id !== frameId)
    }))
    // Select another frame
    const remaining = frames.filter(f => f.id !== frameId)
    if (remaining.length > 0) {
      setSelectedFrameId(remaining[0].id)
    }
  }, [editingChildId, childFrames])

  // Item frame helpers - for editing frames within an item (Item Slyde)
  const updateItemFrame = useCallback((frameId: string, updates: Partial<FrameData>) => {
    if (!editingListId || !editingItemId) return
    setLists(prev => prev.map(l =>
      l.id === editingListId
        ? {
            ...l,
            items: l.items.map(i =>
              i.id === editingItemId
                ? { ...i, frames: (i.frames || []).map(f => f.id === frameId ? { ...f, ...updates } : f) }
                : i
            )
          }
        : l
    ))
  }, [editingListId, editingItemId])

  const addItemFrame = useCallback(() => {
    if (!editingListId || !editingItemId) return
    const newFrame: FrameData = {
      id: `frame-${Date.now()}`,
      order: (currentItemFrames.length || 0) + 1,
      title: `Frame ${(currentItemFrames.length || 0) + 1}`,
      subtitle: '',
      heartCount: 0,
      faqCount: 0,
      accentColor: brandProfile.secondaryColor || '#22D3EE',
      background: { type: 'image', src: '' },
    }
    setLists(prev => prev.map(l =>
      l.id === editingListId
        ? {
            ...l,
            items: l.items.map(i =>
              i.id === editingItemId
                ? { ...i, frames: [...(i.frames || []), newFrame] }
                : i
            )
          }
        : l
    ))
    setSelection({ type: 'itemFrame', itemFrameId: newFrame.id })
  }, [editingListId, editingItemId, currentItemFrames.length, brandProfile.secondaryColor])

  const deleteItemFrame = useCallback((frameId: string) => {
    if (!editingListId || !editingItemId) return
    const frames = currentItemFrames
    if (frames.length <= 1) return // Don't delete last frame
    setLists(prev => prev.map(l =>
      l.id === editingListId
        ? {
            ...l,
            items: l.items.map(i =>
              i.id === editingItemId
                ? { ...i, frames: (i.frames || []).filter(f => f.id !== frameId) }
                : i
            )
          }
        : l
    ))
    // Select another frame
    const remaining = frames.filter(f => f.id !== frameId)
    if (remaining.length > 0) {
      setSelection({ type: 'itemFrame', itemFrameId: remaining[0].id })
    }
  }, [editingListId, editingItemId, currentItemFrames])

  // Business info for SlydeScreen preview
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
    contact: { phone, email },
    accentColor: brandProfile.secondaryColor || '#22D3EE',
  }

  // FAQs (placeholder for now)
  const faqs: FAQItem[] = []

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="home-slyde" />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar with Breadcrumb */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div className="flex items-center gap-4 min-w-0">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingLevel('home')
                    setEditingChildId(null)
                    setSelection({ type: 'home' })
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    editingLevel === 'home'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Home Slyde</span>
                </button>

                {editingLevel === 'child' && editingCategory && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-white/30" />
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium">
                      {editingCategory.name}
                    </span>
                  </>
                )}
              </nav>
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

          {/* Main Editor - 3 Column Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL - Navigation */}
            <aside className="w-72 border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto p-3 space-y-1">

                {/* ====== HOME LEVEL NAVIGATION ====== */}
                {editingLevel === 'home' && (
                  <>
                    {/* Home - single button for all home settings */}
                    <button
                      onClick={() => setSelection({ type: 'home' })}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        selection.type === 'home'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                      }`}
                    >
                      <HomeIcon className="w-4 h-4 shrink-0" />
                      <span className="text-[13px] font-medium">Home</span>
                    </button>

                    {/* Categories Section */}
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between px-3 mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                      Categories ({categories.length}/6)
                    </span>
                    {categories.length < 6 && (
                      <button
                        onClick={addCategory}
                        className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const isSelected = selection.type === 'category' && selection.categoryId === cat.id
                      const isDropTarget = draggingCategoryId && dragOverTarget?.id === cat.id
                      const showIndicatorAbove = isDropTarget && dragOverTarget?.position === 'above'
                      const showIndicatorBelow = isDropTarget && dragOverTarget?.position === 'below'
                      const IconComponent = getCategoryIcon(cat.icon)

                      return (
                        <div key={cat.id} className="relative">
                          <div
                            className={`absolute -top-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150 ${
                              showIndicatorAbove ? 'opacity-100' : 'opacity-0'
                            }`}
                          />

                          <div
                            ref={(el) => {
                              if (el) categoryCardRefs.current.set(cat.id, el)
                              else categoryCardRefs.current.delete(cat.id)
                            }}
                            draggable
                            onClick={() => setSelection({ type: 'category', categoryId: cat.id })}
                            onDragStart={(e) => {
                              setDraggingCategoryId(cat.id)
                              setDragOverTarget(null)
                              const cardEl = categoryCardRefs.current.get(cat.id)
                              if (cardEl) {
                                const clone = cardEl.cloneNode(true) as HTMLDivElement
                                clone.style.position = 'absolute'
                                clone.style.top = '-9999px'
                                clone.style.left = '-9999px'
                                clone.style.width = `${cardEl.offsetWidth}px`
                                clone.style.transform = 'rotate(1.5deg) scale(1.03)'
                                clone.style.boxShadow = '0 16px 48px -12px rgba(0,0,0,0.35)'
                                clone.style.opacity = '1'
                                clone.style.pointerEvents = 'none'
                                clone.style.borderRadius = '0.75rem'
                                document.body.appendChild(clone)
                                dragGhostRef.current = clone
                                e.dataTransfer.setDragImage(clone, cardEl.offsetWidth / 2, 20)
                              }
                              try {
                                e.dataTransfer.setData('text/plain', cat.id)
                                e.dataTransfer.effectAllowed = 'move'
                              } catch { /* ignore */ }
                            }}
                            onDragEnd={() => {
                              setDraggingCategoryId(null)
                              setDragOverTarget(null)
                              if (dragGhostRef.current) {
                                dragGhostRef.current.remove()
                                dragGhostRef.current = null
                              }
                            }}
                            onDragOver={(e) => {
                              if (!draggingCategoryId || draggingCategoryId === cat.id) return
                              e.preventDefault()
                              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                              const relY = e.clientY - rect.top
                              const position: 'above' | 'below' = relY < rect.height / 2 ? 'above' : 'below'
                              setDragOverTarget({ id: cat.id, position })
                            }}
                            onDragLeave={() => {
                              setDragOverTarget((prev) => (prev?.id === cat.id ? null : prev))
                            }}
                            onDrop={(e) => {
                              e.preventDefault()
                              if (draggingCategoryId) {
                                const pos = dragOverTarget?.id === cat.id ? dragOverTarget.position : 'above'
                                moveCategoryNear(draggingCategoryId, cat.id, pos)
                              }
                              setDraggingCategoryId(null)
                              setDragOverTarget(null)
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                            } ${draggingCategoryId === cat.id ? 'opacity-50' : ''}`}
                          >
                            <GripVertical className={`w-3 h-3 shrink-0 cursor-grab ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-white/30'}`} />
                            {showCategoryIcons && <IconComponent className="w-4 h-4 shrink-0" />}
                            <span className="text-[13px] font-medium truncate flex-1">{cat.name}</span>
                          </div>

                          <div
                            className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-150 ${
                              showIndicatorBelow ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </div>
                      )
                    })}

                    {/* Always show Add category button if under the limit */}
                    {categories.length < 6 && (
                      <button
                        onClick={addCategory}
                        className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[12px] font-medium">Add category</span>
                      </button>
                    )}
                  </div>
                </div>

                  </>
                )}

                {/* ====== CHILD LEVEL NAVIGATION (Frames) ====== */}
                {editingLevel === 'child' && editingChildId && (
                  <>
                    {/* Back to Home button */}
                    <button
                      onClick={() => {
                        setEditingLevel('home')
                        setEditingChildId(null)
                        setSelection({ type: 'category', categoryId: editingChildId })
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70 mb-3"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span className="text-[13px] font-medium">Back to Home</span>
                    </button>

                    {/* Frames Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                          Frames ({currentFrames.length})
                        </span>
                        <button
                          onClick={addFrame}
                          className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {currentFrames.map((frame, index) => {
                          const isSelected = frame.id === selectedFrameId

                          return (
                            <button
                              key={frame.id}
                              onClick={() => {
                                setSelectedFrameId(frame.id)
                                setPreviewFrameIndex(index)
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold ${
                                isSelected ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="text-[13px] font-medium truncate flex-1">
                                {frame.title || `Frame ${index + 1}`}
                              </span>
                            </button>
                          )
                        })}

                        {currentFrames.length === 0 && (
                          <button
                            onClick={addFrame}
                            className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Add first frame</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lists Section - Available at child level too */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10 mt-3">
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                          Lists ({lists.length})
                        </span>
                        <button
                          onClick={addNewList}
                          className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {lists.map((list) => {
                          const isSelected = selection.type === 'list' && selection.listId === list.id
                          return (
                            <button
                              key={list.id}
                              onClick={() => setSelection({ type: 'list', listId: list.id })}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              <List className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                              <span className="text-[13px] font-medium truncate flex-1">{list.name}</span>
                              <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                {list.items.length}
                              </span>
                            </button>
                          )
                        })}

                        {lists.length === 0 && (
                          <button
                            onClick={addNewList}
                            className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Add list</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ====== LIST LEVEL NAVIGATION (Items in a List) ====== */}
                {editingLevel === 'list' && editingListId && editingList && (
                  <>
                    {/* Back to Slydes button */}
                    <button
                      onClick={() => {
                        setEditingLevel('child')
                        setEditingListId(null)
                        setSelection({ type: 'list', listId: editingListId })
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70 mb-3"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span className="text-[13px] font-medium">Back to Slydes</span>
                    </button>

                    {/* List Name Header */}
                    <div className="px-3 mb-3">
                      <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{editingList.name}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-white/50">{editingList.items.length} items</p>
                    </div>

                    {/* Items Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                          Items ({editingList.items.length})
                        </span>
                        <button
                          onClick={() => {
                            const newItem: ListItem = {
                              id: `item-${Date.now()}`,
                              title: 'New Item',
                            }
                            const updatedItems = [...editingList.items, newItem]
                            setLists(prev => prev.map(l =>
                              l.id === editingListId ? { ...l, items: updatedItems } : l
                            ))
                          }}
                          className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {editingList.items.map((item) => {
                          const isSelected = selection.type === 'item' && selection.itemId === item.id
                          const frameCount = item.frames?.length ?? 0
                          return (
                            <button
                              key={item.id}
                              onClick={() => setSelection({ type: 'item', itemId: item.id })}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              {item.image ? (
                                <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              ) : (
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                  <ShoppingBag className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-[13px] font-medium truncate block">{item.title}</span>
                                {item.price && (
                                  <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                    {item.price}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                {frameCount > 0 ? `${frameCount} frames` : 'No frames'}
                              </span>
                            </button>
                          )
                        })}

                        {editingList.items.length === 0 && (
                          <button
                            onClick={() => {
                              const newItem: ListItem = {
                                id: `item-${Date.now()}`,
                                title: 'New Item',
                              }
                              const updatedItems = [...editingList.items, newItem]
                              setLists(prev => prev.map(l =>
                                l.id === editingListId ? { ...l, items: updatedItems } : l
                              ))
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Add item</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ====== ITEM LEVEL NAVIGATION (Frames for an Item) ====== */}
                {editingLevel === 'item' && editingItemId && editingItem && editingList && (
                  <>
                    {/* Back to List button */}
                    <button
                      onClick={() => {
                        setEditingLevel('list')
                        setEditingItemId(null)
                        setSelection({ type: 'item', itemId: editingItemId })
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70 mb-3"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span className="text-[13px] font-medium">Back to {editingList.name}</span>
                    </button>

                    {/* Item Header */}
                    <div className="px-3 mb-3">
                      <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">{editingItem.title}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-white/50">{(editingItem.frames?.length ?? 0)} frames</p>
                    </div>

                    {/* Item Frames Section */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                          Frames ({editingItem.frames?.length ?? 0})
                        </span>
                        <button
                          onClick={() => {
                            const frameCount = editingItem.frames?.length ?? 0
                            const newFrame: FrameData = {
                              id: `item-frame-${Date.now()}`,
                              order: frameCount + 1,
                              title: `Frame ${frameCount + 1}`,
                              background: { type: 'image', src: '' },
                              heartCount: 0,
                              faqCount: 0,
                              accentColor: brandProfile.primaryColor,
                            }
                            const updatedFrames = [...(editingItem.frames ?? []), newFrame]
                            // Update item frames
                            setLists(prev => prev.map(l =>
                              l.id === editingListId
                                ? {
                                    ...l,
                                    items: l.items.map(i =>
                                      i.id === editingItemId ? { ...i, frames: updatedFrames } : i
                                    )
                                  }
                                : l
                            ))
                          }}
                          className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {(editingItem.frames ?? []).map((frame, idx) => {
                          const isSelected = selection.type === 'itemFrame' && selection.itemFrameId === frame.id
                          return (
                            <button
                              key={frame.id}
                              onClick={() => setSelection({ type: 'itemFrame', itemFrameId: frame.id })}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[13px] font-medium truncate flex-1">{frame.title}</span>
                            </button>
                          )
                        })}

                        {(editingItem.frames?.length ?? 0) === 0 && (
                          <button
                            onClick={() => {
                              const newFrame: FrameData = {
                                id: `item-frame-${Date.now()}`,
                                order: 1,
                                title: 'Frame 1',
                                background: { type: 'image', src: '' },
                                heartCount: 0,
                                faqCount: 0,
                                accentColor: brandProfile.primaryColor,
                              }
                              setLists(prev => prev.map(l =>
                                l.id === editingListId
                                  ? {
                                      ...l,
                                      items: l.items.map(i =>
                                        i.id === editingItemId ? { ...i, frames: [newFrame] } : i
                                      )
                                    }
                                  : l
                              ))
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Add frame</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </aside>

            {/* CENTER - Phone Preview */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-[#1c1c1e] dark:via-[#232326] dark:to-[#1c1c1e]">
              <DevicePreview enableTilt={false}>
                {editingLevel === 'home' ? (
                  <HomeSlydeScreen data={previewData} onCategoryTap={() => {}} />
                ) : editingLevel === 'list' && editingList ? (
                  // LIST LEVEL PREVIEW: Show InventoryGridView with list items
                  editingList.items.length > 0 ? (
                    <InventoryGridView
                      categoryName={editingList.name}
                      items={editingList.items.map(item => ({
                        id: item.id,
                        title: item.title,
                        subtitle: item.subtitle || '',
                        price: item.price || '',
                        image: item.image || '',
                        badge: item.badge,
                        frames: (item.frames || []) as any[], // Cast to any[] for type compatibility
                      }))}
                      onItemTap={(itemId) => {
                        // Select the tapped item in Navigator
                        setSelection({ type: 'item', itemId })
                      }}
                      onBack={() => {
                        setEditingLevel('child')
                        setEditingListId(null)
                        setSelection({ type: 'list', listId: editingListId! })
                      }}
                      accentColor={brandProfile.primaryColor}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                      <div className="text-center text-white/60 px-8">
                        <List className="w-10 h-10 mx-auto mb-3 text-white/30" />
                        <p className="text-sm">No items in list</p>
                        <p className="text-xs mt-1 text-white/40">Add items using the Navigator</p>
                      </div>
                    </div>
                  )
                ) : editingLevel === 'item' && editingItem ? (
                  // ITEM LEVEL PREVIEW: Show Item Slyde frames
                  (editingItem.frames?.length ?? 0) > 0 ? (
                    <SlydeScreen
                      frames={editingItem.frames!}
                      business={businessInfo}
                      faqs={[]}
                      initialFrameIndex={0}
                      onFrameChange={() => {}}
                      autoAdvance={false}
                      context="category"
                      onBack={() => {
                        setEditingLevel('list')
                        setEditingItemId(null)
                        setSelection({ type: 'item', itemId: editingItemId! })
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                      <div className="text-center text-white/60 px-8">
                        <Layers className="w-10 h-10 mx-auto mb-3 text-white/30" />
                        <p className="text-sm">No frames yet</p>
                        <p className="text-xs mt-1 text-white/40">Add frames using the Navigator</p>
                      </div>
                    </div>
                  )
                ) : currentFrames.length > 0 ? (
                  <SlydeScreen
                    frames={currentFrames}
                    business={businessInfo}
                    faqs={faqs}
                    initialFrameIndex={previewFrameIndex}
                    onFrameChange={setPreviewFrameIndex}
                    autoAdvance={false}
                    context="category"
                    onBack={() => {
                      setEditingLevel('home')
                      setEditingChildId(null)
                      setSelection({ type: 'category', categoryId: editingChildId || undefined })
                    }}
                    onListView={(frame) => {
                      // Check if connected to a list OR has inline items
                      const connectedList = frame.cta?.listId ? lists.find(l => l.id === frame.cta!.listId) : null
                      const hasItems = (connectedList && connectedList.items.length > 0) || (frame.listItems && frame.listItems.length > 0)

                      if (frame.cta?.listId || hasItems) {
                        setListViewFrame(frame)
                        setEditingLevel('list')
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="text-center text-white/60">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm">Loading frames...</p>
                    </div>
                  </div>
                )}
              </DevicePreview>
              <p className="mt-4 text-sm text-gray-500 dark:text-white/50 font-mono">
                {editingLevel === 'home' && 'Home Slyde Preview'}
                {editingLevel === 'child' && `${editingCategory?.name || 'Category'} Preview`}
                {editingLevel === 'list' && `${editingList?.name || 'List'} Preview`}
                {editingLevel === 'item' && `${editingItem?.title || 'Item'} Slyde Preview`}
              </p>
            </main>

            {/* RIGHT PANEL - Inspector */}
            <aside className="w-80 border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-200/80 dark:border-white/10">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {editingLevel === 'home' && selection.type === 'home' && 'Home Settings'}
                  {editingLevel === 'home' && selection.type === 'category' && (selectedCategory?.name || 'Category')}
                  {editingLevel === 'child' && selection.type === 'list' && (selectedList?.name || 'List')}
                  {editingLevel === 'child' && selectedFrame && `Frame ${currentFrames.findIndex(f => f.id === selectedFrame.id) + 1}`}
                  {editingLevel === 'list' && selection.type === 'item' && 'Item Details'}
                  {editingLevel === 'item' && selection.type === 'itemFrame' && 'Frame Editor'}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* HOME - Collapsible sections (only when editing home level) */}
                {editingLevel === 'home' && selection.type === 'home' && (
                  <>
                    {/* Brand Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('brand')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Type className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Brand
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.brand && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Brand Name</label>
                            <input
                              type="text"
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Tagline</label>
                            <input
                              type="text"
                              value={tagline}
                              onChange={(e) => setTagline(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Rating</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Reviews</label>
                              <input
                                type="number"
                                value={reviewCount}
                                onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('video')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Video className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Video
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.video ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.video && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <div className="text-[12px] text-gray-600 dark:text-white/60">
                              9:16 vertical video, 10-30 seconds. Autoplay muted.
                            </div>
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Video URL</label>
                            <input
                              type="text"
                              value={videoSrc}
                              onChange={(e) => setVideoSrc(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="/videos/brand.mp4"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Poster Image (fallback)</label>
                            <input
                              type="text"
                              value={posterSrc}
                              onChange={(e) => setPosterSrc(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Business Info Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('info')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Business Info
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.info ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.info && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">About</label>
                            <textarea
                              value={about}
                              onChange={(e) => setAbout(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm resize-none"
                              placeholder="Tell customers about your business..."
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Address</label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="123 Main Street, City"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Hours</label>
                            <input
                              type="text"
                              value={hours}
                              onChange={(e) => setHours(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="Mon-Fri 9am-5pm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Phone</label>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                placeholder="+44 123..."
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Email</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                placeholder="hello@..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Website</label>
                            <input
                              type="text"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="yourwebsite.com"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Primary CTA Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('cta')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Primary CTA
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.cta ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.cta && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <Toggle
                            enabled={primaryCtaEnabled}
                            onChange={setPrimaryCtaEnabled}
                            label="Show Primary CTA"
                          />
                          {primaryCtaEnabled && (
                            <>
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button Text</label>
                                <input
                                  type="text"
                                  value={primaryCtaText}
                                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                  placeholder="Book Now"
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Action URL</label>
                                <input
                                  type="text"
                                  value={primaryCtaAction}
                                  onChange={(e) => setPrimaryCtaAction(e.target.value)}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                  placeholder="https://booking.example.com"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Settings Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('settings')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Settings
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.settings ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.settings && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <Toggle
                            enabled={showReviews}
                            onChange={setShowReviews}
                            label="Reviews"
                          />
                          <Toggle
                            enabled={showHearts}
                            onChange={setShowHearts}
                            label="Hearts"
                          />
                          <Toggle
                            enabled={showShare}
                            onChange={setShowShare}
                            label="Share"
                          />
                          <Toggle
                            enabled={showSound}
                            onChange={setShowSound}
                            label="Sound"
                          />
                          <Toggle
                            enabled={showCategoryIcons}
                            onChange={setShowCategoryIcons}
                            label="Category Icons"
                          />
                        </div>
                      )}
                    </div>

                    {/* Social Media Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('socialMedia')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <AtSign className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Social Media
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.socialMedia ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.socialMedia && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <p className="text-[11px] text-gray-500 dark:text-white/40 mb-3">
                            Add your social profiles. The Connect button will appear when at least one link is set.
                          </p>

                          {/* Instagram */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <Instagram className="w-3.5 h-3.5" />
                              Instagram
                            </label>
                            <input
                              type="url"
                              value={socialLinks.instagram || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://instagram.com/yourbusiness"
                            />
                          </div>

                          {/* TikTok */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                              </svg>
                              TikTok
                            </label>
                            <input
                              type="url"
                              value={socialLinks.tiktok || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, tiktok: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://tiktok.com/@yourbusiness"
                            />
                          </div>

                          {/* Facebook */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <Facebook className="w-3.5 h-3.5" />
                              Facebook
                            </label>
                            <input
                              type="url"
                              value={socialLinks.facebook || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://facebook.com/yourbusiness"
                            />
                          </div>

                          {/* YouTube */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <Youtube className="w-3.5 h-3.5" />
                              YouTube
                            </label>
                            <input
                              type="url"
                              value={socialLinks.youtube || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://youtube.com/@yourbusiness"
                            />
                          </div>

                          {/* Twitter/X */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                              X (Twitter)
                            </label>
                            <input
                              type="url"
                              value={socialLinks.twitter || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://x.com/yourbusiness"
                            />
                          </div>

                          {/* LinkedIn */}
                          <div>
                            <label className="block text-[11px] font-medium text-gray-600 dark:text-white/60 mb-1 flex items-center gap-1.5">
                              <Linkedin className="w-3.5 h-3.5" />
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              value={socialLinks.linkedin || ''}
                              onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value || undefined }))}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://linkedin.com/company/yourbusiness"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* CATEGORY (only when editing home level) */}
                {editingLevel === 'home' && selection.type === 'category' && selectedCategory && (
                  <>
                    {/* Icon Picker - only shown when icons are enabled */}
                    {showCategoryIcons && (
                      <div>
                        <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-2">Icon</label>
                        <div className="grid grid-cols-4 gap-2">
                          {CATEGORY_ICONS.map((iconOption) => {
                            const isSelected = selectedCategory.icon === iconOption.id
                            return (
                              <button
                                key={iconOption.id}
                                onClick={() => updateCategory(selectedCategory.id, { icon: iconOption.id })}
                                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                                title={iconOption.label}
                              >
                                <iconOption.Icon className="w-5 h-5" />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Name</label>
                      <input
                        type="text"
                        value={selectedCategory.name}
                        onChange={(e) => updateCategory(selectedCategory.id, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Description</label>
                      <input
                        type="text"
                        value={selectedCategory.description}
                        onChange={(e) => updateCategory(selectedCategory.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                        placeholder="Brief description"
                      />
                    </div>

                    {/* Inventory Toggle */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                      <Toggle
                        enabled={selectedCategory.hasInventory ?? false}
                        onChange={(enabled) => updateCategory(selectedCategory.id, { hasInventory: enabled })}
                        label="Has Inventory"
                        description="Show inventory grid after Category Slyde"
                      />

                      {selectedCategory.hasInventory && (
                        <div className="mt-3">
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Inventory CTA Text</label>
                          <input
                            type="text"
                            value={selectedCategory.inventoryCtaText || ''}
                            onChange={(e) => updateCategory(selectedCategory.id, { inventoryCtaText: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            placeholder="View All 12 Vehicles"
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                      <button
                        onClick={() => {
                          setEditingLevel('child')
                          setEditingChildId(selectedCategory.id)
                        }}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 text-white text-sm font-medium rounded-xl transition-all ${HQ_PRIMARY_GRADIENT} ${HQ_PRIMARY_SHADOW} hover:opacity-90`}
                      >
                        <Layers className="w-4 h-4" />
                        Edit Child Slyde Frames
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCategory(selectedCategory.id)
                          setSelection({ type: 'home' })
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Category
                      </button>
                    </div>
                  </>
                )}

                {/* LIST INSPECTOR (when list is selected at child level) */}
                {editingLevel === 'child' && selection.type === 'list' && selectedList && (
                  <>
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
                          onClick={() => {
                            const newItem: ListItem = {
                              id: `item-${Date.now()}`,
                              title: 'New Item',
                            }
                            updateListById(selectedList.id, {
                              items: [...selectedList.items, newItem],
                            })
                          }}
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
                                  onChange={(e) => {
                                    const newItems = [...selectedList.items]
                                    newItems[idx] = { ...item, title: e.target.value }
                                    updateListById(selectedList.id, { items: newItems })
                                  }}
                                  className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                  placeholder="Item title"
                                />
                                <input
                                  type="text"
                                  value={item.subtitle || ''}
                                  onChange={(e) => {
                                    const newItems = [...selectedList.items]
                                    newItems[idx] = { ...item, subtitle: e.target.value }
                                    updateListById(selectedList.id, { items: newItems })
                                  }}
                                  className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                  placeholder="Subtitle (optional)"
                                />
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={item.price || ''}
                                    onChange={(e) => {
                                      const newItems = [...selectedList.items]
                                      newItems[idx] = { ...item, price: e.target.value }
                                      updateListById(selectedList.id, { items: newItems })
                                    }}
                                    className="w-1/2 px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                    placeholder="£18.50"
                                  />
                                  <input
                                    type="text"
                                    value={item.badge || ''}
                                    onChange={(e) => {
                                      const newItems = [...selectedList.items]
                                      newItems[idx] = { ...item, badge: e.target.value }
                                      updateListById(selectedList.id, { items: newItems })
                                    }}
                                    className="w-1/2 px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                    placeholder="Badge"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={item.image || ''}
                                  onChange={(e) => {
                                    const newItems = [...selectedList.items]
                                    newItems[idx] = { ...item, image: e.target.value }
                                    updateListById(selectedList.id, { items: newItems })
                                  }}
                                  className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/15 rounded text-sm text-gray-900 dark:text-white"
                                  placeholder="Image URL (optional)"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const newItems = selectedList.items.filter((_, i) => i !== idx)
                                  updateListById(selectedList.id, { items: newItems })
                                }}
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

                    {/* Edit List - Enter list editing level */}
                    <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                      <button
                        onClick={() => {
                          setEditingLevel('list')
                          setEditingListId(selectedList.id)
                          setSelection({ type: 'item', itemId: selectedList.items[0]?.id })
                        }}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 text-white text-sm font-medium rounded-xl ${HQ_PRIMARY_GRADIENT} ${HQ_PRIMARY_SHADOW} hover:opacity-90 transition-opacity`}
                      >
                        <ChevronRight className="w-4 h-4" />
                        Edit List Items
                      </button>
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
                  </>
                )}

                {/* ITEM INSPECTOR (when editing list level and item is selected) */}
                {editingLevel === 'list' && selection.type === 'item' && selection.itemId && editingList && (
                  (() => {
                    const selectedItem = editingList.items.find(i => i.id === selection.itemId)
                    if (!selectedItem) return null
                    return (
                      <>
                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Item Title</label>
                          <input
                            type="text"
                            value={selectedItem.title}
                            onChange={(e) => {
                              setLists(prev => prev.map(l =>
                                l.id === editingListId
                                  ? { ...l, items: l.items.map(i => i.id === selectedItem.id ? { ...i, title: e.target.value } : i) }
                                  : l
                              ))
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            placeholder="e.g. BMW M3 Competition"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                          <input
                            type="text"
                            value={selectedItem.subtitle || ''}
                            onChange={(e) => {
                              setLists(prev => prev.map(l =>
                                l.id === editingListId
                                  ? { ...l, items: l.items.map(i => i.id === selectedItem.id ? { ...i, subtitle: e.target.value } : i) }
                                  : l
                              ))
                            }}
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
                              onChange={(e) => {
                                setLists(prev => prev.map(l =>
                                  l.id === editingListId
                                    ? { ...l, items: l.items.map(i => i.id === selectedItem.id ? { ...i, price: e.target.value } : i) }
                                    : l
                                ))
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="£45,000"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                            <input
                              type="text"
                              value={selectedItem.badge || ''}
                              onChange={(e) => {
                                setLists(prev => prev.map(l =>
                                  l.id === editingListId
                                    ? { ...l, items: l.items.map(i => i.id === selectedItem.id ? { ...i, badge: e.target.value } : i) }
                                    : l
                                ))
                              }}
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
                            onChange={(e) => {
                              setLists(prev => prev.map(l =>
                                l.id === editingListId
                                  ? { ...l, items: l.items.map(i => i.id === selectedItem.id ? { ...i, image: e.target.value } : i) }
                                  : l
                              ))
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            placeholder="https://..."
                          />
                        </div>

                        {/* Item Slyde Section */}
                        <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                              Item Slyde
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-white/40">
                              {(selectedItem.frames?.length ?? 0)} frames
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setEditingLevel('item')
                              setEditingItemId(selectedItem.id)
                              setSelection({ type: 'itemFrame', itemFrameId: selectedItem.frames?.[0]?.id })
                            }}
                            className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 text-white text-sm font-medium rounded-xl ${HQ_PRIMARY_GRADIENT} ${HQ_PRIMARY_SHADOW} hover:opacity-90 transition-opacity`}
                          >
                            <ChevronRight className="w-4 h-4" />
                            Edit Item Frames
                          </button>
                        </div>

                        {/* Delete Item */}
                        <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                          <button
                            onClick={() => {
                              setLists(prev => prev.map(l =>
                                l.id === editingListId
                                  ? { ...l, items: l.items.filter(i => i.id !== selectedItem.id) }
                                  : l
                              ))
                              setSelection({ type: 'item', itemId: undefined })
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Item
                          </button>
                        </div>
                      </>
                    )
                  })()
                )}

                {/* FRAME INSPECTOR (when editing child level) */}
                {editingLevel === 'child' && selectedFrame && (
                  <>
                    {/* Content Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('content')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Type className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Content
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.content ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.content && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                            <input
                              type="text"
                              value={selectedFrame.title}
                              onChange={(e) => updateFrame(selectedFrame.id, { title: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                            <input
                              type="text"
                              value={selectedFrame.subtitle || ''}
                              onChange={(e) => updateFrame(selectedFrame.id, { subtitle: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                            <input
                              type="text"
                              value={selectedFrame.badge || ''}
                              onChange={(e) => updateFrame(selectedFrame.id, { badge: e.target.value })}
                              placeholder="e.g. ⭐ 5-Star Rated"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Background media</label>
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, type: 'video' } })}
                                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                  selectedFrame.background.type === 'video'
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
                                onClick={() => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, type: 'image' } })}
                                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                                  selectedFrame.background.type === 'image'
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
                              value={selectedFrame.background.src}
                              onChange={(e) => updateFrame(selectedFrame.id, { background: { ...selectedFrame.background, src: e.target.value } })}
                              placeholder="URL or upload..."
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Heart count</label>
                            <input
                              type="number"
                              value={selectedFrame.heartCount}
                              onChange={(e) => updateFrame(selectedFrame.id, { heartCount: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
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
                        onClick={() => toggleSection('cta')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          CTA Button
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.cta ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.cta && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <Toggle
                            enabled={!!selectedFrame.cta}
                            onChange={(enabled) => {
                              if (enabled) {
                                updateFrame(selectedFrame.id, { cta: { text: 'Book Now', icon: 'book', action: '' } })
                              } else {
                                updateFrame(selectedFrame.id, { cta: undefined })
                              }
                            }}
                            label="Enable CTA button"
                          />
                          {selectedFrame.cta && (
                            <>
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button text</label>
                                <input
                                  type="text"
                                  value={selectedFrame.cta.text}
                                  onChange={(e) => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, text: e.target.value } })}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Icon</label>
                                <div className="grid grid-cols-5 gap-2">
                                  {CTA_ICONS.map(({ value, label, Icon }) => (
                                    <button
                                      key={value}
                                      onClick={() => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, icon: value } })}
                                      className={`py-2.5 rounded-lg border text-center transition-all ${
                                        selectedFrame.cta?.icon === value
                                          ? 'border-blue-500 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-500/15 ring-1 ring-blue-500/20'
                                          : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                                      }`}
                                      title={label}
                                    >
                                      <Icon className={`w-4 h-4 mx-auto ${selectedFrame.cta?.icon === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-white/70'}`} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Action</label>
                                <select
                                  value={selectedFrame.cta.action?.startsWith('http') ? 'url' : selectedFrame.cta.action || 'url'}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    if (val === 'url') {
                                      updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: '' } })
                                    } else {
                                      updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: val } })
                                    }
                                  }}
                                  className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                >
                                  <option value="url">External URL</option>
                                  <option value="info">Open Info Sheet</option>
                                  <option value="faq">Open FAQ Sheet</option>
                                  <option value="reviews">Go to Reviews</option>
                                  <option value="list">Open List View</option>
                                </select>
                                {(selectedFrame.cta.action === '' || selectedFrame.cta.action?.startsWith('http')) && (
                                  <input
                                    type="url"
                                    value={selectedFrame.cta.action || ''}
                                    onChange={(e) => updateFrame(selectedFrame.id, { cta: { ...selectedFrame.cta!, action: e.target.value } })}
                                    placeholder="https://..."
                                    className="w-full mt-2 px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                  />
                                )}
                                {/* Connect to List - shown when action is 'list' */}
                                {selectedFrame.cta.action === 'list' && (
                                  <div className="mt-3">
                                    <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Connect to List</label>
                                    {lists.length === 0 ? (
                                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-white/15 text-center">
                                        <p className="text-[12px] text-gray-500 dark:text-white/40 mb-2">No lists created yet</p>
                                        <button
                                          onClick={() => {
                                            addNewList()
                                            // Switch back to home level to edit the new list
                                            setEditingLevel('home')
                                          }}
                                          className="text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline"
                                        >
                                          + Create a list first
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <select
                                          value={selectedFrame.cta.listId || ''}
                                          onChange={(e) => {
                                            updateFrame(selectedFrame.id, {
                                              cta: { ...selectedFrame.cta!, listId: e.target.value || undefined }
                                            })
                                          }}
                                          className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                                        >
                                          <option value="">Select a list...</option>
                                          {lists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                              {list.name} ({list.items.length} items)
                                            </option>
                                          ))}
                                        </select>
                                        {selectedFrame.cta.listId && (
                                          <button
                                            onClick={() => {
                                              setSelection({ type: 'list', listId: selectedFrame.cta!.listId })
                                              setEditingLevel('home')
                                            }}
                                            className="mt-2 text-[12px] font-medium text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            Edit list items
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                                {/* DEPRECATED: Old inline list items - keeping for backward compat */}
                                {selectedFrame.cta.action === 'list' && selectedFrame.listItems && selectedFrame.listItems.length > 0 && !selectedFrame.cta.listId && (
                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                    <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg text-[11px] text-yellow-700 dark:text-yellow-400 mb-3">
                                      ⚠️ Legacy inline items detected. Create a list and connect it above to migrate.
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                      <label className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <List className="w-4 h-4 text-gray-500 dark:text-white/50" />
                                        Inline Items ({selectedFrame.listItems?.length || 0})
                                      </label>
                                    </div>
                                    <div className="space-y-2">
                                      {selectedFrame.listItems.map((item, index) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5"
                                        >
                                          <GripVertical className="w-4 h-4 text-gray-300 dark:text-white/20 cursor-grab flex-shrink-0" />
                                          {/* Thumbnail */}
                                          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/10 flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-white/30">
                                                <ImageIcon className="w-4 h-4" />
                                              </div>
                                            )}
                                          </div>
                                          {/* Title & Price */}
                                          <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{item.title}</div>
                                            <div className="text-[11px] text-blue-600 dark:text-cyan-400">{item.price || ''}</div>
                                          </div>
                                          {/* Delete */}
                                          <button
                                            onClick={() => {
                                              const updatedItems = (selectedFrame.listItems || []).filter((_, i) => i !== index)
                                              updateFrame(selectedFrame.id, { listItems: updatedItems })
                                            }}
                                            className="p-1 text-gray-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('info')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Info className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Info Sheet
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.info ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.info && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <p className="text-[12px] text-gray-500 dark:text-white/50">
                            Content shown when users tap the ⓘ Info button on this frame.
                          </p>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Headline</label>
                            <input
                              type="text"
                              value={selectedFrame.infoContent?.headline || ''}
                              onChange={(e) => updateFrame(selectedFrame.id, {
                                infoContent: { ...selectedFrame.infoContent, headline: e.target.value } as FrameInfoContent
                              })}
                              placeholder="e.g. The Full Experience"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Description</label>
                            <textarea
                              value={selectedFrame.infoContent?.description || ''}
                              onChange={(e) => updateFrame(selectedFrame.id, {
                                infoContent: { ...selectedFrame.infoContent, headline: selectedFrame.infoContent?.headline || '', description: e.target.value }
                              })}
                              rows={3}
                              placeholder="Detailed description for this frame..."
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">List Items (one per line)</label>
                            <textarea
                              value={selectedFrame.infoContent?.items?.join('\n') || ''}
                              onChange={(e) => updateFrame(selectedFrame.id, {
                                infoContent: {
                                  ...selectedFrame.infoContent,
                                  headline: selectedFrame.infoContent?.headline || '',
                                  items: e.target.value.split('\n').filter(Boolean)
                                }
                              })}
                              rows={4}
                              placeholder="Rooftop tent&#10;Kitchen setup&#10;Bedding&#10;Chairs & table"
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm resize-none font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Style Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('style')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Palette className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Style
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.style ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.style && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Accent Color</label>
                            <div className="grid grid-cols-6 gap-2">
                              {['#2563EB', '#06B6D4', '#0F172A', '#059669', '#475569', '#1D4ED8'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => updateFrame(selectedFrame.id, { accentColor: color })}
                                  className={`w-full aspect-square rounded-lg ${
                                    selectedFrame.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-[#2c2c2e]' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                            <button
                              onClick={() => deleteFrame(selectedFrame.id)}
                              disabled={currentFrames.length <= 1}
                              className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Delete This Frame
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ITEM FRAME INSPECTOR (when editing item level) */}
                {editingLevel === 'item' && selectedItemFrame && (
                  <>
                    {/* Content Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('content')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Type className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Content
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.content ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.content && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                            <input
                              type="text"
                              value={selectedItemFrame.title}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { title: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                            <input
                              type="text"
                              value={selectedItemFrame.subtitle || ''}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { subtitle: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                            <input
                              type="text"
                              value={selectedItemFrame.badge || ''}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { badge: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="e.g. Best Seller"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Background Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('background')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Background
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.background ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.background && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Type</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => updateItemFrame(selectedItemFrame.id, { background: { type: 'image', src: selectedItemFrame.background?.src || '' } })}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                  selectedItemFrame.background?.type === 'image'
                                    ? 'bg-blue-600 dark:bg-cyan-500 text-white'
                                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/15'
                                }`}
                              >
                                Image
                              </button>
                              <button
                                onClick={() => updateItemFrame(selectedItemFrame.id, { background: { type: 'video', src: selectedItemFrame.background?.src || '' } })}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                                  selectedItemFrame.background?.type === 'video'
                                    ? 'bg-blue-600 dark:bg-cyan-500 text-white'
                                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/15'
                                }`}
                              >
                                Video
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">
                              {selectedItemFrame.background?.type === 'video' ? 'Video URL' : 'Image URL'}
                            </label>
                            <input
                              type="text"
                              value={selectedItemFrame.background?.src || ''}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { background: { type: selectedItemFrame.background?.type || 'image', src: e.target.value } })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('cta')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Call to Action
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.cta ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.cta && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Button Text</label>
                            <input
                              type="text"
                              value={selectedItemFrame.cta?.text || ''}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { cta: { text: e.target.value, icon: selectedItemFrame.cta?.icon || 'arrow', action: selectedItemFrame.cta?.action } })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="Book Now"
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Icon</label>
                            <select
                              value={selectedItemFrame.cta?.icon || 'arrow'}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { cta: { text: selectedItemFrame.cta?.text || 'Action', icon: e.target.value as CTAIconType, action: selectedItemFrame.cta?.action } })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                            >
                              <option value="arrow">Arrow</option>
                              <option value="book">Book</option>
                              <option value="call">Call</option>
                              <option value="view">View</option>
                              <option value="menu">Menu</option>
                              <option value="list">List</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Action URL</label>
                            <input
                              type="text"
                              value={selectedItemFrame.cta?.action || ''}
                              onChange={(e) => updateItemFrame(selectedItemFrame.id, { cta: { text: selectedItemFrame.cta?.text || 'Action', icon: selectedItemFrame.cta?.icon || 'arrow', action: e.target.value } })}
                              className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-lg text-gray-900 dark:text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20 transition-shadow text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Style Section */}
                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => toggleSection('style')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="text-[13px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Palette className="w-4 h-4 text-gray-500 dark:text-white/50" />
                          Style
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${expandedSections.style ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedSections.style && (
                        <div className="p-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                          <div>
                            <label className="block text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5">Accent Color</label>
                            <div className="grid grid-cols-6 gap-2">
                              {['#2563EB', '#06B6D4', '#0F172A', '#059669', '#475569', '#1D4ED8'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => updateItemFrame(selectedItemFrame.id, { accentColor: color })}
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
                              onClick={() => deleteItemFrame(selectedItemFrame.id)}
                              disabled={currentItemFrames.length <= 1}
                              className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Delete This Frame
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
