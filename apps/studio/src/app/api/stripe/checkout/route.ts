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

interface CheckoutRequest {
  items: CartItem[]
  /** The seller's Stripe Connect account ID */
  connectedAccountId: string
  /** URL to return to after successful payment */
  successUrl: string
  /** URL to return to if payment is cancelled */
  cancelUrl: string
}

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for the cart items.
 * Payment goes directly to the seller's connected account.
 * Slydes takes 0% platform fee - seller receives 100%.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, connectedAccountId, successUrl, cancelUrl } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!connectedAccountId) {
      return NextResponse.json(
        { error: 'Seller has not connected their Stripe account' },
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

    // Create Checkout Session with Connect
    // No application_fee_amount - seller receives 100%
    const session = await stripe.checkout.sessions.create(
      {
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
      {
        // Process on the connected account
        stripeAccount: connectedAccountId,
      }
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
