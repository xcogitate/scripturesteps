import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const getUserFromRequest = async (req: Request) => {
  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token || !supabaseUrl || !supabaseAnonKey) return null

  const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 })
  }
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { priceId } = (await req.json().catch(() => ({}))) as { priceId?: string }
  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId." }, { status: 400 })
  }

  const origin = req.headers.get("origin") || "http://localhost:3000"

  await supabaseServer
    .from("profiles")
    .upsert({ id: user.id, full_name: user.user_metadata?.full_name || "", email: user.email || "" }, { onConflict: "id" })

  const { data: settings } = await supabaseServer
    .from("parent_settings")
    .select("*")
    .eq("parent_id", user.id)
    .maybeSingle()

  let customerId = settings?.billing_customer_id || null
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabaseServer
      .from("parent_settings")
      .upsert({ parent_id: user.id, billing_customer_id: customerId }, { onConflict: "parent_id" })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/settings/billing?success=1`,
    cancel_url: `${origin}/settings/billing?canceled=1`,
    metadata: { supabase_user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
