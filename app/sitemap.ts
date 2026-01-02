import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bibletimeforkids.com"

  // Core pages
  const routes = ["", "/auth", "/about", "/features", "/pricing", "/blog", "/resources", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // SEO landing pages for high-volume keywords
  const seoPages = [
    "/bible-verses-for-kids",
    "/bible-quiz-for-kids",
    "/kids-bible-study",
    "/childrens-church-activities",
    "/bible-memory-games",
    "/sunday-school-games",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Regional pages
  const regionalPages = ["/ng", "/ph", "/ph/tl"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...routes, ...seoPages, ...regionalPages]
}
