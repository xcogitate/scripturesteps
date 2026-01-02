"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { X, Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { SessionStore } from "@/lib/session-store"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  parentName: string
  parentId: string
}

export function ReviewModal({ isOpen, onClose, parentName, parentId }: ReviewModalProps) {
  const [step, setStep] = useState<"rating" | "sentiment" | "feedback" | "success">("rating")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [sentiment, setSentiment] = useState<"good" | "bad" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleRatingSelect = (value: number) => {
    setRating(value)
    setTimeout(() => setStep("sentiment"), 300)
  }

  const handleSentimentSelect = (value: "good" | "bad") => {
    setSentiment(value)
    setTimeout(() => setStep("feedback"), 300)
  }

  const handleSubmit = async () => {
    if (!feedback.trim() || !sentiment) return

    setIsSubmitting(true)

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentId,
        parentName,
        rating,
        sentiment,
        feedback: feedback.trim(),
      }),
    })

    if (!response.ok) {
      setIsSubmitting(false)
      return
    }

    // Update parent account with last review date
    const parent = SessionStore.getCurrentParent()
    if (parent) {
      parent.lastReviewPromptDate = new Date()
      // Set next prompt based on current timing
      const daysSinceCreation = Math.floor(
        (new Date().getTime() - new Date(parent.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysSinceCreation < 30) {
        parent.nextReviewPromptDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      } else {
        parent.nextReviewPromptDate = undefined
      }

      SessionStore.setCurrentParent(parent)
    }

    setIsSubmitting(false)
    setStep("success")
  }

  const handleClose = () => {
    // Reset state
    setStep("rating")
    setRating(0)
    setHoveredRating(0)
    setSentiment(null)
    setFeedback("")
    setIsSubmitting(false)
    onClose()
  }

  const getFeedbackPrompt = () => {
    if (sentiment === "good") {
      return "What do you like most about the app?"
    }
    return "What can we improve to serve you better?"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">We Value Your Feedback</h2>
            <p className="text-sm text-muted-foreground mt-1">Help us improve your experience</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Rating Step */}
        {step === "rating" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-foreground">How would you rate your experience?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingSelect(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        value <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted stroke-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sentiment Step */}
        {step === "sentiment" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right">
            <div className="text-center space-y-4">
              <p className="text-foreground">How do you feel about the app?</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleSentimentSelect("good")}
                  className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-muted hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <ThumbsUp className="h-12 w-12 text-green-600" />
                  <span className="font-medium">Good</span>
                </button>
                <button
                  onClick={() => handleSentimentSelect("bad")}
                  className="flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-muted hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <ThumbsDown className="h-12 w-12 text-red-600" />
                  <span className="font-medium">Bad</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Step */}
        {step === "feedback" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">{getFeedbackPrompt()}</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("sentiment")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!feedback.trim() || isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your feedback helps us improve the app and serve you better.</p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
