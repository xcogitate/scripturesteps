export type ActivityOverrideSettings = {
  enabled: boolean
  unlockAll: boolean
  forceDayOfWeek: number | null
}

export type AdminSettings = {
  activityOverrides: ActivityOverrideSettings
}

const STORAGE_KEY = "admin_system_settings"

const defaultSettings: AdminSettings = {
  activityOverrides: {
    enabled: false,
    unlockAll: false,
    forceDayOfWeek: null,
  },
}

export const getAdminSettings = (): AdminSettings => {
  if (typeof window === "undefined") return defaultSettings
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultSettings

  try {
    const parsed = JSON.parse(raw) as Partial<AdminSettings>
    return {
      activityOverrides: {
        ...defaultSettings.activityOverrides,
        ...(parsed.activityOverrides || {}),
      },
    }
  } catch {
    return defaultSettings
  }
}

export const setAdminSettings = (settings: AdminSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
