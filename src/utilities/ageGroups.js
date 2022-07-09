import { BError } from "berror"
import { getDayFromUrl } from "$utils/days"

export const getAgeGroupName = (ageGroup) => {
  try {
    if (!ageGroup) return "No age group"
    if (ageGroup.min == 18) return "Adultes"
    return `${ageGroup.min}‑${ageGroup.max} ans`
  } catch (error) {
    throw new BError("$utils/ageGroups => getAgeGroupName()", error).log()
  }
}

export const getAge = (dateOfBirth, keepThreeDecimal = true, date) => {
  try {
    if (!dateOfBirth) throw "No date of birth"
    const birthday = dayjs(dateOfBirth, "YYYY-MM-DD")
    if (date) {
      date = dayjs(date)
    } else {
      date = dayjs()
    }
    const age = date.diff(birthday, "year", true)
    if (!keepThreeDecimal) return Math.floor(age)
    //keep one decimal
    const roundedAge = Math.floor(age * 1000) / 1000
    return roundedAge
  } catch (error) {
    throw new BError("$utils/ageGroups => getAge()", error).log()
  }
}

export const getMinYear = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    let currentYear = dayjs().year()
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError("$utils/ageGroups => getMinYear()", error).log()
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
