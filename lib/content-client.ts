import {
  getCachedLessonContent,
  getCachedWeekData,
  setCachedLessonContent,
  setCachedWeekData,
} from "@/lib/offline-cache"

export type WeekDataResponse = {
  week: number
  programYear: number
  month: string
  theme: string
  verse?: { text: string; reference: string }
  verseA?: { text: string; reference: string }
  verseB?: { text: string; reference: string }
}

export type LessonContentResponse = {
  week: number
  programYear: number
  theme: string
  verse: { text: string; reference: string }
  content: any
}

export const fetchWeekData = async (params: { age: number; week: number; programYear: number }) => {
  const cached = getCachedWeekData(params)
  if (typeof window !== "undefined" && cached && navigator.onLine) {
    fetch("/api/week", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setCachedWeekData(params, data as WeekDataResponse)
      })
      .catch(() => {})
    return cached
  }

  if (typeof window !== "undefined" && !navigator.onLine && cached) {
    return cached
  }

  const response = await fetch("/api/week", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    if (cached) return cached
    throw new Error("Failed to load week data.")
  }

  const data = (await response.json()) as WeekDataResponse
  setCachedWeekData(params, data)
  return data
}

export const fetchLessonContent = async (params: {
  age: number
  week: number
  programYear: number
  contentType: "explanation" | "devotional" | "prayer" | "quiz"
  verseVariant?: "A" | "B"
  sessionType?: "morning" | "evening"
  dayOfWeek?: number
}) => {
  const cached = getCachedLessonContent(params)
  if (typeof window !== "undefined" && !navigator.onLine && cached) {
    return cached
  }

  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "content", ...params }),
  })

  if (!response.ok) {
    if (cached) return cached
    throw new Error("Failed to load lesson content.")
  }

  const data = (await response.json()) as LessonContentResponse
  setCachedLessonContent(params, data)
  return data
}
