import { _query } from "$firestore/basics"
import { BError } from "berror"

export const getDayStudents = async (dayUrl, seasonName) => {
  try {
    if (!dayUrl) throw "no day url"
    if (!seasonName) throw "no season name"
    const dayStudents = await _query(
      "students",
      `seasons.${seasonName}.day`,
      "==",
      dayUrl
    )
    //console.log(`Found ${dayStudents.length} stuents for ${dayUrl}`)
    return dayStudents
  } catch (error) {
    console.error(`Error getting students for ${dayUrl}`)
    throw new BError(
      "Function $firestore/getDayStudents => getDayStudents()",
      error
    )
  }
}
