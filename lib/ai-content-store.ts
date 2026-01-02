export interface AIContent {
  id: string
  type: "devotional" | "prayer" | "explanation" | "quiz"
  verseReference: string
  verseText: string
  content: string
  generatedAt: string
  week: number
  age: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  verseVariant?: "A" | "B"
  status: "pending" | "approved" | "rejected"
  approvedAt?: string
  approvedBy?: string
}

export class AIContentStore {
  private static STORAGE_KEY = "ai_content_queue"

  static getAllContent(): AIContent[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static getPendingContent(): AIContent[] {
    return this.getAllContent().filter((item) => item.status === "pending")
  }

  static getApprovedContent(): AIContent[] {
    return this.getAllContent().filter((item) => item.status === "approved")
  }

  static addContent(content: Omit<AIContent, "id" | "generatedAt" | "status">): AIContent {
    const newContent: AIContent = {
      ...content,
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      generatedAt: new Date().toISOString(),
      status: "pending",
    }

    const allContent = this.getAllContent()
    allContent.push(newContent)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent))
    return newContent
  }

  static approveContent(id: string, adminEmail: string): void {
    const allContent = this.getAllContent()
    const item = allContent.find((c) => c.id === id)
    if (item) {
      item.status = "approved"
      item.approvedAt = new Date().toISOString()
      item.approvedBy = adminEmail
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent))
    }
  }

  static rejectContent(id: string): void {
    const allContent = this.getAllContent()
    const item = allContent.find((c) => c.id === id)
    if (item) {
      item.status = "rejected"
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent))
    }
  }

  static updateContent(id: string, updates: Partial<AIContent>): void {
    const allContent = this.getAllContent()
    const index = allContent.findIndex((c) => c.id === id)
    if (index !== -1) {
      allContent[index] = { ...allContent[index], ...updates }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent))
    }
  }

  static deleteContent(id: string): void {
    const allContent = this.getAllContent().filter((c) => c.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allContent))
  }

  static getContentForWeek(week: number, age: number, type: string): AIContent[] {
    return this.getApprovedContent().filter((item) => item.week === week && item.age === age && item.type === type)
  }
}
