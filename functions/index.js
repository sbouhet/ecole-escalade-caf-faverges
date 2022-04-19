let dayjs = require("dayjs")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
const axios = require("axios").default
const soap = require("soap")
const BError = require("berror")
//##########################################################################
//                            UTILITY FUNCTIONS
//##########################################################################

/* const addIdToCurrentUserClaims = async (studentId) => {
  const uid = context.auth.uid
  return admin.auth().setCustomUserClaims(uid, { [studentId]: true })
} */

const getClient = async () => {
  var url = "https://extranet-clubalpin.com/app/soap/extranet_pro.wsdl"
  return new Promise((resolve, reject) => {
    soap.createClient(url, (err, client) => {
      if (err) {
        return reject(err)
      }
      resolve(client)
    })
  })
}

const getAuth = async (client) => {
  const SOAP_ID = process.env.SOAP_ID
  const SOAP_PASSWORD = process.env.SOAP_PASSWORD
  return new Promise((resolve, reject) => {
    client.auth(null, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve({
        ...result,
        utilisateur: SOAP_ID,
        motdepasse: SOAP_PASSWORD,
      })
    })
  })
}

const getUsers = async (client, auth, clubId = 7421) => {
  return new Promise((resolve, reject) => {
    client.extractionAdherents(
      { connect: auth, idclub: clubId },
      (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.extractionAdherentsReturn.collection.item)
      }
    )
  })
}

const getSoapUser = async (client, auth, id) => {
  return new Promise((resolve, reject) => {
    client.verifierUnAdherent({ connect: auth, id: id }, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

const normalize = (string) => {
  try {
    if (!string) throw "No string"
    return string
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase()
  } catch (error) {
    throw error
  }
}

const getNewTokens = async () => {
  const HELLOASSO_ID = process.env.HELLOASSO_ID
  const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD
  const response = await axios({
    url: "https://api.helloasso.com/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // This will urlencode the data correctly:
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: HELLOASSO_ID,
      client_secret: HELLOASSO_PASSWORD,
    }),
  })
  return response.data
}

const refreshToken = async (id, refresh_token) => {
  console.log("REFRESHING TOKENS")
  console.log(id)
  console.log(refresh_token)
  const response = await axios({
    url: "https://api.helloasso.com/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // This will urlencode the data correctly:
    data: new URLSearchParams({
      client_id: id,
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
  })
  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    duration: response.data.expires_in,
  }
}

const initFirestoreToken = async (id, password) => {
  const tokens = await getNewTokens(id, password)
  return db
    .collection("admin")
    .doc("helloAssoTokens")
    .set({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      timestamp: dayjs().valueOf(),
      duration: tokens.expires_in,
      expiration: dayjs().add(tokens.expires_in, "seconds").valueOf(),
    })
}

const updateFirestoreTokens = async (id) => {
  const oldTokens = await getTokensFromFirestore()
  const newTokens = await refreshToken(id, oldTokens.refresh_token)
  return db
    .collection("admin")
    .doc("helloAssoTokens")
    .update({
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      timestamp: dayjs().valueOf(),
      duration: newTokens.duration,
      expiration: dayjs().add(newTokens.duration, "seconds").valueOf(),
    })
}

const getTokensFromFirestore = async () => {
  var docRef = db.collection("admin").doc("helloAssoTokens")
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return {
          access_token: doc.data().access_token,
          refresh_token: doc.data().refresh_token,
          expiration: doc.data().expiration,
        }
      } else {
        console.log("No such document!")
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error)
    })
}

const deleteMedicalCertificate = async (studentId) => {
  const bucket = admin.storage().bucket()
  const path = `medicalCertificates/${season().current}/${studentId}`
  return bucket.file(path).delete()
}

const getAdminEmails = async () => {
  console.log("Trying to get admin emails")
  var docRef = db.collection("admin").doc("admin")
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const adminEmails = doc.data().adminEmails
        let formatted = []
        for (const adminEmail of adminEmails) {
          formatted.push({ email: adminEmail })
        }
        console.log(formatted)
        return formatted
      } else {
        console.log("No such document!")
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error)
    })
}

const getTimeLimit = async () => {
  console.log("Trying to get time limit from firestore")
  var docRef = db.collection("admin").doc("admin")
  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const timeLimit = doc.data().timeLimitForLicence
        return timeLimit
      } else {
        console.log("No such document!")
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error)
    })
}

const sendEmail = async (emails, subject, htmlContent, API_KEY) => {
  await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: { name: "Jules", email: "friarobaz@gmail.com" },
      to: emails,
      subject,
      htmlContent,
    },
    {
      headers: {
        "api-key": API_KEY,
      },
    }
  )
  return true
}

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

const getItemsFromHelloAsso = async (slug, token) => {
  let url
  if (slug) {
    url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/items?pageSize=100`
  } else {
    url =
      "https://api.helloasso.com/v5/organizations/caf-de-faverges/items?pageSize=100"
  }
  const response = await axios({
    url,
    method: "get",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  let items = response.data.data
  return items
}

const getReceipts = async (token, userPayments, slug) => {
  let url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/payments?pageSize=100`

  const response = await axios({
    url,
    method: "get",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const allPayments = response.data.data
  const ids = userPayments.map((x) => x.id)
  const filtered = allPayments.filter((x) => ids.includes(x.id))
  const receipts = filtered.map((x) => x.paymentReceiptUrl)
  return receipts
}

const filterItems = (items, firstName, lastName) => {
  if (!items) throw "No items"
  if (!firstName) throw "No firstName"
  if (!lastName) throw "No lastName"
  firstName = normalize(firstName)
  lastName = normalize(lastName)

  const filtered = items.filter(
    (item) =>
      normalize(item.user.firstName) === firstName &&
      normalize(item.user.lastName) === lastName
  )
  return filtered
}

const formatSoapUser = (soapUser) => {
  console.log(soapUser)
  const usr = soapUser.verifierUnAdherentReturn
  console.log(usr)
  return {
    exists: usr.existe.$value === 1,
    signupDate: usr.inscription.$value,
    lastName: usr.nom.$value,
    firstName: usr.prenom.$value,
  }
}

const getFormattedSoapUser = async (userId) => {
  try {
    const client = await getClient()
    const auth = await getAuth(client)
    const user = await getSoapUser(client, auth, userId)
    const formatted = formatSoapUser(user)
    return formatted
  } catch (error) {
    throw "Utilisateur non trouvé sur la base de donnée du CAF"
  }
}

const getStudentFromFirestore = async (studentId) => {
  try {
    const doc = await db.doc(`students/${studentId}`).get()
    const student = doc.data()
    return student
  } catch (error) {
    throw "Utilisateur non trouvé dans Firestore"
  }
}

const checkConformity = async (soapUser, student) => {
  if (normalize(soapUser.firstName) !== normalize(student.firstName))
    throw "Les prénoms sont différents."
  if (normalize(soapUser.lastName) !== normalize(student.lastName))
    throw "Les noms sont différents."
  const dateDifference = dayjs().diff(soapUser.signupDate, "day")
  const timeLimit = await getTimeLimit()
  if (dateDifference > timeLimit)
    throw `Cette licence a été prise il y a plus de ${timeLimit} jours.`
  return { dateDifference, timeLimit }
}

const linkStudentWithLicence = async (studentId, licenceNb, seasonName) => {
  try {
    const x = await db
      .collection("students")
      .doc(studentId)
      .update({
        [`seasons.${seasonName}.licence`]: "yes",
        [`seasons.${seasonName}.licenceNb`]: licenceNb,
      })
  } catch (error) {
    throw "Impossible de mettre à jour l'utilisateur"
  }
}

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
