"use client"

import { fetchLessonContent, fetchWeekData } from "@/lib/content-client"
import { markOfflineDownloadComplete } from "@/lib/offline-cache"

type OfflineDownloadParams = {
  age: number
  week: number
  programYear: number
}

export const prefetchOfflineContent = async (params: OfflineDownloadParams) => {
  const weekData = await fetchWeekData(params)
  const tasks: Promise<unknown>[] = []
  const isOlder = params.age >= 8

  if (isOlder) {
    tasks.push(
      fetchLessonContent({
        ...params,
        contentType: "explanation",
      }),
    )
    tasks.push(
      fetchLessonContent({
        ...params,
        contentType: "devotional",
      }),
    )
    tasks.push(
      fetchLessonContent({
        ...params,
        contentType: "quiz",
      }),
    )
  } else {
    ;(["A", "B"] as const).forEach((variant) => {
      tasks.push(
        fetchLessonContent({
          ...params,
          contentType: "explanation",
          verseVariant: variant,
        }),
      )
    })
  }

  for (let day = 1; day <= 7; day += 1) {
    tasks.push(
      fetchLessonContent({
        ...params,
        contentType: "prayer",
        sessionType: "evening",
        dayOfWeek: day,
      }),
    )
  }

  await Promise.allSettled(tasks)
  markOfflineDownloadComplete(params)

  return weekData
}
