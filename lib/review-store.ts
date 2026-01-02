import type { Review } from "./types"

class ReviewStore {
  private readonly STORAGE_KEY = "bible_app_reviews"

  // Get all reviews
  getAllReviews(): Review[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  // Get pending reviews (for admin)
  getPendingReviews(): Review[] {
    return this.getAllReviews().filter((r) => r.status === "pending")
  }

  // Get approved reviews (for frontend display)
  getApprovedReviews(): Review[] {
    return this.getAllReviews()
      .filter((r) => r.status === "approved")
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }

  // Submit a new review
  submitReview(review: Omit<Review, "id" | "status" | "submittedAt">): Review {
    const newReview: Review = {
      ...review,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      submittedAt: new Date(),
    }

    const reviews = this.getAllReviews()
    reviews.push(newReview)
    this.saveReviews(reviews)
    return newReview
  }

  // Approve a review
  approveReview(reviewId: string, adminName: string): boolean {
    const reviews = this.getAllReviews()
    const review = reviews.find((r) => r.id === reviewId)

    if (!review) return false

    review.status = "approved"
    review.reviewedAt = new Date()
    review.reviewedBy = adminName

    this.saveReviews(reviews)
    return true
  }

  // Reject a review
  rejectReview(reviewId: string, adminName: string): boolean {
    const reviews = this.getAllReviews()
    const review = reviews.find((r) => r.id === reviewId)

    if (!review) return false

    review.status = "rejected"
    review.reviewedAt = new Date()
    review.reviewedBy = adminName

    this.saveReviews(reviews)
    return true
  }

  // Delete a review
  deleteReview(reviewId: string): boolean {
    const reviews = this.getAllReviews()
    const filteredReviews = reviews.filter((r) => r.id !== reviewId)

    if (filteredReviews.length === reviews.length) return false

    this.saveReviews(filteredReviews)
    return true
  }

  // Get review statistics
  getReviewStats() {
    const reviews = this.getAllReviews()
    const approved = reviews.filter((r) => r.status === "approved")
    const pending = reviews.filter((r) => r.status === "pending")
    const rejected = reviews.filter((r) => r.status === "rejected")

    const avgRating = approved.length > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0

    const goodSentiment = approved.filter((r) => r.sentiment === "good").length
    const badSentiment = approved.filter((r) => r.sentiment === "bad").length

    return {
      total: reviews.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      avgRating: Math.round(avgRating * 10) / 10,
      goodSentiment,
      badSentiment,
      sentimentRatio: approved.length > 0 ? Math.round((goodSentiment / approved.length) * 100) : 0,
    }
  }

  private saveReviews(reviews: Review[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews))
  }
}

export const reviewStore = new ReviewStore()
