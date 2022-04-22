const admin = require("firebase-admin")

module.exports = async (userId) => {
  try {
    if (!userId) throw "No user ID"

    const response = await admin.auth().setCustomUserClaims(userId, null)
    console.log(response)
    return "Deleted custom claims successfully"
  } catch (error) {
    throw new Error("Could not delete custome claims", error)
  }
}
