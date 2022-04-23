const sendEmail = require("./sendEmail")
const getAdminEmails = require("../firebase/firestore/getAdminEmails")

module.exports = async (studentId) => {
  try {
    if (!studentId) throw "No student ID"

    //Get admin emails from Firestore
    const adminEmails = await getAdminEmails()

    //Set subject
    const subject = "Nouveau certificat !"

    //Set html content with student ID
    const htmlContent = `
    <a href="https://ee22.netlify.app/admin/modifyStudent?id=${studentId}" target="_new">
    Cliquez ici pour voir le certificat</a>`

    const response = await sendEmail(adminEmails, subject, htmlContent)
    console.log(response)
    return "New certificate email sent !"
  } catch (error) {
    console.log(error)
    throw error
  }
}
