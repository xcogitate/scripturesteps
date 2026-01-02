"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Play, Pause } from "lucide-react"
import { fetchLessonContent } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"

export default function PrayerPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const searchParams = useSearchParams()
  const sessionType = searchParams.get("type") || "morning"
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [prayerContent, setPrayerContent] = useState<{ title: string; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const requestIdRef = useRef(0)
  const requestKeyRef = useRef("")

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
      return
    }
    setChild(currentChild)

    const loadPrayer = async () => {
      const requestKey = [
        sessionType,
        currentChild.id,
        currentChild.currentWeek,
        currentChild.programYear || 1,
        currentChild.dayOfWeek || 1,
      ].join(":")
      if (requestKeyRef.current === requestKey) return
      requestKeyRef.current = requestKey

      const requestId = ++requestIdRef.current
      setIsLoading(true)
      setLoadError(false)
      setPrayerContent(null)
      try {
        const data = await fetchLessonContent({
          age: currentChild.age,
          week: currentChild.currentWeek,
          programYear: currentChild.programYear || 1,
          contentType: "prayer",
          sessionType: sessionType === "night" ? "evening" : "morning",
          dayOfWeek: currentChild.dayOfWeek || 1,
        })
        const content = data.content || {}
        const text = (content.text || "").replace(/\{childName\}/g, currentChild.name)
        if (requestId === requestIdRef.current) {
          setPrayerContent({
            title: content.title || (sessionType === "night" ? "Evening Prayer" : "Morning Prayer"),
            text,
          })
          setLoadError(false)
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setPrayerContent(null)
          setLoadError(true)
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }
    loadPrayer()
  }, [router, sessionType])

  const prayerTitle = useMemo(() => {
    if (prayerContent?.title) return prayerContent.title
    return sessionType === "night" ? "Evening Prayer" : "Morning Prayer"
  }, [prayerContent, sessionType])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynthesis(window.speechSynthesis)
    }
  }, [])

  const handlePlayPause = () => {
    if (!synthesis || !prayerContent) return

    if (isPlaying) {
      synthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    } else {
      const words = prayerContent.text.split(" ")
      const utterance = new SpeechSynthesisUtterance(prayerContent.text)

      const voices = synthesis.getVoices()
      const preferredVoice = voices.find(
        (v) =>
          (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Karen")) &&
          (v.lang.startsWith("en-") || v.lang === "en"),
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.7
      utterance.pitch = 1.0
      utterance.volume = 1.0

      let wordIndex = 0
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setCurrentWordIndex(wordIndex)
          wordIndex++
        }
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentWordIndex(-1)
        setHasCompleted(true)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setCurrentWordIndex(-1)
      }

      synthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  const renderAnimatedText = (text: string) => {
    const words = text.split(" ")
    return words.map((word, index) => {
      const isActive = currentWordIndex === index
      const isPast = currentWordIndex > index

      return (
        <span key={index}>
          <span
            className={`inline-block transition-all duration-200 ${
              isActive ? "text-primary scale-110 font-bold" : isPast ? "text-muted-foreground" : ""
            }`}
          >
            {word}
          </span>
          {index < words.length - 1 && " "}
        </span>
      )
    })
  }

  const handleCompleteSession = () => {
    const week = child?.currentWeek || 1
    SessionStore.markActivityComplete(`week:${week}:prayer`)
    router.push(`/session-wrap?type=${sessionType}`)
  }

  if (!child) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-accent/5">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-3xl">
              <Heart className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="font-heading text-4xl font-bold">Prayer Time</h1>
            <p className="text-xl text-muted-foreground">Let's talk to God, {child.name}</p>
          </div>

          {/* Prayer Card */}
          <Card className="shadow-xl border-2 border-muted">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-8">
                {/* Prayer Icon */}
                <div className="text-6xl">🙏</div>

                {/* Prayer Title */}
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{prayerTitle}</h2>
                </div>

                {/* Prayer Text */}
                <div className="bg-muted/30 rounded-2xl p-8 max-w-lg mx-auto">
                  {isLoading ? (
                    <div className="h-24 rounded-2xl bg-muted/40 animate-pulse" />
                  ) : loadError ? (
                    <p className="text-lg text-destructive italic">We couldn’t load the prayer. Please try again.</p>
                  ) : prayerContent ? (
                    <p className="text-lg text-foreground leading-relaxed italic">
                      {renderAnimatedText(prayerContent.text)}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground italic">Preparing your prayer...</p>
                  )}
                </div>

                {/* Play/Pause Button */}
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    variant={isPlaying ? "secondary" : "default"}
                    onClick={handlePlayPause}
                    className="w-56 h-16 text-lg font-heading"
                    disabled={isLoading || loadError || !prayerContent}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-6 h-6 mr-2" />
                        Pause Prayer
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-2" />
                        Listen to Prayer
                      </>
                    )}
                  </Button>

                  {isPlaying && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                      <span>Playing guided prayer...</span>
                    </div>
                  )}
                </div>

                {hasCompleted && (
                  <Button onClick={handleCompleteSession} size="lg" className="w-full text-lg py-6 font-heading">
                    Complete Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-2xl p-6">
              <h3 className="font-heading font-semibold mb-3 text-center">How to Pray</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>Find a quiet place where you can focus</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>You can close your eyes or keep them open</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>Listen to the prayer or read it quietly</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <span>Add your own prayers at the end if you'd like</span>
                </p>
              </div>
            </div>

            {hasCompleted && (
              <Button onClick={handleCompleteSession} size="lg" className="w-full text-lg py-6 font-heading">
                Complete Session
              </Button>
            )}
          </div>

          {/* Encouragement */}
          <div className="bg-accent/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prayer is talking to God. You can pray anytime, anywhere. He always listens!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
