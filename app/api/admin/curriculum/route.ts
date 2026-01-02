import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { seedProgramYear } from "@/lib/curriculum"

const referenceRegex = /[1-3]?\s?[A-Za-z][A-Za-z\s]+\d+:\d+/

const splitVerseInput = (value: string) => {
  const cleaned = value.trim()
  const dashMatch = cleaned.match(/^(.*?)(?:-)\s*([1-3]?\s?[A-Za-z][A-Za-z\s]+\d+:\d+.*)$/)
  if (dashMatch) {
    return { text: dashMatch[1].trim(), reference: dashMatch[2].trim() }
  }

  const refMatch = cleaned.match(referenceRegex)
  if (refMatch) {
    const reference = refMatch[0]
    const text = cleaned.replace(reference, "").replace(/[-–—]+/g, " ").trim()
    return { text, reference }
  }

  return { text: cleaned, reference: "Scripture" }
}

const createEmptyYear = async (programYear: number) => {
  if (!supabaseServer) return
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  for (let week = 1; week <= 52; week += 1) {
    const monthIndex = Math.min(Math.floor((week - 1) / 4), 11)
    await supabaseServer.from("weekly_themes").upsert(
      {
        program_year: programYear,
        week,
        month: months[monthIndex],
        theme_4_7: "Theme",
        theme_8_12: "Theme",
      },
      { onConflict: "program_year,week" },
    )

    const rows = ["4", "5", "6", "7"].flatMap((ageGroup) => [
      {
        program_year: programYear,
        week,
        age_group: ageGroup,
        verse_variant: "A",
        verse_text: "TBD",
        reference: "TBD",
      },
      {
        program_year: programYear,
        week,
        age_group: ageGroup,
        verse_variant: "B",
        verse_text: "TBD",
        reference: "TBD",
      },
    ])

    rows.push({
      program_year: programYear,
      week,
      age_group: "8-12",
      verse_variant: null,
      verse_text: "TBD",
      reference: "TBD",
    })

    await supabaseServer.from("weekly_verses").upsert(rows, {
      onConflict: "program_year,week,age_group,verse_variant",
    })
  }
}

export async function GET(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const yearParam = searchParams.get("year")

  if (!yearParam) {
    const { data, error } = await supabaseServer.from("weekly_themes").select("program_year")
    if (error) {
      return NextResponse.json({ error: "Failed to load years.", details: error.message }, { status: 500 })
    }

    const years = Array.from(new Set((data || []).map((row) => row.program_year))).sort((a, b) => a - b)
    return NextResponse.json({ years })
  }

  const programYear = Number(yearParam)
  const { data: themeRows, error: themeError } = await supabaseServer
    .from("weekly_themes")
    .select("week, month, theme_4_7, theme_8_12")
    .eq("program_year", programYear)
    .order("week", { ascending: true })

  if (themeError) {
    return NextResponse.json({ error: "Failed to load weekly themes.", details: themeError.message }, { status: 500 })
  }

  const { data: verseRows, error: verseError } = await supabaseServer
    .from("weekly_verses")
    .select("week, age_group, verse_variant, verse_text, reference")
    .eq("program_year", programYear)

  if (verseError) {
    return NextResponse.json({ error: "Failed to load verses.", details: verseError.message }, { status: 500 })
  }

  const weekMap = new Map<number, any>()
  themeRows?.forEach((row) => {
    weekMap.set(row.week, {
      week: row.week,
      month: row.month,
      theme4to7: row.theme_4_7,
      theme8to12: row.theme_8_12,
      verseA: { age4: "", age5: "", age6: "", age7: "" },
      verseB: { age4: "", age5: "", age6: "", age7: "" },
      age8to12: { verse: "", reference: "" },
    })
  })

  verseRows?.forEach((row) => {
    const entry = weekMap.get(row.week)
    if (!entry) return
    if (row.age_group === "8-12") {
      entry.age8to12 = { verse: row.verse_text, reference: row.reference }
      return
    }
    const target = row.verse_variant === "B" ? entry.verseB : entry.verseA
    const key = `age${row.age_group}` as keyof typeof target
    target[key] = `${row.verse_text} - ${row.reference}`.trim()
  })

  const weeks = Array.from(weekMap.values()).sort((a, b) => a.week - b.week)
  return NextResponse.json({ weeks })
}

export async function PUT(req: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const programYear = Number(body?.programYear)
  const week = Number(body?.week)
  if (!programYear || !week) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
  }

  await supabaseServer.from("weekly_themes").upsert(
    {
      program_year: programYear,
      week,
      month: body?.month || "Unknown",
      theme_4_7: body?.theme4to7 || "Theme",
      theme_8_12: body?.theme8to12 || "Theme",
    },
    { onConflict: "program_year,week" },
  )

  const ages = ["4", "5", "6", "7"]
  const verseRows = ages.flatMap((age) => {
    const verseA = splitVerseInput(body?.verseA?.[`age${age}`] || "")
    const verseB = splitVerseInput(body?.verseB?.[`age${age}`] || "")
    return [
      {
        program_year: programYear,
        week,
        age_group: age,
        verse_variant: "A",
        verse_text: verseA.text || "TBD",
        reference: verseA.reference || "Scripture",
      },
      {
        program_year: programYear,
        week,
        age_group: age,
        verse_variant: "B",
        verse_text: verseB.text || "TBD",
        reference: verseB.reference || "Scripture",
      },
    ]
  })

  verseRows.push({
    program_year: programYear,
    week,
    age_group: "8-12",
    verse_variant: null,
    verse_text: body?.age8to12?.verse || "TBD",
    reference: body?.age8to12?.reference || "Scripture",
  })

  await supabaseServer.from("weekly_verses").upsert(verseRows, {
    onConflict: "program_year,week,age_group,verse_variant",
  })

  return NextResponse.json({ ok: true })
}

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

  const programYear = Number(body?.programYear)
  const mode = body?.mode || "seed"
  if (!programYear) {
    return NextResponse.json({ error: "Missing program year." }, { status: 400 })
  }

  if (mode === "seed") {
    const result = await seedProgramYear(programYear)
    return NextResponse.json({ ok: true, insertedWeeks: result.insertedWeeks })
  }

  await createEmptyYear(programYear)
  return NextResponse.json({ ok: true })
}

