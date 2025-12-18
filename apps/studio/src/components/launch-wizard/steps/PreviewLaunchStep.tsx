'use client'

import { useState } from 'react'
import { ArrowLeft, Rocket, Loader2, ExternalLink, Copy, Check } from 'lucide-react'
import { useWizard } from '../WizardContext'
import { useOrganization } from '@/hooks/useOrganization'
import { writeDemoHomeSlyde, type DemoHomeSlyde, type DemoHomeSlydeCategory } from '@/lib/demoHomeSlyde'

export function PreviewLaunchStep() {
  const { state, actions, enabledSections } = useWizard()
  const { createOrganization, updateOrganization, organization } = useOrganization()
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchError, setLaunchError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Use org slug if available (for existing orgs), otherwise use wizard state
  const slug = organization?.slug || state.businessSetup.slug
  const businessName = organization?.name || state.businessSetup.name
  const slydeUrl = slug ? `https://${slug}.slydes.io` : ''

  const handleCopyUrl = async () => {
    if (!slydeUrl) return
    try {
      await navigator.clipboard.writeText(slydeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  const handleLaunch = async (publish: boolean) => {
    setIsLaunching(true)
    setLaunchError(null)

    try {
      // Step 1: Create organization if it doesn't exist
      let org = organization
      if (!org) {
        // Validate we have required data
        if (!state.businessSetup.name?.trim()) {
          throw new Error('Business name is required')
        }
        if (!state.businessSetup.slug?.trim()) {
          throw new Error('Business URL is required')
        }

        try {
          org = await createOrganization({
            name: state.businessSetup.name.trim(),
            slug: state.businessSetup.slug.trim().toLowerCase(),
            business_type: state.businessType || undefined,
          })
        } catch (createError) {
          // Handle specific errors
          const errorMsg = createError instanceof Error ? createError.message : 'Unknown error'
          if (errorMsg.includes('duplicate') || errorMsg.includes('unique')) {
            throw new Error('This URL is already taken. Please go back and choose a different one.')
          }
          throw new Error(`Failed to create organization: ${errorMsg}`)
        }

        if (!org) {
          throw new Error('Failed to create organization')
        }
      }

      // Step 2: Update organization with contact info and social links
      const updates: Record<string, string | null> = {}
      if (state.contactInfo.instagram) {
        updates.instagram_handle = state.contactInfo.instagram.replace('@', '')
      }
      if (state.contactInfo.tiktok) {
        updates.tiktok_handle = state.contactInfo.tiktok.replace('@', '')
      }
      if (Object.keys(updates).length > 0) {
        try {
          await updateOrganization(updates)
        } catch {
          // Non-fatal: continue even if social update fails
          console.warn('Failed to update social handles')
        }
      }

      // Step 3: Build the demo data and sync to localStorage
      const categories: DemoHomeSlydeCategory[] = enabledSections.map((section, idx) => ({
        id: section.id,
        icon: section.icon,
        name: section.name,
        description: '',
        childSlydeId: section.id,
        hasInventory: false,
      }))

      // Determine primary CTA based on contact info
      let primaryCta = { text: 'Contact Us', action: '#' }
      if (state.contactInfo.phone) {
        primaryCta = { text: 'Call Now', action: `tel:${state.contactInfo.phone.replace(/\s/g, '')}` }
      } else if (state.contactInfo.email) {
        primaryCta = { text: 'Email Us', action: `mailto:${state.contactInfo.email}` }
      }

      // Build social links
      const socialLinks: Record<string, string> = {}
      if (state.contactInfo.instagram) {
        const handle = state.contactInfo.instagram.replace('@', '')
        socialLinks.instagram = `https://instagram.com/${handle}`
      }
      if (state.contactInfo.tiktok) {
        const handle = state.contactInfo.tiktok.replace('@', '')
        socialLinks.tiktok = `https://tiktok.com/@${handle}`
      }
      if (state.contactInfo.facebook) {
        const page = state.contactInfo.facebook.replace('/', '')
        socialLinks.facebook = `https://facebook.com/${page}`
      }

      const demoData: DemoHomeSlyde = {
        backgroundType: state.heroContent.type || 'image',
        videoSrc: state.heroContent.type === 'video' ? (state.heroContent.previewUrl || '') : '',
        imageSrc: state.heroContent.type === 'image' ? (state.heroContent.previewUrl || undefined) : undefined,
        posterSrc: undefined,
        categories,
        primaryCta,
        showCategoryIcons: state.template?.homeDefaults.showCategoryIcons ?? true,
        showHearts: state.template?.homeDefaults.showHearts ?? true,
        showShare: state.template?.homeDefaults.showShare ?? true,
        showSound: state.template?.homeDefaults.showSound ?? true,
        showReviews: state.template?.homeDefaults.showReviews ?? true,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
        childFrames: {},
        childFAQs: {},
        homeFAQs: [],
        faqInbox: [],
        lists: [],
        musicEnabled: true,
        musicCustomUrl: null,
      }

      // Sync to localStorage
      writeDemoHomeSlyde(demoData)

      // Step 4: Mark wizard as complete
      actions.setComplete()

    } catch (err) {
      console.error('Launch error:', err)
      setLaunchError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Slyde is ready!
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          Preview and launch your new site
        </p>
      </div>

      {/* Preview Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#2c2c2e]">
        {/* Preview placeholder */}
        <div className="relative aspect-[9/16] max-h-[300px] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {state.heroContent.previewUrl ? (
            state.heroContent.type === 'video' ? (
              <video
                src={state.heroContent.previewUrl}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={state.heroContent.previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400 dark:text-white/30">
                Your hero content will appear here
              </p>
            </div>
          )}

          {/* Overlay with business name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white">{businessName || 'Your Business'}</h2>
            <p className="text-sm text-white/70">
              {enabledSections.length} section{enabledSections.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* URL */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {slug ? `${slug}.slydes.io` : 'your-business.slydes.io'}
            </span>
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-white/70">Summary</h3>
        <ul className="space-y-1 text-sm text-gray-500 dark:text-white/50">
          <li>Business: {businessName || 'Not set'}</li>
          <li>Type: {state.template?.name || organization?.business_type || 'General'}</li>
          <li>Sections: {enabledSections.length > 0 ? enabledSections.map(s => s.name).join(', ') : 'None selected'}</li>
          {state.contactInfo.phone && <li>Phone: {state.contactInfo.phone}</li>}
          {state.contactInfo.email && <li>Email: {state.contactInfo.email}</li>}
        </ul>
      </div>

      {/* Error message */}
      {launchError && (
        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{launchError}</p>
        </div>
      )}

      {/* Launch Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleLaunch(true)}
          disabled={isLaunching || enabledSections.length === 0}
          className="
            flex w-full items-center justify-center gap-2 rounded-xl py-4
            text-lg font-semibold transition-all
            bg-gradient-to-r from-green-500 to-emerald-500 text-white
            shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLaunching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              Launch My Slyde
            </>
          )}
        </button>

        <button
          onClick={() => handleLaunch(false)}
          disabled={isLaunching || enabledSections.length === 0}
          className="
            w-full rounded-xl border border-gray-200 bg-white py-4
            text-lg font-medium text-gray-700 transition-colors
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:hover:bg-[#3c3c3e]
          "
        >
          Keep editing before launch
        </button>
      </div>

      {/* Back button */}
      <div className="flex justify-center">
        <button
          onClick={actions.prevStep}
          disabled={isLaunching}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to edit
        </button>
      </div>
    </div>
  )
}
