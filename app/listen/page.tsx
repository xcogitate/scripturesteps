"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Volume2, Pause, CheckCircle } from "lucide-react"
import { fetchWeekData } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"

export default function ListenPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const searchParams = useSearchParams()
  const verseParam = searchParams.get("verse") || "A"
  const sessionType = searchParams.get("type") || "morning"

  const [child, setChild] = useState<ChildProfile | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [verseData, setVerseData] = useState<{ text: string; reference: string } | null>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [router])

  useEffect(() => {
    if (!child) return
    const loadVerse = async () => {
      try {
        const data = await fetchWeekData({
          age: child.age,
          week: child.currentWeek,
          programYear: child.programYear || 1,
        })
        const variant = child.age < 8 && verseParam === "B" ? "B" : "A"
        setVerseData(child.age < 8 ? (variant === "B" ? data.verseB || null : data.verseA || null) : data.verse || null)
      } catch {
        setVerseData(null)
      }
    }
    loadVerse()
  }, [child, verseParam])

  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel()
      }
    }
  }, [speechSynthesis])

  const handlePlayPause = () => {
    if (!speechSynthesis) {
      alert("Sorry, your browser doesn't support text-to-speech.")
      return
    }

    if (!isPlaying) {
      speechSynthesis.cancel()
      setCurrentWordIndex(-1)

      if (!verseData) return

      const verseText = verseData.text
      const textToSpeak = verseText.replace(
        /(\d+)\s+([A-Z][a-z]+)\s+(\d+):(\d+)/g,
        (match, book, name, chapter, verse) => {
          const bookNum = book === "1" ? "First" : book === "2" ? "Second" : book === "3" ? "Third" : book
          return `${bookNum} ${name}, chapter ${chapter}, verse ${verse}`
        },
      )
      const words = verseText.split(" ")

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 0.7
      utterance.pitch = 1.1
      utterance.volume = 1.0

      const voices = speechSynthesis.getVoices()

      const childFriendlyVoice =
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("samantha")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("karen")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("victoria")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("zira")) ||
        voices.find((v) => v.lang.startsWith("en-US") && v.localService) ||
        voices.find((v) => v.lang.startsWith("en-GB") && v.localService) ||
        voices.find((v) => v.lang.startsWith("en"))

      if (childFriendlyVoice) {
        utterance.voice = childFriendlyVoice
      }

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const spokenText = textToSpeak.substring(0, event.charIndex)
          const wordCount = spokenText.trim().split(/\s+/).length - 1
          setCurrentWordIndex(wordCount)
        }
      }

      utterance.onstart = () => {
        setIsPlaying(true)
        setCurrentWordIndex(0)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setHasCompleted(true)
        setCurrentWordIndex(-1)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setCurrentWordIndex(-1)
        alert("There was an error playing the audio.")
      }

      speechSynthesis.speak(utterance)
    } else {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }
  }

  if (!child) return null

  const reference = verseData?.reference || "Scripture"
  const verse = verseData?.text || ""
  const verseWords = verse.split(" ")

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/explanation?type=${sessionType}&verse=${verseParam}`)}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/20 rounded-3xl">
              <Volume2 className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-4xl font-bold">Listen to Verse {verseParam}</h1>
            {reference && <p className="text-lg text-primary font-semibold">{reference}</p>}
            <p className="text-xl text-muted-foreground">Hear the verse, {child.name}</p>
          </div>

          <Card className="shadow-xl border-2 border-secondary/30">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="text-6xl mb-6">👂</div>
                  <p className="font-heading text-3xl md:text-4xl font-bold leading-relaxed px-4">
                    {verseWords.map((word, index) => (
                      <span
                        key={`${word}-${index}`}
                        className={`inline-block transition-all duration-300 ${
                          currentWordIndex === index
                            ? "text-primary scale-110"
                            : currentWordIndex > index
                              ? "text-primary/70"
                              : "text-foreground"
                        } ${index < verseWords.length - 1 ? "mr-2" : ""}`}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    variant={isPlaying ? "secondary" : "default"}
                    onClick={handlePlayPause}
                    className="w-48 h-16 text-lg font-heading"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-6 h-6 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-6 h-6 mr-2" />
                        Play Audio
                      </>
                    )}
                  </Button>

                  {isPlaying && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-secondary animate-pulse" style={{ animationDelay: "0ms" }} />
                        <div className="w-1 h-4 bg-secondary animate-pulse" style={{ animationDelay: "150ms" }} />
                        <div className="w-1 h-4 bg-secondary animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span>Playing...</span>
                    </div>
                  )}
                </div>

                {hasCompleted && (
                  <div className="flex items-center justify-center gap-2 text-accent pt-4 animate-fade-in">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Great listening, {child.name}!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Listen as many times as you'd like. Hearing God's Word helps you remember it better!
            </p>
          </div>

          {hasCompleted && (
            <Button
              onClick={() => router.push(`/speak?type=${sessionType}&verse=${verseParam}`)}
              size="lg"
              className="w-full text-lg py-6 font-heading"
            >
              Say It With Me
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
