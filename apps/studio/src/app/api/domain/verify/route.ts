import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyDomainOnVercel } from '@/lib/vercel/domains'
import dns from 'dns'
import { promisify } from 'util'

const resolveCname = promisify(dns.resolveCname)

const EXPECTED_CNAME = 'cname.slydes.io'

export async function POST(request: NextRequest) {
  try {
    const { domain, orgId } = await request.json()

    if (!domain || !orgId) {
      return NextResponse.json(
        { error: 'Missing domain or orgId' },
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

    if (org.custom_domain !== domain) {
      return NextResponse.json({ error: 'Domain mismatch' }, { status: 400 })
    }

    // Check DNS CNAME record
    let verified = false
    let cnameRecords: string[] = []

    try {
      cnameRecords = await resolveCname(domain)
      // Check if any CNAME record points to our target
      verified = cnameRecords.some(
        (record) => record.toLowerCase() === EXPECTED_CNAME || record.toLowerCase() === `${EXPECTED_CNAME}.`
      )
    } catch (dnsError: unknown) {
      // DNS lookup failed - record doesn't exist yet
      const errorCode = (dnsError as NodeJS.ErrnoException)?.code
      if (errorCode === 'ENOTFOUND' || errorCode === 'ENODATA') {
        return NextResponse.json({
          verified: false,
          message: 'No CNAME record found. Please add the DNS record and try again.',
        })
      }
      throw dnsError
    }

    if (verified) {
      // Also verify on Vercel to ensure SSL cert is issued
      const vercelResult = await verifyDomainOnVercel(domain)

      if (!vercelResult.success) {
        console.warn('Vercel verification issue:', vercelResult.error)
        // Continue anyway - DNS is correct, Vercel will catch up
      }

      // Update database
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          custom_domain_verified: true,
          custom_domain_verified_at: new Date().toISOString(),
        })
        .eq('id', orgId)

      if (updateError) {
        console.error('Failed to update verification status:', updateError)
      }

      return NextResponse.json({
        verified: true,
        message: 'Domain verified successfully!',
      })
    }

    return NextResponse.json({
      verified: false,
      message: `CNAME record found but pointing to wrong target. Found: ${cnameRecords.join(', ')}. Expected: ${EXPECTED_CNAME}`,
    })
  } catch (error) {
    console.error('Domain verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
