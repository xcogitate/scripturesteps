"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Edit, Save, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type AdminVerseWeek = {
  week: number
  month: string
  theme4to7: string
  theme8to12: string
  verseA: {
    age4: string
    age5: string
    age6: string
    age7: string
  }
  verseB: {
    age4: string
    age5: string
    age6: string
    age7: string
  }
  age8to12: {
    verse: string
    reference: string
  }
}

export default function VersesManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [weeks, setWeeks] = useState<AdminVerseWeek[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWeek, setSelectedWeek] = useState<AdminVerseWeek | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("content_management")) {
      router.push("/admin/login")
    }
  }, [router])

  const loadYears = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/curriculum")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load years.")
      const availableYears = Array.isArray(data?.years) ? data.years : []
      setYears(availableYears)
      if (availableYears.length) {
        setSelectedYear((prev) => prev ?? availableYears[0])
      }
    } catch (error: any) {
      toast({ title: "Unable to load years", description: error?.message || "Try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const loadWeeks = async (year: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/curriculum?year=${year}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load weeks.")
      setWeeks(Array.isArray(data?.weeks) ? data.weeks : [])
    } catch (error: any) {
      toast({ title: "Unable to load weeks", description: error?.message || "Try again." })
      setWeeks([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadYears()
  }, [])

  useEffect(() => {
    if (selectedYear) {
      loadWeeks(selectedYear)
    }
  }, [selectedYear])

  const filteredWeeks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return weeks
    return weeks.filter((week) => {
      return (
        week.month.toLowerCase().includes(query) ||
        week.theme4to7.toLowerCase().includes(query) ||
        week.theme8to12.toLowerCase().includes(query) ||
        week.age8to12.verse.toLowerCase().includes(query) ||
        week.verseA.age4.toLowerCase().includes(query) ||
        week.verseB.age4.toLowerCase().includes(query)
      )
    })
  }, [weeks, searchQuery])

  const completionStats = useMemo(() => {
    if (!weeks.length) return { completed: 0, total: 52 }
    const completed = weeks.filter((week) => {
      return (
        week.theme4to7 &&
        week.theme8to12 &&
        week.verseA.age4 &&
        week.verseB.age4 &&
        week.age8to12.verse &&
        week.age8to12.reference
      )
    }).length
    return { completed, total: weeks.length }
  }, [weeks])

  const handleEditWeek = (week: AdminVerseWeek) => {
    setSelectedWeek({ ...week })
    setIsEditing(true)
  }

  const handleSaveWeek = async () => {
    if (!selectedWeek || !selectedYear) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/curriculum", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programYear: selectedYear,
          ...selectedWeek,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to save week.")

      setWeeks((prev) => prev.map((item) => (item.week === selectedWeek.week ? selectedWeek : item)))
      setIsEditing(false)
      setSelectedWeek(null)
      toast({ title: "Week updated", description: `Year ${selectedYear}, Week ${selectedWeek.week} saved.` })
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.message || "Try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateYear = async () => {
    const nextYear = Math.max(0, ...years) + 1
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programYear: nextYear, mode: "create" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to create year.")
      await loadYears()
      setSelectedYear(nextYear)
      toast({ title: "Year created", description: `Year ${nextYear} is ready to edit.` })
    } catch (error: any) {
      toast({ title: "Create failed", description: error?.message || "Try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedCurriculum = async () => {
    setIsSeeding(true)
    try {
      const res = await fetch("/api/admin/curriculum/seed", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Unable to seed curriculum.")
      await loadYears()
      toast({ title: "Curriculum seeded", description: "Years 1-4 are ready to edit." })
    } catch (error: any) {
      toast({ title: "Seeding failed", description: error?.message || "Try again." })
    } finally {
      setIsSeeding(false)
    }
  }

  const yearLabel = (year: number) => (year <= 4 ? "Library" : "Custom")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/content")}> 
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Bible Verses Management</h1>
              <p className="text-xs text-gray-500">Manage 52-week verse plans across multiple years</p>
            </div>
            <Button onClick={handleCreateYear}>
              <Plus className="w-4 h-4 mr-2" />
              New Year
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && !weeks.length ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">Loading curriculum...</CardContent>
          </Card>
        ) : years.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div>
                <h2 className="text-lg font-semibold">No curriculum found</h2>
                <p className="text-sm text-gray-500">
                  Seed Years 1-4 into Supabase to start managing the weekly plans.
                </p>
              </div>
              <Button onClick={handleSeedCurriculum} disabled={isSeeding}>
                {isSeeding ? "Seeding..." : "Seed Curriculum"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Program Year</label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedYear ?? undefined}
                    onChange={(event) => {
                      setSelectedYear(Number(event.target.value))
                      setSelectedWeek(null)
                      setIsEditing(false)
                    }}
                    className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        Year {year} ({yearLabel(year)})
                      </option>
                    ))}
                  </select>
                  <Badge variant="secondary">
                    {completionStats.completed}/{completionStats.total} complete
                  </Badge>
                </div>
              </div>

              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by month, theme, or verse..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Weeks ({filteredWeeks.length})</CardTitle>
                    <CardDescription>Click a week to edit its themes and verses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[650px] overflow-y-auto">
                      {filteredWeeks.map((week) => {
                        const hasContent =
                          week.theme4to7 ||
                          week.theme8to12 ||
                          week.verseA.age4 ||
                          week.verseB.age4 ||
                          week.age8to12.verse
                        return (
                          <div
                            key={`year-${selectedYear}-week-${week.week}`}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleEditWeek(week)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Week {week.week}</h3>
                                <p className="text-sm text-gray-600">{week.month || "Unassigned month"}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Ages 4-7</Badge>
                                <span className="text-xs text-gray-600">
                                  {week.theme4to7 || "Theme not set"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Ages 8-12</Badge>
                                <span className="text-xs text-gray-600">
                                  {week.theme8to12 || "Theme not set"}
                                </span>
                              </div>
                              {!hasContent && (
                                <Badge variant="secondary" className="mt-1">
                                  Missing content
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedWeek && isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Edit Year {selectedYear} - Week {selectedWeek.week}
                      </CardTitle>
                      <CardDescription>Update themes and verses for each age group</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[650px] overflow-y-auto">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Month</label>
                        <Input
                          value={selectedWeek.month}
                          onChange={(event) => setSelectedWeek({ ...selectedWeek, month: event.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Theme (Ages 4-7)</label>
                        <Input
                          value={selectedWeek.theme4to7}
                          onChange={(event) =>
                            setSelectedWeek({ ...selectedWeek, theme4to7: event.target.value })
                          }
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Age 4 Verses</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse A</label>
                            <Textarea
                              value={selectedWeek.verseA.age4}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseA: { ...selectedWeek.verseA, age4: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse B</label>
                            <Textarea
                              value={selectedWeek.verseB.age4}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseB: { ...selectedWeek.verseB, age4: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Age 5 Verses</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse A</label>
                            <Textarea
                              value={selectedWeek.verseA.age5}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseA: { ...selectedWeek.verseA, age5: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse B</label>
                            <Textarea
                              value={selectedWeek.verseB.age5}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseB: { ...selectedWeek.verseB, age5: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Age 6 Verses</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse A</label>
                            <Textarea
                              value={selectedWeek.verseA.age6}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseA: { ...selectedWeek.verseA, age6: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse B</label>
                            <Textarea
                              value={selectedWeek.verseB.age6}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseB: { ...selectedWeek.verseB, age6: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Age 7 Verses</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse A</label>
                            <Textarea
                              value={selectedWeek.verseA.age7}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseA: { ...selectedWeek.verseA, age7: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse B</label>
                            <Textarea
                              value={selectedWeek.verseB.age7}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  verseB: { ...selectedWeek.verseB, age7: event.target.value },
                                })
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Theme (Ages 8-12)</label>
                        <Input
                          value={selectedWeek.theme8to12}
                          onChange={(event) =>
                            setSelectedWeek({ ...selectedWeek, theme8to12: event.target.value })
                          }
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Ages 8-12 Verse</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Verse Text</label>
                            <Textarea
                              value={selectedWeek.age8to12.verse}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  age8to12: { ...selectedWeek.age8to12, verse: event.target.value },
                                })
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Reference</label>
                            <Input
                              value={selectedWeek.age8to12.reference}
                              onChange={(event) =>
                                setSelectedWeek({
                                  ...selectedWeek,
                                  age8to12: { ...selectedWeek.age8to12, reference: event.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveWeek} className="flex-1" disabled={isSaving}>
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setSelectedWeek(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12 text-gray-500">
                        <Edit className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Select a week to edit</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
