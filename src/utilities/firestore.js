import { db } from "./firebase"
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
import { getAuth } from "firebase/auth"
import { seasons } from "./seasons"
import { getDayUrl, getDayFromUrl } from "$utils/days"

export const getSeason = async (name) => {
  const docRef = doc(db, "seasons", name)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.error(`Could not find season ${name} in seasons`)
    throw `La saison ${name} n'existe pas dans la base de donnée.`
  }
}

export const getSeasonFromFirestore = async (time = "current") => {
  const name = seasons()[time]
  return await getSeason(name)
}

export const createNewStudent = async (student, season) => {
  if (!student) throw "no student"
  if (!season) throw "no season"
  console.log(`Trying to subscribe ${student.publicInfo.firstName}`)

  //change student status to "préinscrit"
  student.publicInfo.seasons[season.name].status = "Pré‑inscrit(e)"

  //write public data to student doc (students/{studentId})
  const studentRef = await addDoc(
    collection(db, "students"),
    student.publicInfo
  )
  //Get id from newly created doc and add it to the document fields
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

export const getMyStudents = async (season) => {
  let myStudents = []
  let currentUser = getAuth().currentUser
  if (!currentUser) return []
  const userRef = doc(db, "users", currentUser.uid)
  const userSnap = await getDoc(userRef)
  let ids = userSnap.data().students
  for (const id of ids) {
    const studentRef = doc(db, "students", id)
    const studentSnap = await getDoc(studentRef)
    if (
      studentSnap.data().seasons[season.name] &&
      studentSnap.data().seasons[season.name].status
    ) {
      myStudents.push(studentSnap.data())
    }
  }
  return myStudents
}

export const getDayStudents = async (dayUrl, seasonName) => {
  if (!dayUrl) throw "no day url"
  if (!seasonName) throw "no season name"
  const q = query(
    collection(db, "students"),
    where(`seasons.${seasonName}.day`, "==", dayUrl)
  )
  const dayStudents = []
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((student) => {
    dayStudents.push(student.data())
  })
  return dayStudents
}

export const isDayFull = async (dayUrl, seasonName, days) => {
  const dayStudents = await getDayStudents(dayUrl, seasonName)
  const nbOfStudent = dayStudents.length
  const day = getDayFromUrl(dayUrl, days)
  const spotsLeft = day.nbMaxOfStudents - nbOfStudent
  if (spotsLeft <= 0) return true
  return false
}
