// Utility to calculate age from birthdate
export function calculateAge(birthdate: Date): number {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

// Get age group for curriculum selection
export function getAgeGroup(age: number): "4-7" | "8-12" {
  return age >= 8 && age <= 12 ? "8-12" : "4-7"
}

// Validate age is within acceptable range
export function isValidAge(age: number): boolean {
  return age >= 4 && age <= 12
}

// Calculate birthdate from age (for migration/fallback)
export function estimateBirthdateFromAge(age: number): Date {
  const today = new Date()
  const year = today.getFullYear() - age
  return new Date(year, today.getMonth(), today.getDate())
}
