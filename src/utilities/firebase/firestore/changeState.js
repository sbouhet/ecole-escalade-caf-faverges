import { _updateDoc } from "$firestore/basics"
import { BError } from "berror"

export const changeState = async (studentId, field, state, seasonName) => {
  try {
    if (!studentId) throw "no id"
    if (!field) throw "no field"
    if (!state) throw "no state"
    if (!seasonName) throw "no seasonName"
    console.log(`Changing state for ${studentId}`)
    await _updateDoc(
      { [`seasons.${seasonName}.${field}`]: state },
      "students",
      studentId
    )
    if(field == "payment" && state == "no"){
      await _updateDoc(
        { [`seasons.${seasonName}.paymentType`]: null },
        "students",
        studentId
      )
    }
    return
  } catch (error) {
    throw new BError("$firestore/changeState => changeState()", error)
  }
}
