const sendEmail = require("./sendEmail")
const basics = require("../firebase/firestore/basics")

module.exports = async (studentId, seasonName, name) => {
  try {
    if (!studentId) throw "No student ID"
    if (!seasonName) throw "No seasonName"

    //Get admin doc from Firestore
    const adminDoc = await basics._getDoc("admin", "admin")

    //Populate adminEmails
    let adminEmails = []
    for (const adminEmail of adminDoc.data().adminEmails) {
      adminEmails.push({ email: adminEmail })
    }

    //Set subject
    const subject = `Nouveau certificat pour ${name}`

    //Set html content with student ID
    const htmlContent = `
    <a href="https://ee22.netlify.app/prive/mod/checkMedicalCertificate?season=${seasonName}&id=${studentId}" target="_new">
    Cliquez ici pour voir le certificat</a>`

    //Send email to admins
    await sendEmail(adminEmails, subject, htmlContent)

    return "New certificate email sent !"
  } catch (error) {
    console.log(error)
    throw error
  }
}
