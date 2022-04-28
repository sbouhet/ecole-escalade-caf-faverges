import { _addDoc, _setDoc } from "$firestore/basics"
import { BError } from "berror"

export const createNewStudent = async (student, season) => {
  try {
    if (!student) throw "no student"
    if (!season) throw "no season"
    //console.log(`Trying to subscribe ${student.publicInfo.firstName}`)

    //write public data to student doc (students/{studentId})
    const studentId = await _addDoc(student.publicInfo, "students")

    //write private data to student doc (students/{studentId}/privateCol/privateDoc)
    await _setDoc(
      student.privateInfo,
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )

    console.log("Document written with ID: ", studentId)
    return
  } catch (error) {
    throw new BError("$firestore/createNewStudent => createNewStudent()", error)
  }
}
