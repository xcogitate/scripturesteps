"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle, Brain } from "lucide-react"
import { fetchLessonContent } from "@/lib/content-client"
import { useClapEffect } from "@/lib/use-clap-effect"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"

export default function QuizPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const playClapEffect = useClapEffect()
  const hasPlayedClapRef = useRef(false)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [questions, setQuestions] = useState<
    Array<{ prompt: string; options: string[]; answer: string }>
  >([])

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else if (currentChild.age < 8) {
      router.push("/dashboard")
    } else {
      setChild(currentChild)
    }
  }, [router])

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
    if (!child || child.age < 8) return
    const loadQuiz = async () => {
      try {
        const data = await fetchLessonContent({
          age: child.age,
          week: child.currentWeek,
          programYear: child.programYear || 1,
          contentType: "quiz",
        })
        const nextQuestions = (data.content?.questions || []).map((item: any) => ({
          prompt: item.prompt,
          options: item.options,
          answer: item.answer,
        }))
        const cappedQuestions = hasPremiumAccess ? nextQuestions : nextQuestions.slice(0, 2)
        setQuestions(cappedQuestions)
      } catch {
        setQuestions([])
      }
    }
    loadQuiz()
  }, [child, hasPremiumAccess])

  useEffect(() => {
    if (!child || !quizComplete || questions.length === 0) return
    const passed = score >= Math.ceil(questions.length / 2)
    if (passed) {
      SessionStore.markActivityComplete(`week:${child.currentWeek || 1}:quiz`)
    }
  }, [child, quizComplete, score, questions.length])

  useEffect(() => {
    if (!quizComplete || hasPlayedClapRef.current) return
    playClapEffect()
    hasPlayedClapRef.current = true
  }, [quizComplete, playClapEffect])

  const speakEncouragement = (childName: string) => {
    const utterance = new SpeechSynthesisUtterance(`Great job, ${childName}! That's correct!`)
    const voices = speechSynthesis.getVoices()
    const femaleVoice = voices.find((voice) => voice.name.includes("Female") || voice.name.includes("Samantha"))
    if (femaleVoice) utterance.voice = femaleVoice
    utterance.rate = 0.85
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }

  const speakWrongAnswer = () => {
    const utterance = new SpeechSynthesisUtterance("Wrong answer. Try again!")
    const voices = speechSynthesis.getVoices()
    const femaleVoice = voices.find((voice) => voice.name.includes("Female") || voice.name.includes("Samantha"))
    if (femaleVoice) utterance.voice = femaleVoice
    utterance.rate = 0.85
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === questions[currentQuestion].answer) {
      setScore(score + 1)
      if (child) {
        speakEncouragement(child.name)
      }
    } else {
      speakWrongAnswer()
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizComplete(true)
        setShowConfetti(true)
      }
    }, 2000)
  }

  if (showInstructions && child && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl mb-4">
                <Brain className="w-10 h-10 text-accent" />
              </div>
              <h1 className="font-heading text-3xl font-bold">Bible Quiz Time, {child.name}!</h1>
              <p className="text-muted-foreground">Test your knowledge of this week's verse</p>
            </div>

            <Card className="shadow-xl border-2 border-accent/30">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-2xl font-bold mb-4">How to Take the Quiz</h2>
                    <div className="text-left space-y-4 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          1
                        </div>
                        <p className="text-muted-foreground">Read each question carefully</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          2
                        </div>
                        <p className="text-muted-foreground">
                          Choose the answer you think is correct by clicking on it
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          3
                        </div>
                        <p className="text-muted-foreground">You'll see if your answer is correct right away</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          4
                        </div>
                        <p className="text-muted-foreground">Do your best and have fun learning God's Word!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      There are {questions.length} questions. Take your time!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setShowInstructions(false)} size="lg" className="w-full text-lg py-6">
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!child || questions.length === 0) return null

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.answer

  if (quizComplete) {
    const passed = score >= Math.ceil(questions.length / 2)

    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background">
        {showConfetti && passed && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                  backgroundColor: ["#f87171", "#fb923c", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"][
                    Math.floor(Math.random() * 6)
                  ],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl">{passed ? "🎉" : "📚"}</div>
            <h1 className="font-heading text-4xl font-bold">
              {passed ? `Great Job, ${child.name}!` : `Keep Practicing, ${child.name}!`}
            </h1>
            <Card className="shadow-xl border-2 border-accent/30">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <p className="text-6xl font-bold text-primary">
                    {score}/{questions.length}
                  </p>
                  <p className="text-xl text-muted-foreground">
                    You got {score} out of {questions.length} correct!
                  </p>
                  <p className="text-lg font-medium text-primary">
                    {passed
                      ? score === questions.length
                        ? "Perfect score! You're amazing!"
                        : "Good work! Keep studying God's Word!"
                      : "You need at least 1 correct answer to continue. Let's try again!"}
                  </p>
                </div>
              </CardContent>
            </Card>
            {passed ? (
              <Button onClick={() => router.push("/prayer?type=morning")} size="lg" className="w-full text-lg py-6">
                Continue to Prayer
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setQuizComplete(false)
                    setCurrentQuestion(0)
                    setScore(0)
                    setSelectedAnswer(null)
                    setShowResult(false)
                    setShowConfetti(false)
                    hasPlayedClapRef.current = false
                  }}
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  Back to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl mb-4">
              <Brain className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-heading text-3xl font-bold">Bible Quiz</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-primary">Click on the answer you think is correct</p>
          </div>

          <Card className="shadow-xl border-2 border-accent/30">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-6">
                <h2 className="font-heading text-2xl font-bold text-center">{question.prompt}</h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option
                    const isCorrectAnswer = option === question.answer
                    const showCorrect = showResult && isCorrectAnswer
                    const showIncorrect = showResult && isSelected && !isCorrectAnswer

                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && handleAnswerSelect(option)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          showCorrect
                            ? "border-green-500 bg-green-50"
                            : showIncorrect
                              ? "border-red-500 bg-red-50"
                              : isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{option}</span>
                          {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                          {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {showResult && (
                  <div
                    className={`text-center p-4 rounded-xl ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    <p className="font-semibold">
                      {isCorrect
                        ? `Correct, ${child?.name}! Well done! 🎉`
                        : `Not quite, ${child?.name}. The correct answer is highlighted. Keep learning! 📖`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
