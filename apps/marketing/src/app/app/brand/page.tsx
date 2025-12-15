import { ScaffoldNotice } from '../_components/ScaffoldNotice'

export const dynamic = 'force-dynamic'

export default function AppBrandPage() {
  return (
    <div className="space-y-4">
      <ScaffoldNotice title="Brand (App)" demoHref="/demo/hq-brand" />
    </div>
  )
}


