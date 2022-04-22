const admin = require("firebase-admin")
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
      if (!doc.exists) throw "Pas de document"
      return doc.data()
    })
    .catch((error) => {
      console.log(error)
      if (subDocId)
        throw `Document introuvable ${collection}/${docId}/${subCollection}/${subDocId}`
      throw `Document introuvable ${collection}/${docId}`
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
    if (subDocId)
      return `Document mis à jour ${collection}/${docId}/${subCollection}/${subDocId}`
    return `Document mis à jour ${collection}/${docId}`
  } catch (error) {
    if (subDocId)
      throw `Impossible de mettre à jour le document ${collection}/${docId}/${subCollection}/${subDocId}`
    throw `Impossible de mettre à jour le document ${collection}/${docId}`
  }
}
