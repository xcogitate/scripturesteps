"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  createExportRequest,
  getLatestExportRequest,
  getOrCreateParentSettings,
  upsertParentSettings,
} from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Shield, Download, Eye, RefreshCcw, Lock } from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"
import { Input } from "@/components/ui/input"
import { SessionStore } from "@/lib/session-store"

export default function ParentControlsPage() {
  const router = useRouter()
  const [child, setChild] = useState<any>(null)
  const [offlineDownload, setOfflineDownload] = useState(true)
  const [autoDownload, setAutoDownload] = useState(false)
  const [progressReports, setProgressReports] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exportStatus, setExportStatus] = useState("idle")
  const [exportRequestedAt, setExportRequestedAt] = useState<string | null>(null)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeMessage, setUpgradeMessage] = useState("")
  const [pinEnabled, setPinEnabled] = useState(false)
  const [pinValue, setPinValue] = useState("")
  const [pinConfirm, setPinConfirm] = useState("")
  const [storedPinHash, setStoredPinHash] = useState<string | null>(null)
  const [pinError, setPinError] = useState("")
  const [isSavingPin, setIsSavingPin] = useState(false)

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
    const loadSettings = async () => {
      const { data, error } = await getOrCreateParentSettings()
      if (!isActive) return
      if (error || !data) {
        router.push("/auth")
        return
      }
      setChild({ id: data.parent_id })
      setOfflineDownload(data.offline_enabled)
      setAutoDownload(data.auto_download_enabled)
      setProgressReports(data.progress_reports_enabled)
      setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
      setPinEnabled(data.parent_pin_enabled)
      setStoredPinHash(data.parent_pin_hash || null)
      const { data: latestExport } = await getLatestExportRequest()
      if (latestExport) {
        setExportStatus(latestExport.status)
        setExportRequestedAt(latestExport.requested_at)
      } else {
        setExportStatus("idle")
        setExportRequestedAt(null)
      }
      setIsLoading(false)
    }
    loadSettings()
    return () => {
      isActive = false
    }
  }, [router])

  const handleExportProgress = async () => {
    if (!hasPremiumAccess) {
      setUpgradeMessage("Upgrade to Starter to export a full progress report.")
      setShowUpgradeModal(true)
      return
    }
    const { data, error } = await createExportRequest("pdf")
    if (error) {
      alert("Unable to request export right now. Please try again.")
      return
    }
    setExportStatus(data?.status || "requested")
    setExportRequestedAt(data?.requested_at || new Date().toISOString())
    alert("Progress report export requested. We'll email it when it's ready.")
  }

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await upsertParentSettings({
      offline_enabled: hasPremiumAccess ? offlineDownload : false,
      auto_download_enabled: hasPremiumAccess ? autoDownload : false,
      progress_reports_enabled: progressReports,
    })
    setIsSaving(false)
    if (error) {
      alert("Unable to save settings. Please try again.")
      return
    }
    alert("Settings saved successfully")
    router.push("/settings")
  }

  const handlePinSave = async () => {
    setPinError("")
    let pinHash = storedPinHash

    if (pinEnabled) {
      const pinProvided = pinValue.trim().length > 0 || pinConfirm.trim().length > 0
      if (pinProvided) {
        if (pinValue !== pinConfirm) {
          setPinError("PIN entries do not match.")
          return
        }
        if (!/^\d{4}$/.test(pinValue)) {
          setPinError("PIN must be exactly 4 digits.")
          return
        }
        pinHash = await hashPin(pinValue)
      }

      if (!pinHash) {
        setPinError("Set a 4-digit PIN to enable Parent Access protection.")
        return
      }
    } else {
      pinHash = null
    }

    setIsSavingPin(true)
    const { error } = await upsertParentSettings({
      parent_pin_enabled: pinEnabled,
      parent_pin_hash: pinHash,
    })
    setIsSavingPin(false)
    if (error) {
      alert("Unable to save PIN settings. Please try again.")
      return
    }
    alert("Parent access PIN saved successfully")
    SessionStore.setParentAccessGranted(false)
    setStoredPinHash(pinHash)
    setPinValue("")
    setPinConfirm("")
  }

  if (!child) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Parent Controls</h1>
          <p className="text-muted-foreground mt-2">Privacy, safety, and content management</p>
        </div>

        <div className="space-y-4">
          <div className="border-t border-border/60 pt-6">
            <h2 className="font-heading text-xl font-semibold">Parent Access</h2>
            <p className="text-sm text-muted-foreground">Protect parent tools with a PIN.</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Parent Access PIN</Label>
                    <p className="text-sm text-muted-foreground">Require a PIN to open parent tools</p>
                  </div>
                </div>
                <Switch checked={pinEnabled} onCheckedChange={setPinEnabled} />
              </div>

              {pinEnabled && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Set 4-digit PIN</Label>
                    <Input
                      value={pinValue}
                      onChange={(event) => setPinValue(event.target.value)}
                      inputMode="numeric"
                      placeholder="1234"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirm PIN</Label>
                    <Input
                      value={pinConfirm}
                      onChange={(event) => setPinConfirm(event.target.value)}
                      inputMode="numeric"
                      placeholder="1234"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              )}

              {pinError && <p className="text-sm text-red-600">{pinError}</p>}
              <p className="text-xs text-muted-foreground">Your PIN is saved when you tap Save PIN.</p>
              <Button onClick={handlePinSave} disabled={isSavingPin} className="w-full">
                {isSavingPin ? "Saving..." : "Save PIN"}
              </Button>
            </CardContent>
          </Card>

          <div className="border-t border-border/60 pt-6">
            <h2 className="font-heading text-xl font-semibold">Content & Reports</h2>
            <p className="text-sm text-muted-foreground">Manage offline content, auto-download, and reports.</p>
          </div>

          {/* Offline Content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Offline Content</Label>
                    <p className="text-sm text-muted-foreground">Allow offline learning</p>
                  </div>
                </div>
                <Switch
                  checked={offlineDownload}
                  onCheckedChange={(checked) => {
                    if (!hasPremiumAccess) {
                      setUpgradeMessage("Upgrade to Starter to enable offline content.")
                      setShowUpgradeModal(true)
                      return
                    }
                    setOfflineDownload(checked)
                  }}
                />
              </div>
              {!hasPremiumAccess && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Lock className="w-3 h-3" />
                  Starter plan required.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto Download */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <RefreshCcw className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Auto-Download</Label>
                    <p className="text-sm text-muted-foreground">Automatically download weekly content</p>
                  </div>
                </div>
                <Switch
                  checked={autoDownload}
                  onCheckedChange={(checked) => {
                    if (!hasPremiumAccess) {
                      setUpgradeMessage("Upgrade to Starter to enable auto-download.")
                      setShowUpgradeModal(true)
                      return
                    }
                    setAutoDownload(checked)
                  }}
                />
              </div>
              {!hasPremiumAccess && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Lock className="w-3 h-3" />
                  Starter plan required.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Reports */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Progress Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly progress updates</p>
                  </div>
                </div>
                <Switch
                  checked={progressReports}
                  onCheckedChange={(checked) => {
                    setProgressReports(checked)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Progress */}
          <Card className="transition-shadow cursor-pointer hover:shadow-md" onClick={handleExportProgress}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base">Export Progress Report</h3>
                    <p className="text-sm text-muted-foreground">
                      {!hasPremiumAccess
                        ? "Upgrade to Starter to export a full progress report."
                        : exportStatus === "requested"
                        ? `Export requested${exportRequestedAt ? ` on ${new Date(exportRequestedAt).toLocaleDateString()}` : ""}. We'll email it soon.`
                        : "Download learning history"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full mt-6" size="lg" onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>

        {!hasPremiumAccess && (
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => {
              setUpgradeMessage("Upgrade to Starter to unlock offline content and exports.")
              setShowUpgradeModal(true)
            }}
          >
            Upgrade to Starter
          </Button>
        )}

        {/* Info Box */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Parent controls ensure a safe and appropriate learning experience. All data is stored securely and
              privately.
            </p>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Upgrade to Starter"
        description={upgradeMessage || "Upgrade to Starter to access this feature."}
        onUpgrade={() => router.push("/settings/billing")}
      />
    </div>
  )
}
