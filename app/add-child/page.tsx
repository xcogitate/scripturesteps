"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile, AgeGroup } from "@/lib/types"
import { calculateAge, isValidAge } from "@/lib/age-calculator"
import { User, Sparkles, Calendar, Camera } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { getAvatarPresets, getPresetAvatarSrc } from "@/lib/avatar-presets"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"
import { UpgradeModal } from "@/components/upgrade-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AddChildPage() {
  const router = useRouter()
  const [childName, setChildName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [ageError, setAgeError] = useState("")
  const [isAdditionalChild, setIsAdditionalChild] = useState(false)
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [childId] = useState(() => (crypto?.randomUUID ? crypto.randomUUID() : `child-${Date.now()}`))
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [isPlanLoading, setIsPlanLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [existingChildrenCount, setExistingChildrenCount] = useState<number | null>(null)

  useEffect(() => {
    let isActive = true

    const loadPlanAndChildren = async () => {
      const { data } = await getOrCreateParentSettings()
      if (!isActive || !data) return
      setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
      setIsPlanLoading(false)

      if (!supabase) {
        const existingChildren = SessionStore.getAllChildren()
        setExistingChildrenCount(existingChildren.length)
        setIsAdditionalChild(existingChildren.length > 0)
        return
      }

      const { data: authData } = await supabase.auth.getUser()
      if (!isActive || !authData?.user) return
      const { count } = await supabase
        .from("children")
        .select("id", { count: "exact", head: true })
        .eq("parent_id", authData.user.id)
      const safeCount = typeof count === "number" ? count : 0
      setExistingChildrenCount(safeCount)
      setIsAdditionalChild(safeCount > 0)
    }

    loadPlanAndChildren()
    return () => {
      isActive = false
    }
  }, [])

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBirthdate(value)
    setAgeError("")

    if (value) {
      const age = calculateAge(new Date(value))
      if (!isValidAge(age)) {
        setAgeError("Child must be between 4-12 years old to use this app")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const birthdateObj = new Date(birthdate)
    const age = calculateAge(birthdateObj)

    if (!isValidAge(age)) {
      setAgeError("Child must be between 4-12 years old to use this app")
      return
    }

    if (childLimitReached) {
      setShowUpgradeModal(true)
      return
    }

    setIsLoading(true)
    let storedChildId = childId

    if (!supabase) {
      alert("Supabase is not configured.")
      setIsLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        alert("Please sign in again to create a child profile.")
        setIsLoading(false)
        return
      }

      const { data: createdChild, error: insertError } = await supabase
        .from("children")
        .insert({
          parent_id: authData.user.id,
          name: childName,
          age,
          birthdate: birthdateObj.toISOString().split("T")[0],
          avatar_path: avatar ?? null,
        })
        .select("id")
        .single()

      if (insertError || !createdChild?.id) {
        alert("Unable to save child profile. Please try again.")
        setIsLoading(false)
        return
      }

      storedChildId = createdChild.id
    } catch {
      alert("Unable to save child profile. Please try again.")
      setIsLoading(false)
      return
    }

    const childProfile: ChildProfile = {
      id: storedChildId,
      name: childName,
      birthdate: birthdateObj,
      age: age as AgeGroup,
      avatar,
      createdAt: new Date(),
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
    }

    SessionStore.addChild(childProfile)

    setTimeout(() => {
      if (isAdditionalChild) {
        router.push("/parent-dashboard")
      } else {
        router.push("/learning-plan")
      }
    }, 500)
  }

  // Calculate age to show preview
  const calculatedAge = birthdate ? calculateAge(new Date(birthdate)) : null
  const totalChildren = existingChildrenCount ?? SessionStore.getAllChildren().length
  const childLimitReached = !hasPremiumAccess && totalChildren >= 2

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!supabase) {
      alert("Supabase is not configured.")
      return
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5MB or smaller.")
      return
    }

    setIsUploading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        alert("Please sign in again to upload.")
        return
      }

      const extension = file.name.split(".").pop() || "png"
      const path = `${authData.user.id}/${childId}-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        alert("Upload failed. Please try again.")
        return
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60 * 24)

      if (signedError || !signedData?.signedUrl) {
        alert("Upload succeeded, but we could not load the image.")
        return
      }

      setAvatar(path)
      setAvatarPreview(signedData.signedUrl)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handlePresetSelect = (presetId: string) => {
    setAvatar(`preset:${presetId}`)
    setAvatarPreview(getPresetAvatarSrc(presetId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto overflow-hidden"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary-foreground" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      handleAvatarClick()
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload your photo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Choose a preset</DropdownMenuLabel>
                  {getAvatarPresets().map((preset) => (
                    <DropdownMenuItem
                      key={preset.id}
                      onSelect={() => handlePresetSelect(preset.id)}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={preset.src}
                        alt={preset.label}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      <span className="text-sm">{preset.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {isUploading && <p className="text-xs text-muted-foreground">Uploading photo...</p>}
          </div>
          <CardTitle className="font-heading text-3xl">Add Your Child</CardTitle>
          <CardDescription className="text-base">
            We'll personalize their learning experience based on age
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Name */}
            <div className="space-y-3">
              <Label htmlFor="child-name" className="text-base font-semibold">
                Child's Name *
              </Label>
              <Input
                id="child-name"
                placeholder="Enter your child's name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="birthdate" className="text-base font-semibold">
                Date of Birth *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={handleBirthdateChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="text-lg py-6 pl-12"
                />
              </div>

              {calculatedAge && isValidAge(calculatedAge) && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-primary font-medium">Age: {calculatedAge} years old</p>
                </div>
              )}

              {ageError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive font-medium">{ageError}</p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Age is automatically calculated from birthdate and updates each year. This helps us tailor verses,
                explanations, and activities.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6 font-heading"
              disabled={isLoading || isPlanLoading || !childName || !birthdate || !!ageError}
            >
              {isLoading ? (
                "Creating Profile..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Upgrade to add more"
        description="Free accounts can add up to 2 children. Upgrade to Starter to add more profiles."
        onUpgrade={() => router.push("/settings/billing")}
      />
    </div>
  )
}
