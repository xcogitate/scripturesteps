import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const toDateTime = (epochSeconds?: number | null) =>
  epochSeconds ? new Date(epochSeconds * 1000).toISOString() : null

const updateSubscription = async (subscription: Stripe.Subscription) => {
  if (!supabaseServer) return
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id
  if (!customerId) return

  const price = subscription.items.data[0]?.price
  const isActive = ["active", "trialing", "past_due"].includes(subscription.status)

  await supabaseServer
    .from("parent_settings")
    .update({
      plan_name: isActive ? "Starter Plan" : "Free Plan",
      plan_status: subscription.status,
      plan_price_cents: price?.unit_amount || 0,
      plan_interval: price?.recurring?.interval || "month",
      billing_provider: "stripe",
      billing_customer_id: customerId,
      billing_subscription_id: subscription.id,
      current_period_end: toDateTime(subscription.current_period_end),
    })
    .eq("billing_customer_id", customerId)
}

const clearSubscription = async (subscription: Stripe.Subscription) => {
  if (!supabaseServer) return
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id
  if (!customerId) return

  await supabaseServer
    .from("parent_settings")
    .update({
      plan_name: "Free Plan",
      plan_status: subscription.status,
      plan_price_cents: 0,
      plan_interval: "month",
      billing_provider: "stripe",
      billing_subscription_id: null,
      current_period_end: toDateTime(subscription.current_period_end),
    })
    .eq("billing_customer_id", customerId)
}

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 500 })
  }
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  const payload = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["items.data.price"],
        })
        await updateSubscription(subscription)
      }
      break
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      await updateSubscription(subscription)
      break
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await clearSubscription(subscription)
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}
