"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare } from "lucide-react"

export default function SpeakingInsightPage() {
  const router = useRouter()
  const [childrenWithSpeaking, setChildrenWithSpeaking] = useState<ChildProfile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageAccuracy: 0,
    averagePerChild: 0,
    highestAccuracy: { name: "", accuracy: 0 },
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin")
      return
    }

    const allChildren = SessionStore.getAllChildren()
    const withSpeaking = allChildren.filter((child) => (child.speakingAttempts?.length || 0) > 0)

    setChildrenWithSpeaking(
      withSpeaking.sort((a, b) => (b.speakingAttempts?.length || 0) - (a.speakingAttempts?.length || 0)),
    )

    const totalAttempts = allChildren.reduce((sum, child) => sum + (child.speakingAttempts?.length || 0), 0)

    let totalAccuracy = 0
    let accuracyCount = 0
    allChildren.forEach((child) => {
      child.speakingAttempts?.forEach((attempt) => {
        totalAccuracy += attempt.accuracy
        accuracyCount++
      })
    })

    const childrenWithAccuracy = allChildren
      .map((child) => {
        const attempts = child.speakingAttempts || []
        const avgAccuracy = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length : 0
        return { name: child.name, accuracy: avgAccuracy }
      })
      .sort((a, b) => b.accuracy - a.accuracy)

    setStats({
      totalAttempts,
      averageAccuracy: accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0,
      averagePerChild: allChildren.length > 0 ? Math.round(totalAttempts / allChildren.length) : 0,
      highestAccuracy: childrenWithAccuracy[0] || { name: "N/A", accuracy: 0 },
    })
    setCurrentPage(1)
  }, [router])

  const totalPages = Math.ceil(childrenWithSpeaking.length / itemsPerPage)
  const paginatedChildren = childrenWithSpeaking.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
              <h1 className="text-xl font-bold text-gray-900">Speaking Insights</h1>
              <p className="text-xs text-gray-500">Verse recitation performance analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
              <p className="text-xs text-gray-600">speaking attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.averageAccuracy}%</p>
              <p className="text-xs text-gray-600">across all attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Per Child</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.averagePerChild}</p>
              <p className="text-xs text-gray-600">attempts per child</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Highest Accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-900 truncate">{stats.highestAccuracy.name}</p>
              <p className="text-xs text-gray-600">{Math.round(stats.highestAccuracy.accuracy)}% accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Children with Speaking Practice</CardTitle>
            <CardDescription>Sorted by number of verse recitation attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {childrenWithSpeaking.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No speaking attempts recorded yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedChildren.map((child, index) => {
                    const attempts = child.speakingAttempts || []
                    const avgAccuracy =
                      attempts.length > 0
                        ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length)
                        : 0

                    return (
                      <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{child.name}</p>
                            <p className="text-sm text-gray-600">
                              Age {child.age} • {avgAccuracy}% accuracy
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">{attempts.length}</p>
                          <p className="text-xs text-gray-600">attempts</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, childrenWithSpeaking.length)} of{" "}
                      {childrenWithSpeaking.length} children
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
