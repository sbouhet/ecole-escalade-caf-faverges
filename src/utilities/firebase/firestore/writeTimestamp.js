import { _updateDoc } from "$firestore/basics"

export const writeTimeStamp = async (studentId) => {
  if (!studentId) throw "No student ID"
  try {
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
    console.error("Error writing timestamp")
    throw error
  }
}
