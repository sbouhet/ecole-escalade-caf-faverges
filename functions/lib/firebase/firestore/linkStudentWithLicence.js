const basics = require("./basics")

module.exports = async (studentId, licenceNb, seasonName) => {
  try {
    await basics._updateDoc(
      {
        [`seasons.${seasonName}.licence`]: "yes",
        [`seasons.${seasonName}.licenceNb`]: licenceNb,
      },
      "students",
      studentId
    )
  } catch (error) {
    throw "Impossible de mettre à jour l'utilisateur"
  }
}
