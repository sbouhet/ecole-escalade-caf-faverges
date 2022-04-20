const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

module.exports = async (studentId) => {
  try {
    const doc = await db.doc(`students/${studentId}`).get()
    const student = doc.data()
    return student
  } catch (error) {
    throw "Utilisateur non trouvé dans Firestore"
  }
}
