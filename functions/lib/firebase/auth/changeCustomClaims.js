const admin = require("firebase-admin")

module.exports = async (user, field, value) => {
  try {
    if (!user) throw "No user"
    if (!field) throw "No field"
    if (value == null) throw "No value"

    const oldClaims = user.customClaims
    const newClaims = { ...oldClaims, [field]: value }
    const response = await admin.auth().setCustomUserClaims(user.uid, newClaims)
    console.log(response)
    return "Changed custom claims successfully"
  } catch (error) {
    throw new Error("Could not change custome claims", error)
  }
}
