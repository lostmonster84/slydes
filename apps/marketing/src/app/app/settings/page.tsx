import { ScaffoldNotice } from '../_components/ScaffoldNotice'

export const dynamic = 'force-dynamic'

export default function AppSettingsPage() {
  return (
    <div className="space-y-4">
      <ScaffoldNotice title="Settings (App)" demoHref="/demo/hq-settings" />
    </div>
  )
}




