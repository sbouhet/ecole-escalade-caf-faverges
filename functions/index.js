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
const deleteAllCustomClaims = require("./lib/firebase/auth/deleteAllCustomClaims")
const getStudentsByEmail = require("./lib/firebase/firestore/getStudentsByEmail")
const sendNewCertificateEmail = require("./lib/sendinblue/sendNewCertificateEmail")

//test
exports.test = functions.firestore
  .document("test/{test}")
  .onWrite(async (change, context) => {
    console.log("TEST STARTING")
    /*  await admin.auth().setCustomUserClaims("4axktEVXriP8jnDal9KqABJSSp52", null)
    await admin.auth().setCustomUserClaims("XvjCydDEbtfhB0nAPrnhiVhTHBC3", null) */
  })

//##############################################################################################
//                                CALLABLE FUNCTIONS
//##############################################################################################

exports.getMyIds = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw "Il faut être inscrit pour faire ca"

    const myIds = await getStudentsByEmail(context.auth.token.email)
    return {
      statusCode: 200,
      message: `Succès !  élèves trouvés`,
      body: { myIds },
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

exports.checkLicence = functions
  .runWith({ secrets: ["SOAP_ID", "SOAP_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      const soapUser = await getFormattedSoapUser(data.licenceNb)
      const firestoreStudent = await getStudentFromFirestore(data.studentId)
      const { dateDifference, timeLimit } = await checkConformity(
        soapUser,
        firestoreStudent.data()
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

//Medical certificate
exports.sendEmailAndChangeStatus = functions
  .runWith({ secrets: ["SENDINBLUE_API_KEY_SECRET"] })
  .https.onCall(async (data, context) => {
    try {
      console.log(data)
      if (!data.seasonName) throw "No seasonName"
      if (!data.id) throw "No id"

      //Send email to admins
      await sendNewCertificateEmail(data.id)

      //Update student status
      await basics._updateDoc(
        { [`seasons.${data.seasonName}.medicalCertificate`]: "waiting" },
        "students",
        data.id
      )

      return {
        statusCode: 200,
        message: "Succès !",
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 409,
        message: error,
        body: "Could not send email and update student doc",
      }
    }
  })

//####################################################################################################
//                                TRIGGER FUNCTIONS
//####################################################################################################

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

//When a student is deleted from Firestore,  delete medical certificate
exports.onDeleteStudentFromFirestore = functions.firestore
  .document("students/{studentId}")
  .onDelete(async (snap, context) => {
    const studentId = snap.id
    try {
      await deleteMedicalCertificate(studentId)
    } catch (error) {
      console.log(error)
    }
  })

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
