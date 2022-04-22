import { _getDoc } from "$firestore/basics"
import { getAuth } from "firebase/auth"
import { BError } from "berror"
import { db } from "$utils/firebase/firebase"
import { getDocs, query, where, collectionGroup } from "firebase/firestore"

export const getMyStudents = async (season) => {
  try {
    if (!season) throw "No season"
    let myStudents = []
    //Get current user
    let email = getAuth().currentUser.email

    //If no user, return empty array
    if (!email) return []

    //query all student with this email
    const students = query(
      collectionGroup(db, "privateCol"),
      where("emails", "array-contains", "email")
    )
    const querySnapshot = await getDocs(students)
    querySnapshot.forEach((student) => {
      myStudents.push(student.data())
    })

    console.log(`Found ${myStudents.length} student for ${email}`)
    return myStudents
  } catch (error) {
    throw new BError("$firestore/getMyStudents => getMyStudents()", error)
  }
}
