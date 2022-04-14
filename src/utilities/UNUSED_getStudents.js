import { BError } from "berror"

export const getStudents = (seasonObject, dayUrl) => {
  try {
    if (!seasonObject) throw "No season"
    if (!dayUrl) throw "No dayUrl"
    let students = []
    for (const [id, student] of Object.entries(seasonObject.students)) {
      students.push(student)
    }
    if (!dayUrl) return students
    let filtered = students.filter(
      (student) => student.seasons[seasonObject.name] === dayUrl
    )
    return filtered
  } catch (error) {
    throw new BError("function getStudents not working", error).log()
  }
}
