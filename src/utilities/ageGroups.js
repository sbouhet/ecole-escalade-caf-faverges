/* export const ageGroups = [
  { min: 6, max: 7 },
  { min: 8, max: 10 },
  { min: 11, max: 13 },
  { min: 14, max: 17 },
  { min: 18 },
] */

export const getAgeGroupName = (ageGroup) => {
  if (ageGroup.min === 18) return "Adultes"
  return `${ageGroup.min}‑${ageGroup.max} ans`
}
