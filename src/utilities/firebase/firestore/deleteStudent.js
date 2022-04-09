import { _deleteDoc } from "$firestore/basics"

export const deleteStudent = async (studentId) => {
  if (!studentId) throw "No student ID"
  try {
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
    console.log("Could not delete student")
    throw error
  }
}
