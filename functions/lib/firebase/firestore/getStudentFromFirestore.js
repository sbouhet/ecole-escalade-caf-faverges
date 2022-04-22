const basics = require("./basics")

module.exports = async (studentId) => {
  try {
    console.log("Trying to find student in firestore")
    const student = await basics._getDoc("students", studentId)
    console.log("Found student in firestore")
    return student
  } catch (error) {
    throw new Error("Utilisateur non trouvé dans Firestore", error)
  }
}
