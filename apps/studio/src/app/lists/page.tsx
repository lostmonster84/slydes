'use client'

import { useState, useRef } from 'react'
import { Plus, List, Trash2, Package, GripVertical, ChevronRight, Layers, Smartphone, Pencil, Check, X } from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useLists } from '@/hooks/useLists'
import { DevicePreview } from '@/components/slyde-demo/DevicePreview'
import type { FrameData } from '@/components/slyde-demo/frameData'

/**
 * Lists HQ — Lists Management (Collapsible Tree Navigator)
 *
 * ONE screen with collapsible hierarchy:
 * ▼ List (click chevron to expand)
 *     ▼ Item (click chevron to see frames)
 *         Frame 1
 *         Frame 2
 *         + Add frame
 *     + Add item
 * + Add list
 *
 * Click any row → Inspector on right edits THAT thing.
 */

// =============================================
// TYPES
// =============================================
type SelectionType = 'list' | 'item' | 'frame' | null

interface Selection {
  type: SelectionType
  listId: string | null
  itemId: string | null
  frameId: string | null
}

export default function ListsPage() {
  const {
    lists,
    addList, updateList, deleteList, reorderLists,
    addItem, updateItem, deleteItem, reorderItems,
    addItemFrame, updateItemFrame, deleteItemFrame, reorderItemFrames
  } = useLists()

  // =============================================
  // EXPANSION STATE (which lists/items are expanded)
  // =============================================
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // =============================================
  // SELECTION STATE (what's currently selected for editing)
  // =============================================
  const [selection, setSelection] = useState<Selection>({
    type: null,
    listId: null,
    itemId: null,
    frameId: null,
  })

  // =============================================
  // INLINE EDITING STATE
  // =============================================
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  // =============================================
  // TOGGLE FUNCTIONS
  // =============================================
  const toggleList = (listId: string) => {
    setExpandedLists(prev => {
      const next = new Set(prev)
      if (next.has(listId)) {
        next.delete(listId)
      } else {
        next.add(listId)
      }
      return next
    })
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  // =============================================
  // SELECTION FUNCTIONS
  // =============================================
  const selectList = (listId: string) => {
    setSelection({ type: 'list', listId, itemId: null, frameId: null })
  }

  const selectItem = (listId: string, itemId: string) => {
    setSelection({ type: 'item', listId, itemId, frameId: null })
  }

  const selectFrame = (listId: string, itemId: string, frameId: string) => {
    setSelection({ type: 'frame', listId, itemId, frameId })
  }

  // =============================================
  // INLINE EDITING FUNCTIONS
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

  const commitFrameRename = (listId: string, itemId: string, frameId: string) => {
    if (editingValue.trim()) {
      updateItemFrame(listId, itemId, frameId, { title: editingValue.trim() })
    }
    cancelEditing()
  }

  // =============================================
  // ADD FUNCTIONS
  // =============================================
  const handleAddList = () => {
    const newId = addList({ name: 'New List', items: [] })
    setSelection({ type: 'list', listId: newId, itemId: null, frameId: null })
    setExpandedLists(prev => new Set(prev).add(newId))
    startEditing(newId, 'New List')
  }

  const handleAddItem = (listId: string) => {
    const newId = addItem(listId, { title: 'New Item' })
    setSelection({ type: 'item', listId, itemId: newId, frameId: null })
    setExpandedItems(prev => new Set(prev).add(newId))
    startEditing(newId, 'New Item')
  }

  const handleAddFrame = (listId: string, itemId: string) => {
    const newId = addItemFrame(listId, itemId, {
      templateType: 'custom',
      title: 'New Frame',
    })
    setSelection({ type: 'frame', listId, itemId, frameId: newId })
    startEditing(newId, 'New Frame')
  }

  // =============================================
  // DELETE FUNCTIONS
  // =============================================
  const handleDeleteList = (listId: string) => {
    deleteList(listId)
    if (selection.listId === listId) {
      setSelection({ type: null, listId: null, itemId: null, frameId: null })
    }
  }

  const handleDeleteItem = (listId: string, itemId: string) => {
    deleteItem(listId, itemId)
    if (selection.itemId === itemId) {
      setSelection({ type: 'list', listId, itemId: null, frameId: null })
    }
  }

  const handleDeleteFrame = (listId: string, itemId: string, frameId: string) => {
    const item = lists.find(l => l.id === listId)?.items.find(i => i.id === itemId)
    if (item && (item.frames?.length ?? 0) <= 1) return // Can't delete last frame

    deleteItemFrame(listId, itemId, frameId)
    if (selection.frameId === frameId) {
      setSelection({ type: 'item', listId, itemId, frameId: null })
    }
  }

  // =============================================
  // DERIVED STATE FOR INSPECTOR
  // =============================================
  const selectedList = selection.listId ? lists.find(l => l.id === selection.listId) : null
  const selectedItem = selectedList && selection.itemId
    ? selectedList.items.find(i => i.id === selection.itemId)
    : null
  const selectedFrame = selectedItem && selection.frameId
    ? selectedItem.frames?.find(f => f.id === selection.frameId)
    : null

  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="lists" />

        {/* ==================== MAIN CONTENT ==================== */}
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

          {/* 3-Column Layout - CONSTX Pattern */}
          <div className="flex-1 flex overflow-hidden">

            {/* NAVIGATOR (Left Panel) - Collapsible Tree */}
            <div className="w-72 border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#1c1c1e]/80 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                    Lists ({lists.length})
                  </span>
                </div>

                <div className="space-y-0.5">
                  {lists.map((list) => {
                    const isListSelected = selection.type === 'list' && selection.listId === list.id
                    const isListExpanded = expandedLists.has(list.id)
                    const isEditingList = editingId === list.id

                    return (
                      <div key={list.id}>
                        {/* LIST ROW */}
                        <div
                          onClick={() => selectList(list.id)}
                          className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isListSelected
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                              : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                          }`}
                        >
                          {/* Chevron */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleList(list.id)
                            }}
                            className={`p-0.5 rounded transition-transform ${isListExpanded ? 'rotate-90' : ''}`}
                          >
                            <ChevronRight className={`w-4 h-4 ${isListSelected ? 'text-white/70' : 'text-gray-400 dark:text-white/40'}`} />
                          </button>

                          <List className={`w-4 h-4 shrink-0 ${isListSelected ? 'text-white' : 'text-gray-400 dark:text-white/40'}`} />

                          {/* Name (inline editable) */}
                          {isEditingList ? (
                            <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
                                className="flex-1 px-1.5 py-0.5 text-[13px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                              />
                            </div>
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
                              <span className={`text-[11px] ${isListSelected ? 'text-white/70' : 'text-gray-400 dark:text-white/40'}`}>
                                {list.items.length}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditing(list.id, list.name)
                                }}
                                className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                  isListSelected
                                    ? 'text-white/70 hover:text-white hover:bg-white/20'
                                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                }`}
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteList(list.id)
                                }}
                                className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
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

                        {/* ITEMS (nested, shown when list expanded) */}
                        {isListExpanded && (
                          <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                            {list.items.map((item) => {
                              const isItemSelected = selection.type === 'item' && selection.itemId === item.id
                              const isItemExpanded = expandedItems.has(item.id)
                              const isEditingItem = editingId === item.id
                              const frameCount = item.frames?.length ?? 0

                              return (
                                <div key={item.id}>
                                  {/* ITEM ROW */}
                                  <div
                                    onClick={() => selectItem(list.id, item.id)}
                                    className={`group w-full flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                      isItemSelected
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                    }`}
                                  >
                                    {/* Chevron (only if has frames) */}
                                    {frameCount > 0 ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleItem(item.id)
                                        }}
                                        className={`p-0.5 rounded transition-transform ${isItemExpanded ? 'rotate-90' : ''}`}
                                      >
                                        <ChevronRight className={`w-4 h-4 ${isItemSelected ? 'text-white/70' : 'text-gray-400 dark:text-white/40'}`} />
                                      </button>
                                    ) : (
                                      <div className="w-5" /> // Spacer
                                    )}

                                    {item.image ? (
                                      <img src={item.image} alt="" className="w-6 h-6 rounded-lg object-cover shrink-0" />
                                    ) : (
                                      <Package className={`w-4 h-4 shrink-0 ${isItemSelected ? 'text-white' : 'text-gray-400 dark:text-white/40'}`} />
                                    )}

                                    {/* Name (inline editable) */}
                                    {isEditingItem ? (
                                      <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
                                          className="flex-1 px-1.5 py-0.5 text-[13px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <span
                                          className="text-[13px] font-medium truncate flex-1"
                                          onDoubleClick={(e) => {
                                            e.stopPropagation()
                                            startEditing(item.id, item.title)
                                          }}
                                        >
                                          {item.title}
                                        </span>
                                        {frameCount > 0 && (
                                          <span className={`text-[10px] ${isItemSelected ? 'text-white/70' : 'text-gray-400 dark:text-white/40'}`}>
                                            {frameCount}f
                                          </span>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            startEditing(item.id, item.title)
                                          }}
                                          className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                            isItemSelected
                                              ? 'text-white/70 hover:text-white hover:bg-white/20'
                                              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                          }`}
                                        >
                                          <Pencil className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteItem(list.id, item.id)
                                          }}
                                          className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                            isItemSelected
                                              ? 'text-white/70 hover:text-white hover:bg-white/20'
                                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                                          }`}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </>
                                    )}
                                  </div>

                                  {/* FRAMES (nested, shown when item expanded) */}
                                  {isItemExpanded && frameCount > 0 && (
                                    <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5 space-y-0.5">
                                      {item.frames?.map((frame, idx) => {
                                        const isFrameSelected = selection.type === 'frame' && selection.frameId === frame.id
                                        const isEditingFrame = editingId === frame.id

                                        return (
                                          <div
                                            key={frame.id}
                                            onClick={() => selectFrame(list.id, item.id, frame.id)}
                                            className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                                              isFrameSelected
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                            }`}
                                          >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                              isFrameSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/50'
                                            }`}>
                                              {idx + 1}
                                            </div>

                                            {/* Name (inline editable) */}
                                            {isEditingFrame ? (
                                              <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                  ref={editInputRef}
                                                  type="text"
                                                  value={editingValue}
                                                  onChange={(e) => setEditingValue(e.target.value)}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') commitFrameRename(list.id, item.id, frame.id)
                                                    if (e.key === 'Escape') cancelEditing()
                                                  }}
                                                  onBlur={() => commitFrameRename(list.id, item.id, frame.id)}
                                                  className="flex-1 px-1.5 py-0.5 text-[12px] bg-white dark:bg-gray-800 border border-blue-500 rounded text-gray-900 dark:text-white focus:outline-none"
                                                />
                                              </div>
                                            ) : (
                                              <>
                                                <span
                                                  className="text-[12px] font-medium truncate flex-1"
                                                  onDoubleClick={(e) => {
                                                    e.stopPropagation()
                                                    startEditing(frame.id, frame.title || `Frame ${idx + 1}`)
                                                  }}
                                                >
                                                  {frame.title || `Frame ${idx + 1}`}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    startEditing(frame.id, frame.title || `Frame ${idx + 1}`)
                                                  }}
                                                  className={`p-0.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                                                    isFrameSelected
                                                      ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                                                  }`}
                                                >
                                                  <Pencil className="w-2.5 h-2.5" />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteFrame(list.id, item.id, frame.id)
                                                  }}
                                                  disabled={frameCount <= 1}
                                                  className={`p-0.5 rounded-lg transition-all ${
                                                    frameCount <= 1
                                                      ? 'opacity-20 cursor-not-allowed'
                                                      : `opacity-0 group-hover:opacity-100 ${
                                                          isFrameSelected
                                                            ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
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

                                      {/* Add Frame button */}
                                      <button
                                        onClick={() => handleAddFrame(list.id, item.id)}
                                        className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span className="text-[11px] font-medium">Add frame</span>
                                      </button>
                                    </div>
                                  )}

                                  {/* Add Frame button when item has 0 frames but is expanded */}
                                  {isItemExpanded && frameCount === 0 && (
                                    <div className="ml-4 pl-2 border-l border-gray-200 dark:border-white/10 mt-0.5">
                                      <button
                                        onClick={() => handleAddFrame(list.id, item.id)}
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

                            {/* Add Item button */}
                            <button
                              onClick={() => handleAddItem(list.id)}
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

                  {/* Add List button */}
                  <button
                    onClick={handleAddList}
                    className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[12px] font-medium">Add list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW (Center) - Phone Preview */}
            <div className="flex-1 flex items-center justify-center bg-gray-100/50 dark:bg-[#1c1c1e]/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_50%)]" />
              <div className="relative z-10">
                <DevicePreview>
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                    {selection.type === null && (
                      <div className="text-center p-6">
                        <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-400 text-sm">Select something to preview</p>
                      </div>
                    )}
                    {selection.type === 'list' && selectedList && (
                      <div className="text-center p-6">
                        <List className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                        <p className="text-white font-medium mb-2">{selectedList.name}</p>
                        <p className="text-gray-400 text-sm">{selectedList.items.length} items</p>
                      </div>
                    )}
                    {selection.type === 'item' && selectedItem && (
                      <div className="text-center p-6">
                        {selectedItem.image ? (
                          <img src={selectedItem.image} alt="" className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4" />
                        ) : (
                          <Package className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
                        )}
                        <p className="text-white font-medium mb-1">{selectedItem.title}</p>
                        {selectedItem.subtitle && <p className="text-gray-400 text-sm mb-2">{selectedItem.subtitle}</p>}
                        {selectedItem.price && <p className="text-cyan-400 font-semibold">{selectedItem.price}</p>}
                        <p className="text-gray-500 text-xs mt-3">{selectedItem.frames?.length ?? 0} frames</p>
                      </div>
                    )}
                    {selection.type === 'frame' && selectedFrame && (
                      <div className="text-center p-6">
                        <Layers className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                        <p className="text-white font-medium mb-2">{selectedFrame.title || 'Untitled Frame'}</p>
                        {selectedFrame.subtitle && <p className="text-gray-400 text-sm">{selectedFrame.subtitle}</p>}
                        <p className="text-gray-500 text-xs mt-3 capitalize">{selectedFrame.templateType} template</p>
                      </div>
                    )}
                  </div>
                </DevicePreview>
              </div>
            </div>

            {/* INSPECTOR (Right Panel) - Contextual Editor */}
            <div className="w-80 border-l border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 overflow-y-auto">
              {/* No selection */}
              {selection.type === null && (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <List className="w-12 h-12 text-gray-300 dark:text-white/20 mb-3" />
                  <p className="text-gray-500 dark:text-white/50">Select a list, item, or frame to edit</p>
                </div>
              )}

              {/* LIST Editor */}
              {selection.type === 'list' && selectedList && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">List Details</h3>
                    <button
                      onClick={() => handleDeleteList(selectedList.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">List Name</label>
                      <input
                        type="text"
                        value={selectedList.name}
                        onChange={(e) => updateList(selectedList.id, { name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="e.g. Our Vehicles"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70">Items</label>
                        <span className="text-sm text-gray-500 dark:text-white/50">
                          {selectedList.items.length} items
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleAddItem(selectedList.id)
                          setExpandedLists(prev => new Set(prev).add(selectedList.id))
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ITEM Editor */}
              {selection.type === 'item' && selectedList && selectedItem && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Details</h3>
                    <button
                      onClick={() => handleDeleteItem(selectedList.id, selectedItem.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                      <input
                        type="text"
                        value={selectedItem.title}
                        onChange={(e) => updateItem(selectedList.id, selectedItem.id, { title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="e.g. BMW M3 Competition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                      <input
                        type="text"
                        value={selectedItem.subtitle || ''}
                        onChange={(e) => updateItem(selectedList.id, selectedItem.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="e.g. 2023 Model • 12,000 miles"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Price</label>
                        <input
                          type="text"
                          value={selectedItem.price || ''}
                          onChange={(e) => updateItem(selectedList.id, selectedItem.id, { price: e.target.value })}
                          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                          placeholder="£45,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Badge</label>
                        <input
                          type="text"
                          value={selectedItem.badge || ''}
                          onChange={(e) => updateItem(selectedList.id, selectedItem.id, { badge: e.target.value })}
                          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                          placeholder="Best Seller"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Image URL</label>
                      <input
                        type="text"
                        value={selectedItem.image || ''}
                        onChange={(e) => updateItem(selectedList.id, selectedItem.id, { image: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="https://..."
                      />
                    </div>

                    {selectedItem.image && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Preview</label>
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.title}
                          className="w-full max-w-xs rounded-xl object-cover"
                        />
                      </div>
                    )}

                    {/* Frames section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70">Frames</label>
                        <span className="text-sm text-gray-500 dark:text-white/50">
                          {selectedItem.frames?.length || 0} frames
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleAddFrame(selectedList.id, selectedItem.id)
                          setExpandedItems(prev => new Set(prev).add(selectedItem.id))
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                      >
                        + Add Frame
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FRAME Editor */}
              {selection.type === 'frame' && selectedList && selectedItem && selectedFrame && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frame Editor</h3>
                    <button
                      onClick={() => handleDeleteFrame(selectedList.id, selectedItem.id, selectedFrame.id)}
                      disabled={(selectedItem.frames?.length ?? 0) <= 1}
                      className={`p-2 rounded-lg transition-colors ${
                        (selectedItem.frames?.length ?? 0) <= 1
                          ? 'text-gray-300 dark:text-white/20 cursor-not-allowed'
                          : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Title</label>
                      <input
                        type="text"
                        value={selectedFrame.title || ''}
                        onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedFrame.id, { title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="Frame title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Subtitle</label>
                      <input
                        type="text"
                        value={selectedFrame.subtitle || ''}
                        onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedFrame.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="Frame subtitle"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Template Type</label>
                      <select
                        value={selectedFrame.templateType || 'custom'}
                        onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedFrame.id, {
                          templateType: e.target.value as FrameData['templateType']
                        })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                      >
                        <option value="hook">Hook</option>
                        <option value="how">How</option>
                        <option value="who">Who</option>
                        <option value="what">What</option>
                        <option value="proof">Proof</option>
                        <option value="trust">Trust</option>
                        <option value="action">Action</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Background Image URL</label>
                      <input
                        type="text"
                        value={selectedFrame.background?.src || ''}
                        onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedFrame.id, {
                          background: {
                            ...selectedFrame.background,
                            type: 'image',
                            src: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 focus:border-blue-500 dark:focus:border-cyan-400"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Accent Color</label>
                      <input
                        type="color"
                        value={selectedFrame.accentColor || '#2563EB'}
                        onChange={(e) => updateItemFrame(selectedList.id, selectedItem.id, selectedFrame.id, { accentColor: e.target.value })}
                        className="w-full h-10 px-1 py-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
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
