"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"

export default function AgeGroupsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const group = searchParams.get("group") || "4-7"

  const [children, setChildren] = useState<ChildProfile[]>([])
  const [stats, setStats] = useState({
    total: 0,
    avgStreak: 0,
    avgWeek: 0,
    totalWritings: 0,
    totalSpeaking: 0,
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin")
      return
    }

    const allChildren = SessionStore.getAllChildren()
    const filtered =
      group === "4-7"
        ? allChildren.filter((c) => c.age >= 4 && c.age <= 7)
        : allChildren.filter((c) => c.age >= 8 && c.age <= 12)

    setChildren(filtered)

    const totalStreak = filtered.reduce((sum, c) => sum + c.streak, 0)
    const totalWeek = filtered.reduce((sum, c) => sum + c.currentWeek, 0)
    const totalWritings = filtered.reduce((sum, c) => sum + (c.writingSamples?.length || 0), 0)
    const totalSpeaking = filtered.reduce((sum, c) => sum + (c.speakingAttempts?.length || 0), 0)

    setStats({
      total: filtered.length,
      avgStreak: filtered.length > 0 ? Math.round(totalStreak / filtered.length) : 0,
      avgWeek: filtered.length > 0 ? Math.round(totalWeek / filtered.length) : 0,
      totalWritings,
      totalSpeaking,
    })
  }, [router, group])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/analytics")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analytics
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Ages {group}</h1>
              <p className="text-xs text-gray-500">Detailed insights for this age group</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={group === "4-7" ? "default" : "outline"}
                size="sm"
                onClick={() => router.push("/admin/analytics/age-groups?group=4-7")}
              >
                Ages 4-7
              </Button>
              <Button
                variant={group === "8-12" ? "default" : "outline"}
                size="sm"
                onClick={() => router.push("/admin/analytics/age-groups?group=8-12")}
              >
                Ages 8-12
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Children</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.avgStreak}</p>
              <p className="text-xs text-gray-600">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Week</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.avgWeek}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Writings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalWritings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Speaking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSpeaking}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Children in Ages {group}</CardTitle>
            <CardDescription>Complete list of children in this age group</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No children in this age group yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{child.name}</p>
                        <p className="text-sm text-gray-600">
                          Age {child.age} • Week {child.currentWeek} • {child.streak} day streak
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{child.writingSamples?.length || 0} writings</p>
                      <p>{child.speakingAttempts?.length || 0} speaking</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
