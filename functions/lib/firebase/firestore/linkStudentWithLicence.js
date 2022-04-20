const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

module.exports = async (studentId, licenceNb, seasonName) => {
  try {
    const x = await db
      .collection("students")
      .doc(studentId)
      .update({
        [`seasons.${seasonName}.licence`]: "yes",
        [`seasons.${seasonName}.licenceNb`]: licenceNb,
      })
  } catch (error) {
    throw "Impossible de mettre à jour l'utilisateur"
  }
}
