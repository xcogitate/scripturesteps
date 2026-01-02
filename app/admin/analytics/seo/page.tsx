"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, Users, MousePointer, Globe, Smartphone } from "lucide-react"

type SEOAnalyticsSnapshot = {
  time_range: "7d" | "30d" | "90d"
  captured_at: string
  total_visitors: number
  page_views: number
  avg_bounce_rate: number
  conversion_rate: number
  organic_traffic: number
  search_impressions: number
  avg_search_position: number
  click_through_rate: number
  top_keywords: { keyword: string; clicks: number; impressions: number; position: number }[]
  traffic_sources: {
    source: string
    visitors: number
    page_views: number
    bounce_rate: number
    avg_session_duration: number
  }[]
  top_pages: {
    path: string
    page_views: number
    unique_visitors: number
    avg_time_on_page: number
    bounce_rate: number
    exit_rate: number
  }[]
  devices: { device: string; visitors: number; percentage: number }[]
  geography: { country: string; visitors: number; percentage: number }[]
  conversions: {
    signups: number
    child_registrations: number
    completion_rate: number
    retention_rate: number
  }
}

export default function SEOAnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")
  const [sourcesPage, setSourcesPage] = useState(1)
  const [pagesPage, setPagesPage] = useState(1)
  const [snapshot, setSnapshot] = useState<SEOAnalyticsSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const isMountedRef = useRef(true)
  const itemsPerPage = 5

  const loadSnapshot = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/seo-analytics?range=${timeRange}`)
      if (!response.ok) {
        if (isMountedRef.current) setSnapshot(null)
        return
      }
      const data = (await response.json()) as SEOAnalyticsSnapshot
      if (isMountedRef.current) setSnapshot(data)
    } finally {
      if (isMountedRef.current) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSnapshot()
  }, [timeRange])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await fetch("/api/admin/seo-analytics/sync", { method: "POST" })
      await loadSnapshot()
    } finally {
      setIsSyncing(false)
    }
  }

  const trafficSources = snapshot?.traffic_sources ?? []
  const pageAnalytics = snapshot?.top_pages ?? []
  const seoMetrics = snapshot
  const conversions = snapshot?.conversions ?? null
  const devices = snapshot?.devices ?? []
  const geography = snapshot?.geography ?? []

  const totalVisitors = snapshot?.total_visitors ?? 0
  const totalPageViews = snapshot?.page_views ?? 0
  const avgBounceRate = snapshot?.avg_bounce_rate ?? 0

  const sourcesTotalPages = Math.ceil(trafficSources.length / itemsPerPage)
  const paginatedSources = trafficSources.slice((sourcesPage - 1) * itemsPerPage, sourcesPage * itemsPerPage)

  const pagesTotalPages = Math.ceil(pageAnalytics.length / itemsPerPage)
  const paginatedPages = pageAnalytics.slice((pagesPage - 1) * itemsPerPage, pagesPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">SEO & Traffic Analytics</h1>
              <p className="text-muted-foreground">Track and optimize your platform visibility</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7 Days
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              30 Days
            </Button>
            <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
              90 Days
            </Button>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>
        </div>

        {!isLoading && !snapshot && (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No analytics snapshot available for this range yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
              {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
              {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgBounceRate}%</div>
              {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversions?.completion_rate ?? 0}%</div>
              {isLoading && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Engine Performance
            </CardTitle>
            <CardDescription>Organic search visibility and keyword rankings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Organic Traffic</p>
                <p className="text-2xl font-bold">{seoMetrics?.organic_traffic?.toLocaleString() ?? "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Search Impressions</p>
                <p className="text-2xl font-bold">{seoMetrics?.search_impressions?.toLocaleString() ?? "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Position</p>
                <p className="text-2xl font-bold">{seoMetrics?.avg_search_position ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Click-Through Rate</p>
                <p className="text-2xl font-bold">{seoMetrics?.click_through_rate ?? 0}%</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Top Performing Keywords</h4>
              <div className="space-y-2">
                {seoMetrics?.top_keywords?.length ? (
                  seoMetrics.top_keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{keyword.keyword}</p>
                        <p className="text-xs text-muted-foreground">
                          Position: {keyword.position} | CTR: {keyword.impressions > 0 ? ((keyword.clicks / keyword.impressions) * 100).toFixed(1) : "0"}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{keyword.clicks} clicks</p>
                        <p className="text-xs text-muted-foreground">
                          {keyword.impressions.toLocaleString()} impressions
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No keyword data yet.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginatedSources.map((source, index) => {
                  const percentage = totalVisitors > 0 ? Math.round((source.visitors / totalVisitors) * 100) : 0
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-muted-foreground">
                          {source.visitors} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Bounce: {source.bounce_rate}%</span>
                        <span>
                          Avg. Time: {Math.floor(source.avg_session_duration / 60)}m {source.avg_session_duration % 60}s
                        </span>
                      </div>
                    </div>
                  )
                })}
                {!paginatedSources.length && <p className="text-sm text-muted-foreground">No source data yet.</p>}
              </div>

              {sourcesTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcesPage((p) => Math.max(1, p - 1))}
                    disabled={sourcesPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {sourcesPage} of {sourcesTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcesPage((p) => Math.min(sourcesTotalPages, p + 1))}
                    disabled={sourcesPage === sourcesTotalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>Most visited pages and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginatedPages.map((page, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{page.path}</span>
                      <span className="text-sm text-muted-foreground">{page.page_views} views</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <p>Unique Visitors</p>
                        <p className="font-semibold text-foreground">{page.unique_visitors}</p>
                      </div>
                      <div>
                        <p>Avg. Time</p>
                        <p className="font-semibold text-foreground">
                          {Math.floor(page.avg_time_on_page / 60)}m {page.avg_time_on_page % 60}s
                        </p>
                      </div>
                      <div>
                        <p>Bounce Rate</p>
                        <p className="font-semibold text-foreground">{page.bounce_rate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
                {!paginatedPages.length && <p className="text-sm text-muted-foreground">No page data yet.</p>}
              </div>

              {pagesTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagesPage((p) => Math.max(1, p - 1))}
                    disabled={pagesPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagesPage} of {pagesTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagesPage((p) => Math.min(pagesTotalPages, p + 1))}
                    disabled={pagesPage === pagesTotalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Breakdown
              </CardTitle>
              <CardDescription>Visitor distribution by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{device.device}</span>
                    <div className="text-right">
                      <p className="font-semibold">{device.visitors.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{device.percentage}%</p>
                    </div>
                  </div>
                ))}
                {!devices.length && <p className="text-sm text-muted-foreground">No device data yet.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Top countries by visitor count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geography.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{location.country}</span>
                    <div className="text-right">
                      <p className="font-semibold">{location.visitors.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{location.percentage}%</p>
                    </div>
                  </div>
                ))}
                {!geography.length && <p className="text-sm text-muted-foreground">No geography data yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversion and Retention</CardTitle>
            <CardDescription>User acquisition and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Signups</p>
                <p className="text-3xl font-bold">{conversions?.signups ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Child Registrations</p>
                <p className="text-3xl font-bold">{conversions?.child_registrations ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                <p className="text-3xl font-bold">{conversions?.completion_rate ?? 0}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
                <p className="text-3xl font-bold">{conversions?.retention_rate ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
