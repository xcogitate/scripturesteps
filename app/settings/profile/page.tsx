"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { calculateAge } from "@/lib/age-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Lock, Calendar, Trash2, Camera } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { getAvatarPresets, getPresetAvatarSrc, isPresetAvatar } from "@/lib/avatar-presets"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
      setName(currentChild.name)
      if (currentChild.avatar) {
        if (isPresetAvatar(currentChild.avatar)) {
          const presetId = currentChild.avatar.replace("preset:", "")
          setAvatarUrl(getPresetAvatarSrc(presetId))
        } else if (currentChild.avatar.startsWith("http")) {
          setAvatarUrl(currentChild.avatar)
        } else if (supabase) {
          supabase.storage
            .from("avatars")
            .createSignedUrl(currentChild.avatar, 60 * 60 * 24)
            .then(({ data, error }) => {
              if (!error && data?.signedUrl) {
                setAvatarUrl(data.signedUrl)
              }
            })
        }
      }
    }
  }, [router])

  const handleSave = async () => {
    if (!name.trim() || !child) return

    setIsSaving(true)

    const updatedChild: ChildProfile = {
      ...child,
      name: name.trim(),
    }

    if (supabase) {
      const { error } = await supabase
        .from("children")
        .update({
          name: updatedChild.name,
          avatar_path: updatedChild.avatar ?? null,
        })
        .eq("id", child.id)
      if (error) {
        alert("Unable to save changes. Please try again.")
        setIsSaving(false)
        return
      }
    }

    SessionStore.updateChildProfile(updatedChild)

    setTimeout(() => {
      setIsSaving(false)
      router.push("/settings")
    }, 500)
  }

  const handleDelete = async () => {
    if (!child) return

    if (supabase) {
      await supabase.from("children").delete().eq("id", child.id)
    }

    SessionStore.deleteChild(child.id)

    const remainingChildren = SessionStore.getAllChildren()
    if (remainingChildren.length > 0) {
      router.push("/parent-dashboard")
    } else {
      router.push("/add-child")
    }
  }

  if (!child) return null

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !child) return
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
      const path = `${authData.user.id}/${child.id}-${Date.now()}.${extension}`

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

      const { error: updateError } = await supabase
        .from("children")
        .update({ avatar_path: path })
        .eq("id", child.id)
      if (updateError) {
        alert("Unable to save profile photo. Please try again.")
        return
      }

      const updatedChild: ChildProfile = {
        ...child,
        avatar: path,
      }
      SessionStore.updateChildProfile(updatedChild)
      setChild(updatedChild)
      setAvatarUrl(signedData.signedUrl)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handlePresetSelect = (presetId: string) => {
    if (!child) return
    const updatedChild: ChildProfile = {
      ...child,
      avatar: `preset:${presetId}`,
    }
    if (supabase) {
      supabase
        .from("children")
        .update({ avatar_path: updatedChild.avatar })
        .eq("id", child.id)
        .then(({ error }) => {
          if (error) {
            alert("Unable to save preset avatar. Please try again.")
          }
        })
    }
    SessionStore.updateChildProfile(updatedChild)
    setChild(updatedChild)
    setAvatarUrl(getPresetAvatarSrc(presetId))
  }

  const birthdateValue = child.birthdate ? new Date(child.birthdate) : null
  const hasValidBirthdate = Boolean(birthdateValue && !Number.isNaN(birthdateValue.getTime()))
  const birthdateInPast = hasValidBirthdate && birthdateValue <= new Date()
  const currentAge =
    typeof child.age === "number" && child.age > 0
      ? child.age
      : birthdateInPast && birthdateValue
        ? calculateAge(birthdateValue)
        : 0
  const birthdateDisplay =
    birthdateInPast && birthdateValue
      ? birthdateValue.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not set"

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <div className="relative w-16 h-16 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={`${child.name} avatar`} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
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
          <h1 className="font-heading text-3xl font-bold">Child Profile</h1>
          <p className="text-muted-foreground mt-2">Update your child's information</p>
          {isUploading && <p className="text-sm text-muted-foreground mt-2">Uploading photo...</p>}
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="childName" className="text-base font-medium">
                Child's Name
              </Label>
              <Input
                id="childName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter child's name"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={birthdateDisplay}
                  disabled
                  className="text-base bg-muted cursor-not-allowed"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Birthdate is locked and cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Current Age</Label>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-2xl font-heading font-bold text-primary">{currentAge} years old</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Age is automatically calculated from birthdate and updates on their birthday
                </p>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="w-full h-12 text-base font-heading"
              size="lg"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Your child's learning content automatically adjusts as they grow older. The curriculum is designed for
              ages 4-12.
            </p>
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card className="mt-6 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold mb-1 text-destructive">Delete Child Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently remove this child's profile and all their learning progress. This action cannot be undone.
                </p>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete <strong>{child?.name}'s</strong> account and remove all their
                        learning progress, writing samples, and streak data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
