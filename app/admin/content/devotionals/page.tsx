"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { devotionals } from "@/lib/bible-data"
import type { Devotional } from "@/lib/bible-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Edit, Save } from "lucide-react"

export default function DevotionalsManagementPage() {
  const router = useRouter()
  const [devotionalsList, setDevotionalsList] = useState<Devotional[]>(devotionals)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("content_management")) {
      router.push("/admin/login")
    }
  }, [router])

  const filteredDevotionals = devotionalsList.filter(
    (dev) =>
      dev.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.devotion.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditDevotional = (devotional: Devotional) => {
    setSelectedDevotional({ ...devotional })
    setIsEditing(true)
  }

  const handleSaveDevotional = () => {
    if (!selectedDevotional) return

    // In production, this would save to database
    const updated = devotionalsList.map((d) => (d.week === selectedDevotional.week ? selectedDevotional : d))
    setDevotionalsList(updated)
    setIsEditing(false)
    setSelectedDevotional(null)
    alert("Devotional updated successfully!")
  }

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
              <h1 className="text-xl font-bold text-gray-900">Devotionals Management</h1>
              <p className="text-xs text-gray-500">Edit daily devotionals for ages 8-12</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search devotionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Devotionals List and Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>All Devotionals ({filteredDevotionals.length})</CardTitle>
                <CardDescription>Click to edit any devotional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredDevotionals.map((devotional) => (
                    <div
                      key={devotional.week}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleEditDevotional(devotional)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Week {devotional.week}</h3>
                          <p className="text-sm text-gray-600">{devotional.reference}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{devotional.devotion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div>
            {selectedDevotional && isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Week {selectedDevotional.week}</CardTitle>
                  <CardDescription>Update devotional content and prayer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Verse Text</label>
                    <Textarea
                      value={selectedDevotional.verse}
                      onChange={(e) => setSelectedDevotional({ ...selectedDevotional, verse: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Reference</label>
                    <Input
                      value={selectedDevotional.reference}
                      onChange={(e) => setSelectedDevotional({ ...selectedDevotional, reference: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Devotion</label>
                    <Textarea
                      value={selectedDevotional.devotion}
                      onChange={(e) => setSelectedDevotional({ ...selectedDevotional, devotion: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Prayer</label>
                    <Textarea
                      value={selectedDevotional.prayer}
                      onChange={(e) => setSelectedDevotional({ ...selectedDevotional, prayer: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveDevotional} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setSelectedDevotional(null)
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
                    <p>Select a devotional to edit</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
