const sendEmail = require("./sendEmail")
const basics = require("../firebase/firestore/basics")

module.exports = async (studentId) => {
  try {
    if (!studentId) throw "No student ID"

    //Get admin doc from Firestore
    const adminDoc = await basics._getDoc("admin", "admin")

    //Populate adminEmails
    let adminEmails = []
    for (const adminEmail of adminDoc.data().adminEmails) {
      adminEmails.push({ email: adminEmail })
    }

    //Set subject
    const subject = "Nouveau certificat !"

    //Set html content with student ID
    const htmlContent = `
    <a href="https://ee22.netlify.app/admin/modifyStudent?id=${studentId}" target="_new">
    Cliquez ici pour voir le certificat</a>`

    //Send email to admins
    await sendEmail(adminEmails, subject, htmlContent)

    return "New certificate email sent !"
  } catch (error) {
    console.log(error)
    throw error
  }
}
