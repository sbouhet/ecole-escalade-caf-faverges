const basics = require("./basics")
const _getDoc = basics._getDoc

module.exports = async () => {
  try {
    const adminDoc = await _getDoc("admin", "admin")
    formatted = []
    for (const adminEmail of adminDoc.adminEmails) {
      formatted.push({ email: adminEmail })
    }
    return formatted
  } catch (error) {
    throw new Error("Could not get admin emails", error)
  }
}
