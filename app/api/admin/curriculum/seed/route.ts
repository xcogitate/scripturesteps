import { NextResponse } from "next/server"
import { seedProgramYear } from "@/lib/curriculum"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
  return NextResponse.json({
    message: "Seed uses POST. Send a POST request to this endpoint to load Years 1-4.",
    example: "POST /api/admin/curriculum/seed",
  })
}

export async function POST() {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase server is not configured." }, { status: 500 })
  }

  const results = await Promise.all([1, 2, 3, 4].map((year) => seedProgramYear(year)))

  return NextResponse.json({
    ok: true,
    years: results.map((result, index) => ({ year: index + 1, insertedWeeks: result.insertedWeeks })),
  })
}
