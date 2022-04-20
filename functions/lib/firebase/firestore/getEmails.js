module.exports = (studentPrivateData) => {
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
}
