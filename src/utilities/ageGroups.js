import { BError } from "berror"
import { getDayFromUrl } from "$utils/days"

export const getAgeGroupName = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    if (ageGroup.min === 18) return "Adultes"
    return `${ageGroup.min}‑${ageGroup.max} ans`
  } catch (error) {
    throw new BError("$utils/ageGroups => getAgeGroupName()", error)
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
    throw new BError("$utils/ageGroups => getAge()", error)
  }
}

export const getMinYear = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    let currentYear = dayjs().year()
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError("$utils/ageGroups => getMinYear()", error)
  }
}

export const getAgeGroupFromDayUrl = (dayUrl, days, ageGroups) => {
  try {
    if (!dayUrl) throw "No dayUrl"
    if (!days) throw "No days"
    if (!ageGroups) throw "No ageGroups"
    const day = getDayFromUrl(dayUrl, days)
    return ageGroups[day.ageGroupIndex]
  } catch (error) {
    throw new BError("$utils/ageGroups => getAgeGroupFromDayUrl()", error)
  }
}
