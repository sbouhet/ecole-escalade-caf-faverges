const basics = require("./basics")
const changeCustomClaims = require("../auth/changeCustomClaims")
const admin = require("firebase-admin")

module.exports = async (student, parentId) => {
  try {
    //Check arguments
    if (!student) throw "No student object"

    //Create student's public document
    const studentId = await basics._addDoc(student.publicInfo, "students")

    //Write ID in document
    const response = await basics._updateDoc(
      { id: studentId },
      "students",
      studentId
    )
    console.log(response)

    //Create student's private document
    const response2 = await basics._setDoc(
      student.privateInfo,
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )
    console.log(response2)

    /* //Get parent user
    const parentUser = await admin.auth().getUser(parentId)
    console.log(parentUser)

    //Get exisiting students for this parent user
    const oldStudents = parentUser.customClaims.students

    //Add newly created student to list
    const newStudents = [...oldStudents, studentId]

    //update custom claims
    const response3 = await changeCustomClaims(
      parentUser,
      "students",
      newStudents
    )
    console.log(response3)

    //update user in Firestore
    const response4 = await basics._updateDoc(
      { students: newStudents },
      "users",
      parentId
    )
    console.log(response4) */

    return { studentId, response, response2 }
  } catch (error) {
    console.log("Could no create new student")
    console.log(error)
    throw new Error("Impossible de créer cet élève", error)
  }
}
