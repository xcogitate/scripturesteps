"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, TrendingUp, BookOpen, PenTool, MessageSquare, Award, Activity, Search } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalVerses: 0,
    totalWritings: 0,
    totalSpeaking: 0,
    avgStreak: 0,
    completionRate: 0,
    quizPasses: 0,
  })

  useEffect(() => {
    if (!AdminAuth.isAuthenticated() || !AdminAuth.hasPermission("analytics")) {
      router.push("/admin/login")
      return
    }

    // Load all children
    const allChildren = SessionStore.getAllChildren()
    setChildren(allChildren)

    // Calculate analytics
    const today = new Date().toDateString()
    const activeToday = allChildren.filter(
      (child) => child.lastActivityDate && new Date(child.lastActivityDate).toDateString() === today,
    ).length

    const totalWritings = allChildren.reduce((sum, child) => sum + (child.writingSamples?.length || 0), 0)
    const totalSpeaking = allChildren.reduce((sum, child) => sum + (child.speakingAttempts?.length || 0), 0)
    const totalStreak = allChildren.reduce((sum, child) => sum + child.streak, 0)
    const avgStreak = allChildren.length > 0 ? Math.round(totalStreak / allChildren.length) : 0

    // Calculate completion rate
    const totalPossibleActivities = allChildren.length * 5 // Assuming 5 activities per week
    const totalCompletedActivities = allChildren.reduce((sum, child) => sum + (child.completedSessions?.length || 0), 0)
    const completionRate =
      totalPossibleActivities > 0 ? Math.round((totalCompletedActivities / totalPossibleActivities) * 100) : 0

    const totalQuizPasses = allChildren.reduce((sum, child) => sum + (child.quizPasses || 0), 0)

    setAnalytics({
      totalUsers: allChildren.length,
      activeToday,
      totalVerses: allChildren.reduce((sum, child) => sum + child.currentWeek, 0),
      totalWritings,
      totalSpeaking,
      avgStreak,
      completionRate,
      quizPasses: totalQuizPasses,
    })
  }, [router])

  const statCards = [
    {
      title: "Total Children",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
      description: "Registered learners",
      interactive: false,
    },
    {
      title: "Active Today",
      value: analytics.activeToday,
      icon: Activity,
      color: "text-green-600 bg-green-50",
      description: "Completed activities today",
      interactive: true,
      route: "/admin/analytics/active-today",
    },
    {
      title: "Avg Streak",
      value: `${analytics.avgStreak} days`,
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-50",
      description: "Average learning streak",
      interactive: true,
      route: "/admin/analytics/streaks",
    },
    {
      title: "Total Verses",
      value: analytics.totalVerses,
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50",
      description: "Verses learned",
      interactive: false,
    },
    {
      title: "Total Writings",
      value: analytics.totalWritings,
      icon: PenTool,
      color: "text-pink-600 bg-pink-50",
      description: "Writing samples completed",
      interactive: true,
      route: "/admin/analytics/writings",
    },
    {
      title: "Speaking Attempts",
      value: analytics.totalSpeaking,
      icon: MessageSquare,
      color: "text-indigo-600 bg-indigo-50",
      description: "Verse recitations",
      interactive: true,
      route: "/admin/analytics/speaking",
    },
    {
      title: "Completion Rate",
      value: `${analytics.completionRate}%`,
      icon: Award,
      color: "text-yellow-600 bg-yellow-50",
      description: "Average activity completion",
      interactive: false,
    },
    {
      title: "Quiz Passes",
      value: analytics.quizPasses,
      icon: Award,
      color: "text-teal-600 bg-teal-50",
      description: "Successful quiz completions",
      interactive: false,
    },
  ]

  // Age group breakdown
  const ages4to7 = children.filter((c) => c.age >= 4 && c.age <= 7).length
  const ages8to12 = children.filter((c) => c.age >= 8 && c.age <= 12).length
  const ages4to7Percentage = analytics.totalUsers > 0 ? Math.round((ages4to7 / analytics.totalUsers) * 100) : 0
  const ages8to12Percentage = analytics.totalUsers > 0 ? Math.round((ages8to12 / analytics.totalUsers) * 100) : 0

  // Top performers
  const topPerformers = [...children]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
    .map((child) => ({
      name: child.name,
      streak: child.streak,
      writings: child.writingSamples?.length || 0,
      speaking: child.speakingAttempts?.length || 0,
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-xs text-gray-500">Usage stats and engagement metrics</p>
            </div>
            <Button onClick={() => router.push("/admin/analytics/seo")} variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              SEO Analytics
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEO Analytics featured card */}
        <Card
          className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/admin/analytics/seo")}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5 text-blue-600" />
                  SEO & Traffic Analytics
                </CardTitle>
                <CardDescription className="mt-1">
                  Track organic traffic, keyword rankings, conversion metrics, and optimize platform visibility
                </CardDescription>
              </div>
              <Button variant="default" size="sm">
                View Details
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.title}
                className={`${card.interactive ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
                onClick={() => card.interactive && card.route && router.push(card.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardDescription>{card.title}</CardDescription>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl mb-1">{card.value}</CardTitle>
                  <p className="text-xs text-gray-600">
                    {card.description}
                    {card.interactive && <span className="ml-1 text-blue-600">• Click to view details</span>}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Group Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Age Group Distribution</CardTitle>
              <CardDescription>Breakdown of learners by age group</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => router.push("/admin/analytics/age-groups?group=4-7")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Ages 4-7</span>
                  <span className="text-sm text-gray-600">
                    {ages4to7} ({ages4to7Percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${ages4to7Percentage}%` }} />
                </div>
              </div>

              <div
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => router.push("/admin/analytics/age-groups?group=8-12")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Ages 8-12</span>
                  <span className="text-sm text-gray-600">
                    {ages8to12} ({ages8to12Percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${ages8to12Percentage}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Children with the longest streaks</CardDescription>
            </CardHeader>
            <CardContent>
              {topPerformers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data available yet</p>
              ) : (
                <div className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{performer.name}</p>
                          <p className="text-xs text-gray-600">
                            {performer.writings} writings • {performer.speaking} speaking
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">{performer.streak}</p>
                        <p className="text-xs text-gray-600">day streak</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Overview of learning activities across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalVerses}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Verses Learned</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-3">
                    <PenTool className="w-10 h-10 text-pink-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalWritings}</p>
                  <p className="text-sm text-gray-600 mt-1">Writing Samples</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalSpeaking}</p>
                  <p className="text-sm text-gray-600 mt-1">Speaking Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
