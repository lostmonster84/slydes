import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { removeDomainFromVercel } from '@/lib/vercel/domains'

export async function POST(request: NextRequest) {
  try {
    const { orgId } = await request.json()

    if (!orgId) {
      return NextResponse.json(
        { error: 'Missing orgId' },
        { status: 400 }
      )
    }

    // Verify user owns this org
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: org } = await supabase
      .from('organizations')
      .select('id, custom_domain')
      .eq('id', orgId)
      .eq('owner_id', user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (!org.custom_domain) {
      return NextResponse.json({ error: 'No domain configured' }, { status: 400 })
    }

    // Remove from Vercel
    const vercelResult = await removeDomainFromVercel(org.custom_domain)

    if (!vercelResult.success) {
      console.warn('Failed to remove domain from Vercel:', vercelResult.error)
      // Continue anyway - we should still clear our database
    }

    // Clear from database
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        custom_domain: null,
        custom_domain_verified: false,
        custom_domain_verified_at: null,
      })
      .eq('id', orgId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to remove domain' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove domain error:', error)
    return NextResponse.json(
      { error: 'Failed to remove domain' },
      { status: 500 }
    )
  }
}
