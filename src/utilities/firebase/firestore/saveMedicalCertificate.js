import { _updateDoc } from "$firestore/basics"
import { writeTimeStamp } from "$firestore/writeTimestamp"
import { BError } from "berror"

export const saveMedicalCertificate = async (studentId, link, seasonName) => {
  try {
    if (!studentId) throw "no student id"
    if (!link) throw "no link"
    if (!seasonName) throw "no season name"
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
    throw new BError(
      "Function $firestore/saveMedicalCertificate => saveMedicalCertificate()",
      error
    )
  }
}
