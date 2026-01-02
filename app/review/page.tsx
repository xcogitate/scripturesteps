"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Sparkles, BookOpen, PenTool, ArrowRight, ArrowLeft } from "lucide-react"

export default function WeeklyReviewPage() {
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

  const weeklyData = {
    week: 1,
    theme: "God Loves Me",
    versesLearned: ["God is love", "God loves me first"],
    writingCompleted: 2,
    streak: 7,
    newBadge: "Week 1 Champion",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 via-accent/10 to-primary/5">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8 animate-fade-in">
          {/* Celebration Header */}
          <div className="text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-secondary-foreground" />
              </div>
              <Sparkles className="w-10 h-10 text-secondary absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div>
              <h1 className="font-heading text-5xl font-bold mb-3">Amazing Work, {child.name}!</h1>
              <p className="text-2xl text-muted-foreground">You completed Week {weeklyData.week}</p>
            </div>
          </div>

          {/* Week Summary */}
          <Card className="shadow-xl border-2 border-secondary/30">
            <CardContent className="pt-10 pb-10">
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">This Week's Theme</p>
                  <h2 className="font-heading text-3xl font-bold text-foreground">{weeklyData.theme}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/5 rounded-2xl p-6 text-center">
                    <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-heading font-bold text-foreground mb-1">
                      {weeklyData.versesLearned.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Verses Learned</p>
                  </div>

                  <div className="bg-accent/10 rounded-2xl p-6 text-center">
                    <PenTool className="w-10 h-10 text-accent mx-auto mb-3" />
                    <p className="text-3xl font-heading font-bold text-foreground mb-1">
                      {weeklyData.writingCompleted}
                    </p>
                    <p className="text-sm text-muted-foreground">Times Written</p>
                  </div>

                  <div className="bg-secondary/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl mx-auto mb-3">🔥</div>
                    <p className="text-3xl font-heading font-bold text-foreground mb-1">{weeklyData.streak}</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verses Learned */}
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h3 className="font-heading text-xl font-bold mb-6 text-center">What You Learned</h3>
              <div className="space-y-4">
                {weeklyData.versesLearned.map((verse, index) => (
                  <div key={index} className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/20">
                    <div className="text-3xl mb-3">💛</div>
                    <p className="font-heading text-xl font-bold text-foreground">{verse}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Badge */}
          <Card className="shadow-xl bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-secondary/30">
            <CardContent className="pt-10 pb-10">
              <div className="text-center space-y-6">
                <div className="text-7xl">🏆</div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">New Badge Unlocked!</p>
                  <h3 className="font-heading text-3xl font-bold text-foreground">{weeklyData.newBadge}</h3>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You wrote God's Word beautifully, {child.name}! Your writing helps Scripture stay in your heart.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <Button onClick={() => router.push("/progress")} size="lg" className="w-full text-lg py-6 font-heading">
              View Full Progress
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="w-full text-lg py-6 font-heading bg-transparent"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Next Week
            </Button>
          </div>

          {/* Encouragement */}
          <div className="bg-accent/5 rounded-2xl p-8 text-center">
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Keep going, {child.name}! Next week you'll learn even more about God's love and His Word.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
