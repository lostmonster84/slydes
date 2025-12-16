import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { PlanTier } from '@/lib/plans'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAdmin = SupabaseClient<any, any, any>

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

/**
 * Stripe Webhook Handler
 *
 * Handles subscription lifecycle events:
 * - checkout.session.completed → New subscription, update plan
 * - customer.subscription.updated → Plan change, upgrade/downgrade
 * - customer.subscription.deleted → Cancelled, downgrade to free
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const supabase = getSupabaseAdmin()

  if (!stripe || !supabase) {
    console.error('Stripe or Supabase not configured for webhooks')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get the raw body for signature verification
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`Stripe webhook received: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(stripe, supabase, session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  supabase: SupabaseAdmin,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan as PlanTier | undefined

  if (!userId || !plan) {
    console.error('Missing userId or plan in session metadata')
    return
  }

  // Get subscription details
  const subscriptionId = session.subscription as string
  const customerId = session.customer as string

  // Fetch subscription to get status
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update user's profile
  const { error } = await supabase
    .from('profiles')
    .update({
      plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_status: subscription.status === 'active' ? 'active' : 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Failed to update profile after checkout:', error)
    throw error
  }

  console.log(`User ${userId} upgraded to ${plan}`)
}

async function handleSubscriptionUpdated(
  supabase: SupabaseAdmin,
  subscription: Stripe.Subscription
) {
  const subscriptionId = subscription.id

  // Find user by subscription ID
  const { data: profile, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()

  if (findError || !profile) {
    console.error('Could not find user for subscription:', subscriptionId)
    return
  }

  // Determine subscription status
  let status: 'active' | 'cancelled' | 'past_due' = 'active'
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    status = 'cancelled'
  } else if (subscription.status === 'past_due') {
    status = 'past_due'
  }

  // Update subscription status
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)

  if (error) {
    console.error('Failed to update subscription status:', error)
    throw error
  }

  console.log(`Subscription ${subscriptionId} status updated to ${status}`)
}

async function handleSubscriptionDeleted(
  supabase: SupabaseAdmin,
  subscription: Stripe.Subscription
) {
  const subscriptionId = subscription.id

  // Find user by subscription ID
  const { data: profile, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()

  if (findError || !profile) {
    console.error('Could not find user for cancelled subscription:', subscriptionId)
    return
  }

  // Downgrade to free
  const { error } = await supabase
    .from('profiles')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)

  if (error) {
    console.error('Failed to downgrade user after cancellation:', error)
    throw error
  }

  console.log(`User ${profile.id} downgraded to free after subscription cancellation`)
}

async function handlePaymentFailed(
  supabase: SupabaseAdmin,
  invoice: Stripe.Invoice
) {
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) return

  // Find user by subscription ID
  const { data: profile, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle()

  if (findError || !profile) {
    console.error('Could not find user for failed payment:', subscriptionId)
    return
  }

  // Mark as past due
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)

  if (error) {
    console.error('Failed to mark subscription as past_due:', error)
  }

  console.log(`User ${profile.id} payment failed, marked as past_due`)
}
