'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Globe,
  Sparkles,
  Trash2,
  ExternalLink,
  Copy,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowLeft,
  Eye,
  MessageSquare,
} from 'lucide-react'

interface GeneratedDemo {
  id: string
  source_url: string
  business_name: string
  business_tagline: string | null
  business_location: string | null
  business_industry: string | null
  quality: 'high' | 'medium' | 'low'
  quality_notes: string[] | null
  images_count: number
  videos_count: number
  categories_count: number
  frames_count: number
  status: 'draft' | 'ready' | 'sent' | 'converted'
  sent_to: string | null
  sent_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60', icon: Clock },
  ready: { label: 'Ready', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', icon: CheckCircle2 },
  sent: { label: 'Sent', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', icon: Send },
  converted: { label: 'Converted!', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', icon: Sparkles },
}

const QUALITY_CONFIG = {
  high: { label: 'HIGH', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' },
  medium: { label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  low: { label: 'LOW', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
}

export default function DevDemosPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [demos, setDemos] = useState<GeneratedDemo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Only render on localhost
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      router.push('/dashboard')
    }
  }, [router])

  // Fetch demos
  const fetchDemos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/dev/demos')
      const result = await response.json()
      if (result.ok) {
        setDemos(result.data || [])
      } else {
        setError(result.error || 'Failed to fetch demos')
      }
    } catch (err) {
      setError('Failed to fetch demos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchDemos()
    }
  }, [isClient])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this demo? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/dev/demos/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setDemos((prev) => prev.filter((d) => d.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleUpdateStatus = async (id: string, status: GeneratedDemo['status']) => {
    try {
      const response = await fetch(`/api/dev/demos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        setDemos((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status } : d))
        )
      }
    } catch (err) {
      console.error('Failed to update:', err)
    }
  }

  const handleCopyUrl = (id: string) => {
    const url = `${window.location.origin}/dev/demos/${id}/preview`
    navigator.clipboard.writeText(url)
    alert('Preview URL copied!')
  }

  const handleLoadDemo = async (id: string) => {
    try {
      const response = await fetch(`/api/dev/demos/${id}/load`, {
        method: 'POST',
      })
      const result = await response.json()
      if (result.ok && result.generatedDemo) {
        // Import the localStorage helpers dynamically to load the demo
        const { writeDemoHomeSlyde, writeChildFrames, writeChildFAQs, readDemoHomeSlyde } = await import('@/lib/demoHomeSlyde')
        const { writeDemoBrandProfile } = await import('@/lib/demoBrand')

        const generatedDemo = result.generatedDemo
        const current = readDemoHomeSlyde()

        // Write brand info
        writeDemoBrandProfile({
          businessName: generatedDemo.brand.name,
          tagline: generatedDemo.brand.tagline,
          primaryColor: '#2563EB',
          secondaryColor: '#06B6D4',
        })

        // Write home slyde
        writeDemoHomeSlyde({
          ...current,
          backgroundType: generatedDemo.homeSlyde.backgroundVideo ? 'video' : 'image',
          videoSrc: generatedDemo.homeSlyde.backgroundVideo || '',
          imageSrc: generatedDemo.homeSlyde.backgroundImage,
          categories: generatedDemo.homeSlyde.categories,
          childFrames: {},
          childFAQs: {},
        })

        // Write category frames and FAQs
        for (const category of generatedDemo.categorySlydes) {
          writeChildFrames(category.categoryId, category.frames)
          writeChildFAQs(category.categoryId, category.faqs)
        }

        alert('Demo loaded! Go to /dashboard to see it in the editor.')
      } else {
        alert(result.error || 'Failed to load demo')
      }
    } catch (err) {
      console.error('Load error:', err)
      alert('Failed to load demo')
    }
  }

  if (!isClient) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1c1c1e]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#2c2c2e]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-white/60" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Demo Library
                </h1>
                <p className="text-sm text-gray-500 dark:text-white/50">
                  Generated demos for sales outreach
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDemos}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white text-sm font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{demos.length}</div>
            <div className="text-sm text-gray-500 dark:text-white/50">Total Demos</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {demos.filter((d) => d.status === 'ready').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-white/50">Ready to Send</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {demos.filter((d) => d.status === 'sent').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-white/50">Sent</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {demos.filter((d) => d.status === 'converted').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-white/50">Converted</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500 dark:text-white/50">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading demos...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && demos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No demos yet
            </h2>
            <p className="text-gray-500 dark:text-white/50 mb-6 max-w-md">
              Generate your first demo by entering a business URL in the Dev Panel on the dashboard.
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
            >
              <Plus className="w-4 h-4" />
              Create First Demo
            </Link>
          </div>
        )}

        {/* Demo List */}
        {!loading && demos.length > 0 && (
          <div className="space-y-4">
            {demos.map((demo) => {
              const statusConfig = STATUS_CONFIG[demo.status]
              const qualityConfig = QUALITY_CONFIG[demo.quality]
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={demo.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {demo.business_name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusConfig.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${qualityConfig.color}`}>
                          {qualityConfig.label}
                        </span>
                      </div>

                      {demo.business_tagline && (
                        <p className="text-sm text-gray-600 dark:text-white/60 mb-2 truncate">
                          {demo.business_tagline}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/40">
                        <a
                          href={demo.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          {new URL(demo.source_url).hostname}
                        </a>
                        <span>{demo.categories_count} categories</span>
                        <span>{demo.frames_count} frames</span>
                        <span>{demo.images_count} images</span>
                        {demo.videos_count > 0 && <span>{demo.videos_count} videos</span>}
                        <span>{new Date(demo.created_at).toLocaleDateString()}</span>
                      </div>

                      {demo.sent_to && (
                        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Sent to: {demo.sent_to} on {new Date(demo.sent_at!).toLocaleDateString()}
                        </div>
                      )}

                      {demo.notes && (
                        <div className="mt-2 flex items-start gap-1 text-xs text-gray-500 dark:text-white/40">
                          <MessageSquare className="w-3 h-3 mt-0.5" />
                          {demo.notes}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dev/demos/${demo.id}/preview`}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-white/60 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleCopyUrl(demo.id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-600 dark:text-white/60 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLoadDemo(demo.id)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Load into Editor"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {/* Status Dropdown */}
                      <select
                        value={demo.status}
                        onChange={(e) => handleUpdateStatus(demo.id, e.target.value as GeneratedDemo['status'])}
                        className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white border-none focus:ring-2 focus:ring-amber-500/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="sent">Sent</option>
                        <option value="converted">Converted</option>
                      </select>

                      <button
                        onClick={() => handleDelete(demo.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Dev Warning */}
      <div className="fixed bottom-4 left-4 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold">
        DEV ONLY
      </div>
    </div>
  )
}
