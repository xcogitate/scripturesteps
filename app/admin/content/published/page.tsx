"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { AIContentStore, type AIContent } from "@/lib/ai-content-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, CheckCircle, Trash2 } from "lucide-react"

export default function PublishedContentPage() {
  const router = useRouter()
  const [publishedContent, setPublishedContent] = useState<AIContent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("content_management")) {
      router.push("/admin")
      return
    }
    loadPublishedContent()
  }, [router])

  const loadPublishedContent = () => {
    const approved = AIContentStore.getApprovedContent()
    setPublishedContent(approved)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to unpublish this content?")) {
      AIContentStore.deleteContent(id)
      loadPublishedContent()
    }
  }

  const filteredContent = publishedContent.filter((item) => {
    const matchesSearch =
      item.verseReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.verseText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || item.type === filter
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedContent = filteredContent.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filter])

  const getTypeColor = (type: string) => {
    const colors = {
      devotional: "bg-purple-100 text-purple-700",
      prayer: "bg-blue-100 text-blue-700",
      explanation: "bg-green-100 text-green-700",
      quiz: "bg-orange-100 text-orange-700",
    }
    return colors[type as keyof typeof colors]
  }

  const totalDevotionals = publishedContent.filter((c) => c.type === "devotional").length
  const totalPrayers = publishedContent.filter((c) => c.type === "prayer").length
  const totalExplanations = publishedContent.filter((c) => c.type === "explanation").length
  const totalQuizzes = publishedContent.filter((c) => c.type === "quiz").length

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
              <h1 className="text-xl font-bold text-gray-900">Published Content</h1>
              <p className="text-xs text-gray-500">{publishedContent.length} items published</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Devotionals</CardDescription>
              <CardTitle className="text-2xl">{totalDevotionals}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Prayers</CardDescription>
              <CardTitle className="text-2xl">{totalPrayers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Explanations</CardDescription>
              <CardTitle className="text-2xl">{totalExplanations}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quiz Questions</CardDescription>
              <CardTitle className="text-2xl">{totalQuizzes}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "devotional" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("devotional")}
          >
            Devotionals
          </Button>
          <Button variant={filter === "prayer" ? "default" : "outline"} size="sm" onClick={() => setFilter("prayer")}>
            Prayers
          </Button>
          <Button
            variant={filter === "explanation" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("explanation")}
          >
            Explanations
          </Button>
          <Button variant={filter === "quiz" ? "default" : "outline"} size="sm" onClick={() => setFilter("quiz")}>
            Quiz Questions
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search published content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {publishedContent.length === 0 ? "No published content yet" : "No content matches your search"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {publishedContent.length === 0
                    ? "Approve AI-generated content to publish it"
                    : "Try adjusting your search or filter"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedContent.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <Badge variant="outline">Age {item.age}</Badge>
                          {item.verseVariant && <Badge variant="outline">Verse {item.verseVariant}</Badge>}
                          <Badge variant="outline">Week {item.week}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{item.verseReference}</CardTitle>
                        <CardDescription className="text-xs mt-1">{item.verseText}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                    </div>
                    {item.approvedAt && (
                      <p className="text-xs text-gray-500 mt-3">
                        Approved {new Date(item.approvedAt).toLocaleDateString()} by {item.approvedBy}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex items-center justify-between border-t pt-4 mt-6">
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
                  </select>
                  <span>per page</span>
                  <span className="ml-4">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredContent.length)} of {filteredContent.length}
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
                  <span className="text-sm text-gray-600">
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
