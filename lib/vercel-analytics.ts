type TimeRange = "7d" | "30d" | "90d"

const API_BASE = process.env.VERCEL_ANALYTICS_API_BASE || "https://api.vercel.com/v1/analytics"
const API_TOKEN = process.env.VERCEL_API_TOKEN
const PROJECT_ID = process.env.VERCEL_PROJECT_ID
const TEAM_ID = process.env.VERCEL_TEAM_ID

type VercelSummary = Record<string, unknown>

const getNumber = (value: unknown, fallback = 0) => (typeof value === "number" ? value : fallback)

const getString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback)

const pick = <T>(obj: Record<string, unknown>, keys: string[], fallback: T) => {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key] as T
    }
  }
  return fallback
}

const buildParams = (range: TimeRange) => {
  const to = new Date()
  const from = new Date(to)
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  from.setDate(from.getDate() - days)

  const params = new URLSearchParams({
    projectId: PROJECT_ID || "",
    from: from.toISOString(),
    to: to.toISOString(),
  })

  if (TEAM_ID) {
    params.set("teamId", TEAM_ID)
  }

  return params.toString()
}

const fetchJson = async (path: string, range: TimeRange) => {
  if (!API_TOKEN || !PROJECT_ID) {
    throw new Error("Vercel analytics env vars are not configured.")
  }
  const url = `${API_BASE}${path}?${buildParams(range)}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const message = await response.text().catch(() => "")
    throw new Error(message || `Vercel analytics request failed (${response.status})`)
  }

  return response.json()
}

export type AnalyticsSnapshot = {
  totalVisitors: number
  pageViews: number
  avgBounceRate: number
  conversionRate: number
  organicTraffic: number
  searchImpressions: number
  avgSearchPosition: number
  clickThroughRate: number
  topKeywords: { keyword: string; clicks: number; impressions: number; position: number }[]
  trafficSources: { source: string; visitors: number; page_views: number; bounce_rate: number; avg_session_duration: number }[]
  topPages: { path: string; page_views: number; unique_visitors: number; avg_time_on_page: number; bounce_rate: number; exit_rate: number }[]
  devices: { device: string; visitors: number; percentage: number }[]
  geography: { country: string; visitors: number; percentage: number }[]
  conversions: { signups: number; child_registrations: number; completion_rate: number; retention_rate: number }
}

export const fetchVercelAnalyticsSnapshot = async (range: TimeRange): Promise<AnalyticsSnapshot> => {
  const summary = (await fetchJson("/summary", range)) as VercelSummary
  const sources = (await fetchJson("/sources", range)) as { source?: string; visitors?: number; pageViews?: number; bounceRate?: number; avgSessionDuration?: number }[]
  const pages = (await fetchJson("/pages", range)) as { path?: string; views?: number; visitors?: number; avgDuration?: number; bounceRate?: number; exitRate?: number }[]
  const devices = (await fetchJson("/devices", range)) as { device?: string; visitors?: number; percentage?: number }[]
  const countries = (await fetchJson("/countries", range)) as { country?: string; visitors?: number; percentage?: number }[]
  const searches = (await fetchJson("/search", range)) as { keyword?: string; clicks?: number; impressions?: number; position?: number }[]

  const totalVisitors = getNumber(pick(summary, ["visitors", "totalVisitors", "total_visitors"], 0))
  const pageViews = getNumber(pick(summary, ["pageViews", "page_views"], 0))
  const avgBounceRate = getNumber(pick(summary, ["bounceRate", "avgBounceRate", "avg_bounce_rate"], 0))
  const conversionRate = getNumber(pick(summary, ["conversionRate", "conversion_rate"], 0))
  const organicTraffic = getNumber(pick(summary, ["organicTraffic", "organic_traffic"], 0))
  const searchImpressions = getNumber(pick(summary, ["searchImpressions", "search_impressions"], 0))
  const avgSearchPosition = getNumber(pick(summary, ["avgSearchPosition", "avg_search_position"], 0))
  const clickThroughRate = getNumber(pick(summary, ["clickThroughRate", "click_through_rate"], 0))

  return {
    totalVisitors,
    pageViews,
    avgBounceRate,
    conversionRate,
    organicTraffic,
    searchImpressions,
    avgSearchPosition,
    clickThroughRate,
    topKeywords: (searches || []).map((item) => ({
      keyword: getString(item.keyword),
      clicks: getNumber(item.clicks),
      impressions: getNumber(item.impressions),
      position: getNumber(item.position),
    })),
    trafficSources: (sources || []).map((item) => ({
      source: getString(item.source),
      visitors: getNumber(item.visitors),
      page_views: getNumber(item.pageViews),
      bounce_rate: getNumber(item.bounceRate),
      avg_session_duration: getNumber(item.avgSessionDuration),
    })),
    topPages: (pages || []).map((item) => ({
      path: getString(item.path),
      page_views: getNumber(item.views),
      unique_visitors: getNumber(item.visitors),
      avg_time_on_page: getNumber(item.avgDuration),
      bounce_rate: getNumber(item.bounceRate),
      exit_rate: getNumber(item.exitRate),
    })),
    devices: (devices || []).map((item) => ({
      device: getString(item.device),
      visitors: getNumber(item.visitors),
      percentage: getNumber(item.percentage),
    })),
    geography: (countries || []).map((item) => ({
      country: getString(item.country),
      visitors: getNumber(item.visitors),
      percentage: getNumber(item.percentage),
    })),
    conversions: {
      signups: getNumber(pick(summary, ["signups"], 0)),
      child_registrations: getNumber(pick(summary, ["childRegistrations", "child_registrations"], 0)),
      completion_rate: getNumber(pick(summary, ["completionRate", "completion_rate"], 0)),
      retention_rate: getNumber(pick(summary, ["retentionRate", "retention_rate"], 0)),
    },
  }
}
