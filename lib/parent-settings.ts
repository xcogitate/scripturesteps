"use client"

import { supabase, isSupabaseConfigured } from "@/lib/supabase-client"
import { cacheEarlyAccessUntil, cachePlanName } from "@/lib/subscription"

export type ParentSettings = {
  parent_id: string
  reminder_morning_enabled: boolean
  reminder_morning_time: string
  reminder_evening_enabled: boolean
  reminder_evening_time: string
  reminder_days: string[]
  offline_enabled: boolean
  auto_download_enabled: boolean
  content_downloaded: boolean
  last_download_at: string | null
  progress_reports_enabled: boolean
  plan_name: string
  plan_status: string
  plan_price_cents: number
  plan_interval: string
  trial_end: string | null
  current_period_end: string | null
  billing_provider: string | null
  billing_customer_id: string | null
  billing_subscription_id: string | null
  payment_method_brand: string | null
  payment_method_last4: string | null
  parent_pin_enabled: boolean
  parent_pin_hash: string | null
  created_at: string
  updated_at: string
}

export const defaultParentSettings: Omit<ParentSettings, "parent_id" | "created_at" | "updated_at"> = {
  reminder_morning_enabled: true,
  reminder_morning_time: "08:00",
  reminder_evening_enabled: true,
  reminder_evening_time: "19:00",
  reminder_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  offline_enabled: true,
  auto_download_enabled: true,
  content_downloaded: false,
  last_download_at: null,
  progress_reports_enabled: true,
  plan_name: "Free Plan",
  plan_status: "active",
  plan_price_cents: 0,
  plan_interval: "month",
  trial_end: null,
  current_period_end: null,
  billing_provider: null,
  billing_customer_id: null,
  billing_subscription_id: null,
  payment_method_brand: null,
  payment_method_last4: null,
  parent_pin_enabled: false,
  parent_pin_hash: null,
}

type ParentSettingsResult = {
  data: ParentSettings | null
  error: Error | null
}

export type ExportRequest = {
  id: string
  parent_id: string
  status: string
  format: string
  requested_at: string
  completed_at: string | null
}

export type ExportRequestResult = {
  data: ExportRequest | null
  error: Error | null
}

const ensureParentProfile = async (user: { id: string; email?: string | null; user_metadata?: any }) => {
  if (!supabase || !isSupabaseConfigured) {
    return { error: new Error("Supabase is not configured.") }
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.parent_name ||
    user.user_metadata?.name ||
    ""

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        email: user.email || "",
      },
      { onConflict: "id" },
    )

  return { error: error || null }
}

export async function getOrCreateParentSettings(): Promise<ParentSettingsResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured.") }
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { data: null, error: authError }
  const user = authData.user
  if (!user) return { data: null, error: new Error("User is not authenticated.") }

  const { error: profileError } = await ensureParentProfile(user)
  if (profileError) return { data: null, error: profileError }

  const { data, error } = await supabase
    .from("parent_settings")
    .select("*")
    .eq("parent_id", user.id)
    .maybeSingle()

  if (error) return { data: null, error }
  if (data) {
    const settings = data as ParentSettings
    cachePlanName(settings.plan_name)
    cacheEarlyAccessUntil(settings.created_at)
    return { data: data as ParentSettings, error: null }
  }

  const insertPayload = {
    parent_id: user.id,
    ...defaultParentSettings,
  }

  const { data: created, error: insertError } = await supabase
    .from("parent_settings")
    .insert(insertPayload)
    .select()
    .single()

  if (insertError) return { data: null, error: insertError }
  const createdSettings = created as ParentSettings
  cachePlanName(createdSettings.plan_name)
  cacheEarlyAccessUntil(createdSettings.created_at)
  return { data: created as ParentSettings, error: null }
}

export async function upsertParentSettings(
  updates: Partial<Omit<ParentSettings, "parent_id">>,
): Promise<ParentSettingsResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured.") }
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { data: null, error: authError }
  const user = authData.user
  if (!user) return { data: null, error: new Error("User is not authenticated.") }

  const { error: profileError } = await ensureParentProfile(user)
  if (profileError) return { data: null, error: profileError }

  const payload = {
    parent_id: user.id,
    ...updates,
  }

  const { data, error } = await supabase
    .from("parent_settings")
    .upsert(payload, { onConflict: "parent_id" })
    .select()
    .single()

  if (error) return { data: null, error }
  const settings = data as ParentSettings
  cachePlanName(settings.plan_name)
  cacheEarlyAccessUntil(settings.created_at)
  return { data: data as ParentSettings, error: null }
}

export async function createSupportRequest(request: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<ParentSettingsResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured.") }
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { data: null, error: authError }
  const user = authData.user
  if (!user) return { data: null, error: new Error("User is not authenticated.") }

  const { error } = await supabase.from("support_requests").insert({
    parent_id: user.id,
    name: request.name,
    email: request.email,
    subject: request.subject,
    message: request.message,
    status: "new",
  })

  if (error) return { data: null, error }
  return { data: null, error: null }
}

export async function createExportRequest(format = "pdf"): Promise<ExportRequestResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured.") }
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { data: null, error: authError }
  const user = authData.user
  if (!user) return { data: null, error: new Error("User is not authenticated.") }

  const { data, error } = await supabase
    .from("export_requests")
    .insert({
      parent_id: user.id,
      status: "requested",
      format,
      requested_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { data: null, error }
  return { data: data as ExportRequest, error: null }
}

export async function getLatestExportRequest(): Promise<ExportRequestResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured.") }
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) return { data: null, error: authError }
  const user = authData.user
  if (!user) return { data: null, error: new Error("User is not authenticated.") }

  const { data, error } = await supabase
    .from("export_requests")
    .select("*")
    .eq("parent_id", user.id)
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return { data: null, error }
  return { data: (data as ExportRequest) || null, error: null }
}
