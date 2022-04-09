import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage"
import { saveMedicalCertificate, writeTimeStamp } from "./firestore"

export const uploadMedicalCertificate = async (file, seasonName, studentId) => {
  const storage = getStorage()
  const path = `medicalCertificates/${seasonName}/${studentId}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const link = await getDownloadURL(storageRef)
  await saveMedicalCertificate(studentId, link, seasonName)
  await writeTimeStamp(studentId)
  return link
}

export const deleteMedicalCertificate = async (seasonName, studentId) => {
  const storage = getStorage()
  const path = `medicalCertificates/${seasonName}/${studentId}`
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
