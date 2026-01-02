"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Volume2, Mic, BookOpen, RefreshCcw, Lock, Sparkles } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { getBooksForSet, getSetName, getTestamentDescription, getSetProgress, getTotalSets } from "@/lib/bible-books"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"
import type { ChildProfile } from "@/lib/types"
import { useClapEffect } from "@/lib/use-clap-effect"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function BibleBooksPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [phase, setPhase] = useState<"listen" | "recite" | "practice">("listen")
  const [books, setBooks] = useState<string[]>([])
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [highlightedBooks, setHighlightedBooks] = useState<boolean[]>([])
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [practiceOrder, setPracticeOrder] = useState<string[]>([])
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceMessage, setPracticeMessage] = useState("")
  const [isTimedChallenge, setIsTimedChallenge] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [practiceStatus, setPracticeStatus] = useState<"idle" | "running" | "timeout" | "success">("idle")
  const [correctOrder, setCorrectOrder] = useState<string[]>([])
  const playClapEffect = useClapEffect()
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const booksPerSet = currentChild && currentChild.age >= 8 ? 10 : 5
  const masteryRequired = currentChild && currentChild.age >= 8 ? 2 : 3 // Less repetitions for older kids
  const totalSets = getTotalSets(booksPerSet)
  const currentWeek = currentChild?.currentWeek || 1
  const setIndex = (currentWeek - 1) % Math.max(totalSets, 1)
  const isTapGameLocked = !hasPremiumAccess && (currentChild?.age || 0) < 8

  useEffect(() => {
    setIsMounted(true)
    setCurrentChild(SessionStore.getCurrentChild())
  }, [])

  useEffect(() => {
    let isActive = true
    const loadPlan = async () => {
      const { data } = await getOrCreateParentSettings()
      if (!isActive || !data) return
      setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
    }
    loadPlan()
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    if (!currentChild) {
      router.push("/")
      return
    }

    if (currentChild.bibleBookWeek !== currentWeek) {
      currentChild.bibleBookWeek = currentWeek
      currentChild.bibleBookMastery = 0
      SessionStore.setCurrentChild(currentChild)
      setCurrentChild({ ...currentChild })
    }

    const booksForSet = getBooksForSet(setIndex, booksPerSet)
    setBooks(booksForSet)
    setHighlightedBooks(new Array(booksForSet.length).fill(false))
  }, [currentChild, router, booksPerSet, setIndex, currentWeek, isMounted])

  const shuffleBooks = (list: string[]) => {
    const shuffled = [...list]
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const speakBooks = useCallback(
    (booksToSpeak: string[]) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()

        const testament = getSetName(setIndex, booksPerSet)
        const intro = `${currentChild?.name}, these books are from the ${testament}. Let's learn them: `
        const utterance = new SpeechSynthesisUtterance(intro + booksToSpeak.join(", "))
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen"),
        )

        utterance.voice = femaleVoice || voices[0]
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 1.0

        utterance.onend = () => {
          setTimeout(() => {
            const instruction = isTapGameLocked
              ? `Tap practice is part of the Starter plan, ${currentChild?.name}.`
              : `Now ${currentChild?.name}, click the "I'm Ready to Try" button to practice saying these books in order!`
            const instructionUtterance = new SpeechSynthesisUtterance(
              instruction,
            )
            instructionUtterance.voice = femaleVoice || voices[0]
            instructionUtterance.rate = 0.9
            instructionUtterance.pitch = 1.1
            instructionUtterance.volume = 1.0
            window.speechSynthesis.speak(instructionUtterance)
          }, 500)
        }

        window.speechSynthesis.speak(utterance)
      }
    },
    [currentChild, booksPerSet, isTapGameLocked, setIndex],
  )

  useEffect(() => {
    if (phase === "listen" && books.length > 0 && !hasAutoPlayed) {
      setTimeout(() => {
        speakBooks(books)
        setHasAutoPlayed(true)
      }, 500)
    }
  }, [phase, books, speakBooks, hasAutoPlayed])

  const startReciting = () => {
    setPhase("recite")
    setCurrentBookIndex(0)
    setHighlightedBooks(new Array(books.length).fill(false))
  }

  const startPractice = () => {
    setPhase("practice")
    setCorrectOrder(books)
    setPracticeOrder(shuffleBooks(books))
    setPracticeIndex(0)
    setPracticeMessage("")
    setTimeLeft(60)
    setIsTimerRunning(false)
    setPracticeStatus("idle")
    setIsTimedChallenge(false)
  }

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    setIsListening(true)
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    const timeout = setTimeout(() => {
      recognition.stop()
      setIsListening(false)
    }, 3000)

    recognition.onresult = (event: any) => {
      clearTimeout(timeout)
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase()
      const expectedBook = books[currentBookIndex].toLowerCase()

      const normalizedTranscript = transcript
        .replace(/first|1st/gi, "1")
        .replace(/second|2nd/gi, "2")
        .replace(/third|3rd/gi, "3")

      const normalizedExpected = expectedBook
        .replace(/first|1st/gi, "1")
        .replace(/second|2nd/gi, "2")
        .replace(/third|3rd/gi, "3")

      if (normalizedTranscript.includes(normalizedExpected)) {
        const newHighlighted = [...highlightedBooks]
        newHighlighted[currentBookIndex] = true
        setHighlightedBooks(newHighlighted)

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(`Correct, ${currentChild?.name}!`)
          utterance.rate = 1.2
          utterance.volume = 0.7
          utterance.onend = () => playClapEffect()
          window.speechSynthesis.speak(utterance)
        } else {
          playClapEffect()
        }

        if (currentBookIndex === books.length - 1) {
          recognition.stop()
          setIsListening(false)
          startPractice()
        } else {
          setCurrentBookIndex(currentBookIndex + 1)
          setIsListening(false)
          setTimeout(() => {
            startListening()
          }, 800)
        }
      } else {
        setIsListening(false)
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(`Try again, ${currentChild?.name}!`)
          utterance.rate = 1.2
          utterance.volume = 0.7
          window.speechSynthesis.speak(utterance)
        }
      }
    }

    recognition.onerror = () => {
      clearTimeout(timeout)
      setIsListening(false)
    }

    recognition.onend = () => {
      clearTimeout(timeout)
      setIsListening(false)
    }

    recognition.start()
  }, [books, currentBookIndex, highlightedBooks, playClapEffect])

  const speakMessage = (message: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.95
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }

  const handleCompletion = () => {
    if (!currentChild) return

    const newMastery = (currentChild.bibleBookMastery || 0) + 1
    currentChild.bibleBookMastery = newMastery
    SessionStore.setCurrentChild(currentChild)

    router.push("/bible-books-complete")
  }

  useEffect(() => {
    if (phase !== "practice" || !isTimedChallenge || !isTimerRunning) return
    if (timeLeft <= 0) {
      setIsTimerRunning(false)
      setPracticeStatus("timeout")
      setPracticeMessage("Time-out! Let's try again.")
      speakMessage("Time out. Let's try again.")
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [phase, isTimedChallenge, isTimerRunning, timeLeft])

  useEffect(() => {
    if (phase !== "practice" || !isTimedChallenge || !isTimerRunning) return
    if (practiceStatus === "success") return
    if (practiceOrder.length === 0 || practiceOrder.length !== correctOrder.length) return
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase()
    const correct = practiceOrder.every(
      (book, index) => normalize(book) === normalize(correctOrder[index]),
    )
    if (!correct) return
    setPracticeStatus("success")
    setIsTimerRunning(false)
    setPracticeMessage("Congratulations! You finished on time.")
    speakMessage("Congratulations! You finished on time.")
    playClapEffect()
    setTimeout(() => {
      handleCompletion()
    }, 700)
  }, [phase, isTimedChallenge, isTimerRunning, practiceOrder, correctOrder, practiceStatus, playClapEffect])

  const handlePracticeTap = (book: string) => {
    if (practiceOrder.length === 0 || practiceIndex >= books.length) return

    const expected = books[practiceIndex]
    if (book === expected) {
      const nextIndex = practiceIndex + 1
      setPracticeIndex(nextIndex)
      setPracticeMessage("Great job! Keep going.")

      if (nextIndex >= books.length) {
        setPracticeMessage("Perfect! You placed them all in order.")
        playClapEffect()
        setTimeout(() => {
          handleCompletion()
        }, 700)
      }
      return
    }

    setPracticeMessage("Almost! Try the next book in order.")
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    const updated = [...practiceOrder]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    setPracticeOrder(updated)
    setDragIndex(null)
  }

  const handleTimedStart = () => {
    setIsTimedChallenge(true)
    setPracticeStatus("running")
    setTimeLeft(60)
    setIsTimerRunning(true)
    setPracticeMessage("Go! Place the books in order.")
  }

  const checkOrder = () => {
    if (isTimedChallenge && timeLeft <= 0) return
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase()
    if (practiceOrder.length !== correctOrder.length) {
      setPracticeMessage("Not quite. Try rearranging the order.")
      return
    }
    const correct = practiceOrder.every(
      (book, index) => normalize(book) === normalize(correctOrder[index]),
    )
    if (correct) {
      setPracticeStatus("success")
      setIsTimerRunning(false)
      setPracticeMessage("Congratulations! You finished on time.")
      speakMessage("Congratulations! You finished on time.")
      playClapEffect()
      setTimeout(() => {
        handleCompletion()
      }, 700)
    } else {
      setPracticeMessage("Not quite. Try rearranging the order.")
    }
  }

  const handleTimedRetry = () => {
    setPracticeOrder(shuffleBooks(books))
    setPracticeIndex(0)
    setPracticeMessage("")
    setTimeLeft(60)
    setPracticeStatus("idle")
    setIsTimerRunning(false)
    setIsTimedChallenge(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${minutes}:${remaining.toString().padStart(2, "0")}`
  }

  const setName = getSetName(setIndex, booksPerSet)
  const testamentDescription = getTestamentDescription(setIndex, booksPerSet)
  const setProgress = getSetProgress(setIndex, booksPerSet)
  const mastery = currentChild?.bibleBookMastery || 0
  const childName = isMounted ? currentChild?.name : ""
  const heading = childName ? `Books of the Bible, ${childName}!` : "Books of the Bible!"

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <BookOpen className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-primary">{setProgress}</p>
          </div>
          <h1 className="font-heading text-3xl font-bold">{heading}</h1>
          <p className="text-muted-foreground max-w-md mx-auto">{testamentDescription}</p>
          {mastery > 0 && mastery < masteryRequired && (
            <p className="text-sm text-primary font-medium">
              Practice Progress: {mastery}/{masteryRequired} completions
            </p>
          )}
        </div>

        {phase === "listen" && (
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Volume2 className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{setName} Books</p>
              </div>

              <div className="space-y-4">
                {books.map((book, index) => (
                  <div key={index} className="text-2xl font-heading font-bold text-foreground">
                    {book}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" variant="secondary" onClick={startReciting} className="w-full">
                  I'm Ready
                </Button>
                <Button size="lg" variant="outline" onClick={() => speakBooks(books)} className="w-full">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Listen Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "recite" && (
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Mic className="w-10 h-10 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Say the books in order. Each one lights up when you say it right.
                </p>
                <p className="text-xs text-muted-foreground">
                  {isTapGameLocked
                    ? "Tap practice is in Starter."
                    : "When you're done, we'll do a quick tap game to lock it in."}
                </p>
              </div>

              <div className="space-y-3">
                {books.map((book, index) => (
                  <div
                    key={index}
                    className={`text-2xl font-heading font-bold text-center p-4 rounded-lg transition-all duration-300 ${
                      highlightedBooks[index]
                        ? "bg-primary text-primary-foreground scale-105"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {book}
                  </div>
                ))}
              </div>

              {!isListening ? (
                <Button size="lg" onClick={startListening} className="w-full">
                  <Mic className="w-5 h-5 mr-2" />
                  Start Speaking
                </Button>
              ) : (
                <div className="text-center">
                  <div className="inline-block px-6 py-3 bg-accent/20 rounded-full animate-pulse">
                    <p className="text-accent font-medium">Listening...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {phase === "practice" && (
          <Card>
            <CardContent className="p-8 space-y-6">
              {isTapGameLocked ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Tap Practice is in Starter</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upgrade to unlock the tap game that helps children memorize book order faster.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full" onClick={() => setShowUpgradeModal(true)}>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Upgrade to Starter
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold">
                      {(currentChild?.age || 0) >= 8 ? "Arrange the Books in Order" : "Tap the Books in Order"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {(currentChild?.age || 0) >= 8
                        ? "Drag each book into the correct order. Then check your answer."
                        : "Start with the first book and keep going. You'll get a star when you finish."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Progress: {practiceIndex}/{books.length}
                    </p>
                  </div>

                  {(currentChild?.age || 0) >= 8 && (
                    <div className="rounded-2xl border border-border bg-secondary/5 px-4 py-4 text-center">
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Countdown</p>
                      <p className="font-heading text-4xl md:text-5xl text-foreground">{formatTime(timeLeft)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Start when you're ready.</p>
                    </div>
                  )}

                  {practiceMessage && (
                    <div className="flex justify-center">
                      <div
                        className={`text-center font-medium ${
                          practiceStatus === "timeout"
                            ? "timeout-zoom text-destructive bg-destructive/10 px-6 py-3 rounded-full text-4xl shadow-sm"
                            : "text-primary bg-primary/10 px-4 py-2 rounded-full text-sm"
                        }`}
                      >
                        {practiceMessage}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3">
                    {(currentChild?.age || 0) >= 8
                      ? practiceOrder.map((book, index) => (
                          <div
                            key={book}
                            className={`w-full rounded-lg border border-transparent px-4 py-3 font-heading text-lg transition-all ${
                              dragIndex === index ? "opacity-60 shadow-lg" : "shadow-sm hover:shadow-md"
                            } ${
                              index % 4 === 0
                                ? "bg-primary/10"
                                : index % 4 === 1
                                  ? "bg-secondary/10"
                                  : index % 4 === 2
                                    ? "bg-accent/10"
                                    : "bg-destructive/10"
                            }`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnd={() => setDragIndex(null)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => handleDrop(index)}
                          >
                            {book}
                          </div>
                        ))
                      : practiceOrder.map((book) => {
                          const isDone = books.indexOf(book) < practiceIndex
                          return (
                            <Button
                              key={book}
                              variant={isDone ? "secondary" : "outline"}
                              className="w-full justify-center font-heading"
                              onClick={() => handlePracticeTap(book)}
                              disabled={isDone}
                            >
                              {book}
                            </Button>
                          )
                        })}
                  </div>

                  {(currentChild?.age || 0) >= 8 ? (
                    <div className="flex flex-col gap-3">
                      {practiceStatus === "idle" && (
                        <Button size="lg" onClick={handleTimedStart} className="w-full">
                          Start Timer
                        </Button>
                      )}
                      {practiceStatus === "running" && (
                        <Button size="lg" onClick={checkOrder} className="w-full">
                          Check Order
                        </Button>
                      )}
                      {practiceStatus === "timeout" && (
                        <Button size="lg" onClick={handleTimedRetry} className="w-full">
                          <RefreshCcw className="w-5 h-5 mr-2" />
                          Try Again
                        </Button>
                      )}
                      <Button size="lg" variant="outline" onClick={startPractice} className="w-full">
                        Shuffle & Try Again
                      </Button>
                    </div>
                  ) : (
                    <Button size="lg" variant="outline" onClick={startReciting} className="w-full">
                      Practice Again
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Unlock the tap game"
        description="Upgrade to Starter to access the Books of the Bible tap practice."
        onUpgrade={() => router.push("/settings/billing")}
      />
    </div>
  )
}
