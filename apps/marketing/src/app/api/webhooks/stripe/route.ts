import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseAdmin } from '@/lib/supabaseAdmin'

// Lazy initialization - only create Stripe instance when needed
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    console.log('Stripe not configured, skipping webhook')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let supabase: ReturnType<typeof createSupabaseAdmin>
  try {
    supabase = createSupabaseAdmin()
  } catch (e) {
    console.error('Supabase admin not configured:', e)
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
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

        // Extract customer info from metadata
        const { name, company, useCase, memberType } = session.metadata || {}
        const email = session.customer_email
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('🎉 New subscriber!', {
          name,
          email,
          company,
          useCase,
          memberType,
          customerId,
          subscriptionId,
          amountPaid: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
        })

        // Update the user's profile with Stripe IDs and plan
        if (email) {
          // Determine tier from metadata or default to 'creator'
          const tier = memberType === 'pro' ? 'pro' : 'creator'

          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
              plan: tier,
              company_name: company || undefined,
            })
            .eq('email', email)

          if (updateError) {
            console.error('Failed to update profile:', updateError)
            // Don't fail the webhook - the payment succeeded
          } else {
            console.log(`✅ Profile updated for ${email} - plan: ${tier}`)
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id
        const status = subscription.status // active, past_due, canceled, etc.

        console.log('📝 Subscription updated:', { subscriptionId, status })

        // Map Stripe status to our status
        let ourStatus: 'active' | 'cancelled' | 'past_due' = 'active'
        if (status === 'canceled') ourStatus = 'cancelled'
        else if (status === 'past_due') ourStatus = 'past_due'
        else if (status === 'active') ourStatus = 'active'

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ subscription_status: ourStatus })
          .eq('stripe_subscription_id', subscriptionId)

        if (updateError) {
          console.error('Failed to update subscription status:', updateError)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        console.log('❌ Subscription cancelled:', subscriptionId)

        // Downgrade to free
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            plan: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (updateError) {
          console.error('Failed to update cancelled subscription:', updateError)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        // Could send a "payment failed" email here
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
