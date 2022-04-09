import { _updateDoc } from "$firestore/basics"

export const changeState = async (studentId, field, state, seasonName) => {
  if (!studentId) throw "no id"
  if (!field) throw "no field"
  if (!state) throw "no state"
  if (!seasonName) throw "no seasonName"
  try {
    console.log(`Changing state for ${studentId}`)
    await _updateDoc(
      { [`seasons.${seasonName}.${field}`]: state },
      "students",
      studentId
    )
    return
  } catch (error) {
    throw error
  }
}
