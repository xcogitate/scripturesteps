"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star } from "lucide-react"
import { SessionStore } from "@/lib/session-store"

export default function BibleBooksCompletePage() {
  const router = useRouter()
  const [currentChild, setCurrentChild] = useState(SessionStore.getCurrentChild())
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!currentChild) {
      router.push("/")
      return
    }

    setShowConfetti(true)

    // Voice encouragement
    if ("speechSynthesis" in window) {
      const mastery = currentChild.bibleBookMastery || 0
      const message =
        mastery >= 3
          ? `Amazing job, ${currentChild.name}! You've mastered these books!`
          : `Great work, ${currentChild.name}! Keep practicing!`

      const utterance = new SpeechSynthesisUtterance(message)
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("samantha"),
      )

      utterance.voice = femaleVoice || voices[0]
      utterance.rate = 0.8
      utterance.pitch = 1.1

      window.speechSynthesis.speak(utterance)
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [currentChild, router])

  const mastery = currentChild?.bibleBookMastery || 0
  const hasAdvanced = mastery === 0 // Just advanced to new set

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" />
          ))}
        </div>
      )}

      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            {hasAdvanced ? <Star className="w-12 h-12 text-primary" /> : <Trophy className="w-12 h-12 text-primary" />}
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold">{hasAdvanced ? "🎉 New Set Unlocked!" : "Well Done!"}</h1>
            <p className="text-lg text-muted-foreground">
              {hasAdvanced
                ? "You've mastered those books and unlocked the next 5!"
                : `${mastery}/3 successful recitations completed!`}
            </p>
          </div>

          <Button size="lg" onClick={() => router.push("/dashboard")} className="w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
