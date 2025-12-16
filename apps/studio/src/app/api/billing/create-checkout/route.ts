import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { PLAN_CONFIG, getStripePriceId } from '@/lib/plans'

type PaidTier = 'creator' | 'pro'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let payload: { plan?: PaidTier; annual?: boolean }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const plan = payload.plan
  const annual = payload.annual ?? false

  if (plan !== 'creator' && plan !== 'pro') {
    return NextResponse.json({ error: 'Invalid plan. Must be "creator" or "pro"' }, { status: 400 })
  }

  const origin = request.headers.get('origin') || 'https://studio.slydes.io'
  const config = PLAN_CONFIG[plan]

  // Get user's profile for org ID and potential existing Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id, stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle()

  // Try to use pre-configured Stripe Price ID, fallback to inline price
  const stripePriceId = getStripePriceId(plan, annual)

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = stripePriceId
    ? [{ price: stripePriceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Slydes ${config.label}`,
              description: config.features.slice(0, 3).join('. ') + '.',
              images: ['https://slydes.io/og-image.png'],
            },
            unit_amount: (annual ? config.annualPrice : config.monthlyPrice) * 100,
            recurring: { interval: annual ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ]

  // Create checkout session
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'subscription',
    success_url: `${origin}/settings/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/settings/billing?canceled=1`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    metadata: {
      plan,
      annual: annual ? 'true' : 'false',
      userId: user.id,
      orgId: profile?.current_organization_id || '',
      source: 'studio',
    },
  }

  // Use existing customer if available, otherwise set email
  if (profile?.stripe_customer_id) {
    sessionParams.customer = profile.stripe_customer_id
  } else {
    sessionParams.customer_email = user.email || undefined
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
