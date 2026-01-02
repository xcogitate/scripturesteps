import fs from "fs"
import path from "path"

type KjvVerse = {
  book_name: string
  chapter: number
  verse: number
  text: string
}

type KjvFile = {
  verses: KjvVerse[]
}

type ParsedReference = {
  book: string
  chapter: number
  verseStart: number
  verseEnd: number
}

let kjvIndex: Map<string, string> | null = null

const BOOK_ALIASES: Record<string, string> = {
  Psalm: "Psalms",
  Psalms: "Psalms",
  "Song of Songs": "Song of Solomon",
  "Song of Solomon": "Song of Solomon",
  Canticles: "Song of Solomon",
}

const buildKey = (book: string, chapter: number, verse: number) => `${book}|${chapter}|${verse}`

const normalizeBook = (book: string) => {
  const cleaned = book.replace(/\s+/g, " ").trim()
  return BOOK_ALIASES[cleaned] || cleaned
}

const normalizeReference = (reference: string) =>
  reference.replace(/\s+/g, " ").replace(/\.$/, "").trim()

const parseReference = (reference: string): ParsedReference | null => {
  const cleaned = normalizeReference(reference).replace(/\u2013/g, "-")
  const match = cleaned.match(/^([1-3]?\s?[A-Za-z][A-Za-z\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (!match) return null

  const book = normalizeBook(match[1].trim())
  const chapter = Number(match[2])
  const verseStart = Number(match[3])
  const verseEnd = match[4] ? Number(match[4]) : verseStart

  return { book, chapter, verseStart, verseEnd }
}

const cleanKjvText = (value: string) => {
  return value
    .replace(/^\s*\u00b6\s*/g, "")
    .replace(/[\u2039\u203a]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const loadKjvIndex = () => {
  if (kjvIndex) return kjvIndex

  const filePath = path.join(process.cwd(), "supabase", "seed", "web.json")
  const raw = fs.readFileSync(filePath, "utf8")
  const data: KjvFile = JSON.parse(raw)

  kjvIndex = new Map<string, string>()
  for (const verse of data.verses || []) {
    const book = normalizeBook(verse.book_name)
    const key = buildKey(book, verse.chapter, verse.verse)
    kjvIndex.set(key, cleanKjvText(verse.text))
  }

  return kjvIndex
}

export const getKjvText = (reference: string) => {
  const parsed = parseReference(reference)
  if (!parsed) return null

  const index = loadKjvIndex()
  const texts: string[] = []

  for (let verse = parsed.verseStart; verse <= parsed.verseEnd; verse += 1) {
    const key = buildKey(parsed.book, parsed.chapter, verse)
    const text = index.get(key)
    if (!text) return null
    texts.push(text)
  }

  return texts.join(" ")
}
