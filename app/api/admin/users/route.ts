import { NextResponse } from "next/server"
import { isSupabaseServerConfigured, supabaseServer } from "@/lib/supabase-server"
import type { ParentAccount } from "@/lib/types"

export const runtime = "nodejs"

const resolvePlan = (planName?: string | null) => {
  if (!planName) return "free"
  return planName.toLowerCase().includes("starter") ? "starter" : "free"
}

export async function GET() {
  if (!isSupabaseServerConfigured || !supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { data: profiles, error: profilesError } = await supabaseServer
    .from("profiles")
    .select("id,email,created_at")
    .order("created_at", { ascending: false })

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  const parentIds = (profiles || []).map((profile) => profile.id)
  if (parentIds.length === 0) {
    return NextResponse.json({ parents: [] satisfies ParentAccount[] })
  }

  const [{ data: settings, error: settingsError }, { data: children, error: childrenError }] =
    await Promise.all([
      supabaseServer
        .from("parent_settings")
        .select("parent_id, plan_name, plan_status")
        .in("parent_id", parentIds),
      supabaseServer
        .from("children")
        .select("id,parent_id,name,age,avatar_path,created_at")
        .in("parent_id", parentIds),
    ])

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 })
  }

  if (childrenError) {
    return NextResponse.json({ error: childrenError.message }, { status: 500 })
  }

  const childIds = (children || []).map((child) => child.id)
  const { data: progressRows, error: progressError } =
    childIds.length > 0
      ? await supabaseServer.from("progress").select("child_id, week").in("child_id", childIds)
      : { data: [], error: null }

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 })
  }

  const maxWeekByChild = new Map<string, number>()
  for (const row of progressRows || []) {
    if (!row?.child_id) continue
    const current = maxWeekByChild.get(row.child_id) || 0
    const week = typeof row.week === "number" ? row.week : 0
    if (week > current) {
      maxWeekByChild.set(row.child_id, week)
    }
  }

  const settingsByParent = new Map<string, { plan_name?: string | null; plan_status?: string | null }>()
  for (const setting of settings || []) {
    settingsByParent.set(setting.parent_id, setting)
  }

  const childrenByParent = new Map<string, ParentAccount["children"]>()
  for (const child of children || []) {
    const list = childrenByParent.get(child.parent_id) || []
    const createdAt = child.created_at ? new Date(child.created_at) : new Date()
    const currentWeek = Math.max(1, maxWeekByChild.get(child.id) || 1)
    list.push({
      id: child.id,
      name: child.name || "Child",
      birthdate: createdAt,
      age: (child.age || 4) as any,
      avatar: child.avatar_path || undefined,
      createdAt,
      programYear: 1,
      currentWeek,
      dayOfWeek: 1,
      streak: 0,
      completedSessions: [],
      writingSamples: [],
      speakingAttempts: [],
      bibleBookSet: 0,
      bibleBookMasteryLevel: 0,
    })
    childrenByParent.set(child.parent_id, list)
  }

  const parents: ParentAccount[] = (profiles || []).map((profile) => {
    const settingsRow = settingsByParent.get(profile.id)
    const plan = resolvePlan(settingsRow?.plan_name)
    const status = settingsRow?.plan_status === "active" ? "active" : "inactive"
    const parentChildren = childrenByParent.get(profile.id) || []

    return {
      id: profile.id,
      email: profile.email || "",
      createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
      subscription: {
        plan,
        status,
      },
      children: parentChildren,
      activeChildId: parentChildren[0]?.id || null,
    }
  })

  return NextResponse.json({ parents })
}
