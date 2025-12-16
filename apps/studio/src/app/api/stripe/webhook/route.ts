import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

/**
 * Create Supabase admin client lazily (at runtime, not build time)
 * Uses service role to bypass RLS
 */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/stripe/webhook
 *
 * Stripe webhook handler. Processes:
 * - checkout.session.completed → Create order in database
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break
    }

    case 'payment_intent.succeeded': {
      // Optional: Additional handling for payment success
      console.log('Payment succeeded:', event.data.object.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

/**
 * Handle checkout.session.completed
 * Creates an order record in the database
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session:', session.id)

  // Get line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  })

  // Transform line items for storage
  const items = lineItems.data.map((item) => ({
    id: item.id,
    title: item.description || 'Item',
    price: item.price?.unit_amount
      ? `£${(item.price.unit_amount / 100).toFixed(2)}`
      : '',
    price_cents: item.price?.unit_amount || 0,
    quantity: item.quantity || 1,
  }))

  // Calculate totals
  const subtotalCents = session.amount_total || 0
  const platformFeeCents = Math.round(subtotalCents * (PLATFORM_FEE_PERCENT / 100))
  const sellerPayoutCents = subtotalCents - platformFeeCents

  // Find organization by Stripe account ID
  // For demo checkout (no Connect), we need to handle differently
  const stripeAccountId = session.metadata?.connected_account_id

  let organizationId: string | null = null

  const supabaseAdmin = getSupabaseAdmin()

  if (stripeAccountId) {
    // Production: Look up org by Stripe Connect account
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('stripe_account_id', stripeAccountId)
      .single()

    organizationId = org?.id || null
  } else {
    // Demo mode: Use org from metadata or default
    organizationId = session.metadata?.organization_id || null

    // If still null, try to find by customer email pattern or use first org
    if (!organizationId) {
      console.log('No organization found for session, skipping order creation')
      return
    }
  }

  if (!organizationId) {
    console.error('Could not determine organization for checkout session:', session.id)
    return
  }

  // Create order record
  const { error } = await supabaseAdmin.from('orders').insert({
    organization_id: organizationId,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id,
    customer_email: session.customer_details?.email || session.customer_email,
    customer_name: session.customer_details?.name,
    line_items: items,
    subtotal_cents: subtotalCents,
    platform_fee_cents: platformFeeCents,
    seller_payout_cents: sellerPayoutCents,
    currency: session.currency || 'gbp',
    status: 'paid',
  })

  if (error) {
    console.error('Failed to create order:', error)
    throw error
  }

  console.log('Order created for session:', session.id)
}
