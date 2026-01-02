import { NextResponse } from "next/server"
import { getWeekData, seedProgramYear } from "@/lib/curriculum"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const age = Number(body?.age)
  const week = Number(body?.week)
  const programYear = Number(body?.programYear || 1)

  if (!age || !week) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
  }

  const weekData = await getWeekData(week, age, programYear)
  if (!weekData) {
    await seedProgramYear(programYear)
    const seededWeek = await getWeekData(week, age, programYear)
    if (!seededWeek) {
      const themeCheck = await supabaseServer
        .from("weekly_themes")
        .select("week")
        .eq("program_year", programYear)
        .eq("week", week)
        .maybeSingle()

      const verseCheck = await supabaseServer
        .from("weekly_verses")
        .select("age_group, verse_variant")
        .eq("program_year", programYear)
        .eq("week", week)
        .limit(5)

      return NextResponse.json(
        {
          error: "Week data not found. Seed the curriculum in Supabase.",
          details: {
            themeRow: Boolean(themeCheck.data),
            themeError: themeCheck.error?.message || null,
            verseRows: verseCheck.data || [],
            verseError: verseCheck.error?.message || null,
          },
        },
        { status: 404 },
      )
    }
    return NextResponse.json(seededWeek)
  }

  return NextResponse.json(weekData)
}
