"use client"

export type PlanTier = "free" | "starter"

const PLAN_STORAGE_KEY = "scripturesteps_plan_name"
const EARLY_ACCESS_STORAGE_KEY = "scripturesteps_early_access_until"
const EARLY_ACCESS_MONTHS = 6
export const MAX_FREE_WEEKS = 8

export const getPlanTier = (planName?: string | null): PlanTier => {
  if (!planName) return "free"
  return planName.toLowerCase().includes("starter") ? "starter" : "free"
}

export const isStarterPlan = (planName?: string | null): boolean => getPlanTier(planName) === "starter"

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const cachePlanName = (planName?: string | null): void => {
  if (typeof window === "undefined") return
  if (planName) {
    localStorage.setItem(PLAN_STORAGE_KEY, planName)
  } else {
    localStorage.removeItem(PLAN_STORAGE_KEY)
  }
}

export const getCachedPlanName = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PLAN_STORAGE_KEY)
}

export const cacheEarlyAccessUntil = (createdAt?: string | null): void => {
  if (typeof window === "undefined") return
  if (!createdAt) {
    localStorage.removeItem(EARLY_ACCESS_STORAGE_KEY)
    return
  }
  const createdDate = new Date(createdAt)
  if (Number.isNaN(createdDate.getTime())) {
    localStorage.removeItem(EARLY_ACCESS_STORAGE_KEY)
    return
  }
  const until = addMonths(createdDate, EARLY_ACCESS_MONTHS)
  localStorage.setItem(EARLY_ACCESS_STORAGE_KEY, until.toISOString())
}

export const getEarlyAccessUntil = (): Date | null => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(EARLY_ACCESS_STORAGE_KEY)
  if (!stored) return null
  const parsed = new Date(stored)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

export const isEarlyAccessActive = (createdAt?: string | null): boolean => {
  const now = new Date()
  let until: Date | null = null
  if (createdAt) {
    const createdDate = new Date(createdAt)
    if (!Number.isNaN(createdDate.getTime())) {
      until = addMonths(createdDate, EARLY_ACCESS_MONTHS)
    }
  } else {
    until = getEarlyAccessUntil()
  }
  if (!until) return false
  return now < until
}

export const hasPremiumAccess = (planName?: string | null, createdAt?: string | null): boolean =>
  isStarterPlan(planName) || isEarlyAccessActive(createdAt)

export const getMaxWeeksForPlan = (planName?: string | null, createdAt?: string | null): number =>
  hasPremiumAccess(planName, createdAt) ? 52 : MAX_FREE_WEEKS

export const capWeekForPlan = (week: number, planName?: string | null, createdAt?: string | null): number =>
  Math.min(week, getMaxWeeksForPlan(planName, createdAt))
