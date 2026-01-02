"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { PenTool, Star, ArrowLeft } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { useEffect } from "react"

export default function WritingIntroPage() {
  const router = useRouter()
  const childName = SessionStore.getChildName()
  const childAge = SessionStore.getChildAge()

  useEffect(() => {
    const greetingText = `Time to Write, ${childName}! Writing helps us remember God's Word even better.`

    const utterance = new SpeechSynthesisUtterance(greetingText)

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("zira"),
      )
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice()
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice
    }

    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1.0

    const timer = setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 500)

    return () => {
      clearTimeout(timer)
      window.speechSynthesis.cancel()
    }
  }, [childName])

  const getActivityDescription = () => {
    if (childAge <= 5) {
      return "You'll trace words and tap on special words to complete the verse!"
    } else if (childAge <= 7) {
      return "You'll copy the verse and fill in some missing words!"
    } else {
      return "You'll write the full verse and share what it means to you!"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-center">
          <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center shadow-xl relative">
            <PenTool className="w-12 h-12 text-secondary-foreground" />
            <div className="absolute -top-2 -right-2">
              <Star className="w-8 h-8 text-primary fill-primary animate-pulse" />
            </div>
          </div>
        </div>

        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Time to Write, {childName}!</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Writing helps us remember God's Word even better
            </p>
          </div>

          <div className="bg-accent/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <PenTool className="w-6 h-6 text-accent" />
              <span className="font-heading text-lg font-semibold">Your Writing Activity</span>
            </div>
            <p className="text-muted-foreground">{getActivityDescription()}</p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Take your time and do your best. It's okay if it's not perfect!
            </p>
          </div>
        </Card>

        <Button size="lg" className="w-full font-heading text-xl py-7" onClick={() => router.push("/writing")}>
          Start Writing!
        </Button>
      </div>
    </div>
  )
}
