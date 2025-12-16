import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

interface OrganizationData {
  id: string
  name: string
  slug: string
  business_type: string | null
  website: string | null
  owner_email: string
  created_at: string
  slydes_count: number
  published_slydes: number
}

interface OrganizationsResponse {
  timestamp: string
  organizations: OrganizationData[]
  stats: {
    total: number
    byType: Record<string, number>
    thisMonth: number
  }
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [storedPassword, timestamp] = decoded.split('-')
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || storedPassword !== adminPassword) return false

    const tokenAge = Date.now() - parseInt(timestamp, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return tokenAge < sevenDays
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const supabase = createSupabaseAdmin()
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Get all organizations with owner info
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select(`
        id,
        name,
        slug,
        business_type,
        website,
        created_at,
        owner_id
      `)
      .order('created_at', { ascending: false })

    if (orgsError) {
      console.error('[Organizations API] Query error:', orgsError)
      throw new Error(orgsError.message || 'Failed to query organizations')
    }

    // Get owner emails from profiles
    const ownerIds = [...new Set((orgs || []).map(o => o.owner_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', ownerIds)

    const emailById = new Map<string, string>(
      (profiles || []).map(p => [p.id, p.email || 'Unknown'])
    )

    // Get slydes counts per organization
    const { data: slydes } = await supabase
      .from('slydes')
      .select('organization_id, published')

    const slydeCountByOrg = new Map<string, { total: number; published: number }>()
    for (const slyde of slydes || []) {
      const current = slydeCountByOrg.get(slyde.organization_id) || { total: 0, published: 0 }
      current.total++
      if (slyde.published) current.published++
      slydeCountByOrg.set(slyde.organization_id, current)
    }

    // Build organization data
    const organizations: OrganizationData[] = (orgs || []).map(org => {
      const slydeCounts = slydeCountByOrg.get(org.id) || { total: 0, published: 0 }
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        business_type: org.business_type,
        website: org.website,
        owner_email: emailById.get(org.owner_id) || 'Unknown',
        created_at: org.created_at,
        slydes_count: slydeCounts.total,
        published_slydes: slydeCounts.published,
      }
    })

    // Calculate stats
    const byType: Record<string, number> = {}
    let thisMonth = 0

    for (const org of organizations) {
      const type = org.business_type || 'other'
      byType[type] = (byType[type] || 0) + 1

      if (new Date(org.created_at) >= new Date(thisMonthStart)) {
        thisMonth++
      }
    }

    const response: OrganizationsResponse = {
      timestamp: now.toISOString(),
      organizations,
      stats: {
        total: organizations.length,
        byType,
        thisMonth,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Organizations API error:', error)
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as { message: unknown }).message)
    }
    return NextResponse.json(
      { error: 'Failed to fetch organizations', message: errorMessage },
      { status: 500 }
    )
  }
}
