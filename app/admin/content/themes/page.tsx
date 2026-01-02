"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { allVerses } from "@/lib/bible-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Calendar } from "lucide-react"

export default function ThemesManagementPage() {
  const router = useRouter()
  const [monthlyThemes, setMonthlyThemes] = useState<Record<string, { ages4to7: string; ages8to12: string }>>({})

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("content_management")) {
      router.push("/admin/login")
      return
    }

    // Extract unique monthly themes
    const themes: Record<string, { ages4to7: string; ages8to12: string }> = {}
    allVerses.forEach((verse) => {
      if (!themes[verse.month]) {
        themes[verse.month] = {
          ages4to7: verse.theme4to7,
          ages8to12: verse.theme8to12,
        }
      }
    })
    setMonthlyThemes(themes)
  }, [router])

  const handleSaveThemes = () => {
    // In production, this would save to database
    alert("Themes updated successfully!")
  }

  const months = Object.keys(monthlyThemes)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/content")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Monthly Themes</h1>
              <p className="text-xs text-gray-500">Manage themes for each month and age group</p>
            </div>
            <Button onClick={handleSaveThemes}>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {months.map((month) => (
            <Card key={month}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <CardTitle>{month}</CardTitle>
                    <CardDescription>Edit themes for this month</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme for Ages 4-7</label>
                  <Input
                    value={monthlyThemes[month].ages4to7}
                    onChange={(e) =>
                      setMonthlyThemes({
                        ...monthlyThemes,
                        [month]: { ...monthlyThemes[month], ages4to7: e.target.value },
                      })
                    }
                    placeholder="Enter theme for ages 4-7"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme for Ages 8-12</label>
                  <Input
                    value={monthlyThemes[month].ages8to12}
                    onChange={(e) =>
                      setMonthlyThemes({
                        ...monthlyThemes,
                        [month]: { ...monthlyThemes[month], ages8to12: e.target.value },
                      })
                    }
                    placeholder="Enter theme for ages 8-12"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
