var dayjs = require("dayjs")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

//##########################################################################
//                            UTILITY FUNCTIONS
//##########################################################################

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
  if (!data) return []
  if (data.email) emails.push(data.email)
  if (data.parents && data.parents.length) {
    //if parents
    for (const parent of data.parents) {
      if (parent.email) emails.push(parent.email)
    }
  }
  return emails
}

const removeStudentIdFromParents = (studentId) => {
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

//##########################################################################
//                                CALLABLE FUNCTIONS
//##########################################################################

exports.findStudentsWithMyEmailAndAddTheirIdsToMyUserDoc =
  functions.https.onCall((data, context) => {
    const myEmail = context.auth.token.email || null
    const uid = context.auth.uid
    if (!email) return { errorInfo: "Aucune adresse email trouvée." }
    const privateCollectionsRef = db
      .collectionGroup("privateCol")
      .where("emails", "array-contains", myEmail)

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

//Add admin role
exports.addAdminRole = functions.https.onCall((data, context) => {
  let targetId
  // check user is not null
  if (!context.auth) {
    return { errorInfo: "Vous devez être connecté pour faire ca" }
  }
  // check request is made by an admin
  if (
    context.auth.token.admin !== true &&
    context.auth.token.email != "friarobaz@gmail.com"
  ) {
    return { errorInfo: "If faut être admin pour ajouter un admin" }
  }

  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      targetId = user.uid
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      })
    })
    .then(() => {
      return db.collection("users").doc(targetId).update({
        admin: true,
      })
    })
    .then(() => {
      return {
        message: `${data.email} est maintenant administrateur`,
      }
    })
    .catch((err) => {
      return err
    })
})

//Remove admin role
exports.removeAdminRole = functions.https.onCall((data, context) => {
  let targetId
  // check user is not null
  if (!context.auth) {
    return { errorInfo: "Vous devez être connecté pour faire ca" }
  }
  // check request is made by an admin
  if (context.auth.token.admin !== true) {
    return { errorInfo: "If faut être admin pour supprimer un admin" }
  }
  if (data.email === "friarobaz@gmail.com") {
    return { errorInfo: "Vous ne pouvez pas supprimer Jules :)" }
  }
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      targetId = user.uid
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: false,
      })
    })
    .then(() => {
      return db.collection("users").doc(targetId).update({
        admin: false,
      })
    })
    .then(() => {
      return {
        message: `${data.email} n'est  plus administrateur`,
      }
    })
    .catch((err) => {
      return err
    })
})

//##########################################################################
//                                TRIGGER FUNCTIONS
//##########################################################################

//****************************
//AUTH TRIGGERS

//When a new Auth user is created, create it in Firestore
exports.newAuthUser = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    id: user.uid,
  })
})

//When an Auth user is deleted, delete it from Firestore
exports.delAuthUser = functions.auth.user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete()
})

//****************************
//FIRESTORE TRIGGERS

//When student's private doc is created, updated, or deleted, update Emails array
exports.updateEmails = functions.firestore
  .document("students/{studentId}/privateCol/{privateDoc}")
  .onWrite(async (change, context) => {
    const privateDataBefore = change.before.data()
    const privateDataAfter = change.after.data()
    if (!privateDataAfter) return //if deleted do nothing
    const emailsBefore = getEmails(privateDataBefore)
    const emailsAfter = getEmails(privateDataAfter)
    //if no changes to emails, do nothing
    if (emailsBefore === emailsAfter) return
    const studentId = context.params.studentId
    return db
      .doc(`students/${studentId}/privateCol/privateDoc`)
      .update({ emails: emails })
  })

//When a student is deleted from Firestore, remove it's ID from parent users
exports.onDeleteStudentUpdateParentIds = functions.firestore
  .document("students/{studentId}")
  .onDelete((snap, context) => {
    const studentId = snap.id
    return removeStudentIdFromParents(studentId)
  })

/* //When a student is created in Firestore, update season document
exports.onCreateStudentUpdateSeasonDoc = functions.firestore
  .document("students/{studentId}")
  .onCreate((snap, context) => {
    const student = snap.data()
    const id = snap.id
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`seasons/${seasonString}`)
      .update({ [`students.${id}`]: student })
  })

//When a student is updated in Firestore, update season document
exports.onUpdateStudentUpdateSeasonDoc = functions.firestore
  .document("students/{userId}")
  .onUpdate((change, context) => {
    const user = change.after.data()
    const id = change.after.id
    const month = parseInt(dayjs().format("M"))
    const seasonString = month === 8 ? season().next : season().current

    return db
      .doc(`seasons/${seasonString}`)
      .update({ [`students.${id}`]: user })
  })

//When a student is deleted from Firestore, update season doc
// WARNING: CAN POTENTIALLY CAUSE ISSUES IF USED A LOT AT THE SAME TIME
exports.onDeleteStudentUpdateSeasonDoc = functions.firestore
  .document("students/{userId}")
  .onDelete((snap, context) => {
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

//##########################################################################
//                                TEST FUNCTIONS
//##########################################################################

/* exports.randomNumber = functions.https.onRequest((request, response) => {
  const truc = `
  This season: ${season().current},
  next season: ${season().next},
  last season: ${season().last}`
  response.send(truc)
}) */

/* exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `Hello  ${name}`
}) */
