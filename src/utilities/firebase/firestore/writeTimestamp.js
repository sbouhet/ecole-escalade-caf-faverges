import { _updateDoc } from "$firestore/basics"
import { BError } from "berror"

export const writeTimeStamp = async (studentId) => {
  try {
    if (!studentId) throw "No student ID"
    const timestamp = dayjs().format("D MMMM YYYY à HH:mm")
    await _updateDoc(
      { medicalCertificateTimestamp: timestamp },
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )
    console.log("Timestamp written")
    return
  } catch (error) {
    throw new BError("$firestore/writeTimeStamp => writeTimeStamp()", error)
  }
}
