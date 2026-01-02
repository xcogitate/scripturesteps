"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Flame, Home, BookOpen, Volume2, Mic } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"
import { useClapEffect } from "@/lib/use-clap-effect"

export default function SessionWrapPage() {
  useSpeechCancelOnExit()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionType = searchParams.get("type") || "morning"
  const childName = SessionStore.getChildName()
  const childAge = SessionStore.getChildAge()
  const playClapEffect = useClapEffect()

  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Get current streak
    const currentStreak = SessionStore.getStreak()
    const newStreak = currentStreak + 1
    setStreak(newStreak)
    SessionStore.updateStreak(newStreak)
    playClapEffect()
  }, [playClapEffect])

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const getEncouragement = () => {
    if (streak === 1) {
      return `Great job completing your first session, ${childName}! 🎉`
    } else if (streak < 7) {
      return `Wonderful work, ${childName}! You're learning God's Word! ⭐`
    } else if (streak < 30) {
      return `Amazing, ${childName}! You're building a great habit! 🌟`
    } else {
      return `Incredible, ${childName}! You're a Bible learning champion! 🏆`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center shadow-xl animate-bounce">
            <Sparkles className="w-12 h-12 text-accent-foreground" />
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Session Complete!</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{getEncouragement()}</p>
          </div>

          {/* Streak Display */}
          <div className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-destructive" />
              <span className="font-heading text-4xl font-bold text-foreground">{streak}</span>
            </div>
            <p className="text-lg font-heading text-muted-foreground">Day Streak</p>
          </div>

          {/* Progress Points */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="font-heading font-semibold text-accent">✓</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Volume2 className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Listened</p>
              <p className="font-heading font-semibold text-accent">✓</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Spoke</p>
              <p className="font-heading font-semibold text-accent">✓</p>
            </div>
          </div>
        </Card>

        {/* Next Session Hint */}
        <Card className="p-4 bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            {sessionType === "morning"
              ? "See you tonight for your bedtime session! 🌙"
              : "Great work today! See you tomorrow morning! ☀️"}
          </p>
        </Card>

        {/* CTA */}
        <Button size="lg" className="w-full font-heading text-lg" onClick={handleBackToDashboard}>
          <Home className="mr-2 w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
