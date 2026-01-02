"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, LogOut } from "lucide-react"

export default function ChildSettingsPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
    }
  }, [router])

  const handleLogout = () => {
    router.push("/parent-dashboard")
  }

  if (!child) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="font-heading text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-4">
          {/* Logout */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-destructive/20">
            <CardContent className="p-6" onClick={handleLogout}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-destructive">Exit to Parent</h3>
                    <p className="text-sm text-muted-foreground">Return to parent dashboard</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground space-y-1">
          <p>Bible Time for Kids v1.0</p>
          <p>Made with love for children and families</p>
        </div>
      </div>
    </div>
  )
}
