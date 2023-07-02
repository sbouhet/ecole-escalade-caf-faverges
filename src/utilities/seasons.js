import { BError } from "berror"

export const seasons = () => {
  try {
    const string = (year) => {
      return `${year}-${year + 1}`
    }
    const seasonObject = (year) => {
      return {
        current: string(year),
        last: string(year - 1),
        next: string(year + 1),
      }
    }
    const currentMonth = parseInt(dayjs().format("M"))
    //changed on 02/07/2023
    //const juneOrLater = currentMonth > 5
    const augustOrLater = currentMonth > 7
    const thisYear = parseInt(dayjs().format("YYYY"))

    //changed on 02/07/2023
    //if (juneOrLater) return seasonObject(thisYear)
    if (augustOrLater) return seasonObject(thisYear)
    return seasonObject(thisYear - 1)
  } catch (error) {
    throw new BError("$utils/seasons => seasons()", error)
  }
}
