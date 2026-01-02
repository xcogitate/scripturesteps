import { NextResponse } from "next/server"
import { getAgeGroup } from "@/lib/age-groups"
import { getWeekData, getVerseForAge } from "@/lib/curriculum"
import { supabaseServer } from "@/lib/supabase-server"

const OPENAI_MODEL = "gpt-5.2"

type ContentType = "explanation" | "devotional" | "prayer" | "quiz"

const getPrayerContentType = (sessionType?: string, dayOfWeek?: number) => {
  if (sessionType !== "evening") return "prayer_morning"
  if (!dayOfWeek) return "prayer_evening"
  return `prayer_evening_day${dayOfWeek}`
}

const buildPrompt = (params: {
  type: ContentType
  ageGroup: string
  exactAge: number
  theme: string
  verseText: string
  reference: string
  verseVariant?: "A" | "B"
  sessionType?: "morning" | "evening"
  dayOfWeek?: number
}) => {
  const ageRules =
    params.exactAge <= 4
      ? "Age 4: 1-2 short sentences, <= 20 words, very simple words, concrete examples."
      : params.exactAge === 5
        ? "Age 5: 2-3 short sentences, <= 35 words, simple words, one concrete example."
        : params.exactAge === 6
          ? "Age 6: 3-4 sentences, <= 50 words, simple-to-medium words, gentle encouragement."
          : params.exactAge === 7
            ? "Age 7: 4-5 sentences, <= 65 words, simple words with 1-2 key faith words."
            : "Age 8-12: 6-8 sentences, <= 120 words, deeper meaning, reflective tone."
  const base = [
    `Theme: ${params.theme}`,
    `Verse: ${params.reference} - ${params.verseText}`,
    `Age group: ${params.ageGroup}`,
    `Exact age: ${params.exactAge}`,
    `Age rules: ${ageRules}`,
    params.verseVariant ? `Verse variant: ${params.verseVariant}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  if (params.type === "explanation") {
    return `${base}

Write an age-appropriate explanation for the verse. Follow the age rules exactly. Use the placeholder {childName} for personalization.
Return JSON only:
{ "explanation": "..." }`
  }

  if (params.type === "devotional") {
    return `${base}

Write a devotional for ages 8-12 only. Use the placeholder {childName} for personalization. Keep it within 120 words and include one reflection question.
Return JSON only:
{ "title": "...", "verse": "${params.reference}", "content": "...", "question": "..." }`
  }

  if (params.type === "prayer") {
    const session = params.sessionType === "evening" ? "evening" : "morning"
    const dayLine = params.sessionType === "evening" && params.dayOfWeek ? `Day of week: ${params.dayOfWeek}` : ""
    return `${base}
${dayLine ? `\n${dayLine}` : ""}

Write a ${session} prayer. Follow the age rules exactly. Use the placeholder {childName} for personalization.
Return JSON only:
{ "title": "...", "text": "..." }`
  }

  return `${base}

Create 5 multiple-choice quiz questions based on the verse, reference, and theme. Keep language appropriate to the age rules. Each question should have 4 options with one correct answer.
Return JSON only:
{ "questions": [ { "prompt": "...", "options": ["...","...","...","..."], "answer": "..." } ] }`
}

const generateAIContent = async (prompt: string) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Missing OpenAI API key.")
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You write Bible learning content for children. Keep content calm, encouraging, and age-appropriate.",
        },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI error: ${errorText}`)
  }

  const data = await response.json()
  const raw = data?.choices?.[0]?.message?.content?.trim()
  if (!raw) {
    throw new Error("OpenAI returned empty content.")
  }

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error("OpenAI response was not valid JSON.")
  }
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

  const action = body?.action
  const age = Number(body?.age)
  const week = Number(body?.week)
  const programYear = Number(body?.programYear || 1)

  if (!action || !age || !week) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 })
  }

  if (action === "week") {
    const weekData = await getWeekData(week, age, programYear)
    if (!weekData) {
      return NextResponse.json({ error: "Week data not found. Seed the curriculum in Supabase." }, { status: 404 })
    }
    return NextResponse.json(weekData)
  }

  if (action !== "content") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 })
  }

  const contentType = body?.contentType as ContentType
  const verseVariant = body?.verseVariant as "A" | "B" | undefined
  const sessionType = body?.sessionType as "morning" | "evening" | undefined
  const dayOfWeek = Number(body?.dayOfWeek || 0) || undefined

  if (!contentType) {
    return NextResponse.json({ error: "Missing content type." }, { status: 400 })
  }

  const weekData = await getWeekData(week, age, programYear)
  if (!weekData) {
    return NextResponse.json({ error: "Week data not found. Seed the curriculum in Supabase." }, { status: 404 })
  }

  const verse = await getVerseForAge(week, age, programYear, verseVariant || "A")
  if (!verse) {
    return NextResponse.json({ error: "Verse data not found. Seed the curriculum in Supabase." }, { status: 404 })
  }

  const ageGroup = getAgeGroup(age)
  const dbContentType =
    contentType === "prayer" ? getPrayerContentType(sessionType, dayOfWeek) : contentType
  const storedType = contentType === "prayer" ? "prayer" : contentType

  if (contentType === "devotional" && ageGroup !== "8-12") {
    return NextResponse.json({ error: "Devotional is only for ages 8-12." }, { status: 400 })
  }

  const baseQuery = supabaseServer
    .from("ai_content")
    .select("content, content_type")
    .eq("program_year", programYear)
    .eq("week", week)
    .eq("age_group", ageGroup)
    .eq("content_type", dbContentType)

  const { data: existing } =
    ageGroup === "8-12"
      ? await baseQuery.is("verse_variant", null).maybeSingle()
      : await baseQuery.eq("verse_variant", verseVariant || "A").maybeSingle()

  let content = existing?.content

  if (!content) {
    const prompt = buildPrompt({
      type: storedType,
      ageGroup,
      exactAge: age,
      theme: weekData.theme,
      verseText: verse.text,
      reference: verse.reference,
      verseVariant,
      sessionType,
      dayOfWeek,
    })

    content = await generateAIContent(prompt)

    await supabaseServer.from("ai_content").upsert(
      {
        program_year: programYear,
        week,
        age_group: ageGroup,
        verse_variant: ageGroup === "8-12" ? null : verseVariant || "A",
        content_type: dbContentType,
        content,
        model: OPENAI_MODEL,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "program_year,week,age_group,verse_variant,content_type" },
    )
  }

  return NextResponse.json({
    week,
    programYear,
    theme: weekData.theme,
    verse: { text: verse.text, reference: verse.reference },
    content,
  })
}
