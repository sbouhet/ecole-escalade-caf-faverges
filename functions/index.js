const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
/* exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = "lol"
  response.send(number)
})

exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `Hello lolilol ${name}`
}) */

exports.newUserSignup = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    id: user.uid,
  })
})

exports.userDeleted = functions.auth.user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete()
})

exports.updateUserList = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const user = snap.data()

    return db
      .doc("admin/2022-2023")
      .update({ [`PUPILS.${user.id}`]: { id: user.id, email: user.email } })
  })

exports.deleteUser = functions.firestore
  .document("users/{userId}")
  .onDelete((snap, context) => {
    // Get an object representing the document prior to deletion
    // e.g. {'name': 'Marie', 'age': 66}
    const user = snap.data()
    return db
      .doc("admin/2022-2023")
      .get()
      .then((doc) => {
        let PUPILS = doc.data().PUPILS
        delete PUPILS[user.id]
        return db.doc("admin/2022-2023").update({ PUPILS: PUPILS })
      })
      .catch((err) => {
        console.log(err)
      })
    //return db.doc("admin/2022-2023").update({ [`PUPILS.${user.id}`]: null })

    // perform desired operations ...
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
