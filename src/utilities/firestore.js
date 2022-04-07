import { db } from "./firebase"
import {
  doc,
  getDoc,
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
import { getAuth } from "firebase/auth"
import { seasons } from "./seasons"
import { getDayUrl } from "$utils/days"

export const getSeason = async (name) => {
  const seasonsCollectionName = "seasons"
  const docRef = doc(db, seasonsCollectionName, name)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error(`Could not find season ${name} in ${seasonsCollectionName}`)
  }
}

export const getSeasonFromFirestore = async (time = "current") => {
  const name = seasons()[time]
  return await getSeason(name)
}

export const createNewStudent = async (student, season = seasons().current) => {
  console.log(`Trying to subscribe ${student.firstName}`)

  //change student status to "préinscrit"
  student.publicInfo.seasons[seasons().current].status = "Pré‑inscrit(e)"

  //write public data to student doc (students/{studentId})
  const studentRef = await addDoc(
    collection(db, "students"),
    student.publicInfo
  )
  await updateDoc(studentRef, { id: studentRef.id })

  //write private data to student doc (students/{studentId}/privateCol/privateDoc)
  const privateDataRef = await setDoc(
    doc(db, "students", studentRef.id, "privateCol", "privateDoc"),
    student.privateInfo
  )

  //write student ID to user doc (users/{userId})
  const userId = getAuth().currentUser.uid
  await updateDoc(doc(db, "users", userId), {
    students: arrayUnion(studentRef.id),
  })

  console.log("Document written with ID: ", studentRef.id)
  return "ALL GOOD"
}

export const deleteStudent = async (id) => {
  let result = window.confirm(
    "Êtes vous sûr de vouloir supprimer cet élève ? Cette action est irreversible."
  )
  if (!result) return
  console.log("Trying to delete doc" + id)
  await deleteDoc(doc(db, "students", id, "privateCol", "privateDoc"))
  await deleteDoc(doc(db, "students", id))
  console.log("Doc deleted")
  return true
}

export const copySeason = async (oldSeasonName, newSeasonName) => {
  try {
    console.log(`Copying seasons ${oldSeasonName}`)
    const oldSeason = await getSeason(oldSeasonName)
    await setDoc(doc(db, "seasons", newSeasonName), oldSeason)
    console.log("Done")
  } catch (error) {
    throw error
  }
}

export const getMyStudents = async () => {
  let myStudents = []
  let currentUser = getAuth().currentUser
  if (!currentUser) return []
  const userRef = doc(db, "users", currentUser.uid)
  const userSnap = await getDoc(userRef)
  let ids = userSnap.data().students
  for (const id of ids) {
    const studentRef = doc(db, "students", id)
    const studentSnap = await getDoc(studentRef)
    myStudents.push(studentSnap.data())
  }
  return myStudents
}
