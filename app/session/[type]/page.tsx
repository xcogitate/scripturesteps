"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Volume2, CheckCircle, Sun, Moon, Sparkles } from "lucide-react"
import { fetchLessonContent, fetchWeekData } from "@/lib/content-client"

export default function SessionPage() {
  const router = useRouter()
  const params = useParams()
  const sessionType = params.type as "morning" | "night"

  const [child, setChild] = useState<ChildProfile | null>(null)
  const [step, setStep] = useState<"intro" | "verse" | "explanation" | "prayer" | "complete">("intro")
  const [isPlaying, setIsPlaying] = useState(false)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)
  const [verseData, setVerseData] = useState<{ text: string; reference: string } | null>(null)
  const [theme, setTheme] = useState("")
  const [explanation, setExplanation] = useState("")
  const [prayer, setPrayer] = useState("")

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
      const loadContent = async () => {
        try {
          const weekData = await fetchWeekData({
            age: currentChild.age,
            week: currentChild.currentWeek,
            programYear: currentChild.programYear || 1,
          })
          setTheme(weekData.theme)
          const variant =
            currentChild.age < 8
              ? currentChild.dayOfWeek <= 2
                ? "A"
                : currentChild.dayOfWeek <= 4
                  ? "B"
                  : "A"
              : "A"
          const verse =
            currentChild.age < 8
              ? variant === "B"
                ? weekData.verseB
                : weekData.verseA
              : weekData.verse
          setVerseData(verse || null)

          const explanationData = await fetchLessonContent({
            age: currentChild.age,
            week: currentChild.currentWeek,
            programYear: currentChild.programYear || 1,
            contentType: "explanation",
            verseVariant: variant,
          })
          setExplanation(
            (explanationData.content?.explanation || "").replace(/\{childName\}/g, currentChild.name),
          )

          const prayerData = await fetchLessonContent({
            age: currentChild.age,
            week: currentChild.currentWeek,
            programYear: currentChild.programYear || 1,
            contentType: "prayer",
            verseVariant: variant,
            sessionType: sessionType === "night" ? "evening" : "morning",
          })
          setPrayer((prayerData.content?.text || "").replace(/\{childName\}/g, currentChild.name))
        } catch {
          setTheme("")
          setVerseData(null)
          setExplanation("")
          setPrayer("")
        }
      }
      loadContent()
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynthesis(window.speechSynthesis)
    }
  }, [router, sessionType])

  useEffect(() => {
    return () => {
      if (synthesis) {
        synthesis.cancel()
      }
    }
  }, [synthesis])

  if (!child) return null

  const isMorning = sessionType === "morning"
  const SessionIcon = isMorning ? Sun : Moon
  const verseText = verseData?.text || ""
  const verseReference = verseData?.reference || "Scripture"

  const handlePlayAudio = (text: string) => {
    if (!synthesis) return

    if (isPlaying) {
      synthesis.cancel()
      setIsPlaying(false)
      return
    }

    synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

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
      utterance.voice = femaleVoice
    }

    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1.0

    utterance.onstart = () => {
      setIsPlaying(true)
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    synthesis.speak(utterance)
  }

  const handleNext = () => {
    if (step === "intro") setStep("verse")
    else if (step === "verse") setStep("explanation")
    else if (step === "explanation") {
      if (isMorning) {
        setStep("complete")
      } else {
        setStep("prayer")
      }
    } else if (step === "prayer") setStep("complete")
    else router.push("/dashboard")
  }

  const getSessionDuration = () => {
    if (child.age < 6) return "5 mins"
    if (child.age < 8) return "7 mins"
    return "10 mins"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SessionIcon className="w-4 h-4" />
            <span>{getSessionDuration()} session</span>
          </div>
        </div>

        {/* Intro Step */}
        {step === "intro" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl">
                <SessionIcon className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-heading text-4xl font-bold text-foreground">
                {isMorning ? `Good morning, ${child.name}!` : `Time to wind down, ${child.name}`}
              </h1>
              <p className="text-xl text-muted-foreground">
                {isMorning ? "Let's learn God's Word together" : "Let's reflect on today together"}
              </p>
            </div>

            <Card className="shadow-xl border-2 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">{isMorning ? "🌞" : "🌙"}</div>
                    <h2 className="font-heading text-2xl font-bold">Today's Theme</h2>
                    <p className="text-lg text-muted-foreground">{theme || "Theme"}</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {isMorning
                        ? "We'll read a verse, listen to it, and talk about what it means."
                        : "We'll review today's verse and say a prayer together."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full text-lg py-6 font-heading">
              Start Session
            </Button>
          </div>
        )}

        {/* Verse Step */}
        {step === "verse" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold mb-2">{verseReference}</h1>
              <p className="text-muted-foreground">
                {isMorning ? "Read along" : "Let's remember"}, {child.name}
              </p>
            </div>

            <Card className="shadow-xl border-2 border-accent/20">
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <div className="text-5xl mb-6">💛</div>
                    <p className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-relaxed px-4">
                      {verseText}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => handlePlayAudio(verseText)}
                    disabled={isPlaying}
                    className="font-heading"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    {isPlaying ? "Playing..." : `Listen carefully, ${child.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full text-lg py-6 font-heading">
              Continue
            </Button>
          </div>
        )}

        {/* Explanation Step */}
        {step === "explanation" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold mb-2">What Does It Mean?</h1>
              <p className="text-muted-foreground">Let's understand together, {child.name}</p>
            </div>

            <Card className="shadow-xl border-2 border-secondary/20">
              <CardContent className="pt-10 pb-10">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-2xl mb-6">
                      <Sparkles className="w-8 h-8 text-secondary" />
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-foreground text-center leading-relaxed px-4 font-medium">
                    {explanation || "Let's learn what this verse means together."}
                  </p>

                  <div className="flex justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => handlePlayAudio(explanation || "Let's learn what this verse means together.")}
                      disabled={isPlaying}
                      className="font-heading"
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      {isPlaying ? "Playing..." : "Listen to explanation"}
                    </Button>
                  </div>

                  {!isMorning && (
                    <div className="mt-8 p-6 bg-muted/50 rounded-2xl">
                      <p className="text-sm text-muted-foreground text-center mb-4">Reflection Question</p>
                      <p className="text-lg text-foreground text-center font-medium">
                        Did you show kindness today, {child.name}?
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full text-lg py-6 font-heading">
              {isMorning ? "Finish Session" : "Say Prayer"}
            </Button>
          </div>
        )}

        {/* Prayer Step */}
        {step === "prayer" && !isMorning && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold mb-2">Night Prayer</h1>
              <p className="text-muted-foreground">Let's pray together, {child.name}</p>
            </div>

            <Card className="shadow-xl border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-background">
              <CardContent className="pt-10 pb-10">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🙏</div>
                  </div>

                  <p className="text-lg md:text-xl text-foreground text-center leading-relaxed px-4 font-medium">
                    {prayer || "Dear God, thank You for this day. Help me grow closer to You. Amen."}
                  </p>

                  <div className="mt-8 p-6 bg-muted/30 rounded-2xl">
                    <p className="text-sm text-muted-foreground text-center">Take a moment to pray with your heart</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() =>
                      handlePlayAudio(prayer || "Dear God, thank You for this day. Help me grow closer to You. Amen.")
                    }
                    disabled={isPlaying}
                    className="w-full font-heading"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    {isPlaying ? "Playing..." : "Listen to prayer"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full text-lg py-6 font-heading">
              Finish Prayer
            </Button>
          </div>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center">
                <CheckCircle className="w-20 h-20 text-accent" />
              </div>
              <h1 className="font-heading text-4xl font-bold text-foreground">Excellent work, {child.name}!</h1>
              <p className="text-xl text-muted-foreground">
                {isMorning ? "You've completed your morning session" : "You've completed your night reflection"}
              </p>
            </div>

            <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-primary/10 border-none">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <div className="text-5xl mb-4">🌟</div>
                  <h3 className="font-heading text-xl font-bold">Remember</h3>
                  <p className="text-lg font-medium text-foreground">{verseText}</p>
                  <p className="text-sm text-muted-foreground">
                    {isMorning
                      ? "Think about this verse as you go through your day"
                      : "Let this verse stay in your heart as you sleep"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full text-lg py-6 font-heading">
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
