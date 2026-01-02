export interface TrafficSource {
  source: string
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
}

export interface PageAnalytics {
  path: string
  pageViews: number
  uniqueVisitors: number
  avgTimeOnPage: number
  bounceRate: number
  exitRate: number
}

export interface ConversionMetrics {
  signups: number
  childRegistrations: number
  completionRate: number
  retentionRate: number
}

export interface SEOMetrics {
  organicTraffic: number
  searchImpressions: number
  avgSearchPosition: number
  clickThroughRate: number
  topKeywords: { keyword: string; clicks: number; impressions: number; position: number }[]
}

export interface DeviceBreakdown {
  device: string
  visitors: number
  percentage: number
}

export interface GeographicData {
  country: string
  visitors: number
  percentage: number
}

export const SEOAnalyticsStore = {
  getTrafficSources(): TrafficSource[] {
    const stored = localStorage.getItem("seo_traffic_sources")
    if (stored) return JSON.parse(stored)

    // Demo data
    return [
      { source: "Organic Search", visitors: 1250, pageViews: 3200, bounceRate: 42, avgSessionDuration: 180 },
      { source: "Direct", visitors: 850, pageViews: 2100, bounceRate: 35, avgSessionDuration: 240 },
      { source: "Social Media", visitors: 620, pageViews: 1500, bounceRate: 55, avgSessionDuration: 120 },
      { source: "Referral", visitors: 340, pageViews: 890, bounceRate: 48, avgSessionDuration: 150 },
      { source: "Email", visitors: 180, pageViews: 520, bounceRate: 28, avgSessionDuration: 300 },
    ]
  },

  getPageAnalytics(): PageAnalytics[] {
    const stored = localStorage.getItem("seo_page_analytics")
    if (stored) return JSON.parse(stored)

    return [
      { path: "/", pageViews: 4200, uniqueVisitors: 2800, avgTimeOnPage: 45, bounceRate: 38, exitRate: 22 },
      {
        path: "/parent-dashboard",
        pageViews: 3100,
        uniqueVisitors: 1500,
        avgTimeOnPage: 180,
        bounceRate: 25,
        exitRate: 15,
      },
      { path: "/dashboard", pageViews: 2800, uniqueVisitors: 1200, avgTimeOnPage: 420, bounceRate: 12, exitRate: 8 },
      { path: "/confirmation", pageViews: 1200, uniqueVisitors: 1100, avgTimeOnPage: 90, bounceRate: 5, exitRate: 45 },
      { path: "/settings", pageViews: 890, uniqueVisitors: 650, avgTimeOnPage: 240, bounceRate: 18, exitRate: 28 },
    ]
  },

  getSEOMetrics(): SEOMetrics {
    const stored = localStorage.getItem("seo_metrics")
    if (stored) return JSON.parse(stored)

    return {
      organicTraffic: 1250,
      searchImpressions: 45000,
      avgSearchPosition: 8.5,
      clickThroughRate: 2.8,
      topKeywords: [
        { keyword: "bible verses for kids", clicks: 420, impressions: 12000, position: 5.2 },
        { keyword: "children bible learning", clicks: 320, impressions: 9500, position: 6.8 },
        { keyword: "kids devotional app", clicks: 280, impressions: 8200, position: 7.1 },
        { keyword: "bible memorization children", clicks: 230, impressions: 6800, position: 8.9 },
      ],
    }
  },

  getConversionMetrics(): ConversionMetrics {
    const stored = localStorage.getItem("seo_conversions")
    if (stored) return JSON.parse(stored)

    return {
      signups: 342,
      childRegistrations: 486,
      completionRate: 68,
      retentionRate: 72,
    }
  },

  getDeviceBreakdown(): DeviceBreakdown[] {
    const stored = localStorage.getItem("seo_devices")
    if (stored) return JSON.parse(stored)

    return [
      { device: "Mobile", visitors: 1680, percentage: 52 },
      { device: "Desktop", visitors: 1120, percentage: 35 },
      { device: "Tablet", visitors: 420, percentage: 13 },
    ]
  },

  getGeographicData(): GeographicData[] {
    const stored = localStorage.getItem("seo_geography")
    if (stored) return JSON.parse(stored)

    return [
      { country: "United States", visitors: 1850, percentage: 58 },
      { country: "United Kingdom", visitors: 520, percentage: 16 },
      { country: "Canada", visitors: 380, percentage: 12 },
      { country: "Australia", visitors: 280, percentage: 9 },
      { country: "Others", visitors: 170, percentage: 5 },
    ]
  },
}
