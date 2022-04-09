import { _updateDoc } from "$firestore/basics"

export const saveMedicalCertificate = async (studentId, link, seasonName) => {
  if (!studentId) throw "no student id"
  if (!link) throw "no link"
  if (!seasonName) throw "no season name"
  try {
    await _updateDoc(
      {
        [`seasons.${seasonName}.medicalCertificate`]: "waiting",
      },
      "students",
      studentId
    )
    await _updateDoc(
      { medicalCertificateLink: link },
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )
    console.log("Medical certificate saved")
    return
  } catch (error) {
    throw error
  }
}
