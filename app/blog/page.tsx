import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Bible Learning Blog for Parents & Educators",
  description:
    "Tips, resources, and insights for teaching children Bible verses, scripture memory techniques, and faith-based learning activities.",
}

export default function BlogPage() {
  const posts = [
    {
      slug: "top-10-bible-verses-for-kids",
      title: "Top 10 Bible Verses Every Child Should Memorize",
      excerpt:
        "Discover the most impactful scripture verses for children's spiritual development and character building.",
      date: "2024-12-20",
      author: "Sarah Johnson",
      category: "Memory Verses",
    },
    {
      slug: "how-to-make-bible-study-fun",
      title: "5 Ways to Make Bible Study Fun for Elementary Kids",
      excerpt:
        "Transform daily devotions into engaging adventures with these practical tips and interactive activities.",
      date: "2024-12-18",
      author: "Michael Chen",
      category: "Teaching Tips",
    },
    {
      slug: "bible-quiz-competition-prep",
      title: "Preparing Your Child for Bible Quiz Competitions",
      excerpt: "Expert strategies to help your child succeed in scripture memory competitions and trivia challenges.",
      date: "2024-12-15",
      author: "Pastor David Williams",
      category: "Competitions",
    },
  ]

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Bible Learning Blog</h1>
          <p className="text-xl text-muted-foreground">Resources and insights for teaching children God's Word</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.slug} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
              <span className="text-sm font-semibold text-primary">{post.category}</span>
              <h2 className="font-heading text-2xl font-bold">{post.title}</h2>
              <p className="text-muted-foreground">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>
              <Button variant="ghost" asChild className="w-full">
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
