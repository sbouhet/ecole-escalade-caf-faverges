import { getSeasonFromFirestore } from "$firestore/season"
import { _setDoc } from "$firestore/basics"

export const copySeason = async (oldSeasonName, newSeasonName) => {
  if (!oldSeasonName) throw "No old season name"
  if (!newSeasonName) throw "No new season name"
  try {
    console.log(`Copying season ${oldSeasonName}`)

    //Get old season
    const oldSeason = await getSeasonFromFirestore(oldSeasonName)

    //Change name to new name before uploading
    oldSeason.name = newSeasonName

    //Upload
    await _setDoc(oldSeason, "seasons", newSeasonName)

    console.log("Done")
    return
  } catch (error) {
    console.error("Could not copy season")
    throw error
  }
}
