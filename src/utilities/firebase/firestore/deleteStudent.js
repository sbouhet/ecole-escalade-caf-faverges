import { _deleteDoc } from "$firestore/basics"
import { BError } from "berror"

export const deleteStudent = async (studentId) => {
  try {
    if (!studentId) throw "No student ID"
    let result = window.confirm(
      "Êtes vous sûr de vouloir supprimer cet élève ? Cette action est irreversible."
    )
    if (!result) return
    console.log("Trying to delete doc " + studentId)
    await _deleteDoc("students", studentId, "privateCol", "privateDoc")
    await _deleteDoc("students", studentId)
    console.log("Doc deleted")
    return
  } catch (error) {
    throw new BError(
      "Function $firestore/deleteStudent => deleteStudent()",
      error
    )
  }
}
