const basics = require("./basics")

module.exports = async () => {
  try {
    console.log("Trying to find time limit in firestore")
    const adminDoc = await basics._getDoc("admin", "admin")
    console.log("Found time limit")
    console.log(adminDoc)
    return adminDoc.timeLimitForLicence
  } catch (error) {
    throw new Error("Could not get time limit", error)
  }
}
