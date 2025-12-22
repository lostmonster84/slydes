'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Sparkles, MessageCircle, RefreshCw, Zap } from 'lucide-react'
import { useOrganization } from '@/hooks'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface MomentumAIProps {
  /** Whether the chat is open */
  isOpen: boolean
  /** Callback to close the chat */
  onClose: () => void
  /** Whether user is on Pro plan */
  isPro?: boolean
}

const QUICK_ACTIONS = [
  { label: "How's my week?", icon: '📊' },
  { label: 'Help me write copy', icon: '✍️' },
  { label: 'What should I focus on?', icon: '🎯' },
  { label: 'Teach me about hooks', icon: '📚' },
]

// Free tier: 3 messages per day
const FREE_DAILY_LIMIT = 3
const STORAGE_KEY = 'momentum_ai_free_usage'

interface FreeUsage {
  date: string
  count: number
}

function getFreeUsage(): FreeUsage {
  if (typeof window === 'undefined') return { date: '', count: 0 }
  const today = new Date().toISOString().split('T')[0]
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return { date: today, count: 0 }

  const usage = JSON.parse(stored) as FreeUsage
  // Reset if new day
  if (usage.date !== today) {
    return { date: today, count: 0 }
  }
  return usage
}

function incrementFreeUsage(): number {
  const usage = getFreeUsage()
  const today = new Date().toISOString().split('T')[0]
  const newCount = usage.date === today ? usage.count + 1 : 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }))
  return newCount
}

export function MomentumAI({ isOpen, onClose, isPro = false }: MomentumAIProps) {
  const { organization } = useOrganization()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load free usage count on mount
  useEffect(() => {
    if (!isPro) {
      setFreeMessagesUsed(getFreeUsage().count)
    }
  }, [isPro])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && isPro) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isPro])

  const freeMessagesRemaining = FREE_DAILY_LIMIT - freeMessagesUsed
  const canSendMessage = isPro || freeMessagesRemaining > 0

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    // Wait for org to be loaded
    if (!organization?.slug) {
      setError('Loading organization...')
      return
    }

    // Check free tier limit
    if (!isPro && freeMessagesUsed >= FREE_DAILY_LIMIT) {
      setError('limit_reached')
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    // Increment usage for free users BEFORE API call
    if (!isPro) {
      const newCount = incrementFreeUsage()
      setFreeMessagesUsed(newCount)
    }

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          history: messages.slice(-10),
          org: organization?.slug,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.upgradeRequired) {
          setError('upgrade')
        } else {
          throw new Error(data.error || 'Failed to get response')
        }
        return
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, isPro, freeMessagesUsed, organization?.slug])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#1c1c1e] shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white">Momentum AI</h2>
              <p className="text-xs text-white/70">Your business partner</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="New chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        {(isPro || canSendMessage) ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="space-y-6">
                  {/* Welcome */}
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">
                      Hey{organization?.name ? `, ${organization.name}` : ''}! 👋
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-white/60 max-w-xs mx-auto">
                      I'm Momentum AI, your business partner. Ask me anything about your Slydes, analytics, or how to grow.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-white/40 mb-2 px-1">
                      Quick actions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleQuickAction(action.label)}
                          className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left text-sm"
                        >
                          <span>{action.icon}</span>
                          <span className="text-gray-700 dark:text-white/80">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-white/10 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-white/50">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && error !== 'upgrade' && error !== 'limit_reached' && (
                    <div className="flex justify-center">
                      <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl px-4 py-2 text-sm">
                        {error}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Momentum anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-leader-blue"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              {isPro ? (
                <p className="text-xs text-center text-gray-400 dark:text-white/30 mt-2">
                  Momentum AI knows your business and is here to help you grow.
                </p>
              ) : (
                <p className="text-xs text-center text-gray-400 dark:text-white/30 mt-2">
                  {freeMessagesRemaining} free message{freeMessagesRemaining !== 1 ? 's' : ''} remaining today •{' '}
                  <Link href="/settings/billing" className="text-blue-500 hover:underline">
                    Upgrade for unlimited
                  </Link>
                </p>
              )}
            </div>
          </>
        ) : (
          /* Limit Reached - Upgrade Prompt */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
              You've used your 3 free messages today
            </h3>
            <p className="text-gray-600 dark:text-white/60 mb-6 max-w-xs">
              Upgrade to Pro for unlimited access to Momentum AI - your always-on business partner.
            </p>
            <ul className="text-left text-sm text-gray-600 dark:text-white/60 mb-8 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Unlimited conversations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Personalized content suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Analytics explained in plain English
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Learn best practices with guided help
              </li>
            </ul>
            <Link
              href="/settings/billing"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
            >
              Upgrade to Pro — £19/month
            </Link>
            <p className="text-xs text-gray-500 dark:text-white/40 mt-4">
              Your free messages reset at midnight.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Floating trigger bubble for Momentum AI
 * Shows as a round icon button on all pages except Dashboard
 */
export function MomentumAITrigger({ onClick, hasUnread = false }: { onClick: () => void; hasUnread?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110 transition-all flex items-center justify-center group"
      title="Ask Momentum AI"
    >
      {/* Pulse glow - only on hover */}
      <span className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-40 blur-md group-hover:animate-pulse transition-opacity" />
      {/* Icon */}
      <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-20" />
      )}
    </button>
  )
}
