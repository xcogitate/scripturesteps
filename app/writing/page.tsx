"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, PenTool, Eraser, Sparkles } from "lucide-react"
import { fetchWeekData } from "@/lib/content-client"

export default function WritingPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [step, setStep] = useState<"intro" | "writing" | "complete">("intro")
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false)
  const [currentVerse, setCurrentVerse] = useState(0) // 0 for verse A, 1 for verse B (ages 4-7)
  const [writingPhase, setWritingPhase] = useState<"trace" | "write">("trace")
  const [reflection, setReflection] = useState("")
  const [weekData, setWeekData] = useState<any | null>(null)

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
    }
  }, [router])

  useEffect(() => {
    if (!child) return
    const loadWeek = async () => {
      try {
        const data = await fetchWeekData({
          age: child.age,
          week: child.currentWeek,
          programYear: child.programYear || 1,
        })
        setWeekData(data)
      } catch {
        setWeekData(null)
      }
    }
    loadWeek()
  }, [child])

  useEffect(() => {
    if (child && step === "writing" && !hasSpokenGreeting && child.age >= 8) {
      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(
        `Time to Write, ${child.name}! Writing helps us remember God's Word even better.`,
      )

      const voices = synth.getVoices()
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Samantha") ||
          voice.name.includes("Victoria") ||
          (voice.lang.startsWith("en") && voice.name.includes("Female")),
      )

      if (preferredVoice) utterance.voice = preferredVoice
      utterance.rate = 0.85
      utterance.pitch = 1.05

      synth.speak(utterance)
      setHasSpokenGreeting(true)
    }
  }, [child, step, hasSpokenGreeting])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawTraceGuide = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "56px 'Comic Sans MS', 'Segoe UI', sans-serif"

    const maxWidth = canvas.width - 80
    const words = text.split(" ")
    const lines: string[] = []
    let line = ""
    let wordsInLine = 0

    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word
      const nextCount = wordsInLine + 1
      if (ctx.measureText(testLine).width > maxWidth || nextCount > 4) {
        if (line) lines.push(line)
        line = word
        wordsInLine = 1
      } else {
        line = testLine
        wordsInLine = nextCount
      }
    })

    if (line) lines.push(line)

    const lineHeight = 70
    const totalHeight = lines.length * lineHeight
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2

    lines.forEach((lineText, index) => {
      const y = startY + index * lineHeight

      // Guide lines for tracing (baseline + midline).
      ctx.setLineDash([4, 10])
      ctx.lineWidth = 1.5
      ctx.strokeStyle = "#dbeafe"
      ctx.beginPath()
      ctx.moveTo(40, y + 18)
      ctx.lineTo(canvas.width - 40, y + 18)
      ctx.moveTo(40, y - 18)
      ctx.lineTo(canvas.width - 40, y - 18)
      ctx.stroke()

      // Thick outer stroke.
      ctx.setLineDash([])
      ctx.lineWidth = 10
      ctx.strokeStyle = "#e5e7eb"
      ctx.strokeText(lineText, canvas.width / 2, y)

      // Inner dashed trace path.
      ctx.setLineDash([10, 10])
      ctx.lineWidth = 3
      ctx.strokeStyle = "#94a3b8"
      ctx.strokeText(lineText, canvas.width / 2, y)
    })

    ctx.restore()
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [step])

  const isYounger = child?.age ? child.age < 8 : false
  const bothVerses =
    isYounger && weekData?.verseA && weekData?.verseB
      ? {
          verseA: weekData.verseA,
          verseB: weekData.verseB,
        }
      : null
  const singleVerseData = !isYounger ? weekData?.verse || null : null
  const activeVerseText = bothVerses
    ? currentVerse === 0
      ? bothVerses.verseA.text
      : bothVerses.verseB.text
    : null

  useEffect(() => {
    if (step !== "writing") return
    if (!isYounger) return
    if (writingPhase !== "trace") return
    if (!activeVerseText) return
    drawTraceGuide(activeVerseText)
  }, [step, isYounger, writingPhase, activeVerseText])

  if (!child) return null

  const handleComplete = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()

    if (isYounger && bothVerses) {
      SessionStore.addWritingSample(`${bothVerses.verseA.text} & ${bothVerses.verseB.text}`)
    } else if (singleVerseData) {
      SessionStore.addWritingSample(singleVerseData.text)
    }

    router.push("/writing-review")
  }

  const handleNextVerse = () => {
    setCurrentVerse(1)
    setWritingPhase("trace")
    clearCanvas()
  }

  const renderWritingActivity = () => {
    if (isYounger && bothVerses) {
      const verse = currentVerse === 0 ? bothVerses.verseA : bothVerses.verseB
      const verseLabel = currentVerse === 0 ? "Verse A (Monday-Tuesday)" : "Verse B (Wednesday-Thursday)"
      const isTracing = writingPhase === "trace"

      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">{verseLabel}</p>
            <p className="text-lg font-bold text-foreground">{verse.text}</p>
            <p className="text-sm text-muted-foreground">
              {isTracing ? "Trace the verse first, then write it on your own." : "Now write the verse by yourself."}
            </p>
          </div>

          {/* Canvas for handwriting */}
          <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full touch-none"
              style={{ cursor: "url('/images/pen-cursor-32.png') 2 28, auto" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                clearCanvas()
                if (isTracing) drawTraceGuide(verse.text)
              }}
              className="flex-1 bg-transparent"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
            {isTracing ? (
              <Button
                onClick={() => {
                  setWritingPhase("write")
                  clearCanvas()
                }}
                className="flex-1"
              >
                Finish Tracing
              </Button>
            ) : currentVerse === 0 ? (
              <Button onClick={handleNextVerse} className="flex-1">
                Next Verse
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Complete This Week
              </Button>
            )}
          </div>
        </div>
      )
    }

    // Ages 8-12: Write verse + meaning
    if (singleVerseData) {
      return (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Write today's verse:</label>
            <p className="text-sm text-muted-foreground mb-3">
              {singleVerseData.reference}: {singleVerseData.text}
            </p>
            <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={250}
                className="w-full touch-none"
                style={{ cursor: "url('/images/pen-cursor-32.png') 2 28, auto" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <Button variant="outline" onClick={clearCanvas} size="sm" className="mt-2 bg-transparent">
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              In your own words, what does this verse mean, {child.name}?
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full min-h-32 p-4 text-base rounded-xl border-2 border-border focus:border-primary outline-none resize-none"
            />
          </div>

          <Button onClick={handleComplete} size="lg" className="w-full text-lg py-6">
            Save My Writing
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step === "intro" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl">
                <PenTool className="w-10 h-10 text-accent" />
              </div>
              <h1 className="font-heading text-4xl font-bold">{isYounger ? "Writing Day!" : "Writing God's Word"}</h1>
              <p className="text-xl text-muted-foreground">
                {isYounger
                  ? `Let's write both verses you learned this week, ${child.name}`
                  : `Let's practice writing, ${child.name}`}
              </p>
            </div>

            <Card className="shadow-xl border-2 border-accent/30">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="text-2xl font-semibold text-accent">Write it down together!</div>
                  <div className="space-y-3">
                    <h2 className="font-heading text-2xl font-bold">Why We Write</h2>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Writing God's Word helps it stay in your heart. When you write something, you remember it better!
                    </p>
                  </div>

                  {isYounger && bothVerses ? (
                    <div className="bg-accent/5 rounded-xl p-6 space-y-4">
                      <p className="font-heading text-lg font-medium">This Week's Verses</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Verse A</p>
                          <p className="text-lg font-bold">{bothVerses.verseA.text}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Verse B</p>
                          <p className="text-lg font-bold">{bothVerses.verseB.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    singleVerseData && (
                      <div className="bg-accent/5 rounded-xl p-6">
                        <p className="font-heading text-lg font-medium">Today's Verse</p>
                        <p className="text-2xl font-bold mt-2">{singleVerseData.text}</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setStep("writing")} size="lg" className="w-full text-lg py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Writing
            </Button>
          </div>
        )}

        {step === "writing" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="font-heading text-3xl font-bold">Time to Write, {child.name}!</h1>
              <p className="text-muted-foreground">
                {isYounger ? "Write each verse on the canvas below" : "Write the verse and share what it means"}
              </p>
            </div>

            <Card className="shadow-xl border-2 border-accent/30">
              <CardContent className="pt-8 pb-8">{renderWritingActivity()}</CardContent>
            </Card>

            <div className="bg-accent/5 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isYounger
                  ? "Great job this week! After writing, you'll move to next week."
                  : "Take your time. Write carefully and share your heart."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
