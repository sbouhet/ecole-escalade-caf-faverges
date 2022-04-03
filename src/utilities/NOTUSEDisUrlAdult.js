import { getDayUrl } from "./days"

export const isUrlAdult = (url, season) => {
  const days = season.days
  const ageGroups = season.ageGroups
  const currentDay = days.filter((day) => getDayUrl(day) === url)[0]
  let index = currentDay.ageGroupIndex
  return ageGroups[index].min >= 18
}
