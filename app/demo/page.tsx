"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Play, BookOpen, ArrowRight, ArrowLeft } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"

export default function DemoPage() {
  const router = useRouter()

  const handleYoungerDemo = () => {
    const demoChild: ChildProfile = {
      id: `demo-${Date.now()}`,
      name: "Demo Child",
      age: 5,
      birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
      createdAt: new Date(),
      programYear: 1,
      currentWeek: 1,
      streak: 0,
      completedSessions: [],
      activities: {},
      writingSamples: [],
      speakingAttempts: [],
      dayOfWeek: 1,
      bibleBookSet: 0,
      bibleBookMasteryLevel: 0,
      bibleBookWeek: 1,
    }

    SessionStore.setDemoMode(true)
    SessionStore.setCurrentChild(demoChild)
    router.push("/session-intro?type=morning")
  }

  const handleOlderDemo = () => {
    const demoChild: ChildProfile = {
      id: `demo-${Date.now()}`,
      name: "Demo Teen",
      age: 10,
      birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      createdAt: new Date(),
      programYear: 1,
      currentWeek: 1,
      streak: 0,
      completedSessions: [],
      activities: {},
      writingSamples: [],
      speakingAttempts: [],
      dayOfWeek: 1,
      bibleBookSet: 0,
      bibleBookMasteryLevel: 0,
      bibleBookWeek: 1,
    }

    SessionStore.setDemoMode(true)
    SessionStore.setCurrentChild(demoChild)
    router.push("/session-intro?type=morning")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto pt-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
              <Play className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Try a Demo</h1>
          <p className="text-xl text-muted-foreground">
            See how Bible Time for Kids works with a sample learning session
          </p>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">Age 4-7 Experience</h3>
            <p className="text-muted-foreground mb-4">
              Simple verses with pictures, fun activities, and gentle guidance perfect for young learners.
            </p>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleYoungerDemo}>
              Try Age 5 Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">Age 8-12 Experience</h3>
            <p className="text-muted-foreground mb-4">
              Full verses with deeper explanations, devotionals, and prayer activities for older kids.
            </p>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleOlderDemo}>
              Try Age 10 Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </div>

        {/* What You'll See */}
        <Card className="p-6">
          <h3 className="font-heading text-xl font-semibold mb-4">What You'll Experience in the Demo</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>A personalized greeting with the child's name</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Age-appropriate Bible verse presentation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Interactive listening and speaking activities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Writing practice tailored to the age group</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Encouraging feedback and progress tracking</span>
            </li>
          </ul>
        </Card>

        {/* Back Button */}
        <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
