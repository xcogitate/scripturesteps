"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getOrCreateParentSettings, upsertParentSettings } from "@/lib/parent-settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bell, Sun, Moon } from "lucide-react"

export default function RemindersSettingsPage() {
  const router = useRouter()
  const [morningEnabled, setMorningEnabled] = useState(true)
  const [nightEnabled, setNightEnabled] = useState(true)
  const [morningTime, setMorningTime] = useState("08:00")
  const [nightTime, setNightTime] = useState("19:00")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true
    const loadSettings = async () => {
      const { data, error } = await getOrCreateParentSettings()
      if (!isActive) return
      if (error || !data) {
        router.push("/auth")
        return
      }
      setMorningEnabled(data.reminder_morning_enabled)
      setNightEnabled(data.reminder_evening_enabled)
      setMorningTime(data.reminder_morning_time)
      setNightTime(data.reminder_evening_time)
      setIsLoading(false)
    }
    loadSettings()
    return () => {
      isActive = false
    }
  }, [router])

  const handleSave = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    setIsSaving(true)

    const { error } = await upsertParentSettings({
      reminder_morning_enabled: morningEnabled,
      reminder_evening_enabled: nightEnabled,
      reminder_morning_time: morningTime,
      reminder_evening_time: nightTime,
    })

    setIsSaving(false)
    if (error) {
      alert("Unable to save reminder settings. Please try again.")
      return
    }
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Reminder Settings</h1>
          <p className="text-muted-foreground mt-2">Set up daily learning reminders</p>
        </div>

        <div className="space-y-4">
          {/* Morning Reminder */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <Sun className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Morning Session</Label>
                    <p className="text-sm text-muted-foreground">Start the day with God's word</p>
                  </div>
                </div>
                <Switch checked={morningEnabled} onCheckedChange={setMorningEnabled} />
              </div>

              {morningEnabled && (
                <div className="pl-[60px]">
                  <input
                    type="time"
                    value={morningTime}
                    onChange={(e) => setMorningTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-base"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Night Reminder */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Night Session</Label>
                    <p className="text-sm text-muted-foreground">End the day with reflection</p>
                  </div>
                </div>
                <Switch checked={nightEnabled} onCheckedChange={setNightEnabled} />
              </div>

              {nightEnabled && (
                <div className="pl-[60px]">
                  <input
                    type="time"
                    value={nightTime}
                    onChange={(e) => setNightTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-base"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="w-full h-12 text-base font-heading"
            size="lg"
          >
            {isSaving ? "Saving..." : "Save Reminder Settings"}
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Reminders help build consistent learning habits. You can adjust these times anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
