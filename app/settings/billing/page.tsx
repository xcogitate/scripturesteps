"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Sparkles } from "lucide-react"
import { getOrCreateParentSettings } from "@/lib/parent-settings"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { isEarlyAccessActive } from "@/lib/subscription"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function BillingSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState("Free Plan")
  const [planPrice, setPlanPrice] = useState("$0")
  const [planInterval, setPlanInterval] = useState("/month")
  const [planDescription, setPlanDescription] = useState("Access for up to 2 children")
  const [isStarter, setIsStarter] = useState(false)
  const [isEarlyAccess, setIsEarlyAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || ""
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID || ""
  const pricingReady = Boolean(monthlyPriceId && yearlyPriceId)

  useEffect(() => {
    let isActive = true
    const loadSettings = async () => {
      try {
        const { data, error } = await getOrCreateParentSettings()
        if (!isActive) return
        if (error) {
          toast({
            title: "Unable to load billing info",
            description: error.message,
            variant: "destructive",
          })
          return
        }
        if (!data) return
        setCurrentPlan(data.plan_name || "Free Plan")
        const price = `$${(data.plan_price_cents || 0) / 100}`
        setPlanPrice(price)
        setPlanInterval(`/${data.plan_interval || "month"}`)
        const starter = data.plan_name?.toLowerCase().includes("starter") && data.plan_status === "active"
        setIsStarter(starter)
        setIsEarlyAccess(isEarlyAccessActive(data.created_at))
        setPlanDescription(
          starter
            ? "Offline downloads, auto-download, full quiz, and Bible books practice"
            : "Access for up to 2 children",
        )
      } finally {
        if (isActive) setIsLoading(false)
      }
    }
    loadSettings()
    return () => {
      isActive = false
    }
  }, [])

  const benefits = useMemo(
    () => [
      "Full access to every ScriptureSteps feature",
      "Age-based 52-week curriculum (4, 5, 6, 7 each unique; 8–12 shared)",
      "Offline downloads + auto-downloads",
      "Bible quiz with full question set",
      "Books of the Bible practice (listen, recite, tap game)",
      "Unlimited child profiles",
      "Progress reports + export",
    ],
    [],
  )

  const getAuthToken = async () => {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token || null
  }

  const startCheckout = async (priceId: string) => {
    if (!pricingReady || !priceId) {
      toast({ title: "Pricing not configured", description: "Add Stripe price IDs to continue." })
      if (typeof window !== "undefined") {
        window.alert("Stripe price IDs are not configured yet.")
      }
      return
    }
    setIsProcessing(true)
    try {
      const token = await getAuthToken()
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ priceId }),
      })
      const data = await response.json()
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Unable to start checkout.")
      }
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: "Checkout unavailable",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
      if (typeof window !== "undefined") {
        window.alert(error?.message || "Unable to start Stripe checkout.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const openPortal = async () => {
    setIsProcessing(true)
    try {
      const token = await getAuthToken()
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await response.json()
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Unable to open billing portal.")
      }
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: "Unable to open billing portal",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.push("/settings")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">Manage your plan and payment details</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-lg">{currentPlan}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{planDescription}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl">{planPrice}</p>
                  <p className="text-sm text-muted-foreground">{planInterval}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Enjoying ScriptureSteps? Upgrade to Starter for offline downloads and full practice features.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {isStarter ? (
              <Button className="w-full bg-primary hover:bg-primary/90 gap-2" size="lg" onClick={openPortal}>
                Cancel Subscription
              </Button>
            ) : (
              <Button
                className="w-full bg-primary hover:bg-primary/90 gap-2"
                size="lg"
                onClick={() => setShowUpgradeModal(true)}
                disabled={isEarlyAccess}
              >
                <Sparkles className="w-5 h-5" />
                {isEarlyAccess ? "Early Access Active" : "Upgrade to Starter Plan"}
              </Button>
            )}
          </div>
        </div>

        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Upgrade to Starter to unlock offline downloads, auto-download, and full Bible books practice. Cancel
              anytime with no commitment.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Choose your Starter plan</DialogTitle>
            <DialogDescription>
              Pick monthly or yearly. You can cancel anytime from the billing portal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-heading text-lg font-semibold">Billing Cycle</p>
                <p className="text-sm text-muted-foreground">
                  {isYearly ? "Yearly - $49 / year" : "Monthly - $4.99 / month"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Monthly</span>
                <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                <span className="text-xs text-muted-foreground">Yearly</span>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${isYearly ? "border-primary/40 bg-primary/5" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-lg font-semibold">
                    Starter {isYearly ? "Yearly" : "Monthly"}
                  </p>
                  <p className="text-sm text-muted-foreground">{isYearly ? "$49 / year" : "$4.99 / month"}</p>
                </div>
                <Button onClick={() => startCheckout(isYearly ? yearlyPriceId : monthlyPriceId)} disabled={isProcessing}>
                  Upgrade
                </Button>
              </div>
              <ul className="mt-4 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
