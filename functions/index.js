var dayjs = require("dayjs")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

const season = () => {
  const string = (year) => {
    return `${year}-${year + 1}`
  }
  const seasonObject = (year) => {
    return {
      current: string(year),
      last: string(year - 1),
      next: string(year + 1),
    }
  }
  const currentMonth = parseInt(dayjs().format("M"))
  const septemberOrLater = currentMonth > 8
  const thisYear = parseInt(dayjs().format("YYYY"))

  if (septemberOrLater) return seasonObject(thisYear)
  return seasonObject(thisYear - 1)
}

/* exports.randomNumber = functions.https.onRequest((request, response) => {
  const truc = `
  This season: ${season().current},
  next season: ${season().next},
  last season: ${season().last}`
  response.send(truc)
}) */

/* exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `Hello lolilol ${name}`
}) */

exports.newAuthUser = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    id: user.uid,
  })
})

exports.delAuthUser = functions.auth.user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete()
})

exports.newFirestoreUser = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const user = snap.data()
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`years/${seasonString}`)
      .update({ [`students.${user.id}`]: { id: user.id, email: user.email } })
  })

exports.updateFirestoreUser = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const user = change.after.data()
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`years/${seasonString}`)
      .update({ [`students.${user.id}`]: { id: user.id, email: user.email } })
  })

exports.delFirestoreUser = functions.firestore
  .document("users/{userId}")
  .onDelete((snap, context) => {
    // Get an object representing the document prior to deletion
    // e.g. {'name': 'Marie', 'age': 66}
    const user = snap.data()
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current
    return db
      .doc(`years/${seasonString}`)
      .get()
      .then((doc) => {
        let students = doc.data().students
        delete students[user.id]
        return db.doc(`years/${seasonString}`).update({ students: students })
      })
      .catch((err) => {
        console.log(err)
      })
  })

/* exports.onCreateUser = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data()

    // access a particular field as you would any JS property
    const penis = newValue.penis

    console.log(penis)

    return db.doc("essai/essai").set({ penis: "petit" })

    // perform desired operations ...
  }) */
