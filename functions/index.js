let dayjs = require("dayjs")
const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()
const axios = require("axios").default
//const storage = require("@google-cloud/storage")()

//##########################################################################
//                            UTILITY FUNCTIONS
//##########################################################################

/* const addIdToCurrentUserClaims = async (studentId) => {
  const uid = context.auth.uid
  return admin.auth().setCustomUserClaims(uid, { [studentId]: true })
} */

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

const getNewTokens = async (id, password) => {
  const response = await axios({
    url: "https://api.helloasso.com/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // This will urlencode the data correctly:
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: password,
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

const getItemsFromHelloAsso = async (id, password, slug) => {
  let url
  if (slug) {
    url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/items?pageSize=100`
  } else {
    url =
      "https://api.helloasso.com/v5/organizations/caf-de-faverges/items?pageSize=100"
  }

  const tokens = await getNewTokens(id, password)
  const response = await axios({
    url,
    method: "get",
    headers: {
      authorization: `Bearer ${tokens.access_token}`,
    },
  })
  let items = response.data.data
  return items
}

const getUsersFromItems = (items) => {
  //const response = await getItemsFromHelloAsso(id, password, slug)
  //const items = response.data
  //console.log(items)
  /*  return db.collection("admin").doc("test").set({
    test: items,
  }) */

  const users = items.map((item) => {
    let firstName = normalize(item.user.firstName)
    let lastName = normalize(item.user.lastName)
    return `${firstName}_${lastName}`
  })
  return users
}

const isUserInHelloAsso = (firstName, lastName, users) => {
  try {
    if (!firstName) throw "No first name"
    if (!lastName) throw "No last name"
    const normalized = `${normalize(firstName)}_${normalize(lastName)}`
    //const users = await getUsersFromHelloAsso(id, password, slug)
    return users.includes(normalized)
  } catch (error) {
    throw error
  }
}

//##########################################################################
//                                CALLABLE FUNCTIONS
//##########################################################################

//Get items from hello asso API
exports.checkPayment = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD
    const response = await getItemsFromHelloAsso(
      HELLOASSO_ID,
      HELLOASSO_PASSWORD,
      data.slug
    )
    const users = getUsersFromItems(response)
    const result = isUserInHelloAsso(data.firstName, data.lastName, users)
    let status
    result ? (status = "yes") : (status = "no")
    return db
      .collection("students")
      .doc(data.id)
      .update({
        [`seasons.${data.seasonName}.payment`]: status,
      })
      .then(() => {
        return status
      })
  })

exports.getPayments = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .https.onCall(async (data, context) => {
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD
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

//test
exports.test1 = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .firestore.document("admin/admin")
  .onWrite(async (change, context) => {
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD
    console.log("Test 1111111")

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
    console.log(response)
  })

//test2
exports.test2 = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .firestore.document("admin/admin2")
  .onWrite(async (change, context) => {
    console.log("Test 22222222")
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD

    const tokens = await getTokensFromFirestore()

    axios({
      url: "https://api.helloasso.com/v5/organizations/caf-de-faverges/payments",
      method: "get",
      headers: {
        authorization: `Bearer ${tokens.access_token}`,
      },
    })
      .then((response) => {
        //console.log(response.data)
      })
      .catch((error) => {
        //console.log(error.response.data.message)
        updateFirestoreTokens(HELLOASSO_ID).then(() => {
          getTokensFromFirestore().then((newTokens) => {
            axios({
              url: "https://api.helloasso.com/v5/organizations/caf-de-faverges/payments",
              method: "get",
              headers: {
                authorization: `Bearer ${newTokens.access_token}`,
              },
            }).then((response) => {
              //console.log(response)
              return response.data
            })
          })
        })
      })
  })

//test4
exports.test4 = functions
  .runWith({ secrets: ["HELLOASSO_ID", "HELLOASSO_PASSWORD"] })
  .firestore.document("admin/admin4")
  .onWrite(async (change, context) => {
    console.log("Test 44444444")
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD

    const x = await initFirestoreToken(HELLOASSO_ID, HELLOASSO_PASSWORD)
    //const oldTokens = await getTokensFromFirestore()
    //console.log(oldTokens)
    //const timeLeft = oldTokens.expiration - dayjs().valueOf()
    //console.log(`Il reste ${timeLeft} secondes pour utiliser ce token`)
    //const newTokens = await refreshToken(HELLOASSO_ID, oldTokens.refresh_token)
    //console.log(newTokens)
    //const test = await updateFirestoreTokens(HELLOASSO_ID)
  })

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
