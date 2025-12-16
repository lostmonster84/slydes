'use client'

type BriefingData = {
  health: {
    overall: 'healthy' | 'degraded' | 'unhealthy'
    healthyCount: number
    warningCount: number
    errorCount: number
  }
  customers: {
    total: number
    pro: number
    creator: number
    free: number
    newToday: number
    newThisWeek: number
  }
  organizations: {
    total: number
    newThisMonth: number
    withPublishedSlydes: number
  }
  revenue: {
    mrr: number
    arr: number
  }
  waitlist: {
    total: number
    thisWeek: number
  }
  content: {
    totalSlydes: number
    publishedSlydes: number
  }
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function generateBriefing(data: BriefingData): string[] {
  const lines: string[] = []

  // Health status
  if (data.health.overall === 'healthy') {
    lines.push(`All ${data.health.healthyCount} integrations running smoothly.`)
  } else if (data.health.overall === 'degraded') {
    lines.push(`${data.health.warningCount} integration${data.health.warningCount > 1 ? 's' : ''} need${data.health.warningCount === 1 ? 's' : ''} attention, but nothing critical.`)
  } else {
    lines.push(`${data.health.errorCount} critical integration${data.health.errorCount > 1 ? 's are' : ' is'} down - check Integrations page.`)
  }

  // Customers
  if (data.customers.total === 0) {
    lines.push('No customers yet - time to get your first signup!')
  } else if (data.customers.newToday > 0) {
    lines.push(`${data.customers.newToday} new customer${data.customers.newToday > 1 ? 's' : ''} today! You now have ${data.customers.total} total.`)
  } else if (data.customers.newThisWeek > 0) {
    lines.push(`${data.customers.newThisWeek} new customer${data.customers.newThisWeek > 1 ? 's' : ''} this week. ${data.customers.total} total customers.`)
  } else {
    lines.push(`${data.customers.total} customers on the platform.`)
  }

  // Revenue
  if (data.revenue.mrr > 0) {
    lines.push(`MRR is £${data.revenue.mrr} (£${data.revenue.arr} ARR). ${data.customers.pro} Pro + ${data.customers.creator} Creator subscribers.`)
  } else if (data.customers.total > 0) {
    const freeUsers = data.customers.free
    if (freeUsers > 0) {
      lines.push(`${freeUsers} free user${freeUsers > 1 ? 's' : ''} to convert - your first paying customer is the next milestone!`)
    }
  }

  // Organizations
  if (data.organizations.total > 0) {
    if (data.organizations.newThisMonth > 0) {
      lines.push(`${data.organizations.newThisMonth} new org${data.organizations.newThisMonth > 1 ? 's' : ''} this month. ${data.organizations.withPublishedSlydes} of ${data.organizations.total} have published content.`)
    } else {
      lines.push(`${data.organizations.total} organization${data.organizations.total > 1 ? 's' : ''}, ${data.organizations.withPublishedSlydes} with published Slydes.`)
    }
  }

  // Content
  if (data.content.totalSlydes > 0) {
    const publishRate = Math.round((data.content.publishedSlydes / data.content.totalSlydes) * 100)
    lines.push(`${data.content.totalSlydes} Slydes created, ${data.content.publishedSlydes} published (${publishRate}% publish rate).`)
  }

  // Waitlist
  if (data.waitlist.total > 0) {
    if (data.waitlist.thisWeek > 0) {
      lines.push(`${data.waitlist.thisWeek} new waitlist signup${data.waitlist.thisWeek > 1 ? 's' : ''} this week. ${data.waitlist.total} total waiting.`)
    } else {
      lines.push(`${data.waitlist.total} people on the waitlist.`)
    }
  }

  return lines
}

function getNextMilestone(data: BriefingData): { label: string; progress?: string } {
  // First paying customer
  if (data.customers.pro + data.customers.creator === 0) {
    if (data.customers.free > 0) {
      return { label: 'First paying customer', progress: `${data.customers.free} free users to convert` }
    }
    return { label: 'First customer signup' }
  }

  // First £100 MRR
  if (data.revenue.mrr < 100) {
    return { label: '£100 MRR', progress: `£${data.revenue.mrr} / £100` }
  }

  // First £500 MRR
  if (data.revenue.mrr < 500) {
    return { label: '£500 MRR', progress: `£${data.revenue.mrr} / £500` }
  }

  // First £1000 MRR
  if (data.revenue.mrr < 1000) {
    return { label: '£1,000 MRR', progress: `£${data.revenue.mrr} / £1,000` }
  }

  // First £5000 MRR
  if (data.revenue.mrr < 5000) {
    return { label: '£5,000 MRR', progress: `£${data.revenue.mrr.toLocaleString()} / £5,000` }
  }

  return { label: '£10,000 MRR', progress: `£${data.revenue.mrr.toLocaleString()} / £10,000` }
}

interface SmartBriefingProps {
  data: BriefingData
}

export function SmartBriefing({ data }: SmartBriefingProps) {
  const greeting = getGreeting()
  const briefingLines = generateBriefing(data)
  const milestone = getNextMilestone(data)

  return (
    <div className="bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e] rounded-xl border border-white/10 p-6">
      {/* Greeting */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">👋</span>
        <div>
          <h2 className="text-lg font-semibold text-white">{greeting}, James</h2>
          <p className="text-sm text-[#98989d]">Here&apos;s how Slydes is doing</p>
        </div>
      </div>

      {/* Briefing Points */}
      <div className="space-y-2 mb-5">
        {briefingLines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[#636366] mt-0.5">•</span>
            <p className="text-sm text-[#d1d1d6]">{line}</p>
          </div>
        ))}
      </div>

      {/* Next Milestone */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span className="text-sm font-medium text-white">Next milestone:</span>
          <span className="text-sm text-[#98989d]">{milestone.label}</span>
          {milestone.progress && (
            <span className="text-xs text-[#636366] ml-auto">{milestone.progress}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export type { BriefingData }
