'use client'

import { WizardProvider, useWizard } from './WizardContext'
import { WizardProgress } from './WizardProgress'
import { BusinessSetupStep } from './steps/BusinessSetupStep'
import { BusinessTypeStep } from './steps/BusinessTypeStep'
import { HeroContentStep } from './steps/HeroContentStep'
import { SectionsStep } from './steps/SectionsStep'
import { ContactInfoStep } from './steps/ContactInfoStep'
import { PreviewLaunchStep } from './steps/PreviewLaunchStep'

interface LaunchWizardInnerProps {
  skipOrgSetup?: boolean
}

function LaunchWizardInner({ skipOrgSetup = false }: LaunchWizardInnerProps) {
  const { state } = useWizard()

  // Render current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <BusinessSetupStep />
      case 2:
        return <BusinessTypeStep />
      case 3:
        return <HeroContentStep />
      case 4:
        return <SectionsStep />
      case 5:
        return <ContactInfoStep />
      case 6:
        return <PreviewLaunchStep />
      default:
        return <BusinessSetupStep />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-[#1c1c1e]">
      {/* Progress indicator */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#1c1c1e]/80">
        <WizardProgress skipStep1={skipOrgSetup} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  )
}

interface LaunchWizardProps {
  skipOrgSetup?: boolean
  onComplete?: () => void
}

export function LaunchWizard({ skipOrgSetup = false, onComplete }: LaunchWizardProps) {
  return (
    <WizardProvider skipOrgSetup={skipOrgSetup}>
      <LaunchWizardInner skipOrgSetup={skipOrgSetup} />
    </WizardProvider>
  )
}

// Export hook for external use
export { useWizard } from './WizardContext'
