"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminAuth } from "@/lib/admin-auth"
import type { Review } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Star, ThumbsUp, ThumbsDown, Check, X, Trash2, Eye } from "lucide-react"

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [stats, setStats] = useState<any>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      router.push("/admin")
      return
    }

    loadReviews()
  }, [filter, router])

  const loadReviews = async () => {
    const response = await fetch("/api/admin/reviews?status=all")
    const data = await response.json()
    if (!response.ok) return
    const fetchedReviews = Array.isArray(data?.reviews) ? data.reviews : []
    setAllReviews(fetchedReviews)
    setStats(data?.stats || null)
    const filteredReviews = filter === "all" ? fetchedReviews : fetchedReviews.filter((r) => r.status === filter)
    setReviews(filteredReviews)
    setCurrentPage(1)
  }

  const handleApprove = (reviewId: string) => {
    const admin = adminAuth.getCurrentAdmin()
    if (!admin) return
    fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status: "approved", adminName: admin.name }),
    }).then(() => {
      loadReviews()
      setSelectedReview(null)
    })
  }

  const handleReject = (reviewId: string) => {
    const admin = adminAuth.getCurrentAdmin()
    if (!admin) return
    fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status: "rejected", adminName: admin.name }),
    }).then(() => {
      loadReviews()
      setSelectedReview(null)
    })
  }

  const handleDelete = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      fetch(`/api/admin/reviews?reviewId=${reviewId}`, { method: "DELETE" }).then(() => {
        loadReviews()
        setSelectedReview(null)
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500"
      case "rejected":
        return "bg-red-500/10 text-red-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
    ))
  }

  // Pagination
  const totalPages = Math.ceil(reviews.length / itemsPerPage)
  const paginatedReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Review Management</h1>
              <p className="text-muted-foreground">Moderate and approve user reviews</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Reviews</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Approved</div>
              <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Average Rating</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stats.avgRating}</div>
                <div className="flex">{renderStars(Math.round(stats.avgRating))}</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Positive Sentiment</div>
              <div className="text-2xl font-bold text-green-500">{stats.sentimentRatio}%</div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({allReviews.length})
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
            Pending ({stats?.pending || 0})
          </Button>
          <Button variant={filter === "approved" ? "default" : "outline"} onClick={() => setFilter("approved")}>
            Approved ({stats?.approved || 0})
          </Button>
          <Button variant={filter === "rejected" ? "default" : "outline"} onClick={() => setFilter("rejected")}>
            Rejected ({stats?.rejected || 0})
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {paginatedReviews.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No {filter !== "all" ? filter : ""} reviews found</p>
            </Card>
          ) : (
            paginatedReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{review.parentName}</h3>
                          <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                          {review.sentiment && (
                            <Badge variant="outline" className="gap-1">
                              {review.sentiment === "good" ? (
                                <ThumbsUp className="h-3 w-3" />
                              ) : (
                                <ThumbsDown className="h-3 w-3" />
                              )}
                              {review.sentiment}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-foreground">{review.feedback}</p>

                    {review.reviewedAt && (
                      <p className="text-xs text-muted-foreground">
                        Reviewed by {review.reviewedBy} on {new Date(review.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setSelectedReview(review)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {review.status === "pending" && (
                      <>
                        <Button variant="outline" size="icon" onClick={() => handleApprove(review.id)}>
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleReject(review.id)}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleDelete(review.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Detail Modal */}
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedReview.parentName}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={getStatusColor(selectedReview.status)}>{selectedReview.status}</Badge>
                      {selectedReview.sentiment && (
                        <Badge variant="outline" className="gap-1">
                          {selectedReview.sentiment === "good" ? (
                            <ThumbsUp className="h-3 w-3" />
                          ) : (
                            <ThumbsDown className="h-3 w-3" />
                          )}
                          {selectedReview.sentiment}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedReview(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Rating</div>
                  <div className="flex">{renderStars(selectedReview.rating)}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Feedback</div>
                  <p className="text-foreground">{selectedReview.feedback}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Submitted</div>
                    <div>{new Date(selectedReview.submittedAt).toLocaleString()}</div>
                  </div>
                  {selectedReview.reviewedAt && (
                    <>
                      <div>
                        <div className="text-muted-foreground">Reviewed</div>
                        <div>{new Date(selectedReview.reviewedAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Reviewed By</div>
                        <div>{selectedReview.reviewedBy}</div>
                      </div>
                    </>
                  )}
                </div>

                {selectedReview.status === "pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => handleApprove(selectedReview.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleReject(selectedReview.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
