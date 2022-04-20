const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

module.exports = (studentId) => {
  console.log(`Removing ${studentId} from parents`)
  //Query parents
  const parentsRef = db
    .collection("users")
    .where("students", "array-contains", studentId)

  //Get parents
  return parentsRef.get().then((querySnapshot) => {
    //For each parent
    querySnapshot.forEach((parentDoc) => {
      console.log("Parent found")
      console.log(parentDoc.data())
      const parentRef = db.collection("users").doc(parentDoc.id)
      //remove student id
      return parentRef.update({
        students: admin.firestore.FieldValue.arrayRemove(studentId),
      })
    })
  })
}
