"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart3, Settings, LogOut, MessageSquare } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<ReturnType<typeof AdminAuth.getCurrentAdmin>>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const currentAdmin = AdminAuth.getCurrentAdmin()
    if (!currentAdmin) {
      router.push("/admin")
    } else {
      setAdmin(currentAdmin)
    }
    setIsReady(true)
  }, [router])

  const handleLogout = () => {
    AdminAuth.logout()
    router.push("/admin")
  }

  if (!isReady || !admin) {
    return null
  }

  const adminCards = [
    {
      title: "User Management",
      description: "Manage parents, children, and accounts",
      icon: Users,
      href: "/admin/users",
      permission: "user_management" as const,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Content Management",
      description: "Edit verses, devotionals, and themes",
      icon: FileText,
      href: "/admin/content",
      permission: "content_management" as const,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Analytics Dashboard",
      description: "View usage stats and engagement metrics",
      icon: BarChart3,
      href: "/admin/analytics",
      permission: "analytics" as const,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Review Management",
      description: "Moderate and approve user reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
      permission: "content_management" as const,
      color: "text-pink-600 bg-pink-50",
    },
    {
      title: "System Settings",
      description: "Configure app settings and features",
      icon: Settings,
      href: "/admin/system",
      permission: "system_settings" as const,
      color: "text-orange-600 bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/images/scripturesteps-logo.png" alt="ScriptureSteps" className="h-12 md:h-16 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-xs text-gray-500">{admin.name}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {admin.name}</h2>
          <p className="text-gray-600">Manage and monitor your Bible learning platform</p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map((card) => {
            const hasPermission = AdminAuth.hasPermission(card.permission)
            const Icon = card.icon

            return (
              <Card
                key={card.title}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  !hasPermission ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => hasPermission && router.push(card.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription className="mt-1">{card.description}</CardDescription>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full justify-center" disabled={!hasPermission}>
                    {hasPermission ? "Access" : "No Permission"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
