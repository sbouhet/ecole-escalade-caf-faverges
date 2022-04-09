import { getDayStudents } from "$firestore/getDayStudents"
import { getDayFromUrl } from "$utils/days"

export const isDayFull = async (dayUrl, seasonName, days) => {
  if (!dayUrl) throw "No day url"
  if (!seasonName) throw "No season name"
  if (!days) throw "No days object"
  try {
    const dayStudents = await getDayStudents(dayUrl, seasonName)
    const nbOfStudent = dayStudents.length
    const day = getDayFromUrl(dayUrl, days)
    const spotsLeft = day.nbMaxOfStudents - nbOfStudent
    if (spotsLeft <= 0) return true
    return false
  } catch (error) {
    console.error(`Error while trying to see if ${dayUrl} is full`)
    throw error
  }
}
