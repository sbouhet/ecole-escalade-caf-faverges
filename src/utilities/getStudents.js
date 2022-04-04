export const getStudents = (seasonObject, dayUrl) => {
  if (!seasonObject) throw "No season"
  const students = seasonObject.students
  if (!dayUrl) return students

  for (const [id, student] of Object.entries(students)) {
    console.log(`${id}: ${student.firstName}`)
  }
}
