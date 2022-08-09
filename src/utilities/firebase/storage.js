import {
  getStorage,
  ref,
  updateMetadata,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage"
import { _updateDoc } from "$utils/firebase/firestore/basics"
import { BError } from "berror"

export const uploadMedicalCertificate = async (
  file,
  seasonName,
  id,
  userId,
  fileName
) => {
  try {
    if (!file) throw "No file"
    if (!seasonName) throw "No seasonName"
    if (!id) throw "No id"
    if (!userId) throw "No userId"
    if (!fileName) throw "No fileName"

    const storage = getStorage()
    const path = `medicalCertificates/${seasonName}/${fileName}`
    const storageRef = ref(storage, path)

    //Upload certificate
    await uploadBytes(storageRef, file)

    //Write metadata
    const customMetadata = { parentId: userId }
    await updateMetadata(storageRef, { customMetadata })

    //Get link
    const link = await getDownloadURL(storageRef)

    //Create timestamp
    const timestamp = dayjs().format("D MMMM YYYY à HH:mm")

    //Update student private doc with link and timestamp
    await _updateDoc(
      { medicalCertificateLink: link, medicalCertificateTimestamp: timestamp },
      "students",
      id,
      "privateCol",
      "privateDoc"
    )

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
