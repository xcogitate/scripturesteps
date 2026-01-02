import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

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

const buildStats = (rows: any[]) => {
  const total = rows.length
  const approved = rows.filter((r) => r.status === "approved").length
  const pending = rows.filter((r) => r.status === "pending").length
  const rejected = rows.filter((r) => r.status === "rejected").length
  const avgRating = total ? rows.reduce((sum, r) => sum + (r.rating || 0), 0) / total : 0
  const positive = rows.filter((r) => r.sentiment === "good").length
  const sentimentRatio = total ? Math.round((positive / total) * 100) : 0
  return { total, approved, pending, rejected, avgRating: Number(avgRating.toFixed(1)), sentimentRatio }
}

export async function GET(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  let query = supabaseServer
    .from("reviews")
    .select("id,name,rating,message,status,moderated_at,moderated_by,source")
    .order("id", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 })
  }

  const rows = data || []
  return NextResponse.json({
    reviews: rows.map(mapReview),
    stats: buildStats(rows),
  })
}

export async function PATCH(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const reviewId = String(body?.reviewId || "").trim()
  const status = body?.status === "approved" || body?.status === "rejected" ? body.status : null
  const adminName = String(body?.adminName || "").trim()

  if (!reviewId || !status || !adminName) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from("reviews")
    .update({
      status,
      moderated_at: new Date().toISOString(),
      moderated_by: adminName,
    })
    .eq("id", reviewId)
    .select("id,name,rating,message,status,moderated_at,moderated_by,source")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Unable to update review." }, { status: 500 })
  }

  return NextResponse.json({ review: mapReview(data) })
}

export async function DELETE(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const reviewId = searchParams.get("reviewId")
  if (!reviewId) {
    return NextResponse.json({ error: "Missing reviewId." }, { status: 400 })
  }

  const { error } = await supabaseServer.from("reviews").delete().eq("id", reviewId)
  if (error) {
    return NextResponse.json({ error: "Unable to delete review." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
