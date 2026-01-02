"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Award, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { useClapEffect } from "@/lib/use-clap-effect"

export default function WritingReviewPage() {
  const router = useRouter()
  const childName = SessionStore.getChildName()
  const writtenVerse = SessionStore.getLastWritingSample()
  const [showConfetti, setShowConfetti] = useState(false)
  const playClapEffect = useClapEffect()

  const praises = [
    `Beautiful work, ${childName}! 🌟`,
    `Wonderful writing, ${childName}! ⭐`,
    `Amazing job, ${childName}! 🎉`,
    `Excellent work, ${childName}! 🏆`,
    `You're doing great, ${childName}! 💫`,
  ]

  const randomPraise = praises[Math.floor(Math.random() * praises.length)]

  useEffect(() => {
    setShowConfetti(true)

    // Play voice encouragement
    const utterance = new SpeechSynthesisUtterance(`You're doing great, ${childName}!`)
    const voices = window.speechSynthesis.getVoices()
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.includes("Female") ||
        voice.name.includes("female") ||
        voice.name.includes("Samantha") ||
        voice.name.includes("Victoria"),
    )
    if (femaleVoice) {
      utterance.voice = femaleVoice
    }
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.onend = () => playClapEffect()
    window.speechSynthesis.speak(utterance)
    if (!("speechSynthesis" in window)) {
      playClapEffect()
    }

    // Stop confetti after 4 seconds
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [childName, playClapEffect])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6 relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "hsl(var(--primary))",
                    "hsl(var(--secondary))",
                    "hsl(var(--accent))",
                    "#FFD700",
                    "#FF6B6B",
                    "#4ECDC4",
                  ][Math.floor(Math.random() * 6)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto pt-12 space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/writing")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center shadow-xl">
              <Award className="w-10 h-10 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">{randomPraise}</h1>
          <p className="text-xl text-muted-foreground">Look at what you wrote!</p>
        </div>

        {/* Writing Preview */}
        <Card className="p-8 md:p-10 bg-gradient-to-br from-secondary/10 to-accent/10">
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-heading font-semibold text-primary">Your Writing</span>
            </div>
          </div>
          <div className="bg-background/80 rounded-2xl p-6 md:p-8 border-2 border-dashed border-border">
            <p className="font-handwriting text-2xl md:text-3xl leading-loose text-foreground text-balance">
              {writtenVerse || "God loves me very much!"}
            </p>
          </div>
        </Card>

        {/* Praise Card */}
        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">Keep It Up!</h3>
              <p className="text-muted-foreground leading-relaxed">
                Writing God's Word helps you remember it in your heart. You're doing an amazing job learning and growing
                in faith, {childName}!
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Button size="lg" className="w-full font-heading text-lg" onClick={() => router.push("/weekly-celebration")}>
          Continue
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}
