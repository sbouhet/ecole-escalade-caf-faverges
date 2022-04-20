const admin = require("firebase-admin")
admin.initializeApp()
const season = require("../season")

module.exports = async (studentId) => {
  const bucket = admin.storage().bucket()
  const path = `medicalCertificates/${season().current}/${studentId}`
  return bucket.file(path).delete()
}
