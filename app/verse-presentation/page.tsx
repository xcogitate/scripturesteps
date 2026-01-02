"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Volume2, Play, Pause, ArrowLeft } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { fetchWeekData } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"

export default function VersePresentationPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const searchParams = useSearchParams()
  const sessionType = searchParams.get("type") || "morning"
  const verseParam = searchParams.get("verse") || ""

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasHeard, setHasHeard] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [words, setWords] = useState<string[]>([])
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [verseData, setVerseData] = useState<{ text: string; reference: string } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const currentChild = useMemo(() => SessionStore.getCurrentChild(), [])
  const childAge = currentChild?.age || 0
  const currentWeek = currentChild?.currentWeek || 1
  const programYear = currentChild?.programYear || 1
  const dayOfWeek = currentChild?.dayOfWeek || 1

  const verseVariant = childAge < 8 && verseParam === "B" ? "B" : "A"

  useEffect(() => {
    if (!currentChild) return
    const loadVerse = async () => {
      try {
        setLoadError(null)
        const data = await fetchWeekData({
          age: childAge,
          week: currentWeek,
          programYear: programYear || 1,
        })
        if (childAge < 8) {
          const nextVerse = verseVariant === "B" ? data.verseB || null : data.verseA || null
          if (!nextVerse) {
            setLoadError("We couldn't load today's verse. Please try again.")
          }
          setVerseData(nextVerse)
        } else {
          if (!data.verse) {
            setLoadError("We couldn't load today's verse. Please try again.")
          }
          setVerseData(data.verse || null)
        }
      } catch {
        setLoadError("We couldn't load today's verse. Please try again.")
        setVerseData(null)
      }
    }
    loadVerse()
  }, [currentChild, childAge, currentWeek, programYear, verseVariant])

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynthesis(window.speechSynthesis)
    }
  }, [])

  useEffect(() => {
    if (verseData?.reference && verseData?.text) {
      const fullText = `${verseData.reference}. ${verseData.text}`
      setWords(fullText.split(" "))
    }
  }, [verseData])

  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel()
      }
    }
  }, [synthesis])

  const normalizeBibleReference = (text: string): string => {
    return text
      .replace(
        /(\d+)\s*(John|Corinthians|Thessalonians|Timothy|Peter|Kings|Chronicles|Samuel)/gi,
        (match, num, book) => {
          const ordinals: { [key: string]: string } = { "1": "First", "2": "Second", "3": "Third" }
          return `${ordinals[num] || num} ${book}`
        },
      )
      .replace(/(\d+):(\d+)/g, "chapter $1 verse $2")
  }

  const handlePlayAudio = useCallback(() => {
    if (!synthesis || !verseData) return

    if (isPlaying && utterance) {
      synthesis.cancel()
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      return
    }

    const fullText = `${verseData.reference}. ${verseData.text}`
    const normalizedText = normalizeBibleReference(fullText)
    const newUtterance = new SpeechSynthesisUtterance(normalizedText)

    const voices = synthesis.getVoices()
    const femaleVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Female") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Victoria")),
      ) || voices.find((v) => v.lang.startsWith("en"))

    if (femaleVoice) {
      newUtterance.voice = femaleVoice
    }

    newUtterance.rate = 0.7
    newUtterance.pitch = 1.0
    newUtterance.volume = 1.0

    let wordIndex = 0
    newUtterance.onboundary = (event) => {
      if (event.name === "word") {
        setCurrentWordIndex(wordIndex)
        wordIndex++
      }
    }

    newUtterance.onstart = () => {
      setIsPlaying(true)
      setHasHeard(true)
      setCurrentWordIndex(0)
    }

    newUtterance.onend = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }

    newUtterance.onerror = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }

    setUtterance(newUtterance)
    synthesis.speak(newUtterance)
  }, [synthesis, verseData, isPlaying, utterance])

  if (!verseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
        <div className="max-w-2xl mx-auto pt-12 space-y-6 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/session-intro?type=${sessionType}&verse=${verseParam}`)}
            className="mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="p-8 text-muted-foreground">
            {loadError || "Loading verse..."}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-3xl mx-auto pt-12 space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/session-intro?type=${sessionType}&verse=${verseParam}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-8 md:p-12 text-center space-y-8">
          <div className="text-primary font-heading text-lg md:text-xl font-semibold">{verseData.reference}</div>

          <div className="space-y-6">
            <p className="text-2xl md:text-3xl lg:text-4xl font-heading leading-relaxed text-foreground">
              "{verseData.text}"
            </p>
          </div>

          <div className="flex justify-center">
            <Button size="lg" variant="secondary" className="font-heading text-lg px-8" onClick={handlePlayAudio}>
              {isPlaying ? (
                <>
                  <Pause className="mr-2 w-5 h-5" />
                  Playing...
                </>
              ) : (
                <>
                  {hasHeard ? <Volume2 className="mr-2 w-5 h-5" /> : <Play className="mr-2 w-5 h-5" />}
                  {hasHeard ? "Listen Again" : "Listen to Verse"}
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <p className="text-center text-lg text-muted-foreground">
            Take a moment to read and listen to today's verse. When you're ready, we'll talk about what it means.
          </p>
        </Card>

        <Button
          size="lg"
          className="w-full font-heading text-lg"
          onClick={() => router.push(`/explanation?type=${sessionType}&verse=${verseParam}`)}
          disabled={!hasHeard}
        >
          Continue to Explanation
        </Button>
      </div>
    </div>
  )
}
