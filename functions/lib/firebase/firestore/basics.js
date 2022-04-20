const admin = require("firebase-admin")
admin.initializeApp()
const db = admin.firestore()

exports._getDoc = async (collection, docId, subCollection, subDocId) => {
  let docRef = db.collection(collection).doc(docId)
  if (subDocId)
    docRef = db
      .collection(collection)
      .doc(docId)
      .collection(subCollection)
      .doc(subDocId)

  return docRef
    .get()
    .then((doc) => {
      if (!doc.exists) throw "No such document!"
      return doc.data
    })
    .catch((error) => {
      console.log("Error getting document:", error)
    })
}

exports._updateDoc = async (
  object,
  collection,
  docId,
  subCollection,
  subDocId
) => {
  try {
    let docRef = db.collection(collection).doc(docId)
    if (subDocId)
      docRef = db
        .collection(collection)
        .doc(docId)
        .collection(subCollection)
        .doc(subDocId)
    await docRef.update(object)
  } catch (error) {
    throw "Could not update doc"
  }
}
