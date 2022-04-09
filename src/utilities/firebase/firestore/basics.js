import { db } from "$utils/firebase/firebase"
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  arrayUnion,
  arrayRemove,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"

export const _getDoc = async (collection, docId, subCollection, subDocId) => {
  if (!collection) throw "no collection"
  if (!docId) throw "no document ID"
  let docRef
  try {
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      console.log("Document retrieved")
      return docSnap.data()
    } else {
      throw "No such document!"
    }
  } catch (error) {
    throw error
  }
}

export const _query = async (collection, field, operation, value) => {
  if (!collection) throw "No collection"
  if (!field) throw "No field"
  if (!operation) throw "No operation"
  if (!value) throw "No value"
  let result = []
  try {
    const collectionRef = collection(db, collection)
    const q = query(collectionRef, where(field, operation, value))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      result.push(doc.data())
    })
    console.log(`Found ${result.length} results for this query`)
    return result
  } catch (error) {
    throw error
  }
}

//Write docuent with specific ID
export const _setDoc = async (
  document,
  collection,
  docId,
  subCollection,
  subDocId
) => {
  if (!document) throw "No document object"
  if (!collection) throw "No collection"
  if (!docId) throw "No document ID"
  let docRef
  try {
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await setDoc(docRef, document, { merge: true })
    console.log("Document successfully written")
    return
  } catch (error) {
    throw error
  }
}

//Write document with random ID, returns the ID after creation
export const _addDoc = async (document, collection) => {
  if (!document) throw "No document object"
  if (!collection) throw "No Collection"
  try {
    const docRef = await addDoc(collection(db, collection), document)
    console.log("Document written with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    throw error
  }
}

export const _updateDoc = async (
  newValuesasObject,
  collection,
  docId,
  subCollection,
  subDocId
) => {
  if (!newValuesasObject) throw "No object with new values"
  if (!collection) throw "No collection"
  if (!docId) throw "No document ID"
  let docRef
  try {
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await updateDoc(docRef, newValuesasObject)
    console.log("Document successfully updated")
    return
  } catch (error) {
    throw error
  }
}

export const _deleteDoc = async (
  collection,
  docId,
  subCollection,
  subDocId
) => {
  if (!collection) throw "No collection"
  if (!docId) throw "No document ID"
  let docRef
  try {
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await deleteDoc(docRef)
    console.log("Document successfully deleted")
  } catch (error) {
    throw error
  }
}
