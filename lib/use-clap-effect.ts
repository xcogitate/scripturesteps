"use client"

import { useCallback, useEffect, useRef } from "react"

export function useClapEffect() {
  const clapAudioRef = useRef<HTMLAudioElement | null>(null)

  const playClapEffect = useCallback(() => {
    if (typeof window === "undefined") return
    if (!clapAudioRef.current) {
      const audio = new Audio("/audio/Clapping.mp3")
      audio.volume = 0.8
      clapAudioRef.current = audio
    }
    clapAudioRef.current.currentTime = 0
    clapAudioRef.current.play().catch(() => {})
  }, [])

  useEffect(() => {
    return () => {
      if (clapAudioRef.current) {
        clapAudioRef.current.pause()
        clapAudioRef.current.currentTime = 0
      }
    }
  }, [])

  return playClapEffect
}
