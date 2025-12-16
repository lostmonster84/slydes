import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addDomainToVercel } from '@/lib/vercel/domains'

export async function POST(request: NextRequest) {
  try {
    const { domain, orgId } = await request.json()

    if (!domain || !orgId) {
      return NextResponse.json(
        { error: 'Missing domain or orgId' },
        { status: 400 }
      )
    }

    // Validate domain format
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i
    if (!domainRegex.test(domain.trim())) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
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
      .select('id')
      .eq('id', orgId)
      .eq('owner_id', user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Check if domain is already used by another org
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('custom_domain', domain.toLowerCase())
      .neq('id', orgId)
      .single()

    if (existingOrg) {
      return NextResponse.json(
        { error: 'This domain is already in use by another organization' },
        { status: 400 }
      )
    }

    // Add domain to Vercel
    const vercelResult = await addDomainToVercel(domain.toLowerCase())

    if (!vercelResult.success) {
      return NextResponse.json(
        { error: vercelResult.error || 'Failed to register domain with Vercel' },
        { status: 500 }
      )
    }

    // Save to database
    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        custom_domain: domain.toLowerCase(),
        custom_domain_verified: vercelResult.verified,
        custom_domain_verified_at: vercelResult.verified ? new Date().toISOString() : null,
      })
      .eq('id', orgId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to save domain' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      domain: domain.toLowerCase(),
      verified: vercelResult.verified,
      vercelVerification: vercelResult.vercelVerification,
    })
  } catch (error) {
    console.error('Add domain error:', error)
    return NextResponse.json(
      { error: 'Failed to add domain' },
      { status: 500 }
    )
  }
}
