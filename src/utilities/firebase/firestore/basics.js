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
  orderBy,
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
      return docSnap
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

export const _query = async (collectionId, field, operation, value, order) => {
  try {
    if (!collectionId) throw "No collection"
    if (!field) throw "No field"
    if (!operation) throw "No operation"
    let result = []
    const collectionRef = collection(db, collectionId)
    let q = query(collectionRef, where(field, operation, value))
    if (order)
      q = query(collectionRef, where(field, operation, value), orderBy(order))
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
export const _addDoc = async (document, collectionId, subDocId, subCollection) => {
  try {
    if (!document) throw "No document object"
    if (!collectionId) throw "No Collection"
    let docRef
    if (subCollection){
      docRef = await addDoc(collection(db, collectionId, subDocId, subCollection), document)
    }else{
      docRef = await addDoc(collection(db, collectionId), document)
    }
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

export const _getDocs = async (collectionId, subDocId, subCollection) => {
  try {
    if (!collectionId) throw "No collection"
    
    let result = []
    let querySnapshot
    if (subDocId && subCollection) {
      querySnapshot = await getDocs(collection(db, collectionId, subDocId, subCollection));
    } else {
      querySnapshot = await getDocs(collection(db, collectionId));
    }
    querySnapshot.forEach((doc) => {
      result.push(doc)
    })
    return result
  } catch (error) {
    throw new BError("$firestore/basics => _getDocs()", error)
  }
}
