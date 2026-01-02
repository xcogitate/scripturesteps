export type AgeGroup = "4" | "5" | "6" | "7" | "8-12"

export const getAgeGroup = (age: number): AgeGroup => {
  if (age >= 8) return "8-12"
  if (age <= 4) return "4"
  if (age === 5) return "5"
  if (age === 6) return "6"
  return "7"
}
