const basics = require("./basics")

module.exports = async () => {
  try {
    const adminDoc = await basics._getDoc("admin", "admin")
    return adminDoc.data().timeLimitForLicence
  } catch (error) {
    throw new Error("Could not get time limit", error)
  }
}
