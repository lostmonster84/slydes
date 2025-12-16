import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/stripe/connect
 *
 * Creates a Stripe Connect account for the seller and returns
 * an onboarding link. The seller completes KYC on Stripe's hosted page.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { organizationId, returnUrl, refreshUrl } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }

    // Check if org already has a Stripe account
    const { data: org } = await supabase
      .from('organizations')
      .select('stripe_account_id, name')
      .eq('id', organizationId)
      .single()

    let stripeAccountId = org?.stripe_account_id

    // Create new Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express', // Express accounts are easiest - Stripe handles all KYC
        country: 'GB',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          organization_id: organizationId,
          user_id: user.id,
        },
      })

      stripeAccountId = account.id

      // Save Stripe account ID to organization
      await supabase
        .from('organizations')
        .update({ stripe_account_id: stripeAccountId })
        .eq('id', organizationId)
    }

    // Create Account Link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/payments`,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/settings/payments?connected=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url,
      accountId: stripeAccountId,
    })
  } catch (error) {
    console.error('Stripe Connect error:', error)
    return NextResponse.json(
      { error: 'Failed to create Connect account' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/stripe/connect?accountId=xxx
 *
 * Check the status of a Connect account (for dashboard display)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID required' },
        { status: 400 }
      )
    }

    const account = await stripe.accounts.retrieve(accountId)

    return NextResponse.json({
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      // If not fully onboarded, they need to complete setup
      requiresAction: !account.charges_enabled || !account.details_submitted,
    })
  } catch (error) {
    console.error('Stripe account status error:', error)
    return NextResponse.json(
      { error: 'Failed to get account status' },
      { status: 500 }
    )
  }
}
