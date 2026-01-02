"use client"

import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { Download, Check, Wifi, ArrowRight } from "lucide-react"
import { getOrCreateParentSettings, upsertParentSettings } from "@/lib/parent-settings"
import { hasPremiumAccess as computePremiumAccess } from "@/lib/subscription"
import { SessionStore } from "@/lib/session-store"
import { prefetchOfflineContent } from "@/lib/offline-download"
import { useToast } from "@/components/ui/use-toast"
import { UpgradeModal } from "@/components/upgrade-modal"

function OfflineDownloadContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get("source")
  const isFromParentDashboard = source === "parent"
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [autoDownload, setAutoDownload] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let isActive = true
    const loadSettings = async () => {
      const { data } = await getOrCreateParentSettings()
      if (!isActive || !data) return
      setAutoDownload(data.auto_download_enabled)
      setDownloadComplete(data.content_downloaded)
      setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
      setIsLoading(false)
    }
    loadSettings()
    return () => {
      isActive = false
    }
  }, [])

  const handleDownload = async () => {
    if (!hasPremiumAccess) {
      setShowUpgradeModal(true)
      return
    }
    setIsDownloading(true)
    toast({
      title: "Downloading offline content",
      description: "We're saving this week's lessons so they work without internet.",
    })

    try {
      const child = SessionStore.getCurrentChild()
      const age = child?.age || 6
      const week = child?.currentWeek || 1
      const programYear = child?.programYear || 1
      await prefetchOfflineContent({ age, week, programYear })

      setDownloadComplete(true)
      await upsertParentSettings({
        auto_download_enabled: autoDownload,
        offline_enabled: true,
        content_downloaded: true,
        last_download_at: new Date().toISOString(),
      })

      toast({
        title: "Offline content ready",
        description: "This week's lessons are saved on this device.",
      })
    } catch {
      toast({
        title: "Download failed",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleContinue = async () => {
    await upsertParentSettings({
      auto_download_enabled: hasPremiumAccess ? autoDownload : false,
      offline_enabled: hasPremiumAccess ? downloadComplete : false,
    })
    router.push(isFromParentDashboard ? "/parent-dashboard" : "/dashboard")
  }

  const handleToggleAutoDownload = () => {
    if (!hasPremiumAccess) {
      setShowUpgradeModal(true)
      return
    }
    setAutoDownload((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-lg">
              {downloadComplete ? (
                <Check className="w-10 h-10 text-accent-foreground" />
              ) : (
                <Download className="w-10 h-10 text-accent-foreground" />
              )}
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {downloadComplete ? "All Set!" : "Download Content"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {downloadComplete ? "Content is ready for offline use" : "Get this week's content for offline learning"}
          </p>
        </div>

        {/* Download Options */}
        {!downloadComplete && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold mb-2">Offline Learning</h3>
                  <p className="text-muted-foreground">
                    Download content to use the app without internet connection. Perfect for trips or low-connectivity
                    areas.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>This Week's Verses</span>
                  <span className="font-semibold">2 verses</span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Files</span>
                  <span className="font-semibold">4 files</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size</span>
                  <span className="font-semibold">~2.5 MB</span>
                </div>
              </div>
            </Card>

            {/* Auto Download Toggle */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold mb-1">Auto-Download</h3>
                  <p className="text-sm text-muted-foreground">Automatically download new content each week</p>
                </div>
                <button
                  onClick={handleToggleAutoDownload}
                  className={`w-14 h-8 rounded-full transition-all ${autoDownload ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                      autoDownload ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* Success Message */}
        {downloadComplete && (
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2">Ready to Learn!</h3>
                <p className="text-muted-foreground">
                  All content is downloaded and ready for offline use. You can now start your Bible learning journey.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3">
          {!downloadComplete ? (
            <>
              <Button
                size="lg"
                className="w-full font-heading text-lg"
                onClick={handleDownload}
                disabled={isDownloading || isLoading}
              >
                {isDownloading ? (
                  <>
                    <Download className="mr-2 w-5 h-5 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    Download Now
                    <Download className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              {isFromParentDashboard ? (
                <Button variant="ghost" className="w-full" onClick={() => router.push("/parent-dashboard")}>
                  Back to Parent Dashboard
                </Button>
              ) : (
                <Button variant="ghost" className="w-full" onClick={handleContinue}>
                  Skip for Now
                </Button>
              )}
            </>
          ) : (
            <Button size="lg" className="w-full font-heading text-lg" onClick={handleContinue}>
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        title="Offline downloads are in Starter"
        description="Upgrade to Starter to save weekly content and use ScriptureSteps without internet."
        onUpgrade={() => router.push("/settings/billing")}
      />
    </div>
  )
}

export default function OfflineDownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5" />}>
      <OfflineDownloadContent />
    </Suspense>
  )
}
