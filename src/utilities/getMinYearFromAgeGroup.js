import { BError } from "berror"

export const getMinYearFromAgeGroup = (ageGroup) => {
  try {
    if (!ageGroup) throw "No age group"
    let currentYear = dayjs().year()
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError(
      "$utils/getMinYearFromAgeGroup => getMinYearFromAgeGroup()",
      error
    ).log()
  }
}
