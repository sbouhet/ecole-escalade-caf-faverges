module.exports = (studentPrivateData) => {
  try {
    if (!studentPrivateData) return []
    let emails = []
    let data = studentPrivateData
    if (!data) return []
    if (data.email) emails.push(data.email)
    if (data.parents && data.parents.length) {
      //if parents
      for (const parent of data.parents) {
        if (parent.email) emails.push(parent.email)
      }
    }
    return emails
  } catch (error) {
    console.log(error)
    throw `Could not get emails`
  }
}
