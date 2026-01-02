"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SessionStore } from "@/lib/session-store"
import { getAdminSettings } from "@/lib/admin-settings"
import type { ChildProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, PenTool, Moon, Sun, Settings, Trophy, Brain, Library, Edit3, Lock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ChildSwitcher } from "@/components/child-switcher"
import { fetchWeekData } from "@/lib/content-client"
import { useSpeechCancelOnExit } from "@/lib/use-speech-cancel"
import { getOrCreateParentSettings, upsertParentSettings } from "@/lib/parent-settings"
import { getOfflineDownloadTimestamp } from "@/lib/offline-cache"
import { prefetchOfflineContent } from "@/lib/offline-download"
import { hasPremiumAccess as computePremiumAccess, MAX_FREE_WEEKS } from "@/lib/subscription"
import { getPresetAvatarSrc } from "@/lib/avatar-presets"
import { supabase } from "@/lib/supabase-client"

export default function DashboardPage() {
  const router = useRouter()
  useSpeechCancelOnExit()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning")
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>("")
  const [dayOfWeek, setDayOfWeek] = useState(1)
  const [currentDayLabel, setCurrentDayLabel] = useState("")
  const [weekData, setWeekData] = useState<any | null>(null)
  const [overrideSettings, setOverrideSettings] = useState<{
    enabled: boolean
    unlockAll: boolean
    forceDayOfWeek: number | null
  } | null>(null)
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const currentChild = SessionStore.getCurrentChild()
    if (!currentChild) {
      router.push("/auth")
    } else {
      setChild(currentChild)
      setDayOfWeek(currentChild.dayOfWeek || 1)

      const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      setCurrentDayLabel(dayLabels[(currentChild.dayOfWeek || 1) - 1])

      const loadWeek = async () => {
        try {
          const data = await fetchWeekData({
            age: currentChild.age,
            week: currentChild.currentWeek,
            programYear: currentChild.programYear || 1,
          })
          setWeekData(data)
          setCurrentTheme(data.theme)
        } catch {
          setWeekData(null)
        }
      }
      loadWeek()

      const hour = new Date().getHours()
      if (hour >= 18 || hour < 5) {
        setTimeOfDay("evening")
      } else if (hour >= 12) {
        setTimeOfDay("afternoon")
      } else {
        setTimeOfDay("morning")
      }

      const adminSettings = getAdminSettings()
      setOverrideSettings(adminSettings.activityOverrides)

      getOrCreateParentSettings().then(({ data }) => {
        if (data) {
          setHasPremiumAccess(computePremiumAccess(data.plan_name, data.created_at))
        }
      })
    }
  }, [router])

  useEffect(() => {
    if (child && !hasSpokenGreeting && typeof window !== "undefined") {
      const greeting =
        timeOfDay === "morning"
          ? "Good morning"
          : timeOfDay === "afternoon"
            ? "Good afternoon"
            : "Good evening"
      const fullGreeting = `${greeting}, ${child.name}!`

      const timer = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(fullGreeting)

        const voices = window.speechSynthesis.getVoices()
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.name.includes("Samantha") ||
              voice.name.includes("Google US English") ||
              (voice.lang.includes("en") && voice.name.includes("Female")),
          ) || voices.find((voice) => voice.lang.includes("en"))

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 1.0

        window.speechSynthesis.speak(utterance)
        setHasSpokenGreeting(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [child, timeOfDay, hasSpokenGreeting])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices()
    }
  }, [])

  useEffect(() => {
    if (!child) {
      setAvatarUrl(null)
      return
    }

    let isActive = true
    const resolveAvatar = async () => {
      const avatar = child.avatar
      if (!avatar) {
        setAvatarUrl(null)
        return
      }
      if (avatar.startsWith("preset:")) {
        setAvatarUrl(getPresetAvatarSrc(avatar.replace("preset:", "")))
        return
      }
      if (avatar.startsWith("http")) {
        setAvatarUrl(avatar)
        return
      }
      if (!supabase) {
        setAvatarUrl(null)
        return
      }
      const { data } = await supabase.storage.from("avatars").createSignedUrl(avatar, 60 * 60 * 24)
      if (isActive) {
        setAvatarUrl(data?.signedUrl || null)
      }
    }

    resolveAvatar().catch(() => {
      if (isActive) {
        setAvatarUrl(null)
      }
    })

    return () => {
      isActive = false
    }
  }, [child])

  useEffect(() => {
    if (!child) return
    let isActive = true
    const handleAutoDownload = async () => {
      const { data, error } = await getOrCreateParentSettings()
      if (!isActive || error || !data) return
      if (!computePremiumAccess(data.plan_name, data.created_at)) return
      if (!data.offline_enabled || !data.auto_download_enabled) return
      const params = {
        age: child.age,
        week: child.currentWeek || 1,
        programYear: child.programYear || 1,
      }
      if (getOfflineDownloadTimestamp(params)) return
      await prefetchOfflineContent(params)
      await upsertParentSettings({
        content_downloaded: true,
        last_download_at: new Date().toISOString(),
      })
    }
    handleAutoDownload().catch(() => {})
    return () => {
      isActive = false
    }
  }, [child])

  if (!child) return null

  const greeting =
    timeOfDay === "morning"
      ? "Good morning"
      : timeOfDay === "afternoon"
        ? "Good afternoon"
        : "Good evening"
  const greetingIcon = timeOfDay === "evening" ? Moon : Sun
  const GreetingIcon = greetingIcon

  const isYounger = child.age < 8
  const progress = SessionStore.getProgress(child.id)
  const freeWeekLimitReached = !hasPremiumAccess && (child.currentWeek || 1) >= MAX_FREE_WEEKS

  // Monday-Tuesday (1-2): Verse A active, Books active, Night Reflection active
  // Wednesday-Thursday (3-4): Verse A locked (unless incomplete), Verse B active, Books active, Night Reflection active
  // Friday (5): Both verses locked (unless incomplete), Writing active, Books active, Night Reflection active
  // Saturday-Sunday (6-7): Only Books and Night Reflection active

  const forcedDay =
    overrideSettings?.enabled && overrideSettings.forceDayOfWeek ? overrideSettings.forceDayOfWeek : null
  const effectiveDayOfWeek = forcedDay || dayOfWeek
  const overridesEnabled = Boolean(overrideSettings?.enabled)
  const unlockAll = Boolean(overrideSettings?.enabled && overrideSettings.unlockAll)

  const isMonTue = effectiveDayOfWeek >= 1 && effectiveDayOfWeek <= 2
  const isWedThu = effectiveDayOfWeek >= 3 && effectiveDayOfWeek <= 4
  const isFriday = effectiveDayOfWeek === 5
  const isWeekend = effectiveDayOfWeek === 6 || effectiveDayOfWeek === 7
  const canAccessNightPrayer = timeOfDay === "evening"

  const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const effectiveDayLabel = dayLabels[effectiveDayOfWeek - 1] || currentDayLabel

  // Check if verses are completed
  const activities = child.activities || {}
  const currentWeek = child.currentWeek || 1
  const verseACompleted = Boolean(activities[`week:${currentWeek}:verse:A`])
  const verseBCompleted = Boolean(activities[`week:${currentWeek}:verse:B`])
  const verseCompleted = Boolean(activities[`week:${currentWeek}:verse`])

  // Determine which activities to display and their interaction state
  const showVerseA = overridesEnabled || !isWeekend
  const showVerseB =
    (overridesEnabled || isWedThu || isFriday) && child.age >= 4 && child.age <= 7
  const showWriting = overridesEnabled || isFriday
  const showQuiz = (overridesEnabled || isWedThu || isFriday) && child.age >= 8 && child.age <= 12
  const showDevotional = (overridesEnabled || !isWeekend) && child.age >= 8 && child.age <= 12

  // Determine interaction state
  const canInteractVerseA = unlockAll || isMonTue || ((isWedThu || isFriday) && !verseACompleted)
  const canInteractVerseB = unlockAll || isWedThu || (isFriday && !verseBCompleted)
  const canInteractWriting = unlockAll || isFriday
  const canInteractQuiz = unlockAll || isWedThu || isFriday
  const canInteractDevotional = unlockAll || !isWeekend
  const canInteractTodaysVerse = unlockAll || !isFriday || !verseCompleted

  const verseA = weekData?.verseA || weekData?.verse
  const verseB = weekData?.verseB
  const prayerTitle = isYounger ? "Daily Prayer" : "Night Reflection"
  const prayerDescription = isYounger ? "Talk with God and pray" : "Reflect and pray before bed"
  const prayerButtonLabel = isYounger ? "Pray" : "Reflect"

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      <div className="bg-primary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={`${child.name} avatar`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-heading font-bold text-primary-foreground">
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <GreetingIcon className="w-5 h-5 text-secondary" />
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    {greeting}, {child.name}!
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Week {child.currentWeek} - {currentTheme} - {effectiveDayLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChildSwitcher />
              <Button variant="ghost" size="icon" onClick={() => router.push("/settings/child")}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {freeWeekLimitReached && (
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-lg font-semibold">Starter unlocks weeks 9-52</h2>
                  <p className="text-sm text-muted-foreground">
                    You've reached the Free plan limit of {MAX_FREE_WEEKS} weeks. Upgrade to continue the curriculum.
                  </p>
                </div>
                <Button onClick={() => router.push("/settings/billing")}>Upgrade to Starter</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 border-accent/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <h2 className="font-heading text-lg font-semibold">This Week's Progress</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push("/progress")} className="font-heading">
                View Progress
              </Button>
            </div>
            <Progress value={(progress.versesLearned / 2) * 100} className="h-3" />
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">Streak</span>
                <span className="font-medium">{progress.streakDays} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <PenTool className="w-4 h-4 text-accent" />
                <span className="font-medium">{progress.writingCompleted} written</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ages 4-7 Specific Activities */}
        {child.age >= 4 && child.age <= 7 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Learning Activities - {effectiveDayLabel}
            </h2>
            <div className="grid gap-4">
              {/* Books of the Bible - Always Available */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/30"
                onClick={() => router.push("/bible-books")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Library className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold mb-1">Books of the Bible</h3>
                      <p className="text-sm text-muted-foreground">Learn the books order</p>
                    </div>
                    <Button variant="outline" size="lg" className="font-heading bg-transparent">
                      Learn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showVerseA && (
                <>
                  {isMonTue && (
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary mt-6">
                      <h3 className="font-heading text-lg font-bold text-primary mb-2">Verse A</h3>
                      <p className="text-sm text-muted-foreground">Monday-Tuesday - Learn your first verse!</p>
                    </div>
                  )}

                  {!isMonTue && (
                    <div
                      className={`p-4 rounded-lg border-l-4 mt-6 ${canInteractVerseA ? "bg-primary/5 border-primary" : "bg-muted/20 border-muted"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`font-heading text-lg font-bold mb-2 ${canInteractVerseA ? "text-primary" : "text-muted-foreground"}`}
                          >
                            Verse A
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {verseACompleted ? "Review if needed" : "Complete this first"}
                          </p>
                        </div>
                        {!canInteractVerseA && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {verseACompleted ? "Completed" : "Locked"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Card
                    className={`transition-shadow border-2 ${
                      canInteractVerseA
                        ? "cursor-pointer hover:shadow-lg border-primary/20"
                        : "opacity-60 cursor-not-allowed border-muted"
                    }`}
                    onClick={() => canInteractVerseA && router.push("/session-intro?type=morning&verse=A")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 ${canInteractVerseA ? "bg-primary/20" : "bg-muted"} rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                          <BookOpen
                            className={`w-8 h-8 ${canInteractVerseA ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl font-bold mb-1">Today's Verse A</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{verseA?.text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="lg"
                          className="font-heading bg-transparent"
                          disabled={!canInteractVerseA}
                        >
                          {verseACompleted ? "Review" : "Start"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {showVerseB && (
                <>
                  {isWedThu && (
                    <div className="bg-accent/5 p-4 rounded-lg border-l-4 border-accent mt-6">
                      <h3 className="font-heading text-lg font-bold text-accent mb-2">Verse B</h3>
                      <p className="text-sm text-muted-foreground">Wednesday-Thursday - Learn your second verse!</p>
                    </div>
                  )}

                  {isFriday && (
                    <div
                      className={`p-4 rounded-lg border-l-4 mt-6 ${canInteractVerseB ? "bg-accent/5 border-accent" : "bg-muted/20"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3
                            className={`font-heading text-lg font-bold mb-2 ${canInteractVerseB ? "text-accent" : "text-muted-foreground"}`}
                          >
                            Verse B
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {verseBCompleted ? "Review if needed" : "Complete this first"}
                          </p>
                        </div>
                        {!canInteractVerseB && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {verseBCompleted ? "Completed" : "Locked"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Card
                    className={`transition-shadow border-2 ${
                      canInteractVerseB
                        ? "cursor-pointer hover:shadow-lg border-accent/20"
                        : "opacity-60 cursor-not-allowed border-muted"
                    }`}
                    onClick={() => canInteractVerseB && router.push("/session-intro?type=morning&verse=B")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 ${canInteractVerseB ? "bg-accent/20" : "bg-muted"} rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                          <BookOpen
                            className={`w-8 h-8 ${canInteractVerseB ? "text-accent" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl font-bold mb-1">Today's Verse B</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{verseB?.text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="lg"
                          className="font-heading bg-transparent"
                          disabled={!canInteractVerseB}
                        >
                          {verseBCompleted ? "Review" : "Start"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {showWriting && (
                <>
                  <div className="bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary mt-6">
                    <h3 className="font-heading text-lg font-bold text-secondary mb-2">Writing Practice</h3>
                    <p className="text-sm text-muted-foreground">Friday - Write this week's verse!</p>
                  </div>

                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/30"
                    onClick={() => router.push("/writing-intro")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Edit3 className="w-8 h-8 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl font-bold mb-1">Writing Practice</h3>
                          <p className="text-sm text-muted-foreground">Practice writing your verse</p>
                        </div>
                        <Button variant="outline" size="lg" className="font-heading bg-transparent">
                          Start Writing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              <Card
                className={`transition-shadow border-2 border-purple-500/30 ${
                  canAccessNightPrayer ? "cursor-pointer hover:shadow-lg" : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => canAccessNightPrayer && router.push("/session/night")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Moon className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold mb-1">{prayerTitle}</h3>
                      <p className="text-sm text-muted-foreground">{prayerDescription}</p>
                    </div>
                    <Button variant="outline" size="lg" className="font-heading bg-transparent" disabled={!canAccessNightPrayer}>
                      {canAccessNightPrayer ? (
                        prayerButtonLabel
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Ages 8-12 Specific Activities */}
        {child.age >= 8 && child.age <= 12 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Learning Activities - {effectiveDayLabel}
            </h2>
            <div className="grid gap-4">
              {/* Books of the Bible - Always Available */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary/30"
                onClick={() => router.push("/bible-books")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Library className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold mb-1">Books of the Bible</h3>
                      <p className="text-sm text-muted-foreground">Learn the books order</p>
                    </div>
                    <Button variant="outline" size="lg" className="font-heading bg-transparent">
                      Learn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showDevotional && (
                <>
                  {(isMonTue || isWedThu) && (
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary mt-6">
                      <h3 className="font-heading text-lg font-bold text-primary mb-2">
                        {isMonTue ? "Monday-Tuesday" : "Wednesday-Thursday"} Learning
                      </h3>
                      <p className="text-sm text-muted-foreground">Today's verse with devotional</p>
                    </div>
                  )}

                  <Card
                    className={`transition-shadow border-2 ${
                      canInteractTodaysVerse
                        ? "cursor-pointer hover:shadow-lg border-primary/20"
                        : "opacity-60 cursor-not-allowed border-muted"
                    }`}
                    onClick={() => canInteractTodaysVerse && router.push("/session-intro?type=morning")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 ${canInteractTodaysVerse ? "bg-primary/20" : "bg-muted"} rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                          <BookOpen
                            className={`w-8 h-8 ${canInteractTodaysVerse ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-heading text-xl font-bold">Today's Verse</h3>
                            {isFriday && verseACompleted && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Completed
                              </span>
                            )}
                            {isFriday && !verseACompleted && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                Incomplete
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{verseA?.text}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="lg"
                          className="font-heading bg-transparent"
                          disabled={!canInteractTodaysVerse}
                        >
                          {verseACompleted ? "Review" : "Start"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {showQuiz && (
                    <>
                      {isWedThu && (
                        <div className="bg-accent/5 p-4 rounded-lg border-l-4 border-accent mt-6">
                          <h3 className="font-heading text-lg font-bold text-accent mb-2">Test Your Knowledge</h3>
                          <p className="text-sm text-muted-foreground">Wednesday onwards - Take the quiz!</p>
                        </div>
                      )}

                      <Card
                        className={`transition-shadow border-2 ${
                          canInteractQuiz
                            ? "cursor-pointer hover:shadow-lg border-accent/20"
                            : "opacity-60 cursor-not-allowed border-muted"
                        }`}
                        onClick={() => canInteractQuiz && router.push("/quiz")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 ${canInteractQuiz ? "bg-accent/20" : "bg-muted"} rounded-2xl flex items-center justify-center flex-shrink-0`}
                            >
                              <Brain
                                className={`w-8 h-8 ${canInteractQuiz ? "text-accent" : "text-muted-foreground"}`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-bold mb-1">Bible Quiz</h3>
                              <p className="text-sm text-muted-foreground">Test your knowledge</p>
                            </div>
                            <Button
                              variant="outline"
                              size="lg"
                              className="font-heading bg-transparent"
                              disabled={!canInteractQuiz}
                            >
                              Start Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {showWriting && (
                    <>
                      <div className="bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary mt-6">
                        <h3 className="font-heading text-lg font-bold text-secondary mb-2">Friday Writing</h3>
                        <p className="text-sm text-muted-foreground">Write this week's verse with devotional!</p>
                      </div>

                      <Card
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-secondary/30"
                        onClick={() => router.push("/writing-intro")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Edit3 className="w-8 h-8 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-bold mb-1">Writing Practice</h3>
                              <p className="text-sm text-muted-foreground">Write verse with devotional</p>
                            </div>
                            <Button variant="outline" size="lg" className="font-heading bg-transparent">
                              Start Writing
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                </>
              )}

              <Card
                className={`transition-shadow border-2 border-primary/30 ${
                  canAccessNightPrayer ? "cursor-pointer hover:shadow-lg" : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => canAccessNightPrayer && router.push("/session/night")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Moon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold mb-1">Night Reflection</h3>
                      <p className="text-sm text-muted-foreground">End your day with prayer</p>
                    </div>
                    <Button variant="outline" size="lg" className="font-heading bg-transparent" disabled={!canAccessNightPrayer}>
                      {canAccessNightPrayer ? (
                        "Reflect"
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-none shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-3">
              <h1 className="font-heading text-sm uppercase tracking-[0.3em] text-muted-foreground">Theme</h1>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{currentTheme}</h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                This week's theme helps you learn God's Word in a calm, steady way.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

