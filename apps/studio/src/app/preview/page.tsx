'use client'

import { DevicePreview } from '@/components/slyde-demo'
import { HomeSlydeViewer } from '@/components/home-slyde/HomeSlydeViewer'

/**
 * Preview Page - Consumer-facing preview with cart
 *
 * This renders the full Home Slyde experience as consumers would see it,
 * including shopping cart functionality.
 */
export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-[#1c1c1e] dark:via-[#232326] dark:to-[#1c1c1e] flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <DevicePreview enableTilt={false}>
          <HomeSlydeViewer useHardcodedData />
        </DevicePreview>
        <p className="mt-4 text-sm text-gray-500 dark:text-white/50 font-mono">
          Consumer Preview (with Cart)
        </p>
      </div>
    </div>
  )
}
