'use client'

import { ArrowLeft, ImageIcon } from 'lucide-react'
import { useWizard } from '../WizardContext'
import { MediaUploader } from '../components/MediaUploader'

export function HeroContentStep() {
  const { state, actions, canProceed } = useWizard()
  const { heroContent, template } = state

  // Check if we had a file but lost the preview (session restore)
  const lostPreview = heroContent.type && !heroContent.previewUrl && !heroContent.file

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
          <ImageIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Show off your business
        </h1>
        <p className="mt-2 text-gray-500 dark:text-white/60">
          This is what people see first
        </p>
      </div>

      {/* Session restore warning */}
      {lostPreview && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 dark:bg-amber-500/10 dark:border-amber-500/30">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your previously selected {heroContent.type} was not saved. Please upload it again.
          </p>
        </div>
      )}

      {/* Media Uploader */}
      <MediaUploader
        onFileSelect={actions.setHeroFile}
        previewUrl={heroContent.previewUrl}
        mediaType={heroContent.type}
        onClear={actions.clearHeroContent}
        isUploading={heroContent.isUploading}
        uploadProgress={heroContent.uploadProgress}
        error={heroContent.uploadError}
      />

      {/* Tip */}
      <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Pro tip:</strong> Vertical video (9:16) works best. Think TikTok or Instagram Reels.
        </p>
      </div>

      {/* Skip option */}
      {!heroContent.previewUrl && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-white/50">
            Don&apos;t have content ready?
          </p>
          <button
            onClick={actions.nextStep}
            className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Skip for now - add later in the editor
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={actions.prevStep}
          className="
            flex items-center justify-center gap-2 rounded-xl border border-gray-200
            bg-white px-6 py-4 font-medium text-gray-700
            transition-colors hover:bg-gray-50
            dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white dark:hover:bg-[#3c3c3e]
          "
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <button
          onClick={actions.nextStep}
          disabled={!canProceed}
          className={`
            flex-1 rounded-xl py-4 text-lg font-semibold transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/10 dark:text-white/30'
            }
          `}
        >
          {heroContent.previewUrl ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}
