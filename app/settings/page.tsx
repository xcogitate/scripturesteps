"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import { calculateAge } from "@/lib/age-calculator"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import {
  ArrowLeft,
  Users,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
  User,
  Moon,
  CreditCard,
  HelpCircle,
} from "lucide-react"

export default function ParentSettingsPage() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])

  useEffect(() => {
    let isActive = true
    const loadChildren = async () => {
      if (!supabase) {
        const loadedChildren = SessionStore.getAllChildren()
        setChildren(loadedChildren)
        return
      }

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        const loadedChildren = SessionStore.getAllChildren()
        setChildren(loadedChildren)
        return
      }

      const { data, error } = await supabase
        .from("children")
        .select("id,name,age,birthdate,avatar_path,created_at")
        .eq("parent_id", authData.user.id)
        .order("created_at", { ascending: true })

      if (error || !data) {
        const loadedChildren = SessionStore.getAllChildren()
        setChildren(loadedChildren)
        return
      }

      const mappedChildren: ChildProfile[] = data.map((child) => ({
        id: child.id,
        name: child.name || "Child",
        birthdate: child.birthdate ? new Date(child.birthdate) : new Date(),
        age: child.age ?? 4,
        avatar: child.avatar_path || undefined,
        createdAt: child.created_at ? new Date(child.created_at) : new Date(),
        programYear: 1,
        currentWeek: 1,
        streak: 0,
        completedSessions: [],
        activities: {},
        writingSamples: [],
        speakingAttempts: [],
        dayOfWeek: 1,
        bibleBookSet: 0,
        bibleBookMasteryLevel: 0,
        bibleBookWeek: 1,
      }))

      if (isActive) {
        setChildren(mappedChildren)
        SessionStore.setAllChildren(mappedChildren)
      }
    }

    loadChildren()
    return () => {
      isActive = false
    }
  }, [])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    SessionStore.clearSession()
    router.push("/")
  }

  const handleEditProfile = (childId: string) => {
    SessionStore.switchChild(childId)
    router.push("/settings/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/parent-dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="font-heading text-3xl font-bold mb-2">Parent Settings</h1>
        <p className="text-muted-foreground mb-8">Manage children profiles and app preferences</p>

        <div className="space-y-6">
          {/* Children Management */}
          <div>
            <h2 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Children Profiles
            </h2>
            <div className="space-y-3">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-heading font-bold text-primary">
                            {child.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Age {typeof child.age === "number" ? child.age : calculateAge(new Date(child.birthdate))}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditProfile(child.id)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* App Settings */}
          <div>
            <h2 className="font-heading text-xl font-semibold mb-4">App Settings</h2>
            <div className="space-y-3">
              {/* Account Settings */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/account")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Account Settings</h3>
                        <p className="text-sm text-muted-foreground">Email and password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Reminders */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/reminders")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Reminders</h3>
                        <p className="text-sm text-muted-foreground">Set daily notifications</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/appearance")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Appearance</h3>
                        <p className="text-sm text-muted-foreground">Dark mode and theme</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Safety */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/parent-controls")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">Privacy & Safety</h3>
                        <p className="text-sm text-muted-foreground">Parental controls</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Billing & Subscription */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/billing")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Billing & Subscription</h3>
                        <p className="text-sm text-muted-foreground">Manage payment and plan</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/settings/support")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Help & Support</h3>
                        <p className="text-sm text-muted-foreground">FAQs and contact us</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Logout */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-destructive/20"
            onClick={handleLogout}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-medium text-destructive">Log Out</h3>
                    <p className="text-sm text-muted-foreground">Sign out of all profiles</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
