import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

const DNS_SETUP_PRICE = 4900 // £49.00 in pence

export async function POST(request: NextRequest) {
  const stripe = getStripe()

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const { domain, orgId, orgName } = await request.json()

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

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'DNS Setup Service',
              description: `We'll configure ${domain} to point to your Slydes. Includes support and verification.`,
            },
            unit_amount: DNS_SETUP_PRICE,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/domain?setup=success&domain=${encodeURIComponent(domain)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/domain?setup=cancelled`,
      customer_email: user.email || undefined,
      metadata: {
        type: 'dns_setup',
        orgId,
        orgName: orgName || '',
        domain,
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('DNS setup checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
