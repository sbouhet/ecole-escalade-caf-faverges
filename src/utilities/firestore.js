import { db } from "./firebase"
import { doc, getDoc, collection, addDoc } from "firebase/firestore"
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

export const createNewStudent = async (student, season, day) => {
  console.log(`Trying to subscribe ${student.firstName}`)
  student.years[season] = getDayUrl(day)
  const docRef = await addDoc(collection(db, "students"), student)
  console.log("Document written with ID: ", docRef.id)
}
