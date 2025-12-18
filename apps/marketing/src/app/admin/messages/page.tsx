'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  RefreshCw,
  Mail,
  Music,
  HelpCircle,
  CheckCircle,
  Archive,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  Rocket
} from 'lucide-react'

interface Message {
  id: string
  type: 'general' | 'music_help' | 'contact' | 'support' | 'investor' | 'affiliate' | 'partner'
  subject: string | null
  message: string
  user_email: string | null
  user_name: string | null
  user_id: string | null
  org_name: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

const TYPE_CONFIG = {
  music_help: { icon: Music, label: 'Music Help', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  contact: { icon: Mail, label: 'Contact', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  support: { icon: HelpCircle, label: 'Support', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  general: { icon: MessageSquare, label: 'General', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  investor: { icon: DollarSign, label: 'Investor', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  affiliate: { icon: Users, label: 'Affiliate', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  partner: { icon: Rocket, label: 'Partner', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
}

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-green-500/20 text-green-400' },
  read: { label: 'Read', color: 'bg-gray-500/20 text-gray-400' },
  replied: { label: 'Replied', color: 'bg-blue-500/20 text-blue-400' },
  archived: { label: 'Archived', color: 'bg-gray-500/20 text-gray-500' },
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const url = statusFilter === 'all'
        ? '/api/admin/messages'
        : `/api/admin/messages?status=${statusFilter}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateStatus = async (id: string, status: Message['status']) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      // Update local state
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status } : m))
      if (status !== 'new') {
        setUnreadCount(c => Math.max(0, c - 1))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleExpand = async (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null)
    } else {
      setExpandedId(msg.id)
      // Auto-mark as read when expanded
      if (msg.status === 'new') {
        updateStatus(msg.id, 'read')
      }
    }
  }

  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New', count: unreadCount },
    { id: 'read', label: 'Read' },
    { id: 'replied', label: 'Replied' },
    { id: 'archived', label: 'Archived' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
            Messages
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-sm bg-green-500/20 text-green-400 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[#98989d]">Help requests and contact messages</p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={isRefreshing}
          className="px-4 py-2 text-sm font-medium bg-[#3a3a3c] text-white border border-white/10 rounded-lg hover:bg-[#48484a] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              statusFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-[#3a3a3c] text-[#98989d] hover:bg-[#48484a] hover:text-white'
            }`}
          >
            {filter.label}
            {filter.count !== undefined && filter.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                statusFilter === filter.id ? 'bg-white/20' : 'bg-green-500/20 text-green-400'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-8 text-center">
            <RefreshCw className="w-6 h-6 text-[#636366] animate-spin mx-auto" />
            <p className="text-[#636366] mt-2">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-[#2c2c2e] rounded-xl border border-white/10 p-8 text-center">
            <MessageSquare className="w-8 h-8 text-[#636366] mx-auto mb-2" />
            <p className="text-[#636366]">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const typeConfig = TYPE_CONFIG[msg.type]
            const TypeIcon = typeConfig.icon
            const statusConfig = STATUS_CONFIG[msg.status]
            const isExpanded = expandedId === msg.id

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-[#2c2c2e] rounded-xl border transition-colors ${
                  msg.status === 'new' ? 'border-green-500/30' : 'border-white/10'
                }`}
              >
                {/* Message Header - Clickable */}
                <button
                  onClick={() => handleExpand(msg)}
                  className="w-full p-4 text-left flex items-start gap-4"
                >
                  <div className={`p-2 rounded-lg border ${typeConfig.color}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-[#636366]">{timeAgo(msg.created_at)}</span>
                    </div>
                    <h3 className="text-white font-medium truncate">
                      {msg.subject || typeConfig.label}
                    </h3>
                    <p className="text-sm text-[#98989d] truncate">
                      {msg.user_email || 'Anonymous'}
                      {msg.org_name && ` · ${msg.org_name}`}
                    </p>
                    {!isExpanded && (
                      <p className="text-sm text-[#636366] mt-1 line-clamp-1">
                        {msg.message}
                      </p>
                    )}
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#636366]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#636366]" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4 ml-14">
                    <p className="text-white whitespace-pre-wrap mb-4">{msg.message}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {msg.user_email && (
                        <a
                          href={`mailto:${msg.user_email}?subject=Re: ${msg.subject || 'Your message to Slydes'}`}
                          onClick={() => updateStatus(msg.id, 'replied')}
                          className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Reply
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => updateStatus(msg.id, 'replied')}
                          className="px-3 py-1.5 text-sm font-medium bg-[#3a3a3c] hover:bg-[#48484a] text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Replied
                        </button>
                      )}
                      {msg.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(msg.id, 'archived')}
                          className="px-3 py-1.5 text-sm font-medium bg-[#3a3a3c] hover:bg-[#48484a] text-[#98989d] rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
