"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PenTool } from "lucide-react"

export default function WritingsInsightPage() {
  const router = useRouter()
  const [childrenWithWritings, setChildrenWithWritings] = useState<ChildProfile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [stats, setStats] = useState({
    totalWritings: 0,
    averagePerChild: 0,
    mostActive: { name: "", count: 0 },
    ages4to7: 0,
    ages8to12: 0,
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin")
      return
    }

    const allChildren = SessionStore.getAllChildren()
    const withWritings = allChildren.filter((child) => (child.writingSamples?.length || 0) > 0)

    setChildrenWithWritings(
      withWritings.sort((a, b) => (b.writingSamples?.length || 0) - (a.writingSamples?.length || 0)),
    )

    const totalWritings = allChildren.reduce((sum, child) => sum + (child.writingSamples?.length || 0), 0)
    const mostActiveChild = [...allChildren].sort(
      (a, b) => (b.writingSamples?.length || 0) - (a.writingSamples?.length || 0),
    )[0]

    const ages4to7Writings = allChildren
      .filter((c) => c.age >= 4 && c.age <= 7)
      .reduce((sum, child) => sum + (child.writingSamples?.length || 0), 0)
    const ages8to12Writings = allChildren
      .filter((c) => c.age >= 8 && c.age <= 12)
      .reduce((sum, child) => sum + (child.writingSamples?.length || 0), 0)

    setStats({
      totalWritings,
      averagePerChild: allChildren.length > 0 ? Math.round(totalWritings / allChildren.length) : 0,
      mostActive: { name: mostActiveChild?.name || "N/A", count: mostActiveChild?.writingSamples?.length || 0 },
      ages4to7: ages4to7Writings,
      ages8to12: ages8to12Writings,
    })
    setCurrentPage(1)
  }, [router])

  const totalPages = Math.ceil(childrenWithWritings.length / itemsPerPage)
  const paginatedChildren = childrenWithWritings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
              <h1 className="text-xl font-bold text-gray-900">Writing Insights</h1>
              <p className="text-xs text-gray-500">Detailed writing activity analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Writings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalWritings}</p>
              <p className="text-xs text-gray-600">completed samples</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Per Child</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.averagePerChild}</p>
              <p className="text-xs text-gray-600">writing samples</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Most Active</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-900 truncate">{stats.mostActive.name}</p>
              <p className="text-xs text-gray-600">{stats.mostActive.count} writings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Age Group Split</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">4-7: {stats.ages4to7}</p>
              <p className="text-sm text-gray-600">8-12: {stats.ages8to12}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Children with Writings</CardTitle>
            <CardDescription>Sorted by number of completed writing samples</CardDescription>
          </CardHeader>
          <CardContent>
            {childrenWithWritings.length === 0 ? (
              <div className="text-center py-12">
                <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No writing samples completed yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedChildren.map((child, index) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
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
                        <p className="text-2xl font-bold text-pink-600">{child.writingSamples?.length || 0}</p>
                        <p className="text-xs text-gray-600">writing samples</p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, childrenWithWritings.length)} of{" "}
                      {childrenWithWritings.length} children
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
