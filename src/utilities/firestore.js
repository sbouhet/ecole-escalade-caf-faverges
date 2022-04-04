import { db } from "./firebase"
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"
import { seasons } from "./seasons"
import { getDayUrl } from "$utils/days"

export const getSeasonFromFirestore = async (time = "current") => {
  const docRef = doc(db, "years", seasons()[time])
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error("No such document!")
  }
}

export const createNewStudent = async (
  student,
  day,
  season = seasons().current
) => {
  console.log(`Trying to subscribe ${student.firstName}`)
  student.years[season] = getDayUrl(day)
  student.status = "Pré‑inscrit(e)"
  const docRef = await addDoc(collection(db, "students"), student)
  await updateDoc(docRef, { id: docRef.id })
  console.log("Document written with ID: ", docRef.id)
  return "ALL GOOD"
}

export const deleteStudent = async (id) => {
  let result = window.confirm(
    "Êtes vous sûr de vouloir supprimer cet élève ? Cette action est irreversible."
  )
  if (!result) return
  console.log("Trying to delete doc" + id)
  await deleteDoc(doc(db, "students", id))
  console.log("Doc deleted")
  return true
}

/* export const getStudentsFromFirestoreWithUpdates = (dayUrl) => {
   let q1, q2, q3
  if(dayUrl){
    q1 = "firstName"
    q2 = ">"
    q3 = 0
  }
  const q = query(collection(db, "students"), where("first", "==", "CA"))
  const q = query(collection(db, "students"))
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const students = []
    querySnapshot.forEach((doc) => {
      students.push(doc.data())
    })
    console.log(`Found ${students.length} students for this query`)
  })
  return unsubscribe
} */

/* export const getStudents = async (day = null, season=seasons().current) => {
  const docRef = doc(db, "years", season)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error("Could not find season doc in 'years' collection")
  }
} */
