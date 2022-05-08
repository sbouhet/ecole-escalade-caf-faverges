const admin = require("firebase-admin")
const db = admin.firestore()

module.exports = async (email) => {
  try {
    if (!email) throw "Pas d'email"
    console.log(email)

    const privateCollectionsRef = db
      .collectionGroup("privateCol")
      .where("emails", "array-contains", email)

    const snapshot = await privateCollectionsRef.get()
    let ids = []
    snapshot.forEach(async (privateDoc) => {
      const id = privateDoc.ref._path.segments[1]
      ids.push(id) //student id
    })
    return ids
  } catch (error) {
    console.log(error)
    throw new Error(
      `Impossible de trouver les élèves avec cet email: ${email}`,
      error
    )
  }
}
