import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Star, Heart, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Bible Verses for Kids to Memorize - 52 Weekly Scripture Verses",
  description:
    "Discover 52 age-appropriate Bible verses for kids ages 4-12 to memorize. Interactive memory games, printable activities, and fun quizzes to help children learn scripture.",
  keywords:
    "bible verses for kids to memorize, scripture memory for children, kids memory verses, bible memorization activities, printable bible verses for kids",
  openGraph: {
    title: "Bible Verses for Kids to Memorize - Free Weekly Scripture",
    description: "52 Bible verses designed for children ages 4-12. Fun memory games and activities included.",
  },
}

export default function BibleVersesForKidsPage() {
  const benefits = [
    "52 weekly Bible verses curated for ages 4-12",
    "Age-appropriate language and explanations",
    "Interactive memory verse games",
    "Printable activity sheets included",
    "Progress tracking for parents",
    "Voice-guided verse practice",
  ]

  const popularVerses = [
    { reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", age: "Ages 4-7" },
    { reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart...", age: "Ages 8-12" },
    { reference: "John 3:16", text: "For God so loved the world...", age: "Ages 4-12" },
    { reference: "Philippians 4:13", text: "I can do all things through Christ...", age: "Ages 8-12" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalApplication",
            name: "Bible Verses for Kids to Memorize",
            description: "Interactive Bible verse memorization platform for children ages 4-12",
            applicationCategory: "EducationalApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            educationalLevel: "Elementary School",
            audience: {
              "@type": "EducationalAudience",
              audienceType: "Children",
              educationalRole: "Student",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground">
              Bible Verses for Kids to Memorize
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Help your children hide God's Word in their hearts with 52 weekly Bible verses designed specifically for
              ages 4-12
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild className="text-lg px-8 py-6 rounded-2xl">
                <Link href="/auth">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 rounded-2xl bg-transparent">
                <Link href="/resources">
                  View Sample Verses
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Why Children Love Our Bible Verse Program
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Verses Section */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Memory Verses for Kids
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            These beloved scriptures are perfect for children to memorize
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {popularVerses.map((verse, index) => (
              <Card key={index} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-primary">{verse.reference}</h3>
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{verse.age}</span>
                </div>
                <p className="text-lg leading-relaxed">{verse.text}</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Learn this verse <Star className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            How Bible Verse Memorization Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold">1. Learn Weekly Verses</h3>
              <p className="text-muted-foreground">
                Each week features a new Bible verse tailored to your child's age and comprehension level
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold">2. Practice Daily</h3>
              <p className="text-muted-foreground">
                Interactive games, writing practice, and voice recording help reinforce memory
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold">3. Celebrate Progress</h3>
              <p className="text-muted-foreground">
                Track streaks, earn achievements, and see your child grow in God's Word
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Start Your Child's Bible Memory Journey Today</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of families helping their children learn scripture in a fun, engaging way
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6 rounded-2xl">
            <Link href="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">No credit card required • 100% free • Safe for children</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-heading text-xl font-bold mb-3">
                What ages is this Bible verse program designed for?
              </h3>
              <p className="text-muted-foreground">
                Our program is specifically designed for children ages 4-12, with age-appropriate verses and activities
                for each developmental stage.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-heading text-xl font-bold mb-3">How long does it take to memorize a verse?</h3>
              <p className="text-muted-foreground">
                Children typically memorize verses within 3-7 days with daily 5-10 minute practice sessions using our
                interactive games and activities.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-heading text-xl font-bold mb-3">Can I track my child's progress?</h3>
              <p className="text-muted-foreground">
                Yes! Parents have access to a dedicated dashboard showing verse completion, learning streaks, writing
                samples, and speaking practice attempts.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
