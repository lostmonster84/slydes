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
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    console.log('Stripe not configured, skipping webhook')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
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

        console.log('🎉 New founding member!', {
          name,
          email,
          company,
          useCase,
          memberType,
          amountPaid: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
        })

        // TODO: Add to your database
        // await db.foundingMembers.create({
        //   data: {
        //     name,
        //     email,
        //     company,
        //     useCase,
        //     stripeSessionId: session.id,
        //     stripeCustomerId: session.customer as string,
        //     memberNumber: await getNextMemberNumber(),
        //     paidAt: new Date(),
        //   }
        // })

        // TODO: Send welcome email
        // await sendWelcomeEmail({ name, email, memberNumber })

        // TODO: Add to Slack channel invite list
        // await addToSlackInviteList(email)

        // TODO: Create referral code for revenue share
        // await createReferralCode({ email, memberNumber })

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        // Could send a "payment failed" email
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


