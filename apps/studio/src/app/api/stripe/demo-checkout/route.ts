import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

interface CartItem {
  id: string
  title: string
  subtitle: string
  price: string
  price_cents: number
  quantity: number
}

interface DemoCheckoutRequest {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
}

/**
 * POST /api/stripe/demo-checkout
 *
 * Creates a Stripe Checkout session for demo/testing purposes.
 * This goes to the platform's own Stripe account (no Connect).
 * Use this for testing the checkout flow before sellers connect.
 */
export async function POST(request: NextRequest) {
  try {
    const body: DemoCheckoutRequest = await request.json()
    const { items, successUrl, cancelUrl } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create line items for Stripe Checkout
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.title,
          description: item.subtitle || undefined,
        },
        unit_amount: item.price_cents,
      },
      quantity: item.quantity,
    }))

    // Create Checkout Session (no Connect - goes to platform account)
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Demo checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
