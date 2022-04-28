import { db } from "$utils/firebase/firebase"
import { BError } from "berror"

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  collection,
} from "firebase/firestore"

export const _getDoc = async (collection, docId, subCollection, subDocId) => {
  try {
    if (!collection) throw "no collection"
    if (!docId) throw "no document ID"
    let docRef
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      if (subDocId) {
        throw new BError(
          `Could not find doc "${subDocId}" in "${collection}/${docId}/${subCollection}"`,
          null,
          { collection, docId, subCollection, subDocId }
        )
      } else {
        throw new BError(
          `Could not find doc "${docId}" in "${collection}"`,
          null,
          { collection, docId }
        )
      }
    }
  } catch (error) {
    throw new BError("$firestore/basics => _getDoc()", error)
  }
}

export const _query = async (collectionId, field, operation, value) => {
  try {
    if (!collectionId) throw "No collection"
    if (!field) throw "No field"
    if (!operation) throw "No operation"
    if (!value) throw "No value"
    let result = []
    const collectionRef = collection(db, collectionId)
    const q = query(collectionRef, where(field, operation, value))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      result.push(doc)
    })
    return result
  } catch (error) {
    throw new BError("$firestore/basics => _query()", error)
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
  try {
    if (!document) throw "No document object"
    if (!collection) throw "No collection"
    if (!docId) throw "No document ID"
    let docRef
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await setDoc(docRef, document, { merge: true })
    return
  } catch (error) {
    throw new BError("$firestore/basics => _setDoc()", error)
  }
}

//Write document with random ID, returns the ID after creation
export const _addDoc = async (document, collectionId) => {
  try {
    if (!document) throw "No document object"
    if (!collectionId) throw "No Collection"
    const docRef = await addDoc(collection(db, collectionId), document)
    return docRef.id
  } catch (error) {
    throw new BError("$firestore/basics => _addDoc()", error)
  }
}

export const _updateDoc = async (
  newValuesasObject,
  collection,
  docId,
  subCollection,
  subDocId
) => {
  try {
    if (!newValuesasObject) throw "No object with new values"
    if (!collection) throw "No collection"
    if (!docId) throw "No document ID"
    let docRef
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await updateDoc(docRef, newValuesasObject)
    return
  } catch (error) {
    throw new BError("$firestore/basics => _updateDoc()", error)
  }
}

export const _deleteDoc = async (
  collection,
  docId,
  subCollection,
  subDocId
) => {
  try {
    if (!collection) throw "No collection"
    if (!docId) throw "No document ID"
    let docRef
    if (subCollection && subDocId) {
      docRef = doc(db, collection, docId, subCollection, subDocId)
    } else {
      docRef = doc(db, collection, docId)
    }
    await deleteDoc(docRef)
  } catch (error) {
    throw new BError("$firestore/basics => _deleteDoc()", error)
  }
}
