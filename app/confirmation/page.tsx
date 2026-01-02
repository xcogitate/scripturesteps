"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import { CheckCircle, BookOpen, Heart, Sparkles, ArrowRight } from "lucide-react"

export default function ConfirmationPage() {
  const router = useRouter()
  const [child, setChild] = useState<any>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
    }
  }, [router])

  if (!child) return null

  const getAgeDisplay = (age: number) => {
    if (age >= 8) return "8-12"
    return age.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 via-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-accent" />
            <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="text-center space-y-3">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">All Set, {child.name}!</h1>
          <p className="text-xl text-muted-foreground">Your Bible learning journey is ready to begin!</p>
        </div>

        {/* Learning Plan Card */}
        <Card className="shadow-xl border-2 border-accent/20">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl">
                <span className="text-3xl font-heading font-bold text-primary">
                  {child.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{child.name}'s Learning Plan</h2>
                <p className="text-muted-foreground">Age {getAgeDisplay(child.age)} • Personalized Experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-foreground">2 Verses</p>
                <p className="text-sm text-muted-foreground">Per week</p>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-xl">
                <Heart className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="font-semibold text-foreground">Daily Sessions</p>
                <p className="text-sm text-muted-foreground">Morning & Night</p>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-xl">
                <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">Fun Activities</p>
                <p className="text-sm text-muted-foreground">Writing & more</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 space-y-2">
              <h3 className="font-heading font-semibold text-lg">This Month's Theme</h3>
              <p className="text-foreground font-medium text-xl">God Loves Me</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {child.name} will learn about God's love through beautifully crafted Bible verses in short,
                age-appropriate sessions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="text-lg px-8 py-6 font-heading shadow-lg"
            onClick={() => router.push("/reminders")}
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
