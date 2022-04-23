const admin = require("firebase-admin")

module.exports = async (filePath, seasonName, studentId, emails) => {
  try {
    if (!filePath) throw "Pas de fichier a uploader"
    if (!seasonName) throw "Pas de seasonName"
    if (!studentId) throw "Pas de studentId"
    if (!emails) throw "Pas d'emails'"

    const bucket = admin.storage().bucket()
    //const path = `medicalCertificates/${seasonName}/${studentId}`
    //const storageRef = ref(admin.storage(), path)

    return bucket.upload(filePath, {
      public: true,
      destination: `medicalCertificates/${seasonName}/${studentId}`,
    })

    /*  bucket.upload(path, (err, file, apiResponse) =>{
      // Your bucket now contains:
      // - "image.png" (with the contents of `/local/path/image.png')
      // `file` is an instance of a File object that refers to your new file.
    }) */

    //Upload certificate
    await uploadBytes(storageRef, file)

    //Write metadata
    const emailString = emails.join(", ")
    const customMetadata = { emails: emailString }
    await updateMetadata(storageRef, { customMetadata })

    //Get link
    const link = await getDownloadURL(storageRef)

    console.log("Certificate uploaded")
    return link

    //return bucket.file(path).delete()
  } catch (error) {
    console.log(error)
    throw error
  }
}
