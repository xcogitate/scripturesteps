"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export function DashboardLink() {
  const router = useRouter()

  return (
    <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
      <Home className="w-4 h-4" />
      Dashboard
    </Button>
  )
}
