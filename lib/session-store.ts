import type { ChildProfile, ParentAccount } from "./types"
import { calculateAge } from "./age-calculator"
import { capWeekForPlan, getCachedPlanName } from "./subscription"

// This would connect to a backend in production
export class SessionStore {
  private static STORAGE_KEY = "bible_app_session"
  private static DEMO_KEY = "bible_app_demo"
  private static DEMO_FLAG_KEY = "bible_app_is_demo"
  private static ACTIVE_CHILD_KEY = "bible_app_active_child"
  private static PARENT_KEY = "bible_app_parent"
  private static ACTIVE_PARENT_KEY = "bible_app_active_parent"
  private static PARENT_ACCESS_KEY = "bible_app_parent_access_granted"

  static isDemo(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem(this.DEMO_FLAG_KEY) === "true"
  }

  static setDemoMode(isDemo: boolean): void {
    if (typeof window === "undefined") return
    if (isDemo) {
      localStorage.setItem(this.DEMO_FLAG_KEY, "true")
    } else {
      localStorage.removeItem(this.DEMO_FLAG_KEY)
    }
  }

  static getAllChildren(): ChildProfile[] {
    if (typeof window === "undefined") return []
    const parent = this.getCurrentParent()
    if (parent) {
      return parent.children
    }
    const storageKey = this.isDemo() ? this.DEMO_KEY : this.STORAGE_KEY
    const data = localStorage.getItem(storageKey)
    if (!data) return []

    try {
      const parsed = JSON.parse(data)
      // Handle both old single-child format and new multiple-children format
      if (Array.isArray(parsed)) {
        return parsed
      } else if (parsed.id) {
        // Old format - single child object
        return [parsed]
      }
      return []
    } catch {
      return []
    }
  }

  static setAllChildren(children: ChildProfile[]): void {
    if (typeof window === "undefined") return
    const storageKey = this.isDemo() ? this.DEMO_KEY : this.STORAGE_KEY
    localStorage.setItem(storageKey, JSON.stringify(children))
  }

  static addChild(child: ChildProfile): void {
    const parent = this.getCurrentParent()
    if (parent) {
      if (!child.programYear) child.programYear = 1
      if (!child.currentWeek) child.currentWeek = 1
      if (!child.dayOfWeek) child.dayOfWeek = 1

      parent.children.push(child)
      parent.activeChildId = child.id
      this.setCurrentParent(parent)
    } else {
      const children = this.getAllChildren()
      if (!child.programYear) child.programYear = 1
      if (!child.currentWeek) child.currentWeek = 1
      if (!child.dayOfWeek) child.dayOfWeek = 1
      children.push(child)
      this.setAllChildren(children)
      this.setActiveChildId(child.id)
    }
  }

  static getActiveChildId(): string | null {
    if (typeof window === "undefined") return null
    const parent = this.getCurrentParent()
    if (parent) {
      return parent.activeChildId
    }
    return localStorage.getItem(this.ACTIVE_CHILD_KEY)
  }

  static setActiveChildId(childId: string): void {
    if (typeof window === "undefined") return
    const parent = this.getCurrentParent()
    if (parent) {
      parent.activeChildId = childId
      this.setCurrentParent(parent)
    } else {
      localStorage.setItem(this.ACTIVE_CHILD_KEY, childId)
    }
  }

  static getCurrentChild(): ChildProfile | null {
    if (typeof window === "undefined") return null
    const children = this.getAllChildren()
    const activeId = this.getActiveChildId()

    let child: ChildProfile | null = null

    if (activeId) {
      child = children.find((c) => c.id === activeId) || null
    }

    // Return first child if no active ID set
    if (!child && children.length > 0) {
      child = children[0]
    }

    if (child) {
      child = this.syncDayOfWeekWithCalendar(child)
      this.setCurrentChild(child) // Save the synced state
    }

    return child
  }

  static setCurrentChild(child: ChildProfile): void {
    if (typeof window === "undefined") return
    const children = this.getAllChildren()
    const index = children.findIndex((c) => c.id === child.id)

    if (index >= 0) {
      // Update existing child
      children[index] = child
    } else {
      // Add new child
      children.push(child)
    }

    this.setAllChildren(children)
    const parent = this.getCurrentParent()
    if (parent) {
      parent.activeChildId = child.id
      this.setCurrentParent(parent)
    } else {
      this.setActiveChildId(child.id)
    }
  }

  static switchChild(childId: string): void {
    const parent = this.getCurrentParent()
    if (parent) {
      parent.activeChildId = childId
      this.setCurrentParent(parent)
    } else {
      this.setActiveChildId(childId)
    }
  }

  static deleteChild(childId: string): void {
    const children = this.getAllChildren()
    const filtered = children.filter((c) => c.id !== childId)
    this.setAllChildren(filtered)

    // If deleted child was active, switch to first available child
    const activeId = this.getActiveChildId()
    if (activeId === childId) {
      if (filtered.length > 0) {
        this.setActiveChildId(filtered[0].id)
      } else {
        localStorage.removeItem(this.ACTIVE_CHILD_KEY)
      }
    }
  }

  static clearDemoSession(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.DEMO_KEY)
    localStorage.removeItem(this.DEMO_FLAG_KEY)
    localStorage.removeItem(this.ACTIVE_CHILD_KEY)
    // Also clear old demo keys
    localStorage.removeItem("childName")
    localStorage.removeItem("childAge")
    localStorage.removeItem("currentWeek")
  }

  static clearSession(): void {
    if (typeof window === "undefined") return
    if (this.isDemo()) {
      this.clearDemoSession()
    } else {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.ACTIVE_CHILD_KEY)
    }
  }

  static getParentAccessGranted(): boolean {
    if (typeof window === "undefined") return false
    return sessionStorage.getItem(this.PARENT_ACCESS_KEY) === "true"
  }

  static setParentAccessGranted(value: boolean): void {
    if (typeof window === "undefined") return
    if (value) {
      sessionStorage.setItem(this.PARENT_ACCESS_KEY, "true")
    } else {
      sessionStorage.removeItem(this.PARENT_ACCESS_KEY)
    }
  }

  static getProgress(childId: string): any {
    const child = this.getAllChildren().find((c) => c.id === childId)
    if (!child) {
      return {
        versesLearned: 0,
        writingCompleted: 0,
        streakDays: 0,
        currentWeek: 1,
      }
    }

    const week = child.currentWeek || 1
    const activities = child.activities || {}
    const verseKeys = [`week:${week}:verse:A`, `week:${week}:verse:B`, `week:${week}:verse`]
    const versesLearned = verseKeys.reduce((count, key) => (activities[key] ? count + 1 : count), 0)
    const writingCompleted = child.writingSamples?.length || 0

    return {
      versesLearned,
      writingCompleted,
      streakDays: child.streak || 0,
      currentWeek: week,
    }
  }

  static getChildName(): string {
    const child = this.getCurrentChild()
    return child?.name || "Explorer"
  }

  static getChildAge(): number {
    const child = this.getCurrentChild()
    if (!child) return 5

    if (child.birthdate) {
      return calculateAge(new Date(child.birthdate))
    }

    // Fallback to stored age if birthdate is missing (for old profiles)
    return child.age || 5
  }

  static getCurrentWeek(): number {
    const child = this.getCurrentChild()
    return child?.currentWeek || 1
  }

  static updateCurrentWeek(week: number): void {
    const child = this.getCurrentChild()
    if (child) {
      const planName = getCachedPlanName()
      child.currentWeek = capWeekForPlan(week, planName)
      this.setCurrentChild(child)
    }
  }

  static getStreak(): number {
    const child = this.getCurrentChild()
    return child?.streak || 0
  }

  static updateStreak(streak: number): void {
    const child = this.getCurrentChild()
    if (child) {
      child.streak = streak
      this.setCurrentChild(child)
    }
  }

  static addWritingSample(verse: string): void {
    const child = this.getCurrentChild()
    if (child) {
      child.writingSamples = child.writingSamples || []
      child.writingSamples.push({
        verse,
        date: new Date(),
      })
      this.setCurrentChild(child)
      this.markActivityComplete(`week:${child.currentWeek || 1}:writing`)
    }
  }

  static addSpeakingAttempt(verse: string, correctWords: number, totalWords: number): void {
    const child = this.getCurrentChild()
    if (child) {
      child.speakingAttempts = child.speakingAttempts || []
      const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0
      child.speakingAttempts.push({
        verse,
        date: new Date(),
        accuracy,
        correctWords,
        totalWords,
      })
      this.setCurrentChild(child)
      this.markActivityComplete(`week:${child.currentWeek || 1}:speaking`)
    }
  }

  static getSpeakingStats(childId: string): { averageAccuracy: number; totalAttempts: number } {
    const children = this.getAllChildren()
    const child = children.find((c) => c.id === childId)

    if (!child || !child.speakingAttempts || child.speakingAttempts.length === 0) {
      return { averageAccuracy: 0, totalAttempts: 0 }
    }

    const totalAccuracy = child.speakingAttempts.reduce((sum, attempt) => sum + attempt.accuracy, 0)
    const averageAccuracy = Math.round(totalAccuracy / child.speakingAttempts.length)

    return {
      averageAccuracy,
      totalAttempts: child.speakingAttempts.length,
    }
  }

  static getLastWritingSample(): string {
    const child = this.getCurrentChild()
    if (child?.writingSamples && child.writingSamples.length > 0) {
      return child.writingSamples[child.writingSamples.length - 1].verse
    }
    return ""
  }

  static setMorningTime(time: string): void {
    if (typeof window === "undefined") return
    const child = this.getCurrentChild()
    if (child) {
      child.morningTime = time
      this.setCurrentChild(child)
    }
  }

  static setNightTime(time: string): void {
    if (typeof window === "undefined") return
    const child = this.getCurrentChild()
    if (child) {
      child.nightTime = time
      this.setCurrentChild(child)
    }
  }

  static setReminderDays(days: string[]): void {
    if (typeof window === "undefined") return
    const child = this.getCurrentChild()
    if (child) {
      child.reminderDays = days
      this.setCurrentChild(child)
    }
  }

  static updateChildProfile(updatedChild: ChildProfile): void {
    if (typeof window === "undefined") return
    if (updatedChild.birthdate) {
      updatedChild.age = calculateAge(new Date(updatedChild.birthdate)) as any
    }
    this.setCurrentChild(updatedChild)
  }

  static getMorningReminderTime(): string | undefined {
    const child = this.getCurrentChild()
    return child?.morningTime
  }

  static getNightReminderTime(): string | undefined {
    const child = this.getCurrentChild()
    return child?.nightTime
  }

  static setMorningReminderTime(time: string): void {
    this.setMorningTime(time)
  }

  static setNightReminderTime(time: string): void {
    this.setNightTime(time)
  }

  static getProgramYear(): number {
    const child = this.getCurrentChild()
    return child?.programYear || 1
  }

  static updateProgramYear(year: number): void {
    const child = this.getCurrentChild()
    if (child) {
      child.programYear = year
      this.setCurrentChild(child)
    }
  }

  static advanceToProgramYear(nextYear: number): void {
    const child = this.getCurrentChild()
    if (child) {
      child.programYear = nextYear
      child.currentWeek = 1 // Reset to week 1 of new program year
      this.setCurrentChild(child)
    }
  }

  static getDayOfWeek(): number {
    const child = this.getCurrentChild()
    return child?.dayOfWeek || 1
  }

  static updateDayOfWeek(day: number): void {
    const child = this.getCurrentChild()
    if (child) {
      child.dayOfWeek = day
      this.setCurrentChild(child)
    }
  }

  static getCurrentCalendarDay(): number {
    const today = new Date()
    const day = today.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

    // Convert to our format: 1=Monday ... 6=Saturday, 7=Sunday
    if (day === 0) return 7
    return day
  }

  static isNewWeek(lastDate: Date | undefined): boolean {
    if (!lastDate) return false

    const last = new Date(lastDate)
    const today = new Date()

    // Get day of week for both dates
    const lastDay = last.getDay()
    const todayDay = today.getDay()

    // If last activity was Friday (5) or weekend (0,6) and today is Monday (1), it's a new week
    if ((lastDay === 5 || lastDay === 6 || lastDay === 0) && todayDay === 1) {
      return true
    }

    return false
  }

  static syncDayOfWeekWithCalendar(child: ChildProfile): ChildProfile {
    const currentCalendarDay = this.getCurrentCalendarDay()
    const planName = getCachedPlanName()
    const planMaxWeeks = capWeekForPlan(Number.MAX_SAFE_INTEGER, planName)

    if (child.currentWeek > planMaxWeeks) {
      child.currentWeek = planMaxWeeks
    }

    // Check if we've moved to a new week
    if (this.isNewWeek(child.lastActivityDate)) {
      // Advance to next week in curriculum (respect plan week cap)
      if (child.currentWeek < planMaxWeeks) {
        child.currentWeek += 1
      } else {
        child.currentWeek = planMaxWeeks
      }

      // Check if we need to advance to next program year
      const programYearMaxWeeks = child.programYear === 1 ? 52 : 48
      if (child.currentWeek > programYearMaxWeeks) {
        child.programYear += 1
        child.currentWeek = 1
      }
    }

    // Always sync to current calendar day
    child.dayOfWeek = currentCalendarDay

    return child
  }

  static markActivityComplete(activityType: string): void {
    const child = this.getCurrentChild()
    if (child) {
      child.lastActivityDate = new Date()

      if (!child.activities) {
        child.activities = {}
      }

      if (!child.completedSessions) {
        child.completedSessions = []
      }

      if (!child.activities[activityType]) {
        child.activities[activityType] = true
        child.completedSessions.push(new Date().toISOString())
      }

      this.setCurrentChild(child)
    }
  }

  static getAllParents(): ParentAccount[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("bible_app_all_parents")
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  static setAllParents(parents: ParentAccount[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem("bible_app_all_parents", JSON.stringify(parents))
  }

  static getCurrentParent(): ParentAccount | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(this.PARENT_KEY)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  static setCurrentParent(parent: ParentAccount): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.PARENT_KEY, JSON.stringify(parent))

    // Update in all parents list
    const allParents = this.getAllParents()
    const index = allParents.findIndex((p) => p.id === parent.id)
    if (index >= 0) {
      allParents[index] = parent
    } else {
      allParents.push(parent)
    }
    this.setAllParents(allParents)
  }
}
