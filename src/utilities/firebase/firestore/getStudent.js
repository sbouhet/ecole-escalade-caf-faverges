import { _getDoc } from "$firestore/basics"

export const getStudent = async (studentId) => {
  if (!studentId) throw "No id"
  try {
    const publicData = await _getDoc("students", studentId)
    const privateData = await _getDoc(
      "students",
      studentId,
      "privateCol",
      "privateDoc"
    )
    console.log("Found student")
    return { public: publicData, private: privateData }
  } catch (error) {
    console.error(`Could not find student with id ${studentId}`)
    throw error
  }
}
