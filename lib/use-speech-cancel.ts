"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export const useSpeechCancelOnExit = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [pathname])
}
