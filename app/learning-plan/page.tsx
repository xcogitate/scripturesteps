"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BookOpen, Calendar, Star, ArrowRight } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { getVerseForAge } from "@/lib/bible-data"
import { useEffect, useState } from "react"

export default function LearningPlanPage() {
  const router = useRouter()
  const [monthlyTheme, setMonthlyTheme] = useState("")
  const childName = SessionStore.getChildName()
  const childAge = SessionStore.getChildAge()

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (currentChild) {
      const verseData = getVerseForAge(currentChild.age, currentChild.currentWeek, currentChild.programYear)

      const theme = verseData.theme || ""
      if (currentChild.age >= 8) {
        const themeParts = theme.split(" / ")
        setMonthlyTheme(themeParts[1] || themeParts[0] || "")
      } else {
        const themeParts = theme.split(" / ")
        setMonthlyTheme(themeParts[0] || "")
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
              <Star className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">{childName}'s Learning Plan</h1>
          <p className="text-xl text-muted-foreground">Your personalized Bible learning journey</p>
        </div>

        {/* Plan Details */}
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold mb-2">Age Group</h3>
                <p className="text-muted-foreground">Age {childAge} - Perfectly adapted verses and activities</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold mb-2">This Month's Theme</h3>
                <p className="text-muted-foreground">{monthlyTheme || "Loading..."}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold mb-2">Weekly Structure</h3>
                <p className="text-muted-foreground">
                  {childAge >= 8
                    ? "One weekly verse with daily devotional practice (Mon-Thu), quiz midweek, writing practice on Friday, and night reflection in the evening."
                    : "Two short verses per week (Mon-Thu), writing practice on Friday, and night reflection in the evening."}
                </p>
              </div>
            </div>
          </Card>

          {/* What to Expect */}
          <Card className="p-6 bg-accent/5 border-accent/20">
            <h3 className="font-heading text-xl font-semibold mb-4">What {childName} Will Learn</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">-</span>
                <span>Read, listen, and speak Scripture with age-appropriate pacing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">-</span>
                <span>Understand verse meaning through kid-friendly explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">-</span>
                <span>Build memory through writing practice and review</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">-</span>
                <span>Develop a prayer habit with morning and night prayers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">-</span>
                <span>Learn the Books of the Bible in order, one weekly set at a time</span>
              </li>
              {childAge >= 8 && (
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">-</span>
                  <span>Practice with devotionals and quizzes for deeper understanding</span>
                </li>
              )}
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full font-heading text-lg" onClick={() => router.push("/reminders")}>
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/add-child")}>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

