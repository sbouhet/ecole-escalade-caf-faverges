let dayjs = require("dayjs")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
const axios = require("axios").default
//const soap = require("soap")
const BError = require("berror")
const getClient = require("./lib/soap/getClient")
const getAuth = require("./lib/soap/getAuth")
//const getSoapUser = require("./lib/soap/getSoapUser")
//const normalize = require("./lib/normalize")
const getNewTokens = require("./lib/helloAsso/getNewTokens")
//const refreshToken = require("./lib/helloAsso/refreshToken")
const deleteMedicalCertificate = require("./lib/firebase/storage/deleteMedicalCertificate")
const getStudentFromFirestore = require("./lib/firebase/firestore/getStudentFromFirestore")
const getAdminEmails = require("./lib/firebase/firestore/getAdminEmails")
//const getTimeLimit = require("./lib/firebase/firestore/getTimeLimit")
const getEmails = require("./lib/firebase/firestore/getEmails")
const removeStudentIdFromParents = require("./lib/firebase/firestore/removeStudentIdFromParents")
const sendEmail = require("./lib/sendinblue/sendEmail")
//const season = require("./lib/season")
const getItemsFromHelloAsso = require("./lib/helloAsso/getItems")
const getReceipts = require("./lib/helloAsso/getReceipts")
const filterItems = require("./lib/helloAsso/filterItems")
const getFormattedSoapUser = require("./lib/soap/getFormattedSoapUser")
const checkConformity = require("./lib/soap/checkConformity")
const linkStudentWithLicence = require("./lib/firebase/firestore/linkStudentWithLicence")

//##########################################################################
//                            UTILITY FUNCTIONS
//##########################################################################

/* const addIdToCurrentUserClaims = async (studentId) => {
  const uid = context.auth.uid
  return admin.auth().setCustomUserClaims(uid, { [studentId]: true })
} */
//test
exports.test = functions.firestore
  .document("test/{test}")
  .onWrite(async (change, context) => {
    console.log("TEST STARTING")
    test()
    const client = await getClient()
    console.log(getAuth(client))
  })

//##########################################################################
//                                CALLABLE FUNCTIONS
//##########################################################################

exports.checkLicence = functions
  .runWith({ secrets: ["SOAP_ID", "SOAP_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      const soapUser = await getFormattedSoapUser(data.licenceNb)
      const firestoreStudent = await getStudentFromFirestore(data.studentId)
      const { dateDifference, timeLimit } = await checkConformity(
        soapUser,
        firestoreStudent
      )
      const x = await linkStudentWithLicence(
        firestoreStudent.id,
        data.licenceNb,
        data.seasonName
      )
      return {
        statusCode: 200,
        message: "Succès !",
        body: { soapUser, dateDifference, timeLimit },
      }
    } catch (error) {
      return {
        statusCode: 409,
        message: error,
        body: null,
      }
    }
  })

exports.checkPayment = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    const tokens = await getNewTokens()
    const items = await getItemsFromHelloAsso(data.slug, tokens.access_token)
    const filtered = filterItems(items, data.firstName, data.lastName)
    let status
    let helloAssoId = null
    let payments = []

    if (filtered.length === 1) {
      status = "yes"
      helloAssoId = filtered[0].id
      payments = filtered[0].payments
    } else if (filtered.length > 1) {
      status = "waiting"
    } else {
      status = "no"
    }
    const receipts = await getReceipts(tokens.access_token, payments, data.slug)
    const x = await db
      .collection("students")
      .doc(data.id)
      .update({
        [`seasons.${data.seasonName}.payment`]: status,
        [`seasons.${data.seasonName}.helloAssoId`]: helloAssoId,
        //[`seasons.${data.seasonName}.payments`]: payments,
        [`seasons.${data.seasonName}.receipts`]: receipts,
      })
    if (status !== "yes") return { statusCode: 409 }

    return {
      statusCode: 200,
      message: "Succès !",
      body: { filtered, receipts },
    }
  })

exports.getPayments = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    const myEmail = context.auth.token.email || null
    const uid = context.auth.uid
    if (context.auth.token.admin !== true) {
      return { errorInfo: "If faut être admin pour voir les paiements" }
    }

    const tokens = await getTokensFromFirestore()
    const access_token = tokens.access_token
    const refresh_token = tokens.refresh_token

    const response = await axios({
      url: "https://api.helloasso.com/v5/organizations/caf-de-faverges/payments",
      method: "get",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    })
    console.log(`Response code : ${response.code}`)
    return response.data
  })

exports.findStudentsWithMyEmailAndAddTheirIdsToMyUserDoc =
  functions.https.onCall((data, context) => {
    const myEmail = context.auth.token.email || null
    const uid = context.auth.uid
    if (!myEmail) return { errorInfo: "Aucune adresse email trouvée." }
    let nbOfChildren = 0
    const privateCollectionsRef = db
      .collectionGroup("privateCol")
      .where("emails", "array-contains", myEmail)

    return privateCollectionsRef
      .get()
      .then((querySnapshot) => {
        let childrenIds = []
        querySnapshot.forEach((privateDoc) => {
          nbOfChildren++
          childrenIds.push(privateDoc.ref._path.segments[1]) //student id
        })
        return childrenIds
      })
      .then((childrenIds) => {
        return db.collection("users").doc(uid).update({
          students: childrenIds,
        })
      })
      .then(() => {
        return {
          message: `Found ${nbOfChildren} students with email ${myEmail}`,
        }
      })
      .catch(() => {
        return { errorInfo: `Error looking for students wit email ${myEmail}` }
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
      if (data.mod) {
        return admin.auth().setCustomUserClaims(user.uid, {
          mod: true,
        })
      }
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      })
    })
    .then(() => {
      if (data.mod) {
        return db.collection("users").doc(targetId).update({
          mod: true,
        })
      }
      return db.collection("users").doc(targetId).update({
        admin: true,
      })
    })
    .then(() => {
      return {
        message: `${data.email} est maintenant administrateur (ou mod)`,
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
      if (data.mod) {
        return admin.auth().setCustomUserClaims(user.uid, {
          mod: false,
        })
      }
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: false,
      })
    })
    .then(() => {
      if (data.mod) {
        return db.collection("users").doc(targetId).update({
          mod: false,
        })
      }
      return db.collection("users").doc(targetId).update({
        admin: false,
      })
    })
    .then(() => {
      return {
        message: `${data.email} n'est  plus administrateur (ou mod)`,
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
      .update({ emails: emailsAfter })
  })

//When student's private doc is updated, send email to admins if it's a new medical certificate
exports.notifyAdmin = functions
  .runWith({ secrets: ["SENDINBLUE_API_KEY_SECRET"] })
  .firestore.document("students/{studentId}/privateCol/{privateDoc}")
  .onUpdate(async (change, context) => {
    console.log("UPDATE DETECTED")
    const studentId = context.params.studentId
    const timestampBefore = change.before.data().medicalCertificateTimestamp
    const timestampAfter = change.after.data().medicalCertificateTimestamp
    if (timestampBefore === timestampAfter) return
    const SENDINBLUE_API_KEY_SECRET = process.env.SENDINBLUE_API_KEY_SECRET
    const htmlContent = `
    <a href="https://ee22.netlify.app/admin/modifyStudent?id=${studentId}" target="_new">
    Cliquez ici pour voir le certificat</a>`
    return getAdminEmails()
      .then((adminEmails) => {
        sendEmail(
          adminEmails,
          "Nouveau certificat !",
          htmlContent,
          SENDINBLUE_API_KEY_SECRET
        )
      })
      .then(() => {
        console.log("DONE ??")
      })
  })

//When a student is deleted from Firestore, remove it's ID from parent users and delete medical certificate
exports.onDeleteStudentFromFirestore = functions.firestore
  .document("students/{studentId}")
  .onDelete((snap, context) => {
    const studentId = snap.id

    return removeStudentIdFromParents(studentId).then(() => {
      return deleteMedicalCertificate(studentId)
    })
  })

//When user is updated with new student ID, update Auth user claims
exports.updateUser = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    const studentsBefore = change.before.data().students
    const studentsAfter = change.after.data().students
    const userId = context.params.userId
    const isAdmin = change.after.data().admin

    //if no changes to students, do nothing
    if (studentsBefore === studentsAfter) return

    return admin
      .auth()
      .setCustomUserClaims(userId, { admin: isAdmin, students: studentsAfter })
      .then(() => {})
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

/* exports.helloAssoCallback = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*")
    console.log(JSON.stringify(request.body))
    if (request.body.eventType !== "Order") return
    const items = request.body.data.items
    let docRef
    for (const item of items) {
      console.log(item)
      if (!item.id) return
      docRef = db.collection("orders").doc(item.id.toString())
      await docRef.set(item)
    }
    return
    //response.send({ body: request.body })
  }
) */
