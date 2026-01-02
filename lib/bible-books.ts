// All 66 books of the Bible in order
export const BIBLE_BOOKS = [
  // Old Testament (39 books)
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  // New Testament (27 books)
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
]

export function getBooksForSet(setNumber: number, booksPerSet = 5): string[] {
  const startIndex = setNumber * booksPerSet
  return BIBLE_BOOKS.slice(startIndex, startIndex + booksPerSet)
}

export function getSetName(setNumber: number, booksPerSet = 5): string {
  const totalOldTestamentBooks = 39
  const totalBooksInSet = (setNumber + 1) * booksPerSet
  if (totalBooksInSet <= totalOldTestamentBooks) return "Old Testament"
  if (setNumber * booksPerSet >= totalOldTestamentBooks) return "New Testament"
  return "Old Testament"
}

export function getTestamentDescription(setNumber: number, booksPerSet = 5): string {
  const totalOldTestamentBooks = 39
  const totalBooksInSet = (setNumber + 1) * booksPerSet
  if (totalBooksInSet <= totalOldTestamentBooks) {
    return "These are books from the Old Testament, the first part of the Bible that tells us about God's promises."
  }
  return "These are books from the New Testament, which tells us about Jesus and His followers."
}

export function getSetProgress(setNumber: number, booksPerSet = 5): string {
  const totalOldTestamentBooks = 39
  const totalNewTestamentBooks = 27
  const oldTestamentSets = Math.ceil(totalOldTestamentBooks / booksPerSet)
  const totalSets = Math.ceil(BIBLE_BOOKS.length / booksPerSet)

  const totalBooksInSet = (setNumber + 1) * booksPerSet

  if (totalBooksInSet <= totalOldTestamentBooks) {
    return `Old Testament - Set ${setNumber + 1} of ${oldTestamentSets}`
  }
  const newTestamentSetNumber = setNumber - oldTestamentSets + 1
  const newTestamentTotalSets = totalSets - oldTestamentSets
  return `New Testament - Set ${newTestamentSetNumber} of ${newTestamentTotalSets}`
}

export function getTotalSets(booksPerSet = 5): number {
  return Math.ceil(BIBLE_BOOKS.length / booksPerSet)
}

export function getBibleBookProgress(
  setNumber: number,
  masteryLevel: number,
  age: number,
): {
  setLabel: string
  masteryGoal: number
  booksPerSet: number
  currentBooks: string[]
} {
  const booksPerSet = age < 8 ? 5 : 10
  const masteryGoal = age < 8 ? 3 : 2

  return {
    setLabel: getSetProgress(setNumber, booksPerSet),
    masteryGoal,
    booksPerSet,
    currentBooks: getBooksForSet(setNumber, booksPerSet),
  }
}
