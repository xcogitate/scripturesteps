import { NextResponse } from "next/server"
import { isSupabaseServerConfigured, supabaseServer } from "@/lib/supabase-server"
import { fetchVercelAnalyticsSnapshot } from "@/lib/vercel-analytics"

export const runtime = "nodejs"

const ranges: Array<"7d" | "30d" | "90d"> = ["7d", "30d", "90d"]

export async function POST() {
  if (!isSupabaseServerConfigured || !supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  try {
    const snapshots = await Promise.all(ranges.map((range) => fetchVercelAnalyticsSnapshot(range)))

    const payload = snapshots.map((snapshot, index) => ({
      time_range: ranges[index],
      total_visitors: snapshot.totalVisitors,
      page_views: snapshot.pageViews,
      avg_bounce_rate: snapshot.avgBounceRate,
      conversion_rate: snapshot.conversionRate,
      organic_traffic: snapshot.organicTraffic,
      search_impressions: snapshot.searchImpressions,
      avg_search_position: snapshot.avgSearchPosition,
      click_through_rate: snapshot.clickThroughRate,
      top_keywords: snapshot.topKeywords,
      traffic_sources: snapshot.trafficSources,
      top_pages: snapshot.topPages,
      devices: snapshot.devices,
      geography: snapshot.geography,
      conversions: snapshot.conversions,
    }))

    const { error } = await supabaseServer.from("seo_analytics_snapshots").insert(payload)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync analytics." },
      { status: 500 },
    )
  }
}
