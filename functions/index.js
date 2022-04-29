let dayjs = require("dayjs")
require("dayjs/locale/fr")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
const season = require("./lib/season")
const BError = require("berror")
const getNewTokens = require("./lib/helloAsso/getNewTokens")
const getEmails = require("./lib/firebase/firestore/getEmails")
const getItemsFromHelloAsso = require("./lib/helloAsso/getItems")
const getReceipts = require("./lib/helloAsso/getReceipts")
const filterItems = require("./lib/helloAsso/filterItems")
const getFormattedSoapUser = require("./lib/soap/getFormattedSoapUser")
const checkConformity = require("./lib/soap/checkConformity")
const basics = require("./lib/firebase/firestore/basics")
const changeCustomClaims = require("./lib/firebase/auth/changeCustomClaims")
const getStudentsByEmail = require("./lib/firebase/firestore/getStudentsByEmail")
const sendNewCertificateEmail = require("./lib/sendinblue/sendNewCertificateEmail")

//##############################################################################################
//                                CALLABLE FUNCTIONS
//##############################################################################################

//Find students with my email
//(needs to be a cloud functions because users can't read private docs)
exports.getMyIds = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw "Il faut être inscrit pour faire ca"

    const myIds = await getStudentsByEmail(context.auth.token.email)
    return {
      statusCode: 200,
      message: `Ids retrieved`,
      body: { myIds },
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 409,
      message: error,
      body: "Could not get my ids",
    }
  }
})

//Check CAF Database to see if licenceNb is correct
exports.checkLicence = functions
  .runWith({ secrets: ["SOAP_ID", "SOAP_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      if (!data.licenceNb) throw "No licenceNb"
      if (!data.studentId) throw "No studentId"
      if (!data.seasonName) throw "No seasonName"

      //Get soap user from licence number
      const soapUser = await getFormattedSoapUser(data.licenceNb)

      //Get student doc from Firestore
      const student = await basics._getDoc("students", data.studentId)

      //Make sure the names are the same and the signup date is ok
      await checkConformity(soapUser, student.data())

      //Update student doc with licence status and number
      await basics._updateDoc(
        {
          [`seasons.${data.seasonName}.licence`]: "yes",
          [`seasons.${data.seasonName}.licenceNb`]: data.licenceNb,
        },
        "students",
        data.studentId
      )
      return {
        statusCode: 200,
        message: "Licence checks out",
      }
    } catch (error) {
      return {
        statusCode: 409,
        message: error,
        body: "Error checking licence",
      }
    }
  })

//Check HelloAsso to see if payment has been made
exports.checkPayment = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      //slug example: "ecole-d-escalade-6-7-ans-2022-2023"
      if (!data.slug) throw "No slug"
      if (!data.firstName) throw "No firstName"
      if (!data.lastName) throw "No lastName"

      //Get new API tokens (access_token and refresh_token)
      const tokens = await getNewTokens()

      //Get all items for specified slug (a slug is an adress to a helloAsso form)
      const items = await getItemsFromHelloAsso(data.slug, tokens.access_token)

      //Try to find student name in list of items
      const filtered = filterItems(items, data.firstName, data.lastName)

      //If one item is found with specified name (everything went well)
      if (filtered.length === 1) {
        const helloAssoId = filtered[0].id
        const payments = filtered[0].payments

        //Get receipts
        const receipts = await getReceipts(
          tokens.access_token,
          payments,
          data.slug
        )

        //Update public doc with status > "yes"
        await basics._updateDoc(
          { [`seasons.${data.seasonName}.payment`]: "yes" },
          "students",
          data.id
        )

        //Update private doc with receipts and helloAssoId
        await basics._updateDoc(
          { receipts, helloAssoId },
          "students",
          data.id,
          "privateCol",
          "privateDoc"
        )

        //If more than one items have the specified name
      } else if (filtered.length > 1) {
        throw "Plus d'un paiment trouvé avec ce nom, contactez un administrateur"

        //If no payment found
      } else {
        throw "Aucun paiment trouvé avec ce nom"
      }
      return {
        statusCode: 200,
        message: "Payment checked successfully",
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 409,
        message: error,
        body: "Could not check payment",
      }
    }
  })

//change mod / admin status
exports.changeModStatus = functions.https.onCall(async (data, context) => {
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
      const bucket = admin.storage().bucket()
      const path = `medicalCertificates/${season().current}/${studentId}`
      return bucket.file(path).delete()
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

/* exports.deleteClaims = functions.https.onCall(async (data, context) => {
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
}) */

/* //test
exports.test = functions.firestore
  .document("test/{test}")
  .onWrite(async (change, context) => {
    console.log("TEST STARTING")
   
  }) */
