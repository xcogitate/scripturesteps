"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Award } from "lucide-react"

export default function StreaksInsightPage() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [stats, setStats] = useState({
    averageStreak: 0,
    longestStreak: { name: "", streak: 0 },
    over7Days: 0,
    over14Days: 0,
    over30Days: 0,
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin")
      return
    }

    const allChildren = SessionStore.getAllChildren()
    const sortedByStreak = [...allChildren].sort((a, b) => b.streak - a.streak)

    setChildren(sortedByStreak)

    const totalStreak = allChildren.reduce((sum, child) => sum + child.streak, 0)
    const longestStreakChild = sortedByStreak[0]

    const over7 = allChildren.filter((c) => c.streak >= 7).length
    const over14 = allChildren.filter((c) => c.streak >= 14).length
    const over30 = allChildren.filter((c) => c.streak >= 30).length

    setStats({
      averageStreak: allChildren.length > 0 ? Math.round(totalStreak / allChildren.length) : 0,
      longestStreak: { name: longestStreakChild?.name || "N/A", streak: longestStreakChild?.streak || 0 },
      over7Days: over7,
      over14Days: over14,
      over30Days: over30,
    })
    setCurrentPage(1)
  }, [router])

  const totalPages = Math.ceil(children.length / itemsPerPage)
  const paginatedChildren = children.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
              <h1 className="text-xl font-bold text-gray-900">Streak Insights</h1>
              <p className="text-xs text-gray-500">Learning streak performance analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.averageStreak}</p>
              <p className="text-xs text-gray-600">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Longest Streak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-900 truncate">{stats.longestStreak.name}</p>
              <p className="text-xs text-gray-600">{stats.longestStreak.streak} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>7+ Day Streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.over7Days}</p>
              <p className="text-xs text-gray-600">children</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>30+ Day Streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.over30Days}</p>
              <p className="text-xs text-gray-600">children</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Week Streak (7+)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Award className="w-12 h-12 text-yellow-500" />
                <div>
                  <p className="text-3xl font-bold">{stats.over7Days}</p>
                  <p className="text-sm text-gray-600">children</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Two Week Streak (14+)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Award className="w-12 h-12 text-orange-500" />
                <div>
                  <p className="text-3xl font-bold">{stats.over14Days}</p>
                  <p className="text-sm text-gray-600">children</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Month Streak (30+)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Award className="w-12 h-12 text-red-500" />
                <div>
                  <p className="text-3xl font-bold">{stats.over30Days}</p>
                  <p className="text-sm text-gray-600">children</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Children - Sorted by Streak</CardTitle>
            <CardDescription>Complete leaderboard of learning streaks</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No children registered yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedChildren.map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            // Adjusting index for global position
                            (currentPage - 1) * itemsPerPage + index === 0
                              ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                              : (currentPage - 1) * itemsPerPage + index === 1
                                ? "bg-gradient-to-br from-gray-400 to-gray-500"
                                : (currentPage - 1) * itemsPerPage + index === 2
                                  ? "bg-gradient-to-br from-orange-600 to-orange-700"
                                  : "bg-gradient-to-br from-blue-400 to-purple-500"
                          }`}
                        >
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{child.name}</p>
                          <p className="text-sm text-gray-600">
                            Age {child.age} • Week {child.currentWeek}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">{child.streak}</p>
                        <p className="text-xs text-gray-600">day{child.streak !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, children.length)} of {children.length} children
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
