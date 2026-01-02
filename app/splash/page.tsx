"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!supabase) {
        router.push("/")
        return
      }

      const { data, error } = await supabase.auth.getSession()

      if (!error && data.session) {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-secondary/10 to-accent/10 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <BookOpen className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Bible Time for Kids</h1>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    </div>
  )
}
