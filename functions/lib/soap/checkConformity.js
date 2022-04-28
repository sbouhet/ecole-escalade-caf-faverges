const normalize = require("../normalize")
let dayjs = require("dayjs")
const basics = require("../firebase/firestore/basics")

module.exports = async (soapUser, student) => {
  try {
    if (normalize(soapUser.firstName) !== normalize(student.firstName))
      throw "Les prénoms sont différents."
    if (normalize(soapUser.lastName) !== normalize(student.lastName))
      throw "Les noms sont différents."
    const dateDifference = dayjs().diff(soapUser.signupDate, "day")
    const adminDoc = await basics._getDoc("admin", "admin")
    const timeLimit = adminDoc.data().timeLimitForLicence
    if (dateDifference > timeLimit)
      throw `Cette licence a été prise il y a plus de ${timeLimit} jours.`
    return { dateDifference, timeLimit }
  } catch (error) {
    console.log("Error checking conformity")
    console.log(error)
    throw error
  }
}
