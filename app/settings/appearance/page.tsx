"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Moon, Sun, Palette } from "lucide-react"

export default function AppearanceSettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [autoTheme, setAutoTheme] = useState(true)

  const handleSave = () => {
    // Save theme preferences
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    alert("Theme settings saved")
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
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Appearance</h1>
          <p className="text-muted-foreground mt-2">Customize the app's look and feel</p>
        </div>

        <div className="space-y-4">
          {/* Dark Mode */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Auto Theme */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Sun className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Auto Theme</Label>
                    <p className="text-sm text-muted-foreground">Match system theme</p>
                  </div>
                </div>
                <Switch checked={autoTheme} onCheckedChange={setAutoTheme} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full mt-6" size="lg" onClick={handleSave}>
          Save Changes
        </Button>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Changes to the theme will be applied immediately. Auto theme follows your device's system preferences.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
