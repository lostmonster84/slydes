import { ScaffoldNotice } from '../_components/ScaffoldNotice'

export const dynamic = 'force-dynamic'

export default function AppDashboardPage() {
  return (
    <div className="space-y-4">
      <ScaffoldNotice title="Dashboard (App)" demoHref="/demo/hq-dashboard" />
    </div>
  )
}




