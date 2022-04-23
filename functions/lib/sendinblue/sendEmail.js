const axios = require("axios").default

module.exports = async (emails, subject, htmlContent) => {
  try {
    if (!emails) throw "No emails"
    if (!subject) throw "No subject"
    if (!htmlContent) throw "No htmlContent"
    const SENDINBLUE_API_KEY_SECRET = process.env.SENDINBLUE_API_KEY_SECRET
    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: { name: "Jules", email: "jules@ne-pas-repondre.com" },
        to: emails,
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": SENDINBLUE_API_KEY_SECRET,
        },
      }
    )
    return "Email sent !"
  } catch (error) {
    console.log("Could not send email ", error)
    throw error
  }
}
