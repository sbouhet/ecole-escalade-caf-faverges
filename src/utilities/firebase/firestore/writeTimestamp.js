import { _updateDoc } from "$firestore/basics"

export const writeTimeStamp = async (studentId) => {
  if (!studentId) throw "No student ID"
  try {
    const timestamp = dayjs().format("YYYYMMDDHHmmss")
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
    throw error
  }
}
