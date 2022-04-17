import { _addDoc, _updateDoc, _setDoc } from "$firestore/basics"
import { arrayUnion } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { BError } from "berror"

export const createNewStudent = async (student, season) => {
  try {
    if (!student) throw "no student"
    if (!season) throw "no season"
    //console.log(`Trying to subscribe ${student.publicInfo.firstName}`)

    //change student status to "préinscrit"
    student.publicInfo.seasons[season.name].status = "waiting"

    //write public data to student doc (students/{studentId})
    const studentId = await _addDoc(student.publicInfo, "students")

    //Get id from newly created doc and add it to the document fields
    await _updateDoc({ id: studentId }, "students", studentId)

    //write private data to student doc (students/{studentId}/privateCol/privateDoc)
    await _setDoc(
      student.privateInfo,
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )

    //write student ID to user doc (users/{userId})
    const userId = getAuth().currentUser.uid
    await _updateDoc(
      {
        students: arrayUnion(studentId),
      },
      "users",
      userId
    )

    //console.log("Document written with ID: ", studentId)
    return
  } catch (error) {
    throw new BError(
      "Function $firestore/createNewStudent => createNewStudent()",
      error
    )
  }
}
