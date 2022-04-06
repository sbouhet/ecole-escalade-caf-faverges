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

const getEmails = (studentPrivateData) => {
  let emails = []
  let data = studentPrivateData
  if (!data) throw "no data"
  if (data.email) emails.push(data.email)
  if (data.parents && data.parents.length) {
    //if parents
    for (const parent of data.parents) {
      if (parent.email) emails.push(parent.email)
    }
  }
  return emails
}

/* exports.randomNumber = functions.https.onRequest((request, response) => {
  const truc = `
  This season: ${season().current},
  next season: ${season().next},
  last season: ${season().last}`
  response.send(truc)
}) */

exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `Hello  ${name}`
})

exports.test = functions.https.onCall((data, context) => {
  const email = context.auth.token.email || null
  const uid = context.auth.uid
  if (!email) return
  const privateCollectionsRef = db
    .collectionGroup("privateCol")
    .where("emails", "array-contains", email)

  return privateCollectionsRef
    .get()
    .then((querySnapshot) => {
      let childrenIds = []
      querySnapshot.forEach((privateDoc) => {
        childrenIds.push(privateDoc.ref._path.segments[1]) //student id
      })
      return childrenIds
    })
    .then((childrenIds) => {
      return db.collection("users").doc(uid).update({
        students: childrenIds,
      })
    })
})

exports.findChildren = functions.https.onCall((data, context) => {
  const parentEmail = data.email
  console.log(parentEmail)
  var childrenRef = db
    .collectionGroup("privateCol")
    .where("emails", "array-contains", parentEmail)

  childrenRef.get().then((querySnapshot) => {
    let children = []
    querySnapshot.forEach((doc) => {
      children.push(doc.id)
    })
    console.log(children)
    return children
  })
})

exports.newAuthUser = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    id: user.uid,
  })
})

exports.delAuthUser = functions.auth.user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete()
})

//When user is created, updated, or deleted, update Emails array
exports.updateEmails = functions.firestore
  .document("students/{studentId}/privateCol/{privateDoc}")
  .onWrite(async (change, context) => {
    const privateData = change.after.data()
    const emails = getEmails(privateData)
    const studentId = context.params.studentId
    if (!privateData) return //if deleted do nothing
    return db
      .doc(`students/${studentId}/privateCol/privateDoc`)
      .update({ emails: emails })
  })

/* exports.newFirestoreUser = functions.firestore
  .document("students/{userId}")
  .onCreate((snap, context) => {
    const user = snap.data()
    const id = snap.id
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`seasons/${seasonString}`)
      .update({ [`students.${id}`]: user })
  }) */

/* exports.updateFirestoreUser = functions.firestore
  .document("students/{userId}")
  .onUpdate((change, context) => {
    const user = change.after.data()
    const id = change.after.id
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`seasons/${seasonString}`)
      .update({ [`students.${id}`]: user })
  }) */

/* exports.delFirestoreUser = functions.firestore
  .document("students/{userId}")
  .onDelete((snap, context) => {
    // Get an object representing the document prior to deletion
    // e.g. {'name': 'Marie', 'age': 66}
    const user = snap.data()
    const id = snap.id
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current
    return db
      .doc(`seasons/${seasonString}`)
      .get()
      .then((doc) => {
        let students = doc.data().students
        delete students[id]
        return db.doc(`seasons/${seasonString}`).update({ students: students })
      })
      .catch((err) => {
        console.log(err)
      })
  }) */

/* exports.onCreateUser = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data()

    // access a particular field as you would any JS property
    const tetst = newValue.test

    console.log(test)

    return db.doc("essai/essai").set({ test: "petit" })

    // perform desired operations ...
  }) */
