"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Users, Lock, Settings, Plus, BookOpen, Download } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { calculateAge } from "@/lib/age-calculator"
import { ReviewModal } from "@/components/review-modal"
import { ReviewTiming } from "@/lib/review-timing"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"
import { UpgradeModal } from "@/components/upgrade-modal"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase-client"
import { getPresetAvatarSrc } from "@/lib/avatar-presets"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ParentDashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [parentInfo, setParentInfo] = useState<{ name: string; id: string } | null>(null)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeMessage, setUpgradeMessage] = useState("")
  const [pinEnabled, setPinEnabled] = useState(false)
  const [pinHash, setPinHash] = useState<string | null>(null)
  const [parentAccessGranted, setParentAccessGranted] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinEntry, setPinEntry] = useState("")
  const [pinError, setPinError] = useState("")
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const hashPin = async (pin: string) => {
    if (!window.crypto?.subtle) return null
    const encoder = new TextEncoder()
    const data = encoder.encode(pin)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

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

    const parent = SessionStore.getCurrentParent()
    if (parent) {
      setParentInfo({ name: parent.email.split("@")[0], id: parent.id })

      // Check timing after a short delay to ensure smooth page load
      setTimeout(() => {
        if (ReviewTiming.shouldShowReviewModal()) {
          setShowReviewModal(true)
        }
      }, 2000)
    }
    const loadPlan = async () => {
      const { data } = await getOrCreateParentSettings()
      if (!isActive || !data) return
      setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
      setPinEnabled(data.parent_pin_enabled)
      setPinHash(data.parent_pin_hash || null)
      if (data.parent_pin_enabled) {
        setParentAccessGranted(SessionStore.getParentAccessGranted())
      } else {
        SessionStore.setParentAccessGranted(true)
        setParentAccessGranted(true)
      }
    }
    loadPlan()
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const resolveAvatars = async () => {
      const entries = await Promise.all(
        children.map(async (child) => {
          if (!child.avatar) return [child.id, ""]
          if (child.avatar.startsWith("preset:")) {
            return [child.id, getPresetAvatarSrc(child.avatar.replace("preset:", ""))]
          }
          if (!supabase) return [child.id, ""]
          const { data } = await supabase.storage.from("avatars").createSignedUrl(child.avatar, 60 * 60 * 24)
          return [child.id, data?.signedUrl || ""]
        }),
      )
      if (!isActive) return
      const nextMap: Record<string, string> = {}
      entries.forEach(([id, url]) => {
        if (url) nextMap[id as string] = url as string
      })
      setAvatarUrls(nextMap)
    }
    if (children.length > 0) {
      resolveAvatars().catch(() => {})
    } else {
      setAvatarUrls({})
    }
    return () => {
      isActive = false
    }
  }, [children])

  const handleStartLearning = (childId: string) => {
    SessionStore.switchChild(childId)
    router.push("/dashboard")
  }

  const handleReviewClose = () => {
    setShowReviewModal(false)
    ReviewTiming.markModalShown()
  }

  const childLimitReached = !hasPremiumAccess && children.length >= 2

  const openUpgradeModal = (message: string) => {
    setUpgradeMessage(message)
    setShowUpgradeModal(true)
  }

  const parentAccessAllowed = !pinEnabled || parentAccessGranted

  const handleParentAccessToggle = (checked: boolean) => {
    if (!checked) {
      SessionStore.setParentAccessGranted(false)
      setParentAccessGranted(false)
      setPinEntry("")
      setPinError("")
      return
    }

    if (!pinEnabled || !pinHash) {
      toast({
        title: "Parent PIN not set",
        description: "Set a PIN in Parent Controls to enable protected access.",
      })
      return
    }

    setShowPinModal(true)
  }

  const handleParentAccess = () => {
    if (!pinEnabled) return true
    if (parentAccessGranted) return true
    setShowPinModal(true)
    return false
  }

  const handleVerifyPin = async () => {
    setPinError("")
    if (!pinHash) return
    if (!/^\d{4}$/.test(pinEntry)) {
      setPinError("Enter your 4-digit PIN.")
      return
    }
    const hashed = await hashPin(pinEntry)
    if (!hashed || hashed !== pinHash) {
      setPinError("Incorrect PIN. Try again.")
      return
    }
    SessionStore.setParentAccessGranted(true)
    setParentAccessGranted(true)
    setShowPinModal(false)
    setPinEntry("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-5xl mx-auto pt-8 space-y-8">
        <div className="flex h-24 items-center justify-start -ml-2 md:h-28 md:-ml-4">
          <img
            src="/images/scripturesteps-logo.png"
            alt="ScriptureSteps"
            className="h-[140px] w-auto"
          />
        </div>

        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Family Learning Hub</h1>
          <p className="text-muted-foreground mt-2">Select a child to start their Bible learning journey</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Children</h2>
            <Button
              variant="outline"
              onClick={() => {
                if (childLimitReached) {
                  openUpgradeModal("Free accounts can add up to 2 children. Upgrade to add more profiles.")
                  return
                }
                router.push("/add-child")
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>

          {children.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-heading text-xl font-semibold mb-2">No children yet</h3>
              <p className="text-muted-foreground mb-6">Add your first child to get started</p>
              <Button onClick={() => router.push("/add-child")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => {
                const age = typeof child.age === "number" ? child.age : calculateAge(new Date(child.birthdate))

                return (
                  <Card key={child.id} className="p-6 hover:shadow-lg transition-shadow">
                    {/* Child Info */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                        {avatarUrls[child.id] ? (
                          <img
                            src={avatarUrls[child.id]}
                            alt={`${child.name} avatar`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-heading font-bold text-primary-foreground">
                            {child.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-xl font-semibold">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">Age {age}</p>
                    </div>

                    {/* Simple stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-heading font-bold text-primary">{child.streak || 0}</div>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-heading font-bold text-secondary">
                          Week {child.currentWeek || 1}
                        </div>
                        <p className="text-xs text-muted-foreground">Current Week</p>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => handleStartLearning(child.id)}>
                      <BookOpen className="w-5 h-5 mr-2" />
                      Start Learning
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t pt-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Parent Access
            </h2>
            {pinEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Locked</span>
                <Switch checked={parentAccessGranted} onCheckedChange={handleParentAccessToggle} />
              </div>
            )}
          </div>
          {pinEnabled && !parentAccessGranted && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
              Parent tools are locked. Tap any card below to enter your PIN and unlock.
            </div>
          )}
          {!pinEnabled && (
            <div className="rounded-lg border border-secondary/20 bg-secondary/5 px-4 py-3 text-sm text-muted-foreground">
              Want stricter control? Set a Parent Access PIN in Settings.
            </div>
          )}

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${parentAccessAllowed ? "" : "opacity-60"}`}>
            {/* Parent Progress Tracking Card */}
            <Card
              className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => {
                if (!handleParentAccess()) return
                router.push("/parent-progress")
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor all children's activities</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed progress for verses, speaking, writing, quizzes, and Bible books recitation
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {children.length} {children.length === 1 ? "child" : "children"} enrolled
                </span>
              </div>
            </Card>

            {/* Offline Download Card */}
            <Card
              className="p-6 border-2 border-accent/20 transition-colors hover:border-accent/40 cursor-pointer"
              onClick={() => {
                if (!handleParentAccess()) return
                if (hasPremiumAccess) {
                  router.push("/offline-download?source=parent")
                  return
                }
                openUpgradeModal("Upgrade to Starter to download weekly content for offline use.")
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Offline Downloads</h3>
                  <p className="text-sm text-muted-foreground">Save content for offline use</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {hasPremiumAccess
                  ? "Download this week’s lessons so learning works without internet."
                  : "Upgrade to Starter to download weekly content for offline use."}
              </p>
              <div className="flex items-center justify-end text-sm" />
            </Card>

            {/* Settings Card */}
            <Card
              className="p-6 border-2 border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer"
              onClick={() => {
                if (!handleParentAccess()) return
                router.push("/settings")
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage account and preferences</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Update profiles, adjust learning settings, and manage parental controls
              </p>
              <div className="flex items-center justify-end text-sm" />
            </Card>
          </div>
        </div>
      </div>

      {parentInfo && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewClose}
          parentName={parentInfo.name}
          parentId={parentInfo.id}
        />
      )}

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Upgrade to Starter"
        description={upgradeMessage}
        onUpgrade={() => router.push("/settings/billing")}
      />

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Enter Parent PIN</DialogTitle>
            <DialogDescription>Unlock parent tools for this session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                value={pinEntry}
                onChange={(event) => setPinEntry(event.target.value)}
                inputMode="numeric"
                maxLength={4}
                type="password"
                placeholder="Enter 4-digit PIN"
              />
              {pinError && <p className="text-sm text-red-600">{pinError}</p>}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPinModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleVerifyPin}>
                Unlock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
