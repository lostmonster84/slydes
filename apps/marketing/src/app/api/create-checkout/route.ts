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

    // Create Stripe checkout session for Pro subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Slydes Pro',
              description: 'Unlimited Slydes, analytics, lead capture, no branding',
              images: ['https://slydes.io/og-image.png'],
            },
            unit_amount: 1900, // $19 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://slydes.io'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://slydes.io'}/pricing`,
      customer_email: email,
      metadata: {
        name,
        company: company || '',
        useCase,
        memberType: 'pro',
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
