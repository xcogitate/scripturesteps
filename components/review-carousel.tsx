"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"

export function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    let isActive = true
    const loadReviews = async () => {
      const response = await fetch("/api/reviews?status=approved&minRating=4&limit=10")
      const data = await response.json()
      if (!response.ok || !isActive) return
      const approvedReviews = Array.isArray(data?.reviews) ? data.reviews : []
      setReviews([...approvedReviews, ...approvedReviews])
    }
    loadReviews()
    return () => {
      isActive = false
    }
  }, [])

  if (reviews.length === 0) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
    ))
  }

  return (
    <div className="w-full overflow-hidden py-8">
      <h2 className="text-center font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">What Parents Say</h2>
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling container */}
        <div
          className="flex gap-6 animate-scroll"
          style={{
            animation: isAnimating ? "scroll 40s linear infinite" : "none",
          }}
          onMouseEnter={() => setIsAnimating(false)}
          onMouseLeave={() => setIsAnimating(true)}
        >
          {reviews.map((review, index) => (
            <Card
              key={`${review.id}-${index}`}
              className="min-w-[320px] p-6 bg-card border border-border flex-shrink-0"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-foreground line-clamp-4 leading-relaxed">{review.feedback}</p>
                <p className="text-xs font-medium text-muted-foreground">- {review.parentName}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
