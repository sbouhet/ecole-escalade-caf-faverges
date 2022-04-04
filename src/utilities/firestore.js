import { db } from "./firebase"
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore"
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
  const docRef = await addDoc(collection(db, "students"), student)
  await updateDoc(docRef, { id: docRef.id })
  console.log("Document written with ID: ", docRef.id)
}

/* export const getStudents = async (day = null, season=seasons().current) => {
  const docRef = doc(db, "years", season)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error("Could not find season doc in 'years' collection")
  }
} */
