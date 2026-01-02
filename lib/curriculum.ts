import { allVerses, extraVerses4to7, extraVerses8to12, getVerseText, year3Verses, year4Verses } from "@/lib/bible-data"
import { getAgeGroup, type AgeGroup } from "@/lib/age-groups"
import { getKjvText } from "@/lib/kjv"
import { supabaseServer } from "@/lib/supabase-server"

type VerseRecord = {
  text: string
  reference: string
}

type WeekPayload = {
  week: number
  programYear: number
  month: string
  theme4to7: string
  theme8to12: string
  verseA?: VerseRecord
  verseB?: VerseRecord
  verse?: VerseRecord
}

const cleanVerseString = (value: string) => value.replace(/ƒ\?+/g, " - ").replace(/\s+/g, " ").trim()

const splitVerseString = (value: string): VerseRecord => {
  const cleaned = cleanVerseString(value)
  const dashMatch = cleaned.match(/^(.*?)(?:—|-)\s*([1-3]?\s?[A-Za-z][A-Za-z\s]+\d+:\d+.*)$/)
  if (dashMatch) {
    return { text: dashMatch[1].trim().replace(/^"+|"+$/g, ""), reference: dashMatch[2].trim() }
  }

  const refMatch = cleaned.match(/([1-3]?\s?[A-Za-z][A-Za-z\s]+\d+:\d+)/)
  if (refMatch) {
    const reference = refMatch[1]
    const text = cleaned.replace(reference, "").replace(/[-–—]+/g, " ").trim()
    return { text: text.replace(/^"+|"+$/g, ""), reference }
  }

  return { text: cleaned.replace(/^"+|"+$/g, ""), reference: "Scripture" }
}

const resolveKjvText = (record: VerseRecord): VerseRecord => {
  const kjvText = record.reference ? getKjvText(record.reference) : null
  return {
    text: kjvText || record.text,
    reference: record.reference,
  }
}

const getSeedWeek = (week: number, programYear: number) => {
  if (programYear <= 1) {
    return allVerses.find((item) => item.week === week) || null
  }
  if (programYear === 2) {
    return extraVerses4to7.find((item) => item.week === week) || null
  }
  if (programYear === 3) {
    return year3Verses.find((item) => item.week === week) || null
  }
  if (programYear === 4) {
    return year4Verses.find((item) => item.week === week) || null
  }
  return null
}

const getSeedVerseFor8to12 = (week: number, programYear: number): VerseRecord | null => {
  if (programYear <= 1) {
    const seed = allVerses.find((item) => item.week === week)
    if (!seed?.age8to12?.verse) return null
    const reference = seed.age8to12.reference || "Scripture"
    return { text: getKjvText(reference) || seed.age8to12.verse, reference }
  }

  if (programYear === 2) {
    const index = (week - 1) % extraVerses8to12.length
    const seed = extraVerses8to12[index]
    if (!seed) return null
    const reference = seed.reference || "Scripture"
    return { text: getKjvText(reference) || seed.verse, reference }
  }

  const seed = getSeedWeek(week, programYear)
  if (!seed?.age8to12?.verse) return null
  const reference = seed.age8to12.reference || "Scripture"
  return { text: getKjvText(reference) || seed.age8to12.verse, reference }
}

const buildWeekPayload = (week: number, programYear: number): WeekPayload | null => {
  const seed = getSeedWeek(week, programYear)
  if (!seed) return null

  const verseA = resolveKjvText(splitVerseString(seed.verseA.age4))
  const verseB = resolveKjvText(splitVerseString(seed.verseB.age4))

  return {
    week,
    programYear,
    month: seed.month || "Unknown",
    theme4to7: seed.theme4to7 || "Theme",
    theme8to12: seed.theme8to12 || seed.theme4to7 || "Theme",
    verseA,
    verseB,
    verse: getSeedVerseFor8to12(week, programYear) || undefined,
  }
}

const getSeedMeta = (week: number, programYear: number) => {
  const seed = getSeedWeek(week, programYear)
  return {
    month: seed?.month || "Unknown",
    theme4to7: seed?.theme4to7 || "Theme",
    theme8to12: seed?.theme8to12 || seed?.theme4to7 || "Theme",
  }
}

const getWeekDataFromSeed = (week: number, age: number, programYear: number) => {
  const meta = getSeedMeta(week, programYear)
  const ageGroup = getAgeGroup(age)

  if (ageGroup === "8-12") {
    const verse = getVerseText(week, age, "A", programYear)
    return {
      week,
      programYear,
      month: meta.month,
      theme: meta.theme8to12 || verse.theme,
      verse: { text: verse.verse, reference: verse.reference },
    }
  }

  const verseA = getVerseText(week, age, "A", programYear)
  const verseB = getVerseText(week, age, "B", programYear)

  return {
    week,
    programYear,
    month: meta.month,
    theme: meta.theme4to7 || verseA.theme,
    verseA: { text: verseA.verse, reference: verseA.reference },
    verseB: { text: verseB.verse, reference: verseB.reference },
  }
}

const buildVerseRows = (week: number, programYear: number) => {
  const seed = getSeedWeek(week, programYear)
  if (!seed) return []

  const ages: Array<{ group: AgeGroup; value: string; variant: "A" | "B" }> = [
    { group: "4", value: seed.verseA.age4, variant: "A" },
    { group: "5", value: seed.verseA.age5, variant: "A" },
    { group: "6", value: seed.verseA.age6, variant: "A" },
    { group: "7", value: seed.verseA.age7, variant: "A" },
    { group: "4", value: seed.verseB.age4, variant: "B" },
    { group: "5", value: seed.verseB.age5, variant: "B" },
    { group: "6", value: seed.verseB.age6, variant: "B" },
    { group: "7", value: seed.verseB.age7, variant: "B" },
  ]

  const rows = ages.map((item) => {
    const parsed = resolveKjvText(splitVerseString(item.value))
    return {
      program_year: programYear,
      week,
      age_group: item.group,
      verse_variant: item.variant,
      verse_text: parsed.text,
      reference: parsed.reference,
    }
  })

  const verse8to12 = getSeedVerseFor8to12(week, programYear)
  if (verse8to12) {
    rows.push({
      program_year: programYear,
      week,
      age_group: "8-12",
      verse_variant: null,
      verse_text: verse8to12.text,
      reference: verse8to12.reference,
    })
  }

  return rows
}

export const ensureWeekSeeded = async (week: number, programYear: number) => {
  if (!supabaseServer) return

  const { data: existing } = await supabaseServer
    .from("weekly_themes")
    .select("week")
    .eq("program_year", programYear)
    .eq("week", week)
    .maybeSingle()

  if (existing) return

  const payload = buildWeekPayload(week, programYear)
  if (!payload) return

  await supabaseServer.from("weekly_themes").insert({
    program_year: programYear,
    week,
    month: payload.month,
    theme_4_7: payload.theme4to7,
    theme_8_12: payload.theme8to12,
  })

  const verseRows = buildVerseRows(week, programYear)
  if (verseRows.length) {
    await supabaseServer.from("weekly_verses").insert(verseRows)
  }
}

export const seedProgramYear = async (programYear: number) => {
  if (!supabaseServer) return { insertedWeeks: 0 }
  let insertedWeeks = 0

  for (let week = 1; week <= 52; week += 1) {
    const payload = buildWeekPayload(week, programYear)
    if (!payload) continue

    const { error: themeError } = await supabaseServer.from("weekly_themes").upsert(
      {
        program_year: programYear,
        week,
        month: payload.month,
        theme_4_7: payload.theme4to7,
        theme_8_12: payload.theme8to12,
      },
      { onConflict: "program_year,week" },
    )

    if (themeError) continue

    const verseRows = buildVerseRows(week, programYear)
    if (verseRows.length) {
      await supabaseServer.from("weekly_verses").upsert(verseRows, {
        onConflict: "program_year,week,age_group,verse_variant",
      })
    }

    insertedWeeks += 1
  }

  return { insertedWeeks }
}

export const getWeekData = async (week: number, age: number, programYear: number) => {
  if (!supabaseServer) return null

  const { data: themeRow, error: themeError } = await supabaseServer
    .from("weekly_themes")
    .select("month, theme_4_7, theme_8_12")
    .eq("program_year", programYear)
    .eq("week", week)
    .maybeSingle()

  if (themeError || !themeRow) return null

  const ageGroup = getAgeGroup(age)
  if (ageGroup === "8-12") {
    const { data: verseRow, error: verseError } = await supabaseServer
      .from("weekly_verses")
      .select("verse_text, reference, verse_variant")
      .eq("program_year", programYear)
      .eq("week", week)
      .eq("age_group", ageGroup)
      .order("verse_variant", { ascending: true, nullsFirst: true })
      .limit(1)
      .maybeSingle()

    if (verseError) return null
    let resolvedVerse = verseRow

    if (!resolvedVerse) {
    const { data: fallbackRow } = await supabaseServer
      .from("weekly_verses")
      .select("verse_text, reference, verse_variant")
      .eq("program_year", programYear)
      .eq("week", week)
      .eq("age_group", ageGroup)
      .order("verse_variant", { ascending: true, nullsFirst: true })
      .limit(1)
      .maybeSingle()
      resolvedVerse = fallbackRow || null
    }

    if (!resolvedVerse) return null

    return {
      week,
      programYear,
      month: themeRow.month,
      theme: themeRow.theme_8_12,
      verse: {
        text: resolvedVerse.verse_text,
        reference: resolvedVerse.reference,
      },
    }
  }

  const { data: verseRows, error: versesError } = await supabaseServer
    .from("weekly_verses")
    .select("verse_text, reference, verse_variant")
    .eq("program_year", programYear)
    .eq("week", week)
    .eq("age_group", ageGroup)

  const verseA = verseRows?.find((row) => row.verse_variant === "A")
  const verseB = verseRows?.find((row) => row.verse_variant === "B")

  if (versesError || !verseA || !verseB) return null

  return {
    week,
    programYear,
    month: themeRow.month,
    theme: themeRow.theme_4_7,
    verseA: { text: verseA.verse_text, reference: verseA.reference },
    verseB: { text: verseB.verse_text, reference: verseB.reference },
  }
}

export const getVerseForAge = async (
  week: number,
  age: number,
  programYear: number,
  verseVariant?: "A" | "B" | null,
) => {
  const ageGroup = getAgeGroup(age)
  if (!supabaseServer) return null

  const query = supabaseServer
    .from("weekly_verses")
    .select("verse_text, reference, verse_variant")
    .eq("program_year", programYear)
    .eq("week", week)
    .eq("age_group", ageGroup)

    const { data: verseRows, error: verseError } =
    ageGroup === "8-12"
      ? await query.order("verse_variant", { ascending: true, nullsFirst: true }).limit(1)
      : await query.eq("verse_variant", verseVariant || "A")

  const verseRow = Array.isArray(verseRows) ? verseRows[0] : verseRows
  if (verseError) return null

  let resolvedVerse = verseRow
  if (!resolvedVerse && ageGroup === "8-12") {
    const { data: fallbackRows } = await supabaseServer
      .from("weekly_verses")
      .select("verse_text, reference, verse_variant")
      .eq("program_year", programYear)
      .eq("week", week)
      .eq("age_group", ageGroup)
      .order("verse_variant", { ascending: true, nullsFirst: true })
      .limit(1)
      .maybeSingle()
    resolvedVerse = Array.isArray(fallbackRows) ? fallbackRows[0] : fallbackRows
  }

  if (!resolvedVerse) return null

  return {
    text: resolvedVerse.verse_text,
    reference: resolvedVerse.reference,
    verseVariant: resolvedVerse.verse_variant || null,
  }
}
