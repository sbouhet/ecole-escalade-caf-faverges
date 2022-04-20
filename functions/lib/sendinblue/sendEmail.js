const axios = require("axios").default

module.exports = async (emails, subject, htmlContent, API_KEY) => {
  await axios.post(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      sender: { name: "Jules", email: "friarobaz@gmail.com" },
      to: emails,
      subject,
      htmlContent,
    },
    {
      headers: {
        "api-key": API_KEY,
      },
    }
  )
  return true
}
