"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trophy, BookOpen, PenTool, Star, Share2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ProgressPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
    }
  }, [router])

  if (!child) return null

  const progress = SessionStore.getProgress(child.id)
  const speakingStats = SessionStore.getSpeakingStats(child.id)
  const speakingAttempts = child.speakingAttempts || []
  const writingSamples = child.writingSamples || []

  const currentWeekActivities = child.activities || {}
  const completedActivities = Object.values(currentWeekActivities).filter(Boolean).length
  const totalActivities = Object.keys(currentWeekActivities).length
  const weekProgress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

  const badges = [
    {
      id: 1,
      name: "First Verse",
      emoji: "🌟",
      earned: progress.versesLearned >= 1,
    },
    {
      id: 2,
      name: "7 Day Streak",
      emoji: "🔥",
      earned: progress.streakDays >= 7,
    },
    {
      id: 3,
      name: "Writing Star",
      emoji: "✍️",
      earned: progress.writingCompleted >= 3,
    },
    {
      id: 4,
      name: "Week Complete",
      emoji: "🏆",
      earned: completedActivities >= totalActivities && totalActivities > 0,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/parent-dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-3xl">
              <Trophy className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-4xl font-bold">{child.name}'s Progress</h1>
            <p className="text-xl text-muted-foreground">Look how much you've learned!</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-lg border-2 border-primary/20">
              <CardContent className="pt-6 pb-6 text-center">
                <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-4xl font-heading font-bold text-foreground mb-1">{progress.versesLearned}</p>
                <p className="text-sm text-muted-foreground">Verses Learned</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-secondary/20">
              <CardContent className="pt-6 pb-6 text-center">
                <div className="text-4xl mx-auto mb-3">🗣️</div>
                <p className="text-4xl font-heading font-bold text-foreground mb-1">{speakingStats.averageAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Speaking Accuracy</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-accent/20">
              <CardContent className="pt-6 pb-6 text-center">
                <PenTool className="w-10 h-10 text-accent mx-auto mb-3" />
                <p className="text-4xl font-heading font-bold text-foreground mb-1">{progress.writingCompleted}</p>
                <p className="text-sm text-muted-foreground">Written</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-xl font-bold">This Week's Progress</h3>
                    <span className="text-sm font-medium text-muted-foreground">Week {child.currentWeek}</span>
                  </div>
                  <Progress value={weekProgress} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {completedActivities} out of {totalActivities} activities completed
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(currentWeekActivities).map(([activityName, isCompleted]) => (
                    <div
                      key={activityName}
                      className={`flex items-center gap-2 rounded-xl p-3 ${isCompleted ? "bg-accent/10" : "bg-muted"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCompleted ? "bg-accent" : "bg-muted-foreground/20"
                        }`}
                      >
                        <span className={`text-lg ${isCompleted ? "" : "text-muted-foreground"}`}>
                          {isCompleted ? "✓" : "○"}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? "" : "text-muted-foreground"}`}>
                        {activityName.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speaking History */}
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h3 className="font-heading text-xl font-bold mb-6">Bible Verses Recited</h3>

              {speakingAttempts.length > 0 ? (
                <div className="space-y-4">
                  {speakingAttempts
                    .slice(-5)
                    .reverse()
                    .map((attempt, index) => (
                      <div key={index} className="bg-muted/30 rounded-2xl p-6 border border-border">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1">
                            <p className="font-heading font-semibold text-lg mb-2 text-foreground">{attempt.verse}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(attempt.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div
                              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${
                                attempt.accuracy >= 70 ? "bg-accent/20" : "bg-muted"
                              }`}
                            >
                              <div className="text-center">
                                <p
                                  className={`text-2xl font-heading font-bold leading-none ${
                                    attempt.accuracy >= 70 ? "text-accent" : "text-muted-foreground"
                                  }`}
                                >
                                  {attempt.accuracy}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="text-sm text-muted-foreground">
                            {attempt.correctWords} out of {attempt.totalWords} words correct
                          </div>
                          {attempt.accuracy >= 70 && (
                            <div className="flex items-center gap-1 text-accent text-sm font-medium">
                              <Star className="w-4 h-4 fill-accent" />
                              <span>Excellent!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {speakingAttempts.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Showing 5 most recent attempts out of {speakingAttempts.length} total
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-6xl mb-4">🎤</div>
                  <p className="text-lg font-heading font-semibold mb-2">No verses recited yet</p>
                  <p className="text-sm">Complete a speaking session to see your progress here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h3 className="font-heading text-xl font-bold mb-6 text-center">Badges Earned</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`text-center p-4 rounded-2xl ${
                      badge.earned ? "bg-secondary/10 border-2 border-secondary/30" : "bg-muted/50 opacity-50"
                    }`}
                  >
                    <div className="text-5xl mb-2">{badge.earned ? badge.emoji : "🔒"}</div>
                    <p className="text-sm font-heading font-semibold">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-bold">Writing Samples</h3>
                <Button variant="ghost" size="sm" onClick={() => router.push("/writing-samples")}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {writingSamples.length > 0 ? (
                  writingSamples
                    .slice(-3)
                    .reverse()
                    .map((sample, index) => (
                      <div key={index} className="bg-muted/30 rounded-2xl p-6 border border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-heading font-semibold text-lg">{sample.verse}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(sample.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <Star className="w-5 h-5 text-secondary fill-secondary" />
                        </div>
                        <div className="bg-background rounded-xl p-4 border border-border">
                          <p className="font-handwriting text-xl text-foreground">{sample.verse}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No writing samples yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Share Progress */}
          <Card className="shadow-xl bg-gradient-to-br from-primary/10 to-accent/10 border-none">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <Trophy className="w-12 h-12 text-secondary mx-auto" />
                <h3 className="font-heading text-xl font-bold">Share Your Progress</h3>
                <p className="text-muted-foreground">Show family and friends what you've been learning!</p>
                <Button variant="secondary" size="lg" className="font-heading">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
