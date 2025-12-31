'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Check, Clock, Zap, Trash2, Inbox, AlertCircle, User, Building, Circle, Settings, X, GripVertical, Pencil } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Roadmap Page - HQ Admin
 *
 * Kanban board for tracking product development.
 * Columns are now dynamic (loaded from DB) - can add, rename, delete, reorder.
 *
 * Feature suggestions from Studio land here as Triage items.
 */

interface RoadmapItem {
  id: string
  title: string
  description?: string
  status: string
  priority: 'high' | 'medium' | 'low'
  category?: string
  requestType?: string
  source?: 'manual' | 'suggestion'
  userEmail?: string
  orgName?: string
  createdAt: string
}

interface RoadmapColumn {
  id: string
  slug: string
  label: string
  description?: string
  icon: string
  iconColor: string
  position: number
  isDoneColumn: boolean
}

// API endpoints
const ROADMAP_API = '/api/admin/roadmap'
const COLUMNS_API = '/api/admin/roadmap/columns'

const CATEGORY_LABELS: Record<string, string> = {
  editor: 'Editor / Studio',
  slydes: 'Slydes & Content',
  analytics: 'Analytics',
  brand: 'Brand & Design',
  inbox: 'Inbox & Enquiries',
  other: 'Other',
}

const REQUEST_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  feature: { label: 'Feature', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  improvement: { label: 'Improvement', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  bug: { label: 'Bug', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  ux: { label: 'UX', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
}

// Icon name to component mapping
const ICON_MAP: Record<string, typeof Circle> = {
  inbox: Inbox,
  clock: Clock,
  zap: Zap,
  check: Check,
  circle: Circle,
}

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [columns, setColumns] = useState<RoadmapColumn[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [newCategory, setNewCategory] = useState('')
  const [newRequestType, setNewRequestType] = useState('feature')
  const [draggedItem, setDraggedItem] = useState<RoadmapItem | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showColumnManager, setShowColumnManager] = useState(false)

  // Load columns and items on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [columnsRes, itemsRes] = await Promise.all([
          fetch(COLUMNS_API),
          fetch(ROADMAP_API),
        ])

        if (columnsRes.ok) {
          const columnsData = await columnsRes.json()
          setColumns(columnsData.columns || [])
        }

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json()
          setItems(itemsData.items || [])
        }
      } catch (err) {
        console.error('Failed to load roadmap data:', err)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  const addItem = async () => {
    if (!newTitle.trim()) return

    // Find the second column (planned) or first non-triage column for manual items
    const plannedColumn = columns.find(c => c.slug === 'planned') || columns[1] || columns[0]

    const payload = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      priority: newPriority,
      category: newCategory || undefined,
      requestType: newRequestType,
      source: 'manual',
    }

    // Optimistically clear form
    setNewTitle('')
    setNewDescription('')
    setNewPriority('medium')
    setNewCategory('')
    setNewRequestType('feature')

    try {
      const res = await fetch(ROADMAP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setItems([data.item, ...items])
      } else {
        console.error('Failed to add item')
      }
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    // Optimistic update
    setItems(items.map(item => item.id === id ? { ...item, status } : item))

    try {
      await fetch(ROADMAP_API, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const deleteItem = async (id: string) => {
    // Optimistic update
    setItems(items.filter(item => item.id !== id))

    try {
      await fetch(`${ROADMAP_API}?id=${id}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  const handleDragStart = (item: RoadmapItem) => {
    setDraggedItem(item)
  }

  const handleDragEnd = () => {
    if (draggedItem && dropTarget && draggedItem.status !== dropTarget) {
      updateStatus(draggedItem.id, dropTarget)
    }
    setDraggedItem(null)
    setDropTarget(null)
  }

  // Find the done column for marking items as done
  const doneColumn = columns.find(c => c.isDoneColumn) || columns[columns.length - 1]
  const triageColumn = columns.find(c => c.slug === 'triage')

  const triageCount = items.filter(i => i.status === 'triage').length
  const inProgressCount = items.filter(i => i.status === 'in-progress').length

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-white/10 text-white/60 border-white/20',
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-white/40">Loading roadmap...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Roadmap</h1>
          <p className="text-gray-500 dark:text-[#98989d]">Track product development from idea to shipped</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-[#98989d]">
            {items.length} items • {triageCount} in triage • {inProgressCount} in progress
          </div>
          <button
            onClick={() => setShowColumnManager(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Columns
          </button>
        </div>
      </div>

      {/* Add New Item */}
      <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Add to Roadmap</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addItem()}
            placeholder="Feature title..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:border-leader-blue"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none min-w-[150px]"
            >
              <option value="">Category...</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={newRequestType}
              onChange={(e) => setNewRequestType(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none min-w-[130px]"
            >
              {Object.entries(REQUEST_TYPE_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none min-w-[100px]"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={addItem}
              disabled={!newTitle.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-leader-blue text-white font-semibold rounded-xl hover:bg-leader-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))` }}
      >
        {columns.map((column) => {
          const columnItems = items.filter(i => i.status === column.slug)
          const IconComponent = ICON_MAP[column.icon] || Circle

          return (
            <div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault()
                setDropTarget(column.slug)
              }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={handleDragEnd}
              className={`min-h-[500px] rounded-2xl p-4 transition-all ${
                dropTarget === column.slug
                  ? 'bg-leader-blue/10 ring-2 ring-leader-blue/50'
                  : 'bg-gray-100 dark:bg-[#2c2c2e]/50'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`w-4 h-4 ${column.iconColor}`} />
                <h3 className="font-semibold text-gray-900 dark:text-white">{column.label}</h3>
                <span className="ml-auto text-xs text-gray-500 dark:text-white/40 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {columnItems.length}
                </span>
              </div>
              {column.description && (
                <p className="text-xs text-gray-500 dark:text-white/40 mb-4">{column.description}</p>
              )}

              {/* Cards */}
              <div className="space-y-3">
                {columnItems.map(item => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.02, rotate: 1, opacity: 0.9 }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <RoadmapCard
                      item={item}
                      onDelete={deleteItem}
                      onMarkDone={(id) => doneColumn && updateStatus(id, doneColumn.slug)}
                      priorityColors={priorityColors}
                      isDone={column.isDoneColumn}
                    />
                  </motion.div>
                ))}
                {columnItems.length === 0 && (
                  <div className={`p-4 rounded-xl border-2 border-dashed text-center text-sm transition-colors ${
                    dropTarget === column.slug
                      ? 'border-leader-blue/50 text-leader-blue'
                      : 'border-gray-300 text-gray-400 dark:border-white/10 dark:text-white/30'
                  }`}>
                    {dropTarget === column.slug ? 'Drop here' : 'No items'}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Banner */}
      <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-purple-300 font-medium">Feature Suggestions</p>
          <p className="text-sm text-purple-300/70 mt-1">
            When users submit feature suggestions from Studio via "Suggest a Feature", they automatically appear in the Triage column with their category, type, and user info.
          </p>
        </div>
      </div>

      {/* Column Manager Modal */}
      <AnimatePresence>
        {showColumnManager && (
          <ColumnManagerModal
            columns={columns}
            setColumns={setColumns}
            items={items}
            onClose={() => setShowColumnManager(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function RoadmapCard({
  item,
  onDelete,
  onMarkDone,
  priorityColors,
  isDone,
}: {
  item: RoadmapItem
  onDelete: (id: string) => void
  onMarkDone: (id: string) => void
  priorityColors: Record<string, string>
  isDone: boolean
}) {
  const requestTypeInfo = REQUEST_TYPE_LABELS[item.requestType || 'feature'] || REQUEST_TYPE_LABELS.feature
  const categoryLabel = item.category ? CATEGORY_LABELS[item.category] : null

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10 group hover:border-gray-300 dark:hover:border-white/20 transition-colors shadow-sm dark:shadow-none">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2">
          {!isDone ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkDone(item.id)
              }}
              className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300 dark:border-white/30 hover:border-green-400 hover:bg-green-500/10 transition-all shrink-0"
              title="Mark as done"
            />
          ) : (
            <div className="mt-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
          <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">{item.title}</h4>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item.id)
          }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 text-gray-400 dark:text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-500 dark:text-white/50 mb-3 line-clamp-2">{item.description}</p>
      )}

      {/* Tags Row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {/* Request Type */}
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${requestTypeInfo.color}`}>
          {requestTypeInfo.label}
        </span>

        {/* Priority */}
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${priorityColors[item.priority]}`}>
          {item.priority}
        </span>

        {/* Category */}
        {categoryLabel && (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10">
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-white/30">
        <div className="flex items-center gap-2">
          {item.source === 'suggestion' && (
            <span className="flex items-center gap-1 text-purple-400">
              <Inbox className="w-3 h-3" />
              suggestion
            </span>
          )}
          {item.userEmail && (
            <span className="flex items-center gap-1" title={item.userEmail}>
              <User className="w-3 h-3" />
              {item.userEmail.split('@')[0]}
            </span>
          )}
          {item.orgName && (
            <span className="flex items-center gap-1" title={item.orgName}>
              <Building className="w-3 h-3" />
              {item.orgName}
            </span>
          )}
        </div>
        <span>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

// Column Manager Modal
function ColumnManagerModal({
  columns,
  setColumns,
  items,
  onClose,
}: {
  columns: RoadmapColumn[]
  setColumns: React.Dispatch<React.SetStateAction<RoadmapColumn[]>>
  items: RoadmapItem[]
  onClose: () => void
}) {
  const [newColumnLabel, setNewColumnLabel] = useState('')
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingColumn && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingColumn])

  const addColumn = async () => {
    if (!newColumnLabel.trim()) return

    setIsAdding(true)
    setError(null)

    try {
      const res = await fetch(COLUMNS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newColumnLabel.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setColumns([...columns, data.column])
        setNewColumnLabel('')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to add column')
      }
    } catch (err) {
      setError('Failed to add column')
    }

    setIsAdding(false)
  }

  const updateColumn = async (id: string, updates: Partial<RoadmapColumn>) => {
    setError(null)

    try {
      const res = await fetch(COLUMNS_API, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })

      if (res.ok) {
        const data = await res.json()
        setColumns(columns.map(c => c.id === id ? data.column : c))
        setEditingColumn(null)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update column')
      }
    } catch (err) {
      setError('Failed to update column')
    }
  }

  const deleteColumn = async (id: string) => {
    const column = columns.find(c => c.id === id)
    if (!column) return

    const itemCount = items.filter(i => i.status === column.slug).length
    if (itemCount > 0) {
      setError(`Cannot delete "${column.label}" - it has ${itemCount} item(s). Move them first.`)
      return
    }

    setError(null)

    try {
      const res = await fetch(`${COLUMNS_API}?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setColumns(columns.filter(c => c.id !== id))
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to delete column')
      }
    } catch (err) {
      setError('Failed to delete column')
    }
  }

  const startEditing = (column: RoadmapColumn) => {
    setEditingColumn(column.id)
    setEditLabel(column.label)
  }

  const saveEdit = () => {
    if (editingColumn && editLabel.trim()) {
      updateColumn(editingColumn, { label: editLabel.trim() })
    } else {
      setEditingColumn(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Columns</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Column List */}
          <div className="space-y-2 mb-6">
            {columns.map((column, index) => {
              const itemCount = items.filter(i => i.status === column.slug).length
              const IconComponent = ICON_MAP[column.icon] || Circle

              return (
                <div
                  key={column.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 group"
                >
                  <GripVertical className="w-4 h-4 text-gray-300 dark:text-white/20 cursor-grab" />
                  <IconComponent className={`w-4 h-4 ${column.iconColor}`} />

                  {editingColumn === column.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit()
                        if (e.key === 'Escape') setEditingColumn(null)
                      }}
                      onBlur={saveEdit}
                      className="flex-1 px-2 py-1 bg-white dark:bg-[#1c1c1e] border border-leader-blue rounded text-sm text-gray-900 dark:text-white focus:outline-none"
                    />
                  ) : (
                    <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                      {column.label}
                    </span>
                  )}

                  <span className="text-xs text-gray-400 dark:text-white/40">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>

                  {column.isDoneColumn && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                      Done
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(column)}
                      className="p-1.5 rounded text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      title="Rename"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteColumn(column.id)}
                      className="p-1.5 rounded text-gray-400 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add New Column */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newColumnLabel}
              onChange={(e) => setNewColumnLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addColumn()}
              placeholder="New column name..."
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue/50"
            />
            <button
              onClick={addColumn}
              disabled={!newColumnLabel.trim() || isAdding}
              className="flex items-center gap-2 px-4 py-2.5 bg-leader-blue text-white font-semibold rounded-xl hover:bg-leader-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400 dark:text-white/40">
            Tip: Drag columns to reorder. Delete is only possible when a column is empty.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
