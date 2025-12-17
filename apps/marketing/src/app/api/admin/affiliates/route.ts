import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Simple auth check
function isAuthenticated(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    const decoded = Buffer.from(token, 'base64').toString()
    return decoded.startsWith(adminPassword)
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createSupabaseAdmin()

    // Get applications
    const { data: applications, error: appError } = await supabase
      .from('affiliate_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (appError) {
      console.error('Applications fetch error:', appError)
    }

    // Get active affiliates
    const { data: affiliates, error: affError } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false })

    if (affError) {
      console.error('Affiliates fetch error:', affError)
    }

    // Get referrals with affiliate info
    const { data: referrals, error: refError } = await supabase
      .from('affiliate_referrals')
      .select(`
        *,
        affiliates (
          name,
          referral_code
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (refError) {
      console.error('Referrals fetch error:', refError)
    }

    // Get payouts
    const { data: payouts, error: payError } = await supabase
      .from('affiliate_payouts')
      .select(`
        *,
        affiliates (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (payError) {
      console.error('Payouts fetch error:', payError)
    }

    // Calculate stats
    const stats = {
      totalApplications: applications?.length || 0,
      pendingApplications: applications?.filter(a => a.status === 'pending').length || 0,
      activeAffiliates: affiliates?.filter(a => a.status === 'active').length || 0,
      totalReferrals: referrals?.length || 0,
      totalConversions: referrals?.filter(r => r.status === 'converted').length || 0,
      totalEarnings: affiliates?.reduce((sum, a) => sum + (parseFloat(a.total_earnings) || 0), 0) || 0,
      pendingPayouts: affiliates?.reduce((sum, a) => sum + (parseFloat(a.pending_earnings) || 0), 0) || 0,
    }

    return NextResponse.json({
      applications: applications || [],
      affiliates: affiliates || [],
      referrals: referrals || [],
      payouts: payouts || [],
      stats,
    })
  } catch (error) {
    console.error('Admin affiliates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}

// Approve/reject application or update affiliate
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, applicationId, affiliateId, ...data } = body

    const supabase = createSupabaseAdmin()

    if (action === 'approve_application') {
      // Get application
      const { data: app, error: appError } = await supabase
        .from('affiliate_applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (appError || !app) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      // Generate referral code from name
      const baseCode = app.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6)

      // Check for uniqueness
      let referralCode = baseCode
      let counter = 1
      while (true) {
        const { data: existing } = await supabase
          .from('affiliates')
          .select('id')
          .eq('referral_code', referralCode)
          .single()

        if (!existing) break
        referralCode = `${baseCode}${counter}`
        counter++
      }

      // Create affiliate
      const { error: createError } = await supabase
        .from('affiliates')
        .insert({
          application_id: applicationId,
          email: app.email,
          name: app.name,
          referral_code: referralCode,
          instagram_handle: app.instagram_handle,
          tiktok_handle: app.tiktok_handle,
        })

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      // Update application status
      await supabase
        .from('affiliate_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId)

      return NextResponse.json({ success: true, referralCode })
    }

    if (action === 'reject_application') {
      const { error } = await supabase
        .from('affiliate_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          notes: data.notes,
        })
        .eq('id', applicationId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'delete_application') {
      const { error } = await supabase
        .from('affiliate_applications')
        .delete()
        .eq('id', applicationId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'update_affiliate') {
      const { error } = await supabase
        .from('affiliates')
        .update(data)
        .eq('id', affiliateId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'create_payout') {
      const { error } = await supabase
        .from('affiliate_payouts')
        .insert({
          affiliate_id: affiliateId,
          amount: data.amount,
          payout_email: data.payoutEmail,
        })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Update affiliate pending earnings
      await supabase
        .from('affiliates')
        .update({
          pending_earnings: 0,
          paid_earnings: supabase.rpc('increment', { x: data.amount }),
        })
        .eq('id', affiliateId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin affiliates POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
