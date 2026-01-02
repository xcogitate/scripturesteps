"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Bell, Sun, Moon } from "lucide-react"
import { getOrCreateParentSettings, upsertParentSettings } from "@/lib/parent-settings"

export default function RemindersPage() {
  const router = useRouter()
  const [morningTime, setMorningTime] = useState("08:00")
  const [nightTime, setNightTime] = useState("19:00")
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
  const [isSaving, setIsSaving] = useState(false)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  useEffect(() => {
    let isActive = true
    const loadSettings = async () => {
      const { data } = await getOrCreateParentSettings()
      if (!isActive || !data) return
      setMorningTime(data.reminder_morning_time)
      setNightTime(data.reminder_evening_time)
      setSelectedDays(data.reminder_days.length ? data.reminder_days : days)
    }
    loadSettings()
    return () => {
      isActive = false
    }
  }, [])

  const handleSave = async () => {
    // Request notification permission
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      console.log("[v0] Notification permission:", permission)
    }

    setIsSaving(true)
    const { error } = await upsertParentSettings({
      reminder_morning_enabled: true,
      reminder_evening_enabled: true,
      reminder_morning_time: morningTime,
      reminder_evening_time: nightTime,
      reminder_days: selectedDays,
    })
    setIsSaving(false)
    if (error) {
      alert("Unable to save reminder settings. Please try again.")
      return
    }

    // Navigate to offline download page (next step in onboarding)
    router.push("/offline-download")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
              <Bell className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Set Reminders</h1>
          <p className="text-xl text-muted-foreground">We'll send gentle reminders for morning and bedtime sessions</p>
        </div>

        {/* Reminder Settings */}
        <div className="space-y-4">
          {/* Morning Time */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <Sun className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold">Morning Session</h3>
                <p className="text-sm text-muted-foreground">Start the day with God's word</p>
              </div>
            </div>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-lg font-sans"
            />
          </Card>

          {/* Night Time */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold">Bedtime Session</h3>
                <p className="text-sm text-muted-foreground">End the day with peace</p>
              </div>
            </div>
            <input
              type="time"
              value={nightTime}
              onChange={(e) => setNightTime(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-lg font-sans"
            />
          </Card>

          {/* Days Selection */}
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Reminder Days</h3>
            <div className="flex gap-2 flex-wrap">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 min-w-[60px] px-4 py-3 rounded-xl font-heading transition-all ${
                    selectedDays.includes(day)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-heading text-lg"
            onClick={handleSave}
            disabled={selectedDays.length === 0 || isSaving}
          >
            {isSaving ? "Saving..." : "Continue"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/add-child")}>
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  )
}
