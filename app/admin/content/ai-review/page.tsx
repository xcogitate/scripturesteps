"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { AIContentStore, type AIContent } from "@/lib/ai-content-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, CheckCircle, XCircle, Edit, RefreshCw } from "lucide-react"

export default function AIReviewPage() {
  const router = useRouter()
  const [pendingContent, setPendingContent] = useState<AIContent[]>([])
  const [selectedItem, setSelectedItem] = useState<AIContent | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("content_management")) {
      router.push("/admin")
      return
    }
    loadPendingContent()
  }, [router])

  const loadPendingContent = () => {
    const pending = AIContentStore.getPendingContent()
    setPendingContent(pending)
  }

  const handleApprove = (item: AIContent) => {
    const admin = AdminAuth.getCurrentAdmin()
    if (admin) {
      AIContentStore.approveContent(item.id, admin.email)
      loadPendingContent()
      setSelectedItem(null)
    }
  }

  const handleReject = (item: AIContent) => {
    AIContentStore.rejectContent(item.id)
    loadPendingContent()
    setSelectedItem(null)
  }

  const handleEdit = (item: AIContent) => {
    setSelectedItem(item)
    setEditedContent(item.content)
  }

  const handleSaveEdit = () => {
    if (selectedItem) {
      AIContentStore.updateContent(selectedItem.id, { content: editedContent })
      handleApprove(selectedItem)
    }
  }

  const handleRegenerate = (item: AIContent) => {
    alert("AI regeneration would happen here. For now, this is a placeholder.")
  }

  const filteredContent = filter === "all" ? pendingContent : pendingContent.filter((item) => item.type === filter)

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedContent = filteredContent.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

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
              <h1 className="text-xl font-bold text-gray-900">AI Content Review</h1>
              <p className="text-xs text-gray-500">{pendingContent.length} items pending approval</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All ({pendingContent.length})
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

        {/* Content List */}
        <div className="space-y-4">
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
                    </div>
                    <CardTitle className="text-base">{item.verseReference}</CardTitle>
                    <CardDescription className="text-xs mt-1">{item.verseText}</CardDescription>
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => handleApprove(item)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit & Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRegenerate(item)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(item)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredContent.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending content to review</p>
                <p className="text-sm text-gray-500 mt-1">AI-generated content will appear here for approval</p>
              </CardContent>
            </Card>
          )}

          {filteredContent.length > 0 && (
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
          )}
        </div>

        {/* Edit Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
              <CardHeader>
                <CardTitle>Edit Content</CardTitle>
                <CardDescription>
                  {selectedItem.verseReference} - {selectedItem.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="font-sans"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save & Approve
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

const getTypeColor = (type: string) => {
  const colors = {
    devotional: "bg-purple-100 text-purple-700",
    prayer: "bg-blue-100 text-blue-700",
    explanation: "bg-green-100 text-green-700",
    quiz: "bg-orange-100 text-orange-700",
  }
  return colors[type as keyof typeof colors]
}
