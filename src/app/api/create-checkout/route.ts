import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Lazy initialization - only create Stripe instance when needed
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, company, useCase } = data

    // Validate required fields
    if (!name || !email || !useCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Check if Stripe is configured
    if (!stripe) {
      console.log('Stripe not configured, mock signup:', { name, email, company, useCase })
      return NextResponse.json({
        success: true,
        message: 'Founder registered (Stripe not yet configured)',
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Slydes Founder',
              description: 'Lifetime Pro access + 25% revenue share on referrals',
              images: ['https://slydes.io/og-image.png'], // Update with actual OG image
            },
            unit_amount: 49900, // £499 in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://slydes.io'}/founding-member/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://slydes.io'}/founding-member`,
      customer_email: email,
      metadata: {
        name,
        company: company || '',
        useCase,
        memberType: 'founder',
      },
      // Allow promotion codes if you set them up
      allow_promotion_codes: true,
      // Collect billing address for invoicing
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    
    // More specific error handling
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
