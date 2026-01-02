import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Trophy, Users, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Bible Quiz for Kids - Free Interactive Scripture Trivia Games",
  description:
    "Engaging Bible quiz games for kids ages 8-12. Test scripture knowledge with fun trivia questions, Bible competition prep, and interactive challenges. Perfect for Sunday school and home study.",
  keywords:
    "bible quiz for kids, bible trivia for kids, bible quiz competition questions, scripture quiz games, sunday school quiz, bible knowledge questions and answers",
}

export default function BibleQuizForKidsPage() {
  const features = [
    { icon: Brain, title: "Smart Questions", description: "Age-appropriate quiz questions based on weekly verses" },
    { icon: Trophy, title: "Competition Ready", description: "Prepare for Bible quiz competitions with practice mode" },
    { icon: Users, title: "Group Friendly", description: "Perfect for Sunday school, youth groups, and families" },
    { icon: Zap, title: "Instant Feedback", description: "Learn from mistakes with immediate explanations" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: "Bible Quiz for Kids",
            description: "Interactive Bible quiz games for children ages 8-12",
            educationalLevel: "Elementary School",
            typicalAgeRange: "8-12",
            interactivityType: "active",
          }),
        }}
      />

      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="font-heading text-4xl md:text-6xl font-bold">Bible Quiz for Kids</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Make Bible learning fun with interactive quizzes, trivia challenges, and competition prep for kids ages 8-12
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6 rounded-2xl">
            <Link href="/auth">
              Start Quiz Challenge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Why Kids Love Our Bible Quiz
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center space-y-3">
                <feature.icon className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-heading text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ... rest of the content similar to bible-verses page ... */}
    </div>
  )
}
