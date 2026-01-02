"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mic, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { fetchWeekData } from "@/lib/content-client"

function normalizeBibleText(text: string): string {
  let normalized = text.toLowerCase()

  normalized = normalized.replace(/[—–-]/g, " ")
  normalized = normalized.replace(/[.,!?;]/g, "")

  const spokenToDigit: { [key: string]: string } = {
    first: "1",
    "1st": "1",
    second: "2",
    "2nd": "2",
    third: "3",
    "3rd": "3",
  }

  for (const [spoken, digit] of Object.entries(spokenToDigit)) {
    normalized = normalized.replace(new RegExp(`\\b${spoken}\\b`, "gi"), digit)
  }

  normalized = normalized.replace(/\bchapter\s+(\d+)\s+verse\s+(\d+)/gi, "$1:$2")
  normalized = normalized.replace(/\b(\d+)\s+verse\s+(\d+)/gi, "$1:$2")

  normalized = normalized.replace(/\s+/g, " ").trim()

  return normalized
}

export default function SpeakPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionType = searchParams?.get("type") || "morning"
  const verseParam = searchParams?.get("verse") || "A"

  const [child, setChild] = useState<ChildProfile | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [accuracy, setAccuracy] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [needsRetry, setNeedsRetry] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [targetVerse, setTargetVerse] = useState("")
  const [reference, setReference] = useState("")

  const checkAccuracy = useCallback(
    (spokenText: string) => {
      if (!targetVerse) return

      const normalizedTarget = normalizeBibleText(targetVerse)
      const normalizedSpoken = normalizeBibleText(spokenText)

      console.log("[v0] Target verse:", targetVerse)
      console.log("[v0] Normalized target:", normalizedTarget)
      console.log("[v0] Spoken text:", spokenText)
      console.log("[v0] Normalized spoken:", normalizedSpoken)

      const targetWords = normalizedTarget.split(/\s+/)
      const spokenWords = normalizedSpoken.split(/\s+/)

      let correctCount = 0

      for (let i = 0; i < targetWords.length; i++) {
        if (spokenWords[i] && targetWords[i] === spokenWords[i]) {
          correctCount++
        }
      }

      const accuracyPercent = Math.round((correctCount / targetWords.length) * 100)

      console.log(
        "[v0] Correct words:",
        correctCount,
        "Total words:",
        targetWords.length,
        "Accuracy:",
        accuracyPercent + "%",
      )

      setCorrectWords(correctCount)
      setTotalWords(targetWords.length)
      setAccuracy(accuracyPercent)

      if (accuracyPercent >= 70) {
        setHasCompleted(true)
        setNeedsRetry(false)
        SessionStore.addSpeakingAttempt(targetVerse, correctCount, targetWords.length)
        if (child) {
          const verseKey =
            child.age >= 8
              ? `week:${child.currentWeek || 1}:verse`
              : `week:${child.currentWeek || 1}:verse:${verseParam === "B" ? "B" : "A"}`
          SessionStore.markActivityComplete(verseKey)
        }
      } else {
        setNeedsRetry(true)
        setHasCompleted(false)
      }
    },
    [child, targetVerse, verseParam],
  )

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
      const loadVerse = async () => {
        try {
          const data = await fetchWeekData({
            age: currentChild.age,
            week: currentChild.currentWeek,
            programYear: currentChild.programYear || 1,
          })
          const variant = currentChild.age < 8 && verseParam === "B" ? "B" : "A"
          const verse =
            currentChild.age < 8
              ? variant === "B"
                ? data.verseB
                : data.verseA
              : data.verse
          setTargetVerse(verse?.text || "")
          setReference(verse?.reference || "")
        } catch {
          setTargetVerse("")
          setReference("")
        }
      }
      loadVerse()
    }
  }, [router, verseParam])

  useEffect(() => {
    if (!targetVerse) return

    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript
        setTranscript(spokenText)
        checkAccuracy(spokenText)
      }

      recognitionInstance.onerror = (event: any) => {
        setIsRecording(false)
        if (event.error === "no-speech") {
          setNeedsRetry(true)
        }
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [targetVerse, checkAccuracy])

  if (!child || !targetVerse) return null

  const handleSpeak = () => {
    if (recognition) {
      setIsRecording(true)
      setTranscript("")
      setNeedsRetry(false)
      setHasCompleted(false)
      recognition.start()
    } else {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.")
    }
  }

  const handleRetry = () => {
    setTranscript("")
    setNeedsRetry(false)
    setHasCompleted(false)
    setAccuracy(0)
    handleSpeak()
  }

  const handleContinue = () => {
    if (child.age >= 8) {
      router.push("/devotional")
    } else {
      router.push(`/prayer?type=morning`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background">
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl">
              <Mic className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-heading text-4xl font-bold">Say Verse {verseParam}</h1>
            {reference && <p className="text-lg text-primary font-semibold">{reference}</p>}
            <p className="text-xl text-muted-foreground">Practice speaking, {child.name}</p>
          </div>

          <Card className="shadow-xl border-2 border-accent/30">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <div className="text-6xl mb-6">🗣️</div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Read this out loud:</p>
                  <p className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-relaxed px-4">
                    {targetVerse}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    variant={isRecording ? "secondary" : "default"}
                    onClick={handleSpeak}
                    disabled={isRecording}
                    className="w-48 h-16 text-lg font-heading"
                  >
                    {isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-destructive rounded-full animate-pulse mr-2" />
                        Listening...
                      </>
                    ) : (
                      <>
                        <Mic className="w-6 h-6 mr-2" />
                        Start Speaking
                      </>
                    )}
                  </Button>

                  {isRecording && <div className="text-sm text-muted-foreground">Speak clearly into your device</div>}
                </div>

                {transcript && !isRecording && (
                  <div className="space-y-4 pt-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-2">You said:</p>
                      <p className="text-lg italic">{transcript}</p>
                    </div>

                    {hasCompleted ? (
                      <div className="flex flex-col items-center gap-2 text-accent animate-fade-in">
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-heading text-lg font-medium">Wonderful job, {child.name}!</span>
                        <span className="text-sm text-muted-foreground">
                          You got {correctWords} out of {totalWords} words correct ({accuracy}%)
                        </span>
                      </div>
                    ) : needsRetry ? (
                      <div className="flex flex-col items-center gap-2 text-destructive animate-fade-in">
                        <XCircle className="w-8 h-8" />
                        <span className="font-heading text-lg font-medium">Let's try again!</span>
                        <span className="text-sm text-muted-foreground">
                          You got {correctWords} out of {totalWords} words. Try to match all the words.
                        </span>
                        <Button onClick={handleRetry} variant="outline" className="mt-2 bg-transparent">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-accent/5 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Speaking God's Word out loud helps you remember it and makes it part of your heart!
            </p>
          </div>

          {hasCompleted && (
            <Button onClick={handleContinue} size="lg" className="w-full text-lg py-6 font-heading">
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
