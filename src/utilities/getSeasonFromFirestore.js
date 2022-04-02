import { db } from "./firebase"
import { doc, getDoc } from "firebase/firestore"
import { seasons } from "./seasons"

export const getSeasonFromFirestore = async (time = "current") => {
  const docRef = doc(db, "years", seasons()[time])
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error("No such document!")
  }
}
