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
      return doc
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

exports._addDoc = async (object, collection) => {
  try {
    if (!object) throw "Pas d'object à créer"
    if (!collection) throw "Pas de collection"
    const docRef = await db.collection(collection).add(object)
    const id = docRef.id
    console.log("Document créé avec l'ID ", id)
    return id
  } catch (error) {
    console.log(error)
    throw new Error(
      `Impossible de créer un document dans la collection ${collection}`,
      error
    )
  }
}

exports._setDoc = async (
  object,
  collection,
  docId,
  subCollection,
  subDocId
) => {
  try {
    if (!object) throw "Pas d'objet à créer"
    if (!collection) throw "Pas de collection"
    if (!docId) throw "Pas de docId"
    let docRef = db.collection(collection).doc(docId)
    if (subDocId)
      docRef = db
        .collection(collection)
        .doc(docId)
        .collection(subCollection)
        .doc(subDocId)
    await docRef.set(object)
    if (subDocId)
      return `Document créé ${collection}/${docId}/${subCollection}/${subDocId}`
    return `Document créé ${collection}/${docId}`
  } catch (error) {
    if (subDocId)
      throw `Impossible de créer le document ${collection}/${docId}/${subCollection}/${subDocId}`
    throw `Impossible de créer le document ${collection}/${docId}`
  }
}
