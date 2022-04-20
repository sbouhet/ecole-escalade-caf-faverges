const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

module.exports = async () => {
  console.log("Trying to get time limit from firestore")
  var docRef = db.collection("admin").doc("admin")
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const timeLimit = doc.data().timeLimitForLicence
        return timeLimit
      } else {
        console.log("No such document!")
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error)
    })
}
