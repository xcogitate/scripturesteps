"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Trophy, Star, BookOpen, PenTool, Home, Volume2 } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import { getAdminSettings } from "@/lib/admin-settings"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"
import { useClapEffect } from "@/lib/use-clap-effect"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess, MAX_FREE_WEEKS } from "@/lib/subscription"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function WeeklyCelebrationPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const childName = SessionStore.getChildName()
  const weekNumber = SessionStore.getCurrentWeek()
  const adminOverrides = getAdminSettings().activityOverrides
  const effectiveDay =
    adminOverrides.enabled && adminOverrides.forceDayOfWeek ? adminOverrides.forceDayOfWeek : SessionStore.getDayOfWeek()
  const canStartNextWeek = adminOverrides.enabled && adminOverrides.unlockAll ? true : effectiveDay === 1
  const playClapEffect = useClapEffect()
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(
      `Congratulations, ${childName}! You completed week ${weekNumber}! You're doing an amazing job learning God's Word. Keep up the wonderful work!`,
    )
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
  }, [childName, weekNumber, playClapEffect])

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

  const badges = [
    { id: 1, name: "Verse Master", icon: BookOpen, color: "primary" },
    { id: 2, name: "Great Listener", icon: Volume2, color: "secondary" },
    { id: 3, name: "Writing Star", icon: PenTool, color: "accent" },
  ]

  const handleContinue = () => {
    if (!hasPremiumAccess && weekNumber >= MAX_FREE_WEEKS) {
      setShowUpgradeModal(true)
      return
    }
    if (!canStartNextWeek) return
    // Move to next week
    SessionStore.updateCurrentWeek(weekNumber + 1)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-3xl mx-auto pt-12 space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Week {weekNumber} Complete!</h1>
            <p className="text-2xl text-muted-foreground">Congratulations, {childName}! 🎉</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center bg-primary/5 border-primary/20">
            <div className="text-4xl font-heading font-bold text-primary mb-2">2</div>
            <p className="text-sm text-muted-foreground">Verses Learned</p>
          </Card>
          <Card className="p-6 text-center bg-accent/5 border-accent/20">
            <div className="text-4xl font-heading font-bold text-accent mb-2">7</div>
            <p className="text-sm text-muted-foreground">Days in a Row</p>
          </Card>
        </div>

        {/* Badges Earned */}
        <Card className="p-8">
          <h2 className="font-heading text-2xl font-bold text-center mb-6">Badges Earned This Week</h2>
          <div className="grid grid-cols-3 gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <div key={badge.id} className="text-center space-y-3">
                  <div
                    className={`w-16 h-16 mx-auto bg-${badge.color}/10 rounded-full flex items-center justify-center border-2 border-${badge.color}/30`}
                  >
                    <Icon className={`w-8 h-8 text-${badge.color}`} />
                  </div>
                  <p className="text-sm font-heading font-semibold">{badge.name}</p>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Encouragement */}
        <Card className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 border-none">
          <div className="flex items-start gap-4">
            <Star className="w-8 h-8 text-secondary flex-shrink-0 mt-1 fill-secondary" />
            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">Keep Growing!</h3>
              <p className="text-muted-foreground leading-relaxed">
                You're doing amazing, {childName}! Each week you're learning more about God's love and growing in your
                faith. Keep up the wonderful work!
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full font-heading text-lg" onClick={handleContinue} disabled={!canStartNextWeek}>
            Start Next Week
            <Star className="ml-2 w-5 h-5" />
          </Button>
          {!canStartNextWeek && (
            <p className="text-xs text-muted-foreground text-center">
              Next week unlocks on Monday.
            </p>
          )}
          <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/dashboard")}>
            <Home className="mr-2 w-5 h-5" />
            Back to Home
          </Button>
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Unlock weeks 9–52"
        description="Upgrade to Starter to continue the full 52-week curriculum."
        onUpgrade={() => router.push("/settings/billing")}
      />
    </div>
  )
}
