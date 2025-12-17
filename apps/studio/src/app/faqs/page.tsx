'use client'

import { useState, useMemo } from 'react'
import {
  Plus, HelpCircle, Trash2, ChevronRight, Pencil, Layers,
  Wrench, Car, Tag, Smartphone, Home as HomeIcon, ShoppingBag, Sparkles,
  Tent, Utensils, Coffee, Star, Dumbbell, Camera, Music, Palette, Gift,
  Map, Briefcase, Heart, type LucideIcon, Search, X, Eye, MousePointerClick
} from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import {
  useDemoHomeSlyde,
  writeChildFAQs,
  readChildFAQs,
} from '@/lib/demoHomeSlyde'
import type { FAQItem } from '@/components/slyde-demo/frameData'

// Category icon mapping (matches UnifiedStudioEditor)
const CATEGORY_ICONS: { id: string; Icon: LucideIcon }[] = [
  { id: 'wrench', Icon: Wrench },
  { id: 'car', Icon: Car },
  { id: 'tag', Icon: Tag },
  { id: 'smartphone', Icon: Smartphone },
  { id: 'home', Icon: HomeIcon },
  { id: 'shopping-bag', Icon: ShoppingBag },
  { id: 'sparkles', Icon: Sparkles },
  { id: 'tent', Icon: Tent },
  { id: 'utensils', Icon: Utensils },
  { id: 'coffee', Icon: Coffee },
  { id: 'star', Icon: Star },
  { id: 'dumbbell', Icon: Dumbbell },
  { id: 'camera', Icon: Camera },
  { id: 'music', Icon: Music },
  { id: 'palette', Icon: Palette },
  { id: 'gift', Icon: Gift },
  { id: 'map', Icon: Map },
  { id: 'briefcase', Icon: Briefcase },
  { id: 'heart', Icon: Heart },
]

function getCategoryIcon(iconId: string): LucideIcon {
  return CATEGORY_ICONS.find((i) => i.id === iconId)?.Icon || Sparkles
}

/**
 * FAQs HQ — Simple FAQ Management
 *
 * Single page with all sections visible:
 * - Helper text
 * - Stats row (Total FAQs, Categories, Unpublished)
 * - FAQ Library by category
 */
export default function FAQsPage() {
  const { data } = useDemoHomeSlyde()
  const categories = data.categories ?? []
  const childFAQs = data.childFAQs ?? {}

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  // Expansion state for categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Editing state
  const [editingFAQId, setEditingFAQId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState('')
  const [editingAnswer, setEditingAnswer] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  // Helper text dismissed state
  const [helperDismissed, setHelperDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('slydes_faqs_helper_dismissed') === 'true'
  })

  const dismissHelper = () => {
    setHelperDismissed(true)
    localStorage.setItem('slydes_faqs_helper_dismissed', 'true')
  }

  // Count total FAQs and unpublished
  const totalFAQs = Object.values(childFAQs).reduce((acc, faqs) => acc + faqs.length, 0)
  const unpublishedFAQs = Object.values(childFAQs).reduce((acc, faqs) => acc + faqs.filter(f => f.published === false).length, 0)

  // Filtered FAQs for search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories.map(cat => ({
        ...cat,
        faqs: childFAQs[cat.id] ?? [],
      }))
    }

    const query = searchQuery.toLowerCase()
    return categories.map(cat => ({
      ...cat,
      faqs: (childFAQs[cat.id] ?? []).filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      ),
    })).filter(cat => cat.faqs.length > 0 || cat.name.toLowerCase().includes(query))
  }, [categories, childFAQs, searchQuery])

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // Start editing FAQ
  const startEditing = (categoryId: string, faq: FAQItem) => {
    setEditingCategoryId(categoryId)
    setEditingFAQId(faq.id)
    setEditingQuestion(faq.question)
    setEditingAnswer(faq.answer)
  }

  // Save FAQ edit
  const saveEdit = () => {
    if (!editingCategoryId || !editingFAQId) return

    const currentFaqs = readChildFAQs(editingCategoryId)
    const updated = currentFaqs.map(f =>
      f.id === editingFAQId
        ? { ...f, question: editingQuestion, answer: editingAnswer, updatedAt: new Date().toISOString() }
        : f
    )
    writeChildFAQs(editingCategoryId, updated)

    setEditingCategoryId(null)
    setEditingFAQId(null)
    setEditingQuestion('')
    setEditingAnswer('')
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingCategoryId(null)
    setEditingFAQId(null)
    setEditingQuestion('')
    setEditingAnswer('')
  }

  // Delete FAQ
  const deleteFAQ = (categoryId: string, faqId: string) => {
    const currentFaqs = readChildFAQs(categoryId)
    writeChildFAQs(categoryId, currentFaqs.filter(f => f.id !== faqId))
    if (editingFAQId === faqId) cancelEdit()
  }

  // Quick add FAQ
  const quickAddFAQ = (categoryId: string) => {
    const currentFaqs = readChildFAQs(categoryId)
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      createdAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
      published: true,
    }
    writeChildFAQs(categoryId, [...currentFaqs, newFaq])
    setEditingCategoryId(categoryId)
    setEditingFAQId(newFaq.id)
    setEditingQuestion('')
    setEditingAnswer('')
    setExpandedCategories(prev => new Set(prev).add(categoryId))
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="faqs" />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">FAQs</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {totalFAQs} {totalFAQs === 1 ? 'question' : 'questions'}
              </p>
            </div>
            {categories.length > 0 && (
              <button
                onClick={() => quickAddFAQ(categories[0].id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
              >
                <Plus className="w-5 h-5" />
                Add FAQ
              </button>
            )}
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl">

              {/* Helper Text */}
              {!helperDismissed && (
                <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                      <HelpCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Frequently Asked Questions</h2>
                      <p className="text-sm text-gray-600 dark:text-white/70">
                        FAQs appear in the info sheet when customers view your Slydes. Answer common questions to reduce inquiries and build trust.
                      </p>
                    </div>
                    <button
                      onClick={dismissHelper}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Row - Always visible */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Total FAQs</div>
                  <div className="text-2xl font-mono font-bold">{totalFAQs}</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Categories</div>
                  <div className="text-2xl font-mono font-bold">{categories.length}</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Unpublished</div>
                  <div className="text-2xl font-mono font-bold">{unpublishedFAQs}</div>
                </div>
              </div>

              {/* Search Bar */}
              {totalFAQs > 0 && (
                <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {/* Empty State */}
              {categories.length === 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10 mb-6">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-white/10">
                      <Layers className="w-8 h-8 text-blue-500 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">No Slydes yet</h3>
                    <p className="text-sm text-gray-500 dark:text-white/60 mb-6 max-w-sm mx-auto">
                      Create a Slyde in the Studio first, then come back to add FAQs.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                    >
                      Go to Studio
                    </a>
                  </div>
                </div>
              )}

              {/* Category Cards */}
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategories.has(category.id)
                  const faqCount = category.faqs.length

                  return (
                    <div
                      key={category.id}
                      className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10 transition-all"
                    >
                      {/* Category Header */}
                      <div
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-white/40" />
                        </div>
                        {(() => {
                          const Icon = getCategoryIcon(category.icon)
                          return (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-blue-500/20">
                              <Icon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                            </div>
                          )
                        })()}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-white/60">
                            {faqCount} {faqCount === 1 ? 'FAQ' : 'FAQs'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            quickAddFAQ(category.id)
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* FAQs List */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                          <div className="p-5 space-y-3">
                            {category.faqs.length === 0 ? (
                              <div className="text-center py-6">
                                <HelpCircle className="w-8 h-8 text-gray-300 dark:text-white/20 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-white/50 mb-4">No FAQs for this Slyde yet</p>
                                <button
                                  onClick={() => quickAddFAQ(category.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add first FAQ
                                </button>
                              </div>
                            ) : (
                              category.faqs.map((faq) => {
                                const isEditing = editingFAQId === faq.id && editingCategoryId === category.id

                                return (
                                  <div
                                    key={faq.id}
                                    className="rounded-xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10 overflow-hidden"
                                  >
                                    {isEditing ? (
                                      <div className="p-4 space-y-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">Question</label>
                                          <input
                                            type="text"
                                            value={editingQuestion}
                                            onChange={(e) => setEditingQuestion(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            placeholder="What's your question?"
                                            autoFocus
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">Answer</label>
                                          <textarea
                                            value={editingAnswer}
                                            onChange={(e) => setEditingAnswer(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/15 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                            placeholder="Provide a helpful answer..."
                                          />
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                          <button
                                            onClick={() => deleteFAQ(category.id, faq.id)}
                                            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                          >
                                            Delete
                                          </button>
                                          <div className="flex gap-2">
                                            <button
                                              onClick={cancelEdit}
                                              className="px-3 py-1.5 text-sm text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={saveEdit}
                                              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() => startEditing(category.id, faq)}
                                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                      >
                                        <div className="flex items-start gap-3">
                                          <HelpCircle className="w-5 h-5 text-blue-500 dark:text-cyan-400 mt-0.5 shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                              {faq.question || <span className="text-gray-400 italic">No question</span>}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-white/50 mt-1 line-clamp-2">
                                              {faq.answer || <span className="italic">No answer yet</span>}
                                            </p>
                                            {/* Stats badges */}
                                            {((faq.views ?? 0) > 0 || (faq.clicks ?? 0) > 0) && (
                                              <div className="flex items-center gap-3 mt-2">
                                                {(faq.views ?? 0) > 0 && (
                                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Eye className="w-3 h-3" /> {faq.views}
                                                  </span>
                                                )}
                                                {(faq.clicks ?? 0) > 0 && (
                                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <MousePointerClick className="w-3 h-3" /> {faq.clicks}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                startEditing(category.id, faq)
                                              }}
                                              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                deleteFAQ(category.id, faq.id)
                                              }}
                                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            )}

                            {/* Add FAQ Button */}
                            {category.faqs.length > 0 && (
                              <button
                                onClick={() => quickAddFAQ(category.id)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Add FAQ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}
