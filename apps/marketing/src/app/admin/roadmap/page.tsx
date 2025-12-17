'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Clock, Zap, Trash2, Inbox, AlertCircle, User, Building } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Roadmap Page - HQ Admin
 *
 * Kanban board for tracking product development.
 * 4 columns: Triage (new suggestions) → Planned → In Progress → Done
 *
 * Feature suggestions from Studio land here as Triage items.
 * Items are stored in localStorage for now (can be moved to Supabase later).
 */

interface RoadmapItem {
  id: string
  title: string
  description?: string
  status: 'triage' | 'planned' | 'in-progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  category?: string
  requestType?: string
  source?: 'manual' | 'suggestion'
  userEmail?: string
  orgName?: string
  createdAt: string
}

const STORAGE_KEY = 'slydes_hq_roadmap'

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

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [newCategory, setNewCategory] = useState('')
  const [newRequestType, setNewRequestType] = useState('feature')
  const [draggedItem, setDraggedItem] = useState<RoadmapItem | null>(null)
  const [dropTarget, setDropTarget] = useState<RoadmapItem['status'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoading) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, isLoading])

  const addItem = () => {
    if (!newTitle.trim()) return
    const newItem: RoadmapItem = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: 'planned',
      priority: newPriority,
      category: newCategory || undefined,
      requestType: newRequestType,
      source: 'manual',
      createdAt: new Date().toISOString(),
    }
    setItems([newItem, ...items])
    setNewTitle('')
    setNewDescription('')
    setNewPriority('medium')
    setNewCategory('')
    setNewRequestType('feature')
  }

  const updateStatus = (id: string, status: RoadmapItem['status']) => {
    setItems(items.map(item => item.id === id ? { ...item, status } : item))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
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

  const triage = items.filter(i => i.status === 'triage')
  const planned = items.filter(i => i.status === 'planned')
  const inProgress = items.filter(i => i.status === 'in-progress')
  const done = items.filter(i => i.status === 'done')

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-white/10 text-white/60 border-white/20',
  }

  const columns: { id: RoadmapItem['status']; label: string; icon: typeof Clock; iconColor: string; items: RoadmapItem[]; description: string }[] = [
    { id: 'triage', label: 'Triage', icon: Inbox, iconColor: 'text-purple-400', items: triage, description: 'New suggestions to review' },
    { id: 'planned', label: 'Planned', icon: Clock, iconColor: 'text-gray-400', items: planned, description: 'Approved for development' },
    { id: 'in-progress', label: 'In Progress', icon: Zap, iconColor: 'text-amber-400', items: inProgress, description: 'Currently being built' },
    { id: 'done', label: 'Done', icon: Check, iconColor: 'text-green-400', items: done, description: 'Shipped and live' },
  ]

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Roadmap</h1>
          <p className="text-[#98989d]">Track product development from idea to shipped</p>
        </div>
        <div className="text-sm text-[#98989d]">
          {items.length} items • {triage.length} in triage • {inProgress.length} in progress
        </div>
      </div>

      {/* Add New Item */}
      <div className="mb-8 p-5 rounded-2xl bg-[#2c2c2e] border border-white/10">
        <h2 className="font-semibold text-white mb-4">Add to Roadmap</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addItem()}
            placeholder="Feature title..."
            className="w-full px-4 py-3 bg-[#1c1c1e] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue/50 focus:border-leader-blue"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)..."
              className="flex-1 px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-white focus:outline-none min-w-[150px]"
            >
              <option value="">Category...</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={newRequestType}
              onChange={(e) => setNewRequestType(e.target.value)}
              className="px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-white focus:outline-none min-w-[130px]"
            >
              {Object.entries(REQUEST_TYPE_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-4 py-2.5 bg-[#1c1c1e] border border-white/10 rounded-xl text-white focus:outline-none min-w-[100px]"
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
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => {
              e.preventDefault()
              setDropTarget(column.id)
            }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={handleDragEnd}
            className={`min-h-[500px] rounded-2xl p-4 transition-all ${
              dropTarget === column.id
                ? 'bg-leader-blue/10 ring-2 ring-leader-blue/50'
                : 'bg-[#2c2c2e]/50'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-2">
              <column.icon className={`w-4 h-4 ${column.iconColor}`} />
              <h3 className="font-semibold text-white">{column.label}</h3>
              <span className="ml-auto text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                {column.items.length}
              </span>
            </div>
            <p className="text-xs text-white/40 mb-4">{column.description}</p>

            {/* Cards */}
            <div className="space-y-3">
              {column.items.map(item => (
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
                    priorityColors={priorityColors}
                  />
                </motion.div>
              ))}
              {column.items.length === 0 && (
                <div className={`p-4 rounded-xl border-2 border-dashed text-center text-sm transition-colors ${
                  dropTarget === column.id
                    ? 'border-leader-blue/50 text-leader-blue'
                    : 'border-white/10 text-white/30'
                }`}>
                  {dropTarget === column.id ? 'Drop here' : 'No items'}
                </div>
              )}
            </div>
          </div>
        ))}
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
    </div>
  )
}

function RoadmapCard({
  item,
  onDelete,
  priorityColors,
}: {
  item: RoadmapItem
  onDelete: (id: string) => void
  priorityColors: Record<string, string>
}) {
  const requestTypeInfo = REQUEST_TYPE_LABELS[item.requestType || 'feature'] || REQUEST_TYPE_LABELS.feature
  const categoryLabel = item.category ? CATEGORY_LABELS[item.category] : null

  return (
    <div className="p-4 rounded-xl bg-[#2c2c2e] border border-white/10 group hover:border-white/20 transition-colors">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-white text-sm leading-tight">{item.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item.id)
          }}
          className="p-1 rounded opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-white/50 mb-3 line-clamp-2">{item.description}</p>
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
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/50 border border-white/10">
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Meta Row */}
      <div className="flex items-center justify-between text-[10px] text-white/30">
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
