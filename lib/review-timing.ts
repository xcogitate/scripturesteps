import { SessionStore } from "./session-store"

export class ReviewTiming {
  // Check if we should show the review modal
  static shouldShowReviewModal(): boolean {
    if (typeof window === "undefined") return false

    const parent = SessionStore.getCurrentParent()
    if (!parent) return false

    const now = new Date()
    const createdAt = new Date(parent.createdAt)
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceCreation >= 30) {
      return false
    }

    // Check if next prompt date is set and hasn't arrived yet
    if (parent.nextReviewPromptDate) {
      const nextPrompt = new Date(parent.nextReviewPromptDate)
      if (now < nextPrompt) {
        return false
      }
    }

    // First prompt: After 2 weeks (14 days)
    if (daysSinceCreation >= 14 && !parent.lastReviewPromptDate) {
      return true
    }

    // If we have a last review date, check if enough time has passed for next prompt
    if (parent.lastReviewPromptDate) {
      const lastPrompt = new Date(parent.lastReviewPromptDate)
      const daysSinceLastPrompt = Math.floor((now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24))

      // Second prompt: 2 weeks after the first, within the first 30 days
      if (daysSinceCreation < 30 && daysSinceLastPrompt >= 14) {
        return true
      }
    }

    return false
  }

  // Mark that we've shown the modal (user dismissed without completing)
  static markModalShown(): void {
    const parent = SessionStore.getCurrentParent()
    if (!parent) return

    const createdAt = new Date(parent.createdAt)
    const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCreation < 30) {
      parent.nextReviewPromptDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    } else {
      parent.nextReviewPromptDate = undefined
    }
    SessionStore.setCurrentParent(parent)
  }
}
