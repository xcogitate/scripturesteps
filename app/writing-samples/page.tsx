"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Calendar } from "lucide-react"
import type { ChildProfile, WritingSample } from "@/lib/types"
import { calculateAge } from "@/lib/age-calculator"

export default function WritingSamplesPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [samples, setSamples] = useState<WritingSample[]>([])

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
      setSamples(currentChild.writingSamples || [])
    }
  }, [router])

  if (!child) return null

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const age = child.birthdate ? calculateAge(new Date(child.birthdate)) : child.age

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/parent-progress")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Progress Tracking
        </Button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">{child.name}'s Writing Samples</h1>
          <p className="text-muted-foreground mt-2">
            Age {age} • {samples.length} sample{samples.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-4">
          {samples.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-heading text-xl font-semibold mb-2">No writing samples yet</h3>
              <p className="text-muted-foreground">
                Writing samples will appear here as {child.name} completes writing activities
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {samples.map((sample, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-muted-foreground">{formatDate(sample.date)}</p>
                      </div>
                      <p className="font-handwriting text-xl text-foreground leading-relaxed">{sample.verse}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
