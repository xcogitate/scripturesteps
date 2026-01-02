import { NextResponse } from "next/server"
import { isSupabaseServerConfigured, supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  if (!isSupabaseServerConfigured || !supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const range = (searchParams.get("range") || "30d") as "7d" | "30d" | "90d"

  const { data, error } = await supabaseServer
    .from("seo_analytics_snapshots")
    .select("*")
    .eq("time_range", range)
    .order("captured_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    const status = error.code === "42P01" ? 404 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  if (!data) {
    return NextResponse.json({ error: "No snapshot found." }, { status: 404 })
  }

  return NextResponse.json(data)
}
