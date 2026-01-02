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

  const origin = req.headers.get("origin") || "http://localhost:3000"

  const { data: settings } = await supabaseServer
    .from("parent_settings")
    .select("billing_customer_id")
    .eq("parent_id", user.id)
    .maybeSingle()

  if (!settings?.billing_customer_id) {
    return NextResponse.json({ error: "No subscription found." }, { status: 400 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: settings.billing_customer_id,
    return_url: `${origin}/settings/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
