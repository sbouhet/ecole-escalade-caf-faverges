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
  const docRef = doc(db, "seasons", season)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error("Could not find season doc in 'seasons' collection")
  }
} */
