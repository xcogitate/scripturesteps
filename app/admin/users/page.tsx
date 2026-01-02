"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import type { ParentAccount } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Users, Baby, TrendingUp, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function UserManagementPage() {
  const router = useRouter()
  const [parents, setParents] = useState<ParentAccount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParent, setSelectedParent] = useState<ParentAccount | null>(null)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())
  const [ageFilter, setAgeFilter] = useState<"all" | "4-7" | "8-12">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadParents = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" })
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        throw new Error(errorPayload.error || "Failed to load users.")
      }
      const data = await response.json()
      setParents(data.parents || [])
    } catch (error) {
      setParents([])
      setLoadError(error instanceof Error ? error.message : "Failed to load users.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const toggleParentExpansion = (parentId: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(parentId)) {
        newSet.delete(parentId)
      } else {
        newSet.add(parentId)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("user_management")) {
      router.push("/admin")
      return
    }

    loadParents()
  }, [router, loadParents])

  const filteredParents = parents
    .map((parent) => {
      const filteredChildren =
        ageFilter === "all"
          ? parent.children
          : ageFilter === "4-7"
            ? parent.children.filter((c) => c.age >= 4 && c.age <= 7)
            : parent.children.filter((c) => c.age >= 8 && c.age <= 12)

      return { ...parent, children: filteredChildren }
    })
    .filter(
      (parent) =>
        parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.children.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )

  const allChildren = parents.flatMap((p) => p.children)
  const totalChildren = allChildren.length
  const totalParents = parents.length
  const ages4to7 = allChildren.filter((c) => c.age >= 4 && c.age <= 7).length
  const ages8to12 = allChildren.filter((c) => c.age >= 8 && c.age <= 12).length
  const avgStreak =
    allChildren.length > 0 ? Math.round(allChildren.reduce((sum, c) => sum + c.streak, 0) / allChildren.length) : 0

  const totalPages = Math.ceil(filteredParents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedParents = filteredParents.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, ageFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
              <p className="text-xs text-gray-500">Manage parent accounts and their children</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${ageFilter === "all" && !searchQuery ? "ring-2 ring-emerald-500 bg-emerald-50" : "hover:bg-gray-50"}`}
            onClick={() => {
              setAgeFilter("all")
              setSearchQuery("")
            }}
          >
            <CardHeader className="pb-3">
              <CardDescription>Total Parents</CardDescription>
              <CardTitle className="text-3xl">{totalParents}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-green-600">
                <Users className="w-3 h-3 mr-1" />
                {ageFilter === "all" && !searchQuery ? "Showing all parents" : "Click to show all"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Children</CardDescription>
              <CardTitle className="text-3xl">{totalChildren}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-blue-600">
                <Baby className="w-3 h-3 mr-1" />
                All learners
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${ageFilter === "4-7" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"}`}
            onClick={() => setAgeFilter(ageFilter === "4-7" ? "all" : "4-7")}
          >
            <CardHeader className="pb-3">
              <CardDescription>Ages 4-7</CardDescription>
              <CardTitle className="text-3xl">{ages4to7}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-purple-600">
                <Baby className="w-3 h-3 mr-1" />
                {ageFilter === "4-7" ? "Filtering..." : "Click to filter"}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${ageFilter === "8-12" ? "ring-2 ring-indigo-500 bg-indigo-50" : "hover:bg-gray-50"}`}
            onClick={() => setAgeFilter(ageFilter === "8-12" ? "all" : "8-12")}
          >
            <CardHeader className="pb-3">
              <CardDescription>Ages 8-12</CardDescription>
              <CardTitle className="text-3xl">{ages8to12}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-indigo-600">
                <GraduationCap className="w-3 h-3 mr-1" />
                {ageFilter === "8-12" ? "Filtering..." : "Click to filter"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Streak</CardDescription>
              <CardTitle className="text-3xl">{avgStreak}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-orange-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                Days active
              </div>
            </CardContent>
          </Card>
        </div>

        {ageFilter !== "all" && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Showing: Ages {ageFilter}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setAgeFilter("all")}>
              Clear filter
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by parent email or child name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              All Parent Accounts ({filteredParents.length}){ageFilter !== "all" && ` - Ages ${ageFilter}`}
            </CardTitle>
            <CardDescription>View and manage parent accounts and their children</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Loading parents...</p>
              </div>
            ) : loadError ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">{loadError}</p>
                <Button variant="outline" size="sm" onClick={loadParents}>
                  Try again
                </Button>
              </div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No parents found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedParents.map((parent) => (
                  <div key={parent.id} className="border rounded-lg overflow-hidden">
                    {/* Parent Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => toggleParentExpansion(parent.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {parent.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{parent.email}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <Badge variant="outline">{parent.children.length} children</Badge>
                            <span>{parent.subscription?.plan === "starter" ? "Starter" : "Free"} Plan</span>
                            <span className="text-xs">Joined {new Date(parent.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {expandedParents.has(parent.id) ? "▼" : "▶"}
                      </Button>
                    </div>

                    {/* Children List (Expanded) */}
                    {expandedParents.has(parent.id) && (
                      <div className="p-4 space-y-3 bg-white">
                        {parent.children.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No children added yet</p>
                        ) : (
                          parent.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors ml-8"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {child.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{child.name}</h4>
                                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                    <span>{child.age} years old</span>
                                    <span>Week {child.currentWeek}</span>
                                    <span>{child.streak} day streak</span>
                                    <span>{child.writingSamples?.length || 0} writings</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {filteredParents.length > 0 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>per page</span>
                  <span className="ml-4">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredParents.length)} of {filteredParents.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
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
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
