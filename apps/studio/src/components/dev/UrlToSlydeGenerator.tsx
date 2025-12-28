'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, Globe, Sparkles, CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink, Save, Library } from 'lucide-react'
import {
  writeDemoHomeSlyde,
  writeChildFrames,
  writeChildFAQs,
  readDemoHomeSlyde,
} from '@/lib/demoHomeSlyde'
import { writeDemoBrandProfile } from '@/lib/demoBrand'
import type {
  GeneratorStage,
  ScrapedBusiness,
  GeneratedDemo,
  ScrapeProgress,
} from '@/types/generator'

/**
 * URL to Slyde Generator - Dev Only Tool
 *
 * Paste a business URL → Scrape → AI Generate → Load Demo
 */

interface ProgressStep {
  label: string
  stage: GeneratorStage | 'scraping_homepage' | 'scraping_services' | 'scraping_about' | 'scraping_videos'
  status: 'pending' | 'active' | 'complete' | 'error'
}

export function UrlToSlydeGenerator() {
  const [url, setUrl] = useState('')
  const [stage, setStage] = useState<GeneratorStage>('idle')
  const [error, setError] = useState<string | null>(null)
  const [scrapedBusiness, setScrapedBusiness] = useState<ScrapedBusiness | null>(null)
  const [generatedDemo, setGeneratedDemo] = useState<GeneratedDemo | null>(null)
  const [savedDemoId, setSavedDemoId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [steps, setSteps] = useState<ProgressStep[]>([
    { label: 'Scraping homepage...', stage: 'scraping_homepage', status: 'pending' },
    { label: 'Analyzing services...', stage: 'scraping_services', status: 'pending' },
    { label: 'Finding videos...', stage: 'scraping_videos', status: 'pending' },
    { label: 'Generating content...', stage: 'generating', status: 'pending' },
    { label: 'Building Slydes...', stage: 'complete', status: 'pending' },
  ])

  const updateStep = useCallback((stepStage: string, status: 'active' | 'complete' | 'error') => {
    setSteps((prev) =>
      prev.map((step) =>
        step.stage === stepStage ? { ...step, status } : step
      )
    )
  }, [])

  const resetSteps = useCallback(() => {
    setSteps([
      { label: 'Scraping homepage...', stage: 'scraping_homepage', status: 'pending' },
      { label: 'Analyzing services...', stage: 'scraping_services', status: 'pending' },
      { label: 'Finding videos...', stage: 'scraping_videos', status: 'pending' },
      { label: 'Generating content...', stage: 'generating', status: 'pending' },
      { label: 'Building Slydes...', stage: 'complete', status: 'pending' },
    ])
  }, [])

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Reset state
    setError(null)
    setScrapedBusiness(null)
    setGeneratedDemo(null)
    setSavedDemoId(null)
    resetSteps()
    setStage('scraping')

    try {
      // Step 1: Scrape the website
      updateStep('scraping_homepage', 'active')

      const scrapeResponse = await fetch('/api/dev/scrape-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const scrapeResult = await scrapeResponse.json()

      if (!scrapeResult.ok || !scrapeResult.data) {
        throw new Error(scrapeResult.error || 'Failed to scrape website')
      }

      updateStep('scraping_homepage', 'complete')
      updateStep('scraping_services', 'complete')
      updateStep('scraping_videos', 'complete')

      setScrapedBusiness(scrapeResult.data)

      // Step 2: Generate content with AI
      setStage('generating')
      updateStep('generating', 'active')

      const generateResponse = await fetch('/api/dev/generate-slyde-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scrapedBusiness: scrapeResult.data }),
      })

      const generateResult = await generateResponse.json()

      if (!generateResult.ok || !generateResult.data) {
        throw new Error(generateResult.error || 'Failed to generate content')
      }

      updateStep('generating', 'complete')
      updateStep('complete', 'active')

      setGeneratedDemo(generateResult.data)
      setStage('complete')
      updateStep('complete', 'complete')
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStage('error')
    }
  }

  const handleLoadDemo = () => {
    if (!generatedDemo) return

    // Read current demo to preserve some settings
    const current = readDemoHomeSlyde()

    // Write brand info
    writeDemoBrandProfile({
      businessName: generatedDemo.brand.name,
      tagline: generatedDemo.brand.tagline,
      primaryColor: '#2563EB', // Default blue for now
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

    // Show success message
    alert('Demo loaded! Check the Studio editor.')
  }

  const handleCopyShareUrl = () => {
    // For demo mode, the share URL is just the current origin with /demo
    const shareUrl = `${window.location.origin}/demo`
    navigator.clipboard.writeText(shareUrl)
    alert('Share URL copied!')
  }

  const handleSaveDemo = async () => {
    if (!generatedDemo || !scrapedBusiness) return

    setSaving(true)
    try {
      const response = await fetch('/api/dev/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scrapedBusiness,
          generatedDemo,
        }),
      })

      const result = await response.json()
      if (result.ok && result.data) {
        setSavedDemoId(result.data.id)
        alert('Demo saved to library!')
      } else {
        throw new Error(result.error || 'Failed to save demo')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert(err instanceof Error ? err.message : 'Failed to save demo')
    } finally {
      setSaving(false)
    }
  }

  const isLoading = stage === 'scraping' || stage === 'analyzing' || stage === 'generating'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Demo Generator
        </span>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-xs text-gray-600 dark:text-white/60">
          Business URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !url.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span>Analyze & Generate</span>
          </>
        )}
      </button>

      {/* Progress Steps */}
      {(isLoading || stage === 'complete') && (
        <div className="space-y-1.5 pt-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {step.status === 'pending' && (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-white/20" />
              )}
              {step.status === 'active' && (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              )}
              {step.status === 'complete' && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {step.status === 'error' && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span
                className={
                  step.status === 'active'
                    ? 'text-amber-600 dark:text-amber-400 font-medium'
                    : step.status === 'complete'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-white/40'
                }
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Preview */}
      {generatedDemo && (
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-white/10">
          <div className="text-xs font-semibold text-gray-900 dark:text-white">
            Preview
          </div>

          <div className="space-y-1.5 text-xs text-gray-600 dark:text-white/60">
            <div className="flex justify-between">
              <span>Business:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {generatedDemo.brand.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slydes:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {generatedDemo.categorySlydes.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Frames:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {generatedDemo.categorySlydes.reduce((sum, cat) => sum + cat.frames.length, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Images:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {scrapedBusiness
                  ? scrapedBusiness.heroImages.length + scrapedBusiness.galleryImages.length
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Videos:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {scrapedBusiness
                  ? scrapedBusiness.youtubeVideos.length + scrapedBusiness.vimeoVideos.length
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Quality:</span>
              <span
                className={`font-medium px-1.5 py-0.5 rounded ${
                  generatedDemo.quality === 'high'
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    : generatedDemo.quality === 'medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                }`}
              >
                {generatedDemo.quality.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quality Notes */}
          {generatedDemo.qualityNotes.length > 0 && (
            <div className="text-xs text-amber-600 dark:text-amber-400 space-y-0.5">
              {generatedDemo.qualityNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleLoadDemo}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Load
            </button>
            <button
              onClick={handleSaveDemo}
              disabled={saving || !!savedDemoId}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-500/50 text-white text-xs font-semibold transition-colors"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : savedDemoId ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleCopyShareUrl}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Library Link */}
          <Link
            href="/dev/demos"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold transition-colors"
          >
            <Library className="w-3.5 h-3.5" />
            View Demo Library
          </Link>
        </div>
      )}
    </div>
  )
}
