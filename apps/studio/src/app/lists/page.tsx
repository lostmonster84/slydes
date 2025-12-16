'use client'

import { useState, useRef } from 'react'
import { Plus, List, Trash2, Package, GripVertical } from 'lucide-react'
import { HQSidebarConnected } from '@/components/hq/HQSidebarConnected'
import { useLists } from '@/hooks/useLists'
import type { ListData, ListItem } from '@/components/slyde-demo/frameData'

/**
 * Lists HQ — Lists Management
 *
 * Follows CONSTX pattern: Navigator (left) + Preview (center) + Inspector (right)
 * Consistent with HomeSlydeEditorClient and Slydes page styling.
 *
 * IDENTICAL drag-and-drop implementation as Studio categories.
 */

export default function ListsPage() {
  const { lists, addList, updateList, deleteList, reorderLists, addItem, updateItem, deleteItem, reorderItems } = useLists()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Drag state for Lists - IDENTICAL to Studio categories
  const [draggingListId, setDraggingListId] = useState<string | null>(null)
  const [listDragOverTarget, setListDragOverTarget] = useState<{ id: string; position: 'above' | 'below' } | null>(null)
  const listCardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const listDragGhostRef = useRef<HTMLDivElement | null>(null)

  // Drag state for Items - IDENTICAL to Studio categories
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null)
  const [itemDragOverTarget, setItemDragOverTarget] = useState<{ id: string; position: 'above' | 'below' } | null>(null)
  const itemCardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const itemDragGhostRef = useRef<HTMLDivElement | null>(null)

  const selectedList = selectedListId ? lists.find(l => l.id === selectedListId) : null
  const selectedItem = selectedList && selectedItemId
    ? selectedList.items.find(i => i.id === selectedItemId)
    : null

  const handleAddList = () => {
    const newId = addList({ name: 'New List', items: [] })
    setSelectedListId(newId)
    setSelectedItemId(null)
  }

  const handleAddItem = (listId: string) => {
    const newId = addItem(listId, { title: 'New Item' })
    setSelectedItemId(newId)
  }

  // Move list near another list - IDENTICAL pattern to Studio moveCategoryNear
  const moveListNear = (fromId: string, targetId: string, position: 'above' | 'below') => {
    if (fromId === targetId) return
    const fromIndex = lists.findIndex((l) => l.id === fromId)
    if (fromIndex < 0) return
    const targetIndex = lists.findIndex((l) => l.id === targetId)
    if (targetIndex < 0) return
    const insertIndex = position === 'below' ? targetIndex + (fromIndex < targetIndex ? 0 : 1) : targetIndex - (fromIndex < targetIndex ? 1 : 0)
    reorderLists(fromIndex, insertIndex < 0 ? 0 : insertIndex)
  }

  // Move item near another item - IDENTICAL pattern to Studio moveCategoryNear
  const moveItemNear = (listId: string, fromId: string, targetId: string, position: 'above' | 'below') => {
    if (fromId === targetId) return
    const list = lists.find(l => l.id === listId)
    if (!list) return
    const fromIndex = list.items.findIndex((i) => i.id === fromId)
    if (fromIndex < 0) return
    const targetIndex = list.items.findIndex((i) => i.id === targetId)
    if (targetIndex < 0) return
    const insertIndex = position === 'below' ? targetIndex + (fromIndex < targetIndex ? 0 : 1) : targetIndex - (fromIndex < targetIndex ? 1 : 0)
    reorderItems(listId, fromIndex, insertIndex < 0 ? 0 : insertIndex)
  }

  const totalItems = lists.reduce((acc, l) => acc + l.items.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#1c1c1e] dark:text-white overflow-hidden">
      <div className="flex h-screen">
        <HQSidebarConnected activePage="lists" />

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Top Bar - Matches Slydes page */}
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

            {/* NAVIGATOR (Left Panel) - w-72 */}
            <div className="w-72 border-r border-gray-200 dark:border-white/10 bg-white/80 backdrop-blur-xl dark:bg-[#1c1c1e]/80 overflow-y-auto">
              <div className="p-4">
                {/* Section Header - Matches HomeSlydeEditorClient */}
                <div className="flex items-center justify-between px-3 mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                    Lists ({lists.length})
                  </span>
                  <button
                    onClick={handleAddList}
                    className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  {lists.map((list) => {
                    const isSelected = selectedListId === list.id
                    const isDropTarget = draggingListId && listDragOverTarget?.id === list.id
                    const showIndicatorAbove = isDropTarget && listDragOverTarget?.position === 'above'
                    const showIndicatorBelow = isDropTarget && listDragOverTarget?.position === 'below'

                    return (
                      <div key={list.id} className="relative">
                        {/* Drop indicator above */}
                        {showIndicatorAbove && (
                          <div className="absolute -top-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                        )}
                        <div
                          ref={(el) => {
                            if (el) listCardRefs.current.set(list.id, el)
                            else listCardRefs.current.delete(list.id)
                          }}
                          draggable
                          onClick={() => {
                            setSelectedListId(list.id)
                            setSelectedItemId(null)
                          }}
                          onDragStart={(e) => {
                            setDraggingListId(list.id)
                            setListDragOverTarget(null)
                            const cardEl = listCardRefs.current.get(list.id)
                            if (cardEl) {
                              const ghost = cardEl.cloneNode(true) as HTMLDivElement
                              ghost.style.position = 'absolute'
                              ghost.style.top = '-9999px'
                              ghost.style.left = '-9999px'
                              ghost.style.width = `${cardEl.offsetWidth}px`
                              ghost.style.opacity = '0.9'
                              ghost.style.transform = 'scale(1.02)'
                              document.body.appendChild(ghost)
                              listDragGhostRef.current = ghost
                              e.dataTransfer.setDragImage(ghost, 20, 20)
                            }
                            try {
                              e.dataTransfer.effectAllowed = 'move'
                            } catch { /* ignore */ }
                          }}
                          onDragEnd={() => {
                            setDraggingListId(null)
                            setListDragOverTarget(null)
                            if (listDragGhostRef.current) {
                              listDragGhostRef.current.remove()
                              listDragGhostRef.current = null
                            }
                          }}
                          onDragOver={(e) => {
                            if (!draggingListId || draggingListId === list.id) return
                            e.preventDefault()
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                            const relY = e.clientY - rect.top
                            const position: 'above' | 'below' = relY < rect.height / 2 ? 'above' : 'below'
                            setListDragOverTarget({ id: list.id, position })
                          }}
                          onDragLeave={() => {
                            setListDragOverTarget((prev) => (prev?.id === list.id ? null : prev))
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            if (draggingListId) {
                              const pos = listDragOverTarget?.id === list.id ? listDragOverTarget.position : 'above'
                              moveListNear(draggingListId, list.id, pos)
                            }
                            setDraggingListId(null)
                            setListDragOverTarget(null)
                          }}
                          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                              : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                          } ${draggingListId === list.id ? 'opacity-50' : ''}`}
                        >
                          <GripVertical className={`w-3 h-3 shrink-0 cursor-grab ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-white/30'}`} />
                          <List className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-gray-400 dark:text-white/40'}`} />
                          <span className="text-[13px] font-medium truncate flex-1">{list.name}</span>
                          <span className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-gray-400 dark:text-white/40'}`}>
                            {list.items.length}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteList(list.id)
                              if (selectedListId === list.id) {
                                setSelectedListId(null)
                                setSelectedItemId(null)
                              }
                            }}
                            className={`p-1 rounded-lg transition-all ${
                              isSelected
                                ? 'text-white/70 hover:text-white hover:bg-white/20'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Drop indicator below */}
                        {showIndicatorBelow && (
                          <div className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                        )}
                      </div>
                    )
                  })}

                  {/* Always show Add list button - Dashed Affordance Pattern */}
                  <button
                    onClick={handleAddList}
                    className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[12px] font-medium">Add list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW (Center) - Items List */}
            <div className="flex-1 flex overflow-hidden">
              {selectedList ? (
                <>
                  {/* Items Navigator */}
                  <div className="w-72 border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1c1c1e] overflow-y-auto">
                    <div className="p-4">
                      {/* Section Header */}
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                          Items ({selectedList.items.length})
                        </span>
                        <button
                          onClick={() => handleAddItem(selectedList.id)}
                          className="p-1 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {selectedList.items.map((item) => {
                          const isItemSelected = selectedItemId === item.id
                          const isDropTarget = draggingItemId && itemDragOverTarget?.id === item.id
                          const showIndicatorAbove = isDropTarget && itemDragOverTarget?.position === 'above'
                          const showIndicatorBelow = isDropTarget && itemDragOverTarget?.position === 'below'

                          return (
                            <div key={item.id} className="relative">
                              {/* Drop indicator above */}
                              {showIndicatorAbove && (
                                <div className="absolute -top-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                              )}
                              <div
                                ref={(el) => {
                                  if (el) itemCardRefs.current.set(item.id, el)
                                  else itemCardRefs.current.delete(item.id)
                                }}
                                draggable
                                onClick={() => setSelectedItemId(item.id)}
                                onDragStart={(e) => {
                                  setDraggingItemId(item.id)
                                  setItemDragOverTarget(null)
                                  const cardEl = itemCardRefs.current.get(item.id)
                                  if (cardEl) {
                                    const ghost = cardEl.cloneNode(true) as HTMLDivElement
                                    ghost.style.position = 'absolute'
                                    ghost.style.top = '-9999px'
                                    ghost.style.left = '-9999px'
                                    ghost.style.width = `${cardEl.offsetWidth}px`
                                    ghost.style.opacity = '0.9'
                                    ghost.style.transform = 'scale(1.02)'
                                    document.body.appendChild(ghost)
                                    itemDragGhostRef.current = ghost
                                    e.dataTransfer.setDragImage(ghost, 20, 20)
                                  }
                                  try {
                                    e.dataTransfer.effectAllowed = 'move'
                                  } catch { /* ignore */ }
                                }}
                                onDragEnd={() => {
                                  setDraggingItemId(null)
                                  setItemDragOverTarget(null)
                                  if (itemDragGhostRef.current) {
                                    itemDragGhostRef.current.remove()
                                    itemDragGhostRef.current = null
                                  }
                                }}
                                onDragOver={(e) => {
                                  if (!draggingItemId || draggingItemId === item.id) return
                                  e.preventDefault()
                                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                                  const relY = e.clientY - rect.top
                                  const position: 'above' | 'below' = relY < rect.height / 2 ? 'above' : 'below'
                                  setItemDragOverTarget({ id: item.id, position })
                                }}
                                onDragLeave={() => {
                                  setItemDragOverTarget((prev) => (prev?.id === item.id ? null : prev))
                                }}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  if (draggingItemId) {
                                    const pos = itemDragOverTarget?.id === item.id ? itemDragOverTarget.position : 'above'
                                    moveItemNear(selectedList.id, draggingItemId, item.id, pos)
                                  }
                                  setDraggingItemId(null)
                                  setItemDragOverTarget(null)
                                }}
                                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                  isItemSelected
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'hover:bg-white dark:hover:bg-white/5 text-gray-700 dark:text-white/70'
                                } ${draggingItemId === item.id ? 'opacity-50' : ''}`}
                              >
                                <GripVertical className={`w-3 h-3 shrink-0 cursor-grab ${isItemSelected ? 'text-white/60' : 'text-gray-400 dark:text-white/30'}`} />
                                {item.image ? (
                                  <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                ) : (
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isItemSelected ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'
                                  }`}>
                                    <Package className={`w-4 h-4 ${isItemSelected ? 'text-white' : 'text-gray-400 dark:text-white/30'}`} />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-[13px] font-medium truncate ${isItemSelected ? 'text-white' : ''}`}>{item.title}</div>
                                  {item.price && (
                                    <div className={`text-[11px] ${isItemSelected ? 'text-white/70' : 'text-gray-500 dark:text-white/50'}`}>{item.price}</div>
                                  )}
                                </div>
                                {item.badge && (
                                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${
                                    isItemSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-blue-100 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteItem(selectedList.id, item.id)
                                    if (selectedItemId === item.id) {
                                      setSelectedItemId(null)
                                    }
                                  }}
                                  className={`p-1 rounded-lg transition-all ${
                                    isItemSelected
                                      ? 'text-white/70 hover:text-white hover:bg-white/20'
                                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {/* Drop indicator below */}
                              {showIndicatorBelow && (
                                <div className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                              )}
                            </div>
                          )
                        })}

                        {/* Always show Add item button - Dashed Affordance Pattern */}
                        <button
                          onClick={() => handleAddItem(selectedList.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-blue-300 dark:hover:border-cyan-500/30 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[12px] font-medium">Add item</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* INSPECTOR (Right Panel) - w-80 */}
                  <div className="flex-1 bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80 overflow-y-auto border-l border-gray-200 dark:border-white/10">
                    {selectedItem ? (
                      <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Details</h3>
                          <button
                            onClick={() => {
                              deleteItem(selectedList.id, selectedItem.id)
                              setSelectedItemId(null)
                            }}
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

                          {/* Item Frames */}
                          <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-white/70">Item Slyde</label>
                              <span className="text-sm text-gray-500 dark:text-white/50">
                                {selectedItem.frames?.length || 0} frames
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-white/50 mb-3">
                              Configure the frames that appear when someone taps this item.
                            </p>
                            <button
                              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                            >
                              Edit Item Frames
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">List Details</h3>
                          <button
                            onClick={() => {
                              deleteList(selectedList.id)
                              setSelectedListId(null)
                              setSelectedItemId(null)
                            }}
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
                            <p className="text-sm text-gray-500 dark:text-white/50">
                              Select an item from the list to edit its details.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white/80 backdrop-blur-xl dark:bg-[#2c2c2e]/80">
                  <div className="text-center">
                    <List className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-white/50">Select a list to view items</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow effects (subtle, Apple-like) - Matches Slydes page */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-blue-500/12" />
      <div className="fixed bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none dark:bg-cyan-500/12" />
    </div>
  )
}
