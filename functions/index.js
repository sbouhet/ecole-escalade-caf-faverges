let dayjs = require("dayjs")
require("dayjs/locale/fr")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
const axios = require("axios").default
const BError = require("berror")
const getNewTokens = require("./lib/helloAsso/getNewTokens")
const deleteMedicalCertificate = require("./lib/firebase/storage/deleteMedicalCertificate")
const getStudentFromFirestore = require("./lib/firebase/firestore/getStudentFromFirestore")
const getEmails = require("./lib/firebase/firestore/getEmails")
const getItemsFromHelloAsso = require("./lib/helloAsso/getItems")
const getReceipts = require("./lib/helloAsso/getReceipts")
const filterItems = require("./lib/helloAsso/filterItems")
const getFormattedSoapUser = require("./lib/soap/getFormattedSoapUser")
const checkConformity = require("./lib/soap/checkConformity")
const linkStudentWithLicence = require("./lib/firebase/firestore/linkStudentWithLicence")
const basics = require("./lib/firebase/firestore/basics")
const changeCustomClaims = require("./lib/firebase/auth/changeCustomClaims")
const createNewStudent = require("./lib/firebase/firestore/createNewStudent")
const deleteAllCustomClaims = require("./lib/firebase/auth/deleteAllCustomClaims")
const getStudentsByEmail = require("./lib/firebase/firestore/getStudentsByEmail")
const season = require("./lib/season")
const sendNewCertificateEmail = require("./lib/sendinblue/sendNewCertificateEmail")

/* const addIdToCurrentUserClaims = async (studentId) => {
  const uid = context.auth.uid
  return admin.auth().setCustomUserClaims(uid, { [studentId]: true })
} */
//test
exports.test = functions.firestore
  .document("test/{test}")
  .onWrite(async (change, context) => {
    console.log("TEST STARTING")
    /*  await admin.auth().setCustomUserClaims("4axktEVXriP8jnDal9KqABJSSp52", null)
    await admin.auth().setCustomUserClaims("XvjCydDEbtfhB0nAPrnhiVhTHBC3", null) */
  })

//##############################################################################################
//##############################################################################################
//##############################################################################################
//                                CALLABLE FUNCTIONS
//##############################################################################################
//##############################################################################################
//##############################################################################################

/* exports.newMedicalCertificate = functions.https.onCall(
  async (data, context) => {
    try {
      const link = uploadMedicalCertificate(
        data.file,
        data.seasonName,
        data.studentId,
        data.emails
      )
      console.log(link)
      return {
        statusCode: 200,
        message: `Succès !  élèves trouvés`,
        body: { link },
      }
    } catch (error) {
      return {
        statusCode: 409,
        message: error,
        body: null,
      }
    }
  }
) */

exports.getMyStudents = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw "Il faut être inscrit pour faire ca"

    const myStudents = await getStudentsByEmail(context.auth.token.email)
    console.log("MYSTUDENTS : ", myStudents)
    return {
      statusCode: 200,
      message: `Succès !  élèves trouvés`,
      body: { myStudents },
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 409,
      message: error,
      body: null,
    }
  }
})

exports.deleteClaims = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth.token.admin) throw "C'est pas la fête"
    const response = deleteAllCustomClaims(data.userId)
    return {
      statusCode: 200,
      message: "Succès !",
      body: response,
    }
  } catch (error) {
    return {
      statusCode: 409,
      message: error,
      body: null,
    }
  }
})

exports.createStudent = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw "Vous devez être connecté pour faire ca"
    if (!data.student) throw "Pas d'élève à créer (data.student)"

    //Get ID from user that is making the call
    const parentId = context.auth.uid

    //Create new student etc
    const response = await createNewStudent(data.student, parentId)

    return {
      statusCode: 200,
      message: "Succès !",
      body: response,
    }
  } catch (error) {
    return {
      statusCode: 409,
      message: error,
      body: null,
    }
  }
})

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

    //Update public doc
    const response = basics._updateDoc(
      {
        [`seasons.${data.seasonName}.payment`]: status,
      },
      "students",
      data.id
    )
    console.log(response)

    //Update private doc
    const response2 = await basics._updateDoc(
      { receipts, helloAssoId },
      "students",
      data.id,
      "privateCol",
      "privateDoc"
    )
    console.log(response2)

    if (status !== "yes")
      return { statusCode: 409, message: "Une erreur est survenue", body: null }

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

//change mod / admin status
exports.changeModStatus = functions.https.onCall(async (data, context) => {
  console.log(data)
  try {
    // check user is not null
    if (!context.auth) throw "Vous devez être connecté pour faire ca"

    // check request is made by an admin
    if (
      context.auth.token.admin !== true &&
      context.auth.token.email != "friarobaz@gmail.com"
    ) {
      throw "If faut être admin pour faire ca"
    }
    // check if all parameters are present
    if (!data.email) throw "Pas d'email"
    if (!data.field) throw "Pas de champ (mod ou admin)"
    if (data.value == null) throw "Pas de valeur (true ou false)"

    //get auth user from email data
    const user = await admin.auth().getUserByEmail(data.email)

    //change custom claims on auth user
    const response = await changeCustomClaims(user, data.field, data.value)
    console.log(response)

    //change role in firestore
    const response2 = await basics._updateDoc(
      { [data.field]: data.value },
      "users",
      user.uid
    )
    console.log(response2)

    return {
      statusCode: 200,
      message: "Succès !",
      body: { user, response, response2 },
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 409,
      message: error,
      body: null,
    }
  }
})

//####################################################################################################
//####################################################################################################
//####################################################################################################
//                                TRIGGER FUNCTIONS
//####################################################################################################
//####################################################################################################
//####################################################################################################

//****************************
//STORAGE TRIGGERS

//When a new medical certificate is uploaded
exports.onNewCertificate = functions
  .runWith({ secrets: ["SENDINBLUE_API_KEY_SECRET"] })
  .storage.object()
  .onFinalize(async (object) => {
    try {
      console.log(JSON.stringify(object))
      const nameArray = object.name.split("/")
      const id = nameArray[nameArray.length - 1]
      const seasonName = nameArray[nameArray.length - 2]

      const response = await basics._updateDoc(
        {
          [`seasons.${seasonName}.medicalCertificate`]: "waiting",
        },
        "students",
        id
      )
      console.log(response)

      const response2 = await sendNewCertificateEmail(id)
      console.log(response2)
      console.log("All done")
    } catch (error) {
      console.log(error)
    }
  })

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
/* exports.notifyAdmin = functions
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
  }) */

/* //When a student is deleted from Firestore, remove it's ID from parent users and delete medical certificate
exports.onDeleteStudentFromFirestore = functions.firestore
  .document("students/{studentId}")
  .onDelete((snap, context) => {
    const studentId = snap.id

    return removeStudentIdFromParents(studentId).then(() => {
      return deleteMedicalCertificate(studentId)
    })
  }) */

/* //When user is updated with new student ID, update Auth user claims
exports.updateUser = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    //Get student list before change
    const studentsBefore = change.before.data().students

    //Get student list after change
    const studentsAfter = change.after.data().students

    //Get user ID
    const userId = context.params.userId

    //If no changes to students, do nothing
    if (studentsBefore === studentsAfter) return

    //Get auth user from user ID
    const user = await admin.auth().getUser(userId)

    //Update custom claims with new list of students
    const response = await changeCustomClaims(user, "students", studentsAfter)
    console.log(response)
  }) */

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
