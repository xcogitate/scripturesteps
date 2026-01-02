"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Sun, Moon, ArrowLeft } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"
import { useEffect, useState } from "react"

export default function SessionIntroPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const searchParams = useSearchParams()
  const verseParam = searchParams.get("verse") || ""
  const currentChild = SessionStore.getCurrentChild()
  const childName = currentChild?.name
  const childAge = currentChild?.age || 0
  const dayOfWeek = currentChild?.dayOfWeek || 1
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false)

  const getGreetingTime = () => {
    const hour = new Date().getHours()
    if (hour >= 18 || hour < 5) return "evening"
    if (hour >= 12) return "afternoon"
    return "morning"
  }

  const greetingTime = getGreetingTime()
  const isMorning = greetingTime === "morning"
  const isAfternoon = greetingTime === "afternoon"
  const isYoungerChild = childAge < 8

  const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const dayName = dayNames[dayOfWeek] || ""
  const verseLetter = verseParam || (dayOfWeek <= 2 ? "A" : dayOfWeek <= 4 ? "B" : "both")

  useEffect(() => {
    if (childName && !hasSpokenGreeting && typeof window !== "undefined") {
      const greeting = isMorning ? "Good Morning" : isAfternoon ? "Good Afternoon" : "Good Evening"
      const fullGreeting = `${greeting}, ${childName}!`

      const timer = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(fullGreeting)

        const voices = window.speechSynthesis.getVoices()
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.name.includes("Samantha") ||
              voice.name.includes("Google US English") ||
              (voice.lang.includes("en") && voice.name.includes("Female")),
          ) || voices.find((voice) => voice.lang.includes("en"))

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 1.0

        window.speechSynthesis.speak(utterance)
        setHasSpokenGreeting(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [childName, isMorning, isAfternoon, hasSpokenGreeting])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-center">
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl ${
              isMorning ? "bg-secondary" : "bg-primary"
            }`}
          >
            {isMorning ? (
              <Sun className="w-12 h-12 text-secondary-foreground" />
            ) : (
              <Moon className="w-12 h-12 text-primary-foreground" />
            )}
          </div>
        </div>

        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {isMorning ? "Good Morning" : isAfternoon ? "Good Afternoon" : "Good Evening"}, {childName}!
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {isMorning
                ? "Let's start your day with God's Word"
                : isAfternoon
                  ? "Let's pause for God's Word together"
                  : "Let's end your day with a special message from God"}
            </p>
          </div>

          {isYoungerChild && dayOfWeek <= 5 && (
            <div className="bg-secondary/10 rounded-xl p-4">
              <p className="text-lg font-heading font-semibold text-secondary">
                {verseLetter === "A" || verseLetter === "B" ? `Verse ${verseLetter}` : "Writing Day"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {verseLetter === "A"
                  ? "Today we're learning the first verse"
                  : verseLetter === "B"
                    ? "Today we're learning the second verse"
                    : "Today you'll write both verses you learned this week"}
              </p>
            </div>
          )}

          <div className="bg-muted/50 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg">
                {isYoungerChild && dayOfWeek === 5 ? "Time to write!" : "Today's verse is ready for you"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              {isYoungerChild && dayOfWeek === 5
                ? "You'll practice writing the verses you learned this week."
                : "We'll read together, talk about what it means, and practice saying it."}
            </p>
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full font-heading text-xl py-7"
          onClick={() => {
            const sessionType = greetingTime === "evening" ? "evening" : "morning"
            router.push(`/verse-presentation?type=${sessionType}&verse=${verseLetter}`)
          }}
        >
          Let's Begin!
        </Button>
      </div>
    </div>
  )
}
