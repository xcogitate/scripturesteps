"use client"

import type { LessonContentResponse, WeekDataResponse } from "@/lib/content-client"

type WeekKeyParams = { age: number; week: number; programYear: number }
type ContentKeyParams = {
  age: number
  week: number
  programYear: number
  contentType: "explanation" | "devotional" | "prayer" | "quiz"
  verseVariant?: "A" | "B"
  sessionType?: "morning" | "evening"
  dayOfWeek?: number
}

const WEEK_PREFIX = "ss_offline_week"
const CONTENT_PREFIX = "ss_offline_content"
const OFFLINE_META_PREFIX = "ss_offline_meta"

const getWeekKey = (params: WeekKeyParams) =>
  `${WEEK_PREFIX}:${params.programYear}:${params.week}:${params.age}`

const getContentKey = (params: ContentKeyParams) => {
  const variant = params.verseVariant || "both"
  const session = params.sessionType || "any"
  const day = params.dayOfWeek ? String(params.dayOfWeek) : "any"
  return `${CONTENT_PREFIX}:${params.programYear}:${params.week}:${params.age}:${params.contentType}:${variant}:${session}:${day}`
}

const getOfflineMetaKey = (params: WeekKeyParams) =>
  `${OFFLINE_META_PREFIX}:${params.programYear}:${params.week}:${params.age}`

export const getCachedWeekData = (params: WeekKeyParams): WeekDataResponse | null => {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(getWeekKey(params))
  if (!raw) return null
  try {
    return JSON.parse(raw) as WeekDataResponse
  } catch {
    return null
  }
}

export const setCachedWeekData = (params: WeekKeyParams, data: WeekDataResponse) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getWeekKey(params), JSON.stringify(data))
}

export const getCachedLessonContent = (params: ContentKeyParams): LessonContentResponse | null => {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(getContentKey(params))
  if (!raw) return null
  try {
    return JSON.parse(raw) as LessonContentResponse
  } catch {
    return null
  }
}

export const setCachedLessonContent = (params: ContentKeyParams, data: LessonContentResponse) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getContentKey(params), JSON.stringify(data))
}

export const markOfflineDownloadComplete = (params: WeekKeyParams) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getOfflineMetaKey(params), new Date().toISOString())
}

export const getOfflineDownloadTimestamp = (params: WeekKeyParams) => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(getOfflineMetaKey(params))
}

export const clearOfflineCache = (params: WeekKeyParams) => {
  if (typeof window === "undefined") return
  localStorage.removeItem(getWeekKey(params))
  localStorage.removeItem(getOfflineMetaKey(params))
}
