import { _updateDoc } from "$firestore/basics"
import { writeTimeStamp } from "$firestore/writeTimestamp"

export const saveMedicalCertificate = async (studentId, link, seasonName) => {
  if (!studentId) throw "no student id"
  if (!link) throw "no link"
  if (!seasonName) throw "no season name"
  try {
    await _updateDoc(
      { medicalCertificateLink: link },
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )

    //write timestamp
    await writeTimeStamp(studentId)
    console.log("saving public doc")
    await _updateDoc(
      {
        [`seasons.${seasonName}.medicalCertificate`]: "waiting",
      },
      "students",
      studentId
    )
    console.log("Medical certificate saved")
    return
  } catch (error) {
    throw error
  }
}