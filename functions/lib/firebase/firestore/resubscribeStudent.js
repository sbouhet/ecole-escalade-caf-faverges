const basics = require("./basics")
let dayjs = require("dayjs")

module.exports = async (id, oldSeasonName, newSeasonName, dayUrl) => {
  try {
    if (!id) throw "Pas d'id"
    if (!oldSeasonName) throw "Pas de oldSeasonName"
    if (!newSeasonName) throw "Pas de newSeasonName"
    if (!dayUrl) throw "Pas de dayUrl"

    const student = await basics._getDoc("students", id)
    if (!student.data().seasons[oldSeasonName])
      throw "Élève non trouvé dans la saison passée"

    if (student.data().seasons[newSeasonName])
      throw "Élève déja inscrit(e) sur cette saison"

    const newSeason = {
      day: dayUrl,
      status: "no",
      payment: "no",
      licence: "no",
      medicalCertificate: "no",
      licenceNb: null,
      timestamp: dayjs().unix(),
    }

    await basics._updateDoc(
      { [`seasons.${newSeasonName}`]: newSeason },
      "students",
      id
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}
