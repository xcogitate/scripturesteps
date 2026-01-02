export type AgeGroup = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ChildProfile {
  id: string
  name: string
  birthdate: Date
  age: AgeGroup
  avatar?: string
  createdAt: Date
  programYear: number // Which year of the program they're in (1, 2, 3, etc.)
  currentWeek: number // Week within the current program year (1-52 for year 1, 1-48 for year 2, etc.)
  dayOfWeek: number // Day within the current week (1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday)
  lastActivityDate?: Date // Track the last date activities were completed
  streak: number
  completedSessions: string[]
  writingSamples: WritingSample[]
  speakingAttempts: SpeakingAttempt[] // Added to track speaking progress
  bibleBookSet: number // Which set of 5 books they're learning (0-12, covers all 66 books)
  bibleBookMasteryLevel: number // How many times they've recited correctly (need 3 to master)
  bibleBookWeek?: number // Which week the current Bible books mastery applies to
  activities?: Record<string, boolean> // Track completion of various activities
  quizAttempts?: number // Track number of quiz attempts
  quizPasses?: number // Track number of successful quiz passes
  morningTime?: string
  nightTime?: string
  reminderDays?: string[]
}

export interface WritingSample {
  verse: string
  date: Date
}

export interface SpeakingAttempt {
  verse: string
  date: Date
  accuracy: number // Percentage of words matched correctly
  correctWords: number
  totalWords: number
}

export interface LearningSession {
  id: string
  childId: string
  type: "morning" | "night"
  verseId: string
  completed: boolean
  completedAt?: Date
}

export interface Progress {
  versesLearned: number
  writingCompleted: number
  streakDays: number
  badges: Badge[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export type SessionType = "morning" | "night"

export interface ParentAccount {
  id: string
  email: string
  createdAt: Date
  subscription?: {
    plan: "free" | "starter"
    status: "active" | "inactive"
  }
  children: ChildProfile[]
  activeChildId: string | null
  lastReviewPromptDate?: Date
  nextReviewPromptDate?: Date
}

export interface Review {
  id: string
  parentId: string
  parentName: string
  rating: number // 1-5 stars
  sentiment: "good" | "bad"
  feedback: string // What they like or don't like
  status: "pending" | "approved" | "rejected"
  submittedAt: string | Date
  reviewedAt?: string | Date
  reviewedBy?: string // Admin who reviewed it
}
