'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, List, Trash2, Package, ChevronDown, ChevronRight, Pencil, GripVertical, MoreHorizontal, X } from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useLists } from '@/hooks/useLists'

/**
 * Lists HQ — Clean Card-Based List Management
 *
 * Lists are reusable collections of items (products, services, vehicles, etc.)
 * that can be attached to any Category Slyde.
 *
 * Pattern: Header with helper text → Stats → Expandable cards
 */

export default function ListsPage() {
  const {
    lists,
    addList, updateList, deleteList,
    addItem, updateItem, deleteItem,
  } = useLists()

  // Which list is expanded for editing
  const [expandedListId, setExpandedListId] = useState<string | null>(null)

  // Helper text dismissal (persisted to localStorage)
  const [showHelper, setShowHelper] = useState(true)
  useEffect(() => {
    const dismissed = localStorage.getItem('slydes_lists_helper_dismissed')
    if (dismissed === 'true') setShowHelper(false)
  }, [])
  const dismissHelper = () => {
    setShowHelper(false)
    localStorage.setItem('slydes_lists_helper_dismissed', 'true')
  }

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  // Computed stats
  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)

  // Toggle list expansion
  const toggleList = (listId: string) => {
    setExpandedListId(prev => prev === listId ? null : listId)
  }

  // Inline editing functions
  const startEditing = (id: string, currentValue: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingId(id)
    setEditingValue(currentValue)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingValue('')
  }

  const commitListRename = (listId: string) => {
    if (editingValue.trim()) {
      updateList(listId, { name: editingValue.trim() })
    }
    cancelEditing()
  }

  const commitItemRename = (listId: string, itemId: string) => {
    if (editingValue.trim()) {
      updateItem(listId, itemId, { title: editingValue.trim() })
    }
    cancelEditing()
  }

  // Add functions
  const handleAddList = () => {
    const newId = addList({ name: 'New List', items: [] })
    setExpandedListId(newId)
    startEditing(newId, 'New List')
  }

  const handleAddItem = (listId: string) => {
    const newId = addItem(listId, { title: 'New Item' })
    startEditing(newId, 'New Item')
  }

  // Delete functions
  const handleDeleteList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteList(listId)
    if (expandedListId === listId) {
      setExpandedListId(null)
    }
  }

  const handleDeleteItem = (listId: string, itemId: string) => {
    deleteItem(listId, itemId)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="lists" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Top Bar */}
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/80">
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">Lists</h1>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {lists.length} {lists.length === 1 ? 'list' : 'lists'} • {totalItems} items total
              </p>
            </div>
            <button
              onClick={handleAddList}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
            >
              <Plus className="w-5 h-5" />
              Create List
            </button>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl">

              {/* Helper Text - Connection to Studio */}
              {showHelper && (
                <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20 relative">
                  <button
                    onClick={dismissHelper}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 dark:hover:bg-white/10 dark:hover:text-white/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-4 pr-8">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                      <List className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white mb-1">What are Lists?</h2>
                      <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
                        Lists are reusable collections of items like products, services, vehicles, or properties that you can attach to any Category Slyde.
                        Create your inventory once, then connect it to your Slydes in <span className="font-medium text-blue-600 dark:text-cyan-400">Studio</span>.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-white/50">
                        Lists are for showcasing, not selling. You can link items to your own website. For in-app purchases and checkout, enable <span className="font-medium text-blue-600 dark:text-cyan-400">Commerce</span> in Settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Row */}
              {lists.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Total Lists</div>
                    <div className="text-2xl font-mono font-bold">{lists.length}</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Total Items</div>
                    <div className="text-2xl font-mono font-bold">{totalItems}</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10">
                    <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">Avg Items/List</div>
                    <div className="text-2xl font-mono font-bold">
                      {lists.length > 0 ? Math.round(totalItems / lists.length) : 0}
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {lists.length === 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#2c2c2e] dark:border-white/10 mb-6">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-white/10">
                      <List className="w-8 h-8 text-blue-500 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">No lists yet</h3>
                    <p className="text-sm text-gray-500 dark:text-white/60 mb-6 max-w-sm mx-auto">
                      Create your first list to start organizing your products, services, or inventory.
                    </p>
                    <button
                      onClick={handleAddList}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/15"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First List
                    </button>
                  </div>
                </div>
              )}

              {/* List Cards */}
              <div className="space-y-4">
                {lists.map((list) => {
                  const isExpanded = expandedListId === list.id
                  const isEditingList = editingId === list.id

                  return (
                    <div
                      key={list.id}
                      className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden dark:bg-[#2c2c2e] dark:border-white/10 transition-all"
                    >
                      {/* List Header */}
                      <div
                        onClick={() => toggleList(list.id)}
                        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        {/* Expand/Collapse Icon */}
                        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-white/40" />
                        </div>

                        {/* List Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-blue-500/20">
                          <List className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                        </div>

                        {/* List Name */}
                        <div className="flex-1">
                          {isEditingList ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitListRename(list.id)
                                if (e.key === 'Escape') cancelEditing()
                              }}
                              onBlur={() => commitListRename(list.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-1.5 text-lg font-semibold bg-gray-50 dark:bg-white/5 border border-blue-500 rounded-lg text-gray-900 dark:text-white focus:outline-none"
                            />
                          ) : (
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{list.name}</h3>
                          )}
                          <p className="text-sm text-gray-500 dark:text-white/60">
                            {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => startEditing(list.id, list.name, e)}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteList(list.id, e)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content - Items */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                          <div className="p-5 space-y-3">
                            {list.items.length === 0 ? (
                              <div className="text-center py-6">
                                <Package className="w-8 h-8 text-gray-300 dark:text-white/20 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-white/50">No items in this list yet</p>
                              </div>
                            ) : (
                              list.items.map((item) => {
                                const isEditingItem = editingId === item.id

                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 dark:bg-[#2c2c2e] dark:border-white/10"
                                  >
                                    {/* Item Image or Icon */}
                                    {item.image ? (
                                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                    ) : (
                                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                        <Package className="w-5 h-5 text-gray-400 dark:text-white/40" />
                                      </div>
                                    )}

                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                      {isEditingItem ? (
                                        <input
                                          ref={editInputRef}
                                          type="text"
                                          value={editingValue}
                                          onChange={(e) => setEditingValue(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') commitItemRename(list.id, item.id)
                                            if (e.key === 'Escape') cancelEditing()
                                          }}
                                          onBlur={() => commitItemRename(list.id, item.id)}
                                          className="w-full px-2 py-1 text-sm font-medium bg-gray-50 dark:bg-white/5 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                        />
                                      ) : (
                                        <>
                                          <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                                          {item.subtitle && (
                                            <p className="text-sm text-gray-500 dark:text-white/60 truncate">{item.subtitle}</p>
                                          )}
                                        </>
                                      )}
                                    </div>

                                    {/* Price */}
                                    {item.price && (
                                      <span className="text-sm font-semibold text-blue-600 dark:text-cyan-400 shrink-0">
                                        {item.price}
                                      </span>
                                    )}

                                    {/* Item Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => startEditing(item.id, item.title)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(list.id, item.id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })
                            )}

                            {/* Add Item Button */}
                            <button
                              onClick={() => handleAddItem(list.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-medium">Add item</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Add List Button */}
                {lists.length > 0 && (
                  <button
                    onClick={handleAddList}
                    className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group dark:border-white/20 dark:hover:border-white/30"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform dark:from-blue-500/15 dark:to-cyan-500/15 dark:border-white/10">
                        <Plus className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-700 dark:text-white/70 mb-1">Create New List</h3>
                      <p className="text-sm text-gray-500 dark:text-white/50">
                        Add another collection of items
                      </p>
                    </div>
                  </button>
                )}
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
