import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

const toNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

  const mapReview = (row: any) => ({
  id: row.id,
  parentId: null,
  parentName: row.name,
  rating: row.rating,
  sentiment: null,
  feedback: row.message,
  status: row.status,
  submittedAt: row.created_at || row.submitted_at || null,
  reviewedAt: row.moderated_at,
  reviewedBy: row.moderated_by,
})

export async function GET(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || "approved"
  const minRating = toNumber(searchParams.get("minRating"), 0)
  const limit = toNumber(searchParams.get("limit"), 10)

  const { data, error } = await supabaseServer
    .from("reviews")
    .select("id,name,rating,message,status,moderated_at,moderated_by,source")
    .eq("status", status)
    .gte("rating", minRating)
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 })
  }

  return NextResponse.json({ reviews: (data || []).map(mapReview) })
}

export async function POST(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const parentName = String(body?.parentName || "").trim()
  const rating = Number(body?.rating || 0)
  const sentiment = body?.sentiment === "good" || body?.sentiment === "bad" ? body.sentiment : null
  const feedback = String(body?.feedback || "").trim()

  if (!parentName || !rating || !feedback) {
    return NextResponse.json({ error: "Missing required review fields." }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from("reviews")
    .insert({
      name: parentName,
      rating,
      message: feedback,
      status: "pending",
      source: "app",
    })
    .select("id,name,rating,message,status,moderated_at,moderated_by,source")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Unable to submit review." }, { status: 500 })
  }

  return NextResponse.json({ review: mapReview(data) }, { status: 201 })
}
