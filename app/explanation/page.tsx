"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Lightbulb, ArrowRight, ArrowLeft, Volume2 } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { useEffect, useState, useCallback } from "react"
import { fetchLessonContent } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"

export default function ExplanationPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const searchParams = useSearchParams()
  const sessionType = searchParams.get("type") || "morning"
  const verseParam = searchParams.get("verse") || "A"
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [verseData, setVerseData] = useState<{ text: string; reference: string } | null>(null)
  const [explanation, setExplanation] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null)

  const childAge = currentChild?.age
  const childName = currentChild?.name
  const weekNumber = currentChild?.currentWeek
  const dayOfWeek = currentChild?.dayOfWeek || 1
  const programYear = currentChild?.programYear || 1

  useEffect(() => {
    setIsMounted(true)
    const child = SessionStore.getCurrentChild()
    if (!child) {
      router.push("/dashboard")
      return
    }
    setCurrentChild(child)
  }, [router])

  useEffect(() => {
    if (!childAge || !weekNumber) return
    const loadExplanation = async () => {
      try {
        const data = await fetchLessonContent({
          age: childAge,
          week: weekNumber,
          programYear,
          contentType: "explanation",
          verseVariant: verseParam === "B" ? "B" : "A",
        })
        const text = data.content?.explanation || ""
        const personalized = childName ? text.replace(/\{childName\}/g, childName) : text
        setVerseData(data.verse)
        setExplanation(personalized)
      } catch {
        setVerseData(null)
        setExplanation("")
      }
    }
    loadExplanation()
  }, [childAge, weekNumber, programYear, verseParam, childName])

  const reference = verseData?.reference || "Scripture"

  const speakExplanation = useCallback(() => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(explanation)

      // Get available voices and select a kid-friendly female voice
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Woman") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Karen") ||
          voice.name.includes("Google UK English Female"),
      )

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.rate = 0.8 // Slightly slower for clarity
      utterance.pitch = 1.1 // Slightly higher for warmth
      utterance.volume = 1.0

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      window.speechSynthesis.speak(utterance)
    }
  }, [explanation])

  useEffect(() => {
    if (!hasAutoPlayed && childName && explanation) {
      const timer = setTimeout(() => {
        speakExplanation()
        setHasAutoPlayed(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasAutoPlayed, childName, explanation, speakExplanation])

  if (!isMounted) {
    return null
  }

  if (!currentChild) {
    return null
  }

  if (!verseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
        <div className="max-w-3xl mx-auto pt-12">
          <Card className="p-8 md:p-10 text-center text-muted-foreground">Loading explanation...</Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-3xl mx-auto pt-12 space-y-8">
        <Button variant="ghost" onClick={() => router.push(`/verse-presentation?type=${sessionType}`)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">What Does This Mean?</h1>
        </div>

        {/* Verse Reference */}
        <Card className="p-6 bg-primary/5 border-primary/20 text-center">
          <p className="text-lg font-heading text-primary font-semibold">{reference}</p>
        </Card>

        {/* Explanation */}
        <Card className="p-8 md:p-10">
          <p className="text-xl md:text-2xl leading-relaxed text-foreground">{explanation}</p>

          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={speakExplanation} disabled={isPlaying} className="gap-2 bg-transparent">
              <Volume2 className="w-4 h-4" />
              {isPlaying ? "Playing..." : "Listen Again"}
            </Button>
          </div>
        </Card>

        {/* Interactive Element for Younger Ages */}
        {childAge <= 7 && (
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-4">
              <div className="text-4xl">❤️</div>
              <p className="text-lg text-muted-foreground">God loves you this much and even more!</p>
            </div>
          </Card>
        )}

        <Button
          size="lg"
          className="w-full font-heading text-lg"
          onClick={() => router.push(`/listen?type=${sessionType}&verse=${verseParam}`)}
        >
          Continue to Listening
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
