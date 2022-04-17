import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage"

import { saveMedicalCertificate } from "$firestore/saveMedicalCertificate"
import { BError } from "berror"

export const uploadMedicalCertificate = async (file, seasonName, studentId) => {
  try {
    if (!file) throw "No file"
    if (!seasonName) throw "No seasonName"
    if (!studentId) throw "No studentId"
    const storage = getStorage()
    const path = `medicalCertificates/${seasonName}/${studentId}`
    const storageRef = ref(storage, path)

    //Upload certificate
    await uploadBytes(storageRef, file)

    //Get link
    const link = await getDownloadURL(storageRef)

    //Write link in stuent/private and change status is season/currentSeason/certificate
    await saveMedicalCertificate(studentId, link, seasonName)

    console.log("Certificate uploaded")
    return link
  } catch (error) {
    throw new BError(
      "$utils/firebase/storage => uploadMedicalCertificate()",
      error
    )
  }
}

export const deleteMedicalCertificate = async (seasonName, studentId) => {
  try {
    if (!seasonName) throw "No season name"
    if (!studentId) throw "No student ID"
    const storage = getStorage()
    const path = `medicalCertificates/${seasonName}/${studentId}`
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    throw new BError(
      "$utils/firebase/storage => deleteMedicalCertificate()",
      error
    )
  }
}
