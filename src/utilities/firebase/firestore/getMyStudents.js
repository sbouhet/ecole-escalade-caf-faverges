import { _getDoc } from "$firestore/basics"
import { getAuth } from "firebase/auth"
import { BError } from "berror"

export const getMyStudents = async (season) => {
  try {
    if (!season) throw "No season"
    let myStudents = []
    //Get current user
    let currentUser = getAuth().currentUser

    //If no user, return empty array
    if (!currentUser) return []

    //Get document for current user
    const userDoc = await _getDoc("users", currentUser.uid)

    //Get student IDs from document
    const studentIds = userDoc.students

    //For all IDs
    for (const id of studentIds) {
      //Get student document
      const studentDoc = await _getDoc("students", id)

      //Check ff season exists and status is not null
      if (
        studentDoc.seasons[season.name] &&
        studentDoc.seasons[season.name].status
      ) {
        //Add document to MyStudents
        myStudents.push(studentDoc)
      }
    }
    //console.log(`Found ${myStudents.length} student for ${currentUser.email}`)
    return myStudents
  } catch (error) {
    throw new BError("$firestore/getMyStudents => getMyStudents()", error)
  }
}
