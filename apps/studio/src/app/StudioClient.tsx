'use client'

import { useState, useEffect } from 'react'
import { UnifiedStudioEditor } from './UnifiedStudioEditor'
import { LaunchWizard, useWizard } from '@/components/launch-wizard/LaunchWizard'
import { WizardProvider } from '@/components/launch-wizard/WizardContext'
import { useOrganization } from '@/hooks/useOrganization'
import { readDemoHomeSlyde } from '@/lib/demoHomeSlyde'

interface StudioClientProps {
  hasOrganization: boolean
}

function StudioClientInner({ hasOrganization: initialHasOrganization }: StudioClientProps) {
  const { organization, isLoading } = useOrganization()
  const [showWizard, setShowWizard] = useState<boolean | null>(null)
  const [wizardComplete, setWizardComplete] = useState(false)

  // Determine if we should show the wizard
  useEffect(() => {
    if (isLoading) return

    // If wizard was just completed, skip to editor
    if (wizardComplete) {
      setShowWizard(false)
      return
    }

    // Check if there's existing demo data (user has already set something up)
    const demoData = readDemoHomeSlyde()
    const hasContent = demoData.videoSrc || demoData.imageSrc || demoData.categories.length > 0

    // Show wizard if:
    // 1. No organization exists, OR
    // 2. Organization exists but no content has been created
    if (!organization && !hasContent) {
      setShowWizard(true)
    } else {
      setShowWizard(false)
    }
  }, [organization, isLoading, wizardComplete])

  // Loading state
  if (isLoading || showWizard === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#1c1c1e]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-white/50">Loading...</p>
        </div>
      </div>
    )
  }

  // Show wizard for new users
  if (showWizard) {
    return <WizardWrapper onComplete={() => setWizardComplete(true)} hasOrganization={!!organization} />
  }

  // Show editor for existing users
  return <UnifiedStudioEditor />
}

interface WizardWrapperProps {
  onComplete: () => void
  hasOrganization: boolean
}

function WizardWrapper({ onComplete, hasOrganization }: WizardWrapperProps) {
  return (
    <WizardProvider skipOrgSetup={hasOrganization}>
      <WizardWithCompletion onComplete={onComplete} hasOrganization={hasOrganization} />
    </WizardProvider>
  )
}

function WizardWithCompletion({ onComplete, hasOrganization }: WizardWrapperProps) {
  const { state } = useWizard()

  // Watch for wizard completion
  useEffect(() => {
    if (state.isComplete) {
      onComplete()
    }
  }, [state.isComplete, onComplete])

  return <LaunchWizardInnerComponent skipOrgSetup={hasOrganization} />
}

// Inline the wizard inner component to avoid circular deps
function LaunchWizardInnerComponent({ skipOrgSetup = false }: { skipOrgSetup?: boolean }) {
  const { state } = useWizard()

  // Dynamically import step components
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <BusinessSetupStepLazy />
      case 2:
        return <BusinessTypeStepLazy />
      case 3:
        return <HeroContentStepLazy />
      case 4:
        return <SectionsStepLazy />
      case 5:
        return <ContactInfoStepLazy />
      case 6:
        return <PreviewLaunchStepLazy />
      default:
        return <BusinessSetupStepLazy />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#1c1c1e]">
      {/* Progress indicator */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#1c1c1e]/80">
        <WizardProgressComponent skipStep1={skipOrgSetup} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  )
}

// Lazy load step components
import { BusinessSetupStep as BusinessSetupStepLazy } from '@/components/launch-wizard/steps/BusinessSetupStep'
import { BusinessTypeStep as BusinessTypeStepLazy } from '@/components/launch-wizard/steps/BusinessTypeStep'
import { HeroContentStep as HeroContentStepLazy } from '@/components/launch-wizard/steps/HeroContentStep'
import { SectionsStep as SectionsStepLazy } from '@/components/launch-wizard/steps/SectionsStep'
import { ContactInfoStep as ContactInfoStepLazy } from '@/components/launch-wizard/steps/ContactInfoStep'
import { PreviewLaunchStep as PreviewLaunchStepLazy } from '@/components/launch-wizard/steps/PreviewLaunchStep'
import { WizardProgress as WizardProgressComponent } from '@/components/launch-wizard/WizardProgress'

export function StudioClient(props: StudioClientProps) {
  return <StudioClientInner {...props} />
}
