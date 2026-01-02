"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Mic, FileText, Trophy, BookMarked } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { calculateAge } from "@/lib/age-calculator"
import { getVerseForAge } from "@/lib/bible-data"
import { getBibleBookProgress } from "@/lib/bible-books"

export default function ParentProgressPage() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null)

  useEffect(() => {
    const loadedChildren = SessionStore.getAllChildren()
    setChildren(loadedChildren)
    if (loadedChildren.length > 0) {
      setSelectedChild(loadedChildren[0])
    }
  }, [])

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No children enrolled yet</p>
          <Button className="mt-4" onClick={() => router.push("/parent-dashboard")}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const age = selectedChild.birthdate ? calculateAge(new Date(selectedChild.birthdate)) : selectedChild.age

  const verseData = getVerseForAge(
    selectedChild.currentWeek || 1,
    age,
    selectedChild.programYear || 1,
    selectedChild.dayOfWeek || 1,
  )

  const bibleBookProgress = getBibleBookProgress(selectedChild)

  // Calculate activity completion percentages
  const activities = selectedChild.activities || {}
  const totalActivities = Object.keys(activities).length
  const completedActivities = Object.values(activities).filter((completed) => completed).length
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0

  // Speaking accuracy
  const speakingAttemptsArray = selectedChild.speakingAttempts || []
  const speakingAttemptCount = speakingAttemptsArray.length
  const speakingAccuracy =
    speakingAttemptCount > 0
      ? Math.round(speakingAttemptsArray.reduce((sum, attempt) => sum + attempt.accuracy, 0) / speakingAttemptCount)
      : 0

  // Quiz performance tracking
  const quizAttempts = selectedChild.quizAttempts || 0
  const quizPasses = selectedChild.quizPasses || 0
  const quizSuccessRate = quizAttempts > 0 ? Math.round((quizPasses / quizAttempts) * 100) : 0

  const bibleBookMasteryLevel = selectedChild.bibleBookMastery || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <div className="max-w-6xl mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/parent-dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold">Progress Tracking</h1>
            <p className="text-muted-foreground">Detailed activity monitoring for all children</p>
          </div>
        </div>

        {/* Child Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {children.map((child) => (
            <Button
              key={child.id}
              variant={selectedChild.id === child.id ? "default" : "outline"}
              onClick={() => setSelectedChild(child)}
              className="flex-shrink-0"
            >
              {child.name}
            </Button>
          ))}
        </div>

        {/* Selected Child Overview */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-heading font-bold text-primary-foreground">
                {selectedChild.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold">{selectedChild.name}</h2>
              <p className="text-muted-foreground">
                Age {age} • Year {selectedChild.programYear || 1} • Week {selectedChild.currentWeek || 1}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="text-3xl font-heading font-bold text-primary">{selectedChild.streak || 0}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg">
              <div className="text-3xl font-heading font-bold text-secondary">{completionRate}%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg">
              <div className="text-3xl font-heading font-bold text-accent">
                {selectedChild.writingSamples?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Writing Samples</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="text-3xl font-heading font-bold text-primary">{speakingAccuracy}%</div>
              <p className="text-sm text-muted-foreground">Speaking Accuracy</p>
            </div>
          </div>
        </Card>

        {/* Activity Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bible Verse Progress */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h3 className="font-heading text-xl font-semibold">Bible Verse</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Verse</p>
                <p className="font-medium">{verseData?.reference || "Not started"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress This Week</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{completionRate}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Speaking Practice */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-6 h-6 text-secondary" />
              <h3 className="font-heading text-xl font-semibold">Speaking Practice</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Attempts</p>
                <p className="font-medium text-2xl">{speakingAttemptCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Accuracy</p>
                <p className="font-medium text-2xl text-secondary">{speakingAccuracy}%</p>
              </div>
            </div>
          </Card>

          {/* Writing Samples */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-accent" />
              <h3 className="font-heading text-xl font-semibold">Writing Practice</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="font-medium text-2xl">{selectedChild.writingSamples?.length || 0}</p>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  SessionStore.switchChild(selectedChild.id)
                  router.push("/writing-samples")
                }}
              >
                View Samples
              </Button>
            </div>
          </Card>

          {/* Quiz Performance */}
          {age >= 8 && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <h3 className="font-heading text-xl font-semibold">Quiz Performance</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Attempts</p>
                  <p className="font-medium text-2xl">{quizAttempts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Passed</p>
                  <p className="font-medium text-2xl text-primary">{quizPasses}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="font-medium text-lg">{quizSuccessRate}%</p>
                </div>
              </div>
            </Card>
          )}

          {/* Bible Books Progress */}
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BookMarked className="w-6 h-6 text-secondary" />
              <h3 className="font-heading text-xl font-semibold">Bible Books Recitation</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Progress</p>
                <p className="font-medium">{bibleBookProgress.currentSetLabel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mastery Level</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all"
                      style={{
                        width: `${(bibleBookMasteryLevel / bibleBookProgress.masteryGoal) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {bibleBookMasteryLevel} / {bibleBookProgress.masteryGoal}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Books</p>
                <p className="text-sm">{bibleBookProgress.books?.join(", ") || "Not started"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
