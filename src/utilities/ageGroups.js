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

export const getAge = (dateOfBirth, keepOneDecimal = true) => {
  if (!dateOfBirth) throw "No date of birth input, can't figure out age"
  //const birthday = dayjs(dateOfBirth, "YYYY-MM-DD")
  const birthday = dayjs(dateOfBirth, "DD/MM/YYYY")
  const today = dayjs()
  const age = today.diff(birthday, "year", true)
  if (!keepOneDecimal) return Math.round(age)
  //keep one decimal
  const roundedAge = Math.round(age * 10) / 10
  return roundedAge
}

export const getMinYear = (ageGroup) => {
  if (!ageGroup) return
  let currentYear = dayjs().year()
  const minAge = ageGroup.min
  return currentYear - minAge
}
