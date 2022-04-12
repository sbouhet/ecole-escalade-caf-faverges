import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage"

import { saveMedicalCertificate } from "$firestore/saveMedicalCertificate"

export const uploadMedicalCertificate = async (file, seasonName, studentId) => {
  if (!file) throw "No file"
  if (!seasonName) throw "No seasonName"
  if (!studentId) throw "No studentId"
  try {
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
    console.error("Error while uploading certificate")
  }
}

export const deleteMedicalCertificate = async (seasonName, studentId) => {
  const storage = getStorage()
  const path = `medicalCertificates/${seasonName}/${studentId}`
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
