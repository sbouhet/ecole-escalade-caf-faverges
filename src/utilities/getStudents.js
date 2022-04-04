export const getStudents = (seasonObject, dayUrl) => {
  if (!seasonObject) throw "No season"
  let students = []
  for (const [id, student] of Object.entries(seasonObject.students)) {
    students.push(student)
  }
  if (!dayUrl) return students
  let filtered = students.filter(
    (student) => student.years[seasonObject.name] === dayUrl
  )
  return filtered
}
