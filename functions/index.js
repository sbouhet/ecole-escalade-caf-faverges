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
const getItems = require("./lib/helloAsso/getItems")
const getOrders = require("./lib/helloAsso/getOrders")
const getPayments = require("./lib/helloAsso/getPayments")
const getFormattedSoapUser = require("./lib/soap/getFormattedSoapUser")
const checkConformity = require("./lib/soap/checkConformity")
const basics = require("./lib/firebase/firestore/basics")
const changeCustomClaims = require("./lib/firebase/auth/changeCustomClaims")
const sendNewCertificateEmail = require("./lib/sendinblue/sendNewCertificateEmail")
const resubscribeStudent = require("./lib/firebase/firestore/resubscribeStudent")
const getPaymentLink = require("./lib/helloAsso/getPaymentLink")
const sendEmail = require("./lib/sendinblue/sendEmail")

//##############################################################################################
//                                CALLABLE FUNCTIONS
//##############################################################################################

//Check CAF Database to see if licenceNb is correct
exports.checkLicence = functions
  .runWith({ secrets: ["SOAP_ID", "SOAP_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      if (!data.licenceNb) throw "Pas de numéro de licence"
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

//Get payment link
exports.getPaymentLinkFromHelloAsso = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      if (!data.firstName) throw "No firstName"
      if (!data.lastName) throw "No lastName"
      if (!data.email) throw "No email"
      if (!data.id) throw "No id"
      if (!data.totalAmount) throw "No totalAmount"
      if (!data.seasonName) throw "No seasonName"

      //Get new API tokens (access_token and refresh_token)
      const tokens = await getNewTokens()

      const result = await getPaymentLink(
        tokens.access_token,
        data.totalAmount, // total amount to be paid
        data.id,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
        data.seasonName,
        data.payInThree
      )
      console.log(result)

      return {
        statusCode: 200,
        message: "Link created successfully",
        id: result.id,
        link: result.redirectUrl,
        data: data
      }
    } catch (error) {
      return {
        statusCode: 409,
        message: error,
        body: "Could not get payment link",
      }
    }
  })

//Get items from HelloAsso
exports.getItemsFromHelloAsso = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    try {
      
      //Get new API tokens (access_token and refresh_token)
      const tokens = await getNewTokens()

      const result = await getItems(tokens.access_token, data.search)
      console.log(result)

      return {
        statusCode: 200,
        message: "Items retrieved",
        body: result
      }
    } catch (error) {
      return {
        statusCode: 409,
        message: error,
        body: `Could not get items`,
      }
    }
  })

//Get orders from HelloAsso
exports.getOrdersFromHelloAsso = functions
.runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
.https.onCall(async (data, context) => {
  try {
    

    //Get new API tokens (access_token and refresh_token)
    const tokens = await getNewTokens()

    const result = await getOrders(tokens.access_token, data.search)
    console.log(result)

    return {
      statusCode: 200,
      message: "Orders retrieved",
      body: result
    }
  } catch (error) {
    return {
      statusCode: 409,
      message: error,
      body: `Could not get orders`,
    }
  }
})

//Get payments from HelloAsso
exports.getPaymentsFromHelloAsso = functions
.runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
.https.onCall(async (data, context) => {
  try {

    //Get new API tokens (access_token and refresh_token)
    const tokens = await getNewTokens()

    const result = await getPayments(tokens.access_token, data.search)
    console.log(result)

    return {
      statusCode: 200,
      message: "Payments retrieved",
      body: result
    }
  } catch (error) {
    return {
      statusCode: 409,
      message: error,
      body: `Could not get Payments`,
    }
  }
})

//Change payment status to waiting
exports.changePaymentStatusToWaiting = functions.https.onCall(
  async (data, context) => {
    try {
      if (!data.seasonName) throw "No seasonName"
      if (!data.studentId) throw "No studentId"

      const studentRef = await basics._getDoc("students", data.studentId)
      const currentState = studentRef.data().seasons[data.seasonName].payment

      //If current payment state is "yes" or "waiting", do nothing
      if(currentState != "no") throw `Current state is ${currentState}`
      
      //Update public doc with status
      await basics._updateDoc(
        { 
          [`seasons.${data.seasonName}.payment`]:  "waiting"
        },
        "students",
        data.studentId
      )

      return {
        statusCode: 200,
        message: "Payment status updated",
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 409,
        message: error,
        body: "Could not update payment status",
      }
    }
  }
)

//Set payment type
exports.setPaymentType = functions.https.onCall(
  async (data, context) => {
    try {
      if (!data.seasonName) throw "No seasonName"
      if (!data.studentId) throw "No studentId"
      if (!data.paymentType) throw "No paymentType"

      console.log(data)

      //Update public doc with payment type
      await basics._updateDoc(
        { [`seasons.${data.seasonName}.paymentType`]: data.paymentType },
        "students",
        data.studentId
      )

      return {
        statusCode: 200,
        message: "Payment type updated",
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 409,
        message: error,
        body: "Could not update payment type",
      }
    }
  }
)

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
      if (!data.name) throw "No name"

      //Send email to admins
      await sendNewCertificateEmail(data.id, data.seasonName, data.name)

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

  //Send email
exports.sendEmailToPeople = functions
.runWith({ secrets: ["SENDINBLUE_API_KEY_SECRET"] })
.https.onCall(async (data, context) => {
  try {
    // check user is not null
    if (!context.auth) throw "Vous devez être connecté pour faire ca"

    // check request is made by a mod
    if (
      context.auth.token.mod !== true 
    ) {
      throw "If faut être admin pour faire ca"
    }

    if (!data.subject) throw "No subject"
    if (!data.htmlContent) throw "No htmlContent"
    if (!data.emails) throw "No emails"

    //populate email field
    let targetEmails = []
    for (const email of data.emails) {
      targetEmails.push({ email: email })
    }
   
    //Send email to admins
    const result = await sendEmail(targetEmails, data.subject, data.htmlContent)

    return {
      statusCode: 200,
      message: "Succès !",
      body: result
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 409,
      message: error,
      body: `Could not send email ${data.subject}`,
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


//When a student's private info is deleted from Firestore,  delete medical certificate
exports.onDeleteStudentFromFirestore = functions.firestore
  .document("students/{studentId}/privateCol/privateDoc")
  .onDelete(async (snap, context) => {
    //const studentId = snap.id
    const fileName = snap.data().medicalCertificateName
    //TODO
    try {
      const bucket = admin.storage().bucket()
      const path = `medicalCertificates/${season().current}/${fileName}`
      return bucket.file(path).delete()
    } catch (error) {
      console.log(error)
    }
  })

//##########################################################################
//                                CALLBACKS
//##########################################################################

//HelloAsso callback
exports.helloAssoCallback = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*")
    
    //Log
    await basics._setDoc({body:request.body}, "helloAssoLogs", dayjs().unix().toString())

    let studentId = request.body.metadata.studentId
    let seasonName = request.body.metadata.seasonName

    if(!studentId || !seasonName) throw "No StudentId or seasonName"

    //Check current state
    const studentRef = await basics._getDoc("students", studentId)
    const currentState = studentRef.data().seasons[seasonName].payment

    //If current payment state is "yes", do nothing
    if(currentState === "yes") throw `Current state is yes, abort`
    
    if(request.body.eventType == "Payment"){
      const state= request.body.data.state
      
      //If payment is authorized, update firestore
      if(state==="Authorized"){
        //Update student doc with status payment > yes
        await basics._updateDoc(
          {
            [`seasons.${seasonName}.payment`]: "yes",
            [`seasons.${seasonName}.paymentType`]: "CB",
          },
          "students",
          studentId
          )
        }
      }
    }
)

















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

  //Find students with my email
//(needs to be a cloud functions because users can't read private docs)
/* exports.getMyIds = functions.https.onCall(async (data, context) => {
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
}) */

//Resubscribe student
/* exports.resubscribe = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) throw "Il faut être inscrit pour faire ca"

    await resubscribeStudent(
      data.id,
      data.oldSeasonName,
      data.newSeasonName,
      data.dayUrl
    )

    return {
      statusCode: 200,
      message: `Student resubscibed successfully`,
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 409,
      message: error,
      body: "Could not resubscribe student",
    }
  }
}) */