"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Activity, Calendar, Clock } from "lucide-react"

export default function ActiveTodayPage() {
  const router = useRouter()
  const [activeChildren, setActiveChildren] = useState<ChildProfile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [stats, setStats] = useState({
    totalActive: 0,
    morningActive: 0,
    eveningActive: 0,
    averageActivities: 0,
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin")
      return
    }

    const today = new Date().toDateString()
    const allChildren = SessionStore.getAllChildren()
    const active = allChildren.filter(
      (child) => child.lastActivityDate && new Date(child.lastActivityDate).toDateString() === today,
    )

    setActiveChildren(active)

    // Calculate stats
    const totalActivities = active.reduce((sum, child) => {
      const todayActivities =
        child.completedSessions?.filter((session) => new Date(session).toDateString() === today).length || 0
      return sum + todayActivities
    }, 0)

    setStats({
      totalActive: active.length,
      morningActive: Math.floor(active.length * 0.6), // Mock calculation
      eveningActive: Math.floor(active.length * 0.4),
      averageActivities: active.length > 0 ? Math.round(totalActivities / active.length) : 0,
    })
    setCurrentPage(1)
  }, [router])

  const totalPages = Math.ceil(activeChildren.length / itemsPerPage)
  const paginatedChildren = activeChildren.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
              <h1 className="text-xl font-bold text-gray-900">Active Today</h1>
              <p className="text-xs text-gray-500">Children who completed activities today</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalActive}</p>
                  <p className="text-xs text-gray-600">children learning today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Time Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Morning</span>
                  <span className="text-sm font-medium">{stats.morningActive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Evening</span>
                  <span className="text-sm font-medium">{stats.eveningActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageActivities}</p>
                  <p className="text-xs text-gray-600">per child today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Children List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Children Today</CardTitle>
            <CardDescription>Detailed list of children with activity today</CardDescription>
          </CardHeader>
          <CardContent>
            {activeChildren.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No children have been active today yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedChildren.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{child.name}</p>
                          <p className="text-sm text-gray-600">
                            Age {child.age} • Week {child.currentWeek}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {child.lastActivityDate
                              ? new Date(child.lastActivityDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{child.streak} day streak</p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, activeChildren.length)} of {activeChildren.length} children
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
