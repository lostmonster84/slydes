import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

type Tier = 'pro' | 'enterprise'

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

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const tier = (payload as any)?.tier as Tier | undefined
  if (tier !== 'pro' && tier !== 'enterprise') {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const origin = request.headers.get('origin') || 'https://studio.slydes.io'

  // MVP pricing (monthly). Replace with Stripe Price IDs later if desired.
  const priceDataByTier: Record<Tier, { name: string; description: string; unit_amount: number }> = {
    pro: {
      name: 'Slydes Creator',
      description: 'Inventory/Listings unlocked. Unlimited Slydes. Advanced analytics.',
      unit_amount: 1900,
    },
    enterprise: {
      name: 'Slydes Commerce',
      description: 'Cart + Checkout unlocked. Everything in Creator.',
      unit_amount: 4900,
    },
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id')
    .eq('id', user.id)
    .maybeSingle()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: priceDataByTier[tier].name,
            description: priceDataByTier[tier].description,
            images: ['https://slydes.io/og-image.png'],
          },
          unit_amount: priceDataByTier[tier].unit_amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/settings/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/settings/billing?canceled=1`,
    customer_email: user.email || undefined,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    metadata: {
      memberType: tier,
      userId: user.id,
      orgId: profile?.current_organization_id || '',
      source: 'studio',
    },
  })

  return NextResponse.json({ url: session.url })
}


