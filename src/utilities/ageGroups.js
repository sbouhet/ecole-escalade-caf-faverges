/* export const ageGroups = [
  { min: 6, max: 7 },
  { min: 8, max: 10 },
  { min: 11, max: 13 },
  { min: 14, max: 17 },
  { min: 18 },
] */

import { BError } from "berror"

export const getAgeGroupName = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    if (ageGroup.min === 18) return "Adultes"
    return `${ageGroup.min}‑${ageGroup.max} ans`
  } catch (error) {
    throw new BError("function getAgeGroupName not working", error)
  }
}

export const getAge = (dateOfBirth, keepOneDecimal = true) => {
  try {
    if (!dateOfBirth) throw "No date of birth"
    const birthday = dayjs(dateOfBirth, "DD/MM/YYYY")
    const today = dayjs()
    const age = today.diff(birthday, "year", true)
    if (!keepOneDecimal) return Math.round(age)
    //keep one decimal
    const roundedAge = Math.round(age * 10) / 10
    return roundedAge
  } catch (error) {
    throw new BError("function getAge not working", error)
  }
}

export const getMinYear = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    let currentYear = dayjs().year()
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError("function ageGRoups/getMinYear not working", error)
  }
}
