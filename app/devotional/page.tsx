"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Book, Heart, CheckCircle, Play, Pause } from "lucide-react"
import { fetchLessonContent } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"

export default function DevotionalPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [devotion, setDevotion] = useState<{
    title: string
    verseText: string
    reference: string
    content: string
    question: string
    theme: string
  } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynthesis(window.speechSynthesis)
    }
  }, [])

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)

      if (currentChild.age < 8) {
        router.push("/dashboard")
      }
    }
  }, [router])

  useEffect(() => {
    if (!child || child.age < 8) return
    const loadDevotional = async () => {
      try {
        const data = await fetchLessonContent({
          age: child.age,
          week: child.currentWeek,
          programYear: child.programYear || 1,
          contentType: "devotional",
        })
        const content = data.content || {}
        setDevotion({
          title: content.title || "Daily Devotional",
          verseText: data.verse.text,
          reference: data.verse.reference,
          content: (content.content || "").replace(/\{childName\}/g, child.name),
          question: (content.question || "").replace(/\{childName\}/g, child.name),
          theme: data.theme,
        })
      } catch {
        setDevotion(null)
      }
    }
    loadDevotional()
  }, [child])

  useEffect(() => {
    if (child && devotion && synthesis && !hasGreeted && child.age >= 8) {
      const greetingText = `Daily Devotional. A message for you, ${child.name}.`
      const utterance = new SpeechSynthesisUtterance(greetingText)

      const voices = synthesis.getVoices()
      const preferredVoice = voices.find(
        (v) =>
          (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Karen")) &&
          (v.lang.startsWith("en-") || v.lang === "en"),
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = 0.8
      utterance.pitch = 1.0
      utterance.volume = 1.0

      synthesis.speak(utterance)
      setHasGreeted(true)
    }
  }, [child, devotion, synthesis, hasGreeted])

  if (!child || child.age < 8 || !devotion) return null

  const normalizeBibleReference = (text: string) => {
    return text
      .replace(/(\d+)\s+([A-Z][a-z]+)/g, (match, num, book) => {
        const ordinals: { [key: string]: string } = { "1": "First", "2": "Second", "3": "Third" }
        return `${ordinals[num] || num} ${book}`
      })
      .replace(/(\d+):(\d+)/g, "chapter $1 verse $2")
      .replace(/"/g, "")
  }

  const verseLine = `${devotion.verseText} - ${devotion.reference}`

  const handlePlayPause = () => {
    if (!synthesis) return

    if (isPlaying) {
      synthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    } else {
      const fullText = `${devotion.title}. ${normalizeBibleReference(verseLine)}. ${devotion.content}`
      const words = fullText.split(" ")
      const utterance = new SpeechSynthesisUtterance(fullText)

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

  const renderAnimatedText = (text: string, startIndex: number) => {
    const words = text.split(" ")
    return words.map((word, index) => {
      const globalIndex = startIndex + index
      const isActive = currentWordIndex === globalIndex
      const isPast = currentWordIndex > globalIndex

      return (
        <span key={`${startIndex}-${index}`}>
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

  const titleWords = devotion.title.split(" ").length
  const verseWords = verseLine.split(" ").length
  const contentStartIndex = titleWords + verseWords

  const getNextRoute = () => {
    if (!child) return "/dashboard"
    const dayOfWeek = SessionStore.getDayOfWeek()

    // Wednesday (3) or Thursday (4) should go to quiz for ages 8-12
    if (child.age >= 8 && (dayOfWeek === 3 || dayOfWeek === 4)) {
      return "/quiz"
    }

    // All other days go to prayer
    return "/prayer?type=morning"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 via-background to-primary/5">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-3xl">
              <Book className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-4xl font-bold">Daily Devotional</h1>
            <p className="text-xl text-muted-foreground">A message for you, {child.name}</p>
          </div>

          {/* Devotional Card */}
          <Card className="shadow-xl border-2 border-secondary/30">
            <CardContent className="pt-10 pb-10">
              <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                    {renderAnimatedText(devotion.title, 0)}
                  </h2>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Book className="w-4 h-4" />
                    <span>
                      Week {child.currentWeek} - {devotion.theme}
                    </span>
                  </div>
                </div>

                {/* Verse */}
                <div className="bg-primary/5 rounded-2xl p-8 text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Today's Verse</p>
                  <p className="font-heading text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                    {renderAnimatedText(verseLine, titleWords)}
                  </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-foreground leading-relaxed">
                    {renderAnimatedText(devotion.content, contentStartIndex)}
                  </p>
                </div>

                {/* Reflection Question */}
                <div className="bg-accent/5 rounded-2xl p-6 border-l-4 border-accent">
                  <div className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Reflection Question
                      </p>
                      <p className="text-lg text-foreground leading-relaxed">{devotion.question}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Playback Controls */}
          <div className="flex justify-center">
            <Button
              size="lg"
              variant={isPlaying ? "secondary" : "default"}
              onClick={handlePlayPause}
              className="w-64 h-14 text-lg font-heading"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause Reading
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Listen to Devotional
                </>
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {!hasCompleted ? (
              <Button onClick={() => setHasCompleted(true)} size="lg" className="w-full text-lg py-6 font-heading">
                Mark as Read
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-accent animate-fade-in">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-heading text-lg font-medium">Devotional completed!</span>
                </div>
                <Button onClick={() => router.push(getNextRoute())} size="lg" className="w-full font-heading">
                  {child.age >= 8 && (SessionStore.getDayOfWeek() === 3 || SessionStore.getDayOfWeek() === 4)
                    ? "Continue to Quiz"
                    : "Continue to Prayer"}
                </Button>
              </div>
            )}
          </div>

          {/* Encouragement */}
          <div className="bg-secondary/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think about the question throughout your day. Share your thoughts with your family at dinner!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}




