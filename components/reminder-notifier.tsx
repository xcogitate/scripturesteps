"use client"

import { useEffect } from "react"
import { getOrCreateParentSettings } from "@/lib/parent-settings"

const MORNING_KEY = "scripturesteps_reminder_last_morning"
const EVENING_KEY = "scripturesteps_reminder_last_evening"

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getTimeKey = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

const canNotifyToday = (reminderDays: string[] | null | undefined) => {
  if (!reminderDays || reminderDays.length === 0) return true
  const today = dayNames[new Date().getDay()]
  return reminderDays.includes(today)
}

const shouldSend = (storageKey: string, targetTime: string) => {
  if (getTimeKey(new Date()) !== targetTime) return false
  const lastSent = localStorage.getItem(storageKey)
  return lastSent !== getTodayKey()
}

const markSent = (storageKey: string) => {
  localStorage.setItem(storageKey, getTodayKey())
}

const sendNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return
  if (Notification.permission !== "granted") return
  new Notification(title, { body })
}

export function ReminderNotifier() {
  useEffect(() => {
    let isActive = true
    let intervalId: number | null = null

    const setup = async () => {
      const { data, error } = await getOrCreateParentSettings()
      if (!isActive || error || !data) return

      const runCheck = () => {
        if (!canNotifyToday(data.reminder_days)) return

        if (data.reminder_morning_enabled && shouldSend(MORNING_KEY, data.reminder_morning_time)) {
          sendNotification("Time for ScriptureSteps", "Start a short morning Bible session together.")
          markSent(MORNING_KEY)
        }

        if (data.reminder_evening_enabled && shouldSend(EVENING_KEY, data.reminder_evening_time)) {
          sendNotification("Time for ScriptureSteps", "End the day with a calm reflection.")
          markSent(EVENING_KEY)
        }
      }

      runCheck()
      intervalId = window.setInterval(runCheck, 60 * 1000)
    }

    setup()

    return () => {
      isActive = false
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  return null
}
