"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Lock } from "lucide-react"

export default function AccountSettingsPage() {
  const router = useRouter()
  const [email] = useState("parent@example.com") // Non-editable email
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match")
      return
    }
    // Save password change logic here
    alert("Password updated successfully")
    router.push("/settings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your email and password</p>
        </div>

        <div className="space-y-6">
          {/* Email (Non-editable) */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <Label className="text-base font-medium">Email Address</Label>
                </div>
                <Input value={email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Your registered email cannot be changed</p>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-secondary" />
                  </div>
                  <Label className="text-base font-medium">Change Password</Label>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full mt-6" size="lg" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
