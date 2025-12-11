import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: Integrate with Stripe
    // When Stripe is configured, this will:
    // 1. Create a Stripe checkout session
    // 2. Return the checkout URL
    // 3. User is redirected to Stripe to pay
    // 4. After payment, webhook updates database
    
    // For now, log the signup and return success
    console.log('Founding member signup:', { name, email, company, useCase })

    // Example Stripe integration (uncomment when ready):
    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Slydes Founding Member',
              description: 'Lifetime Pro access to Slydes',
            },
            unit_amount: 29900, // $299 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/founding-member/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/founding-member`,
      customer_email: email,
      metadata: {
        name,
        company: company || '',
        useCase,
      },
    })

    return NextResponse.json({ url: session.url })
    */

    // For demo, return success without payment
    return NextResponse.json({
      success: true,
      message: 'Founding member registered (Stripe not yet configured)',
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

