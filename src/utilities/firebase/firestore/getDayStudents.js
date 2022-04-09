import { _query } from "$firestore/basics"

export const getDayStudents = async (dayUrl, seasonName) => {
  if (!dayUrl) throw "no day url"
  if (!seasonName) throw "no season name"
  try {
    const dayStudents = await _query(
      "students",
      `seasons.${seasonName}.day`,
      "==",
      dayUrl
    )
    console.log(`Found ${dayStudents.length} stuents for ${dayUrl}`)
    return dayStudents
  } catch (error) {
    console.error(`Error getting students for ${dayUrl}`)
    throw error
  }
}
