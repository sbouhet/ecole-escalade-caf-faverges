const normalize = require("../normalize")
let dayjs = require("dayjs")
const getTimeLimit = require("../firebase/firestore/getTimeLimit")

module.exports = async (soapUser, student) => {
  if (normalize(soapUser.firstName) !== normalize(student.firstName))
    throw "Les prénoms sont différents."
  if (normalize(soapUser.lastName) !== normalize(student.lastName))
    throw "Les noms sont différents."
  const dateDifference = dayjs().diff(soapUser.signupDate, "day")
  const timeLimit = await getTimeLimit()
  if (dateDifference > timeLimit)
    throw `Cette licence a été prise il y a plus de ${timeLimit} jours.`
  return { dateDifference, timeLimit }
}
