const getClient = require("./getClient")
const getAuth = require("./getAuth")
const getSoapUser = require("./getSoapUser")
const formatSoapUser = require("./formatSoapUser")

module.exports = async (userId) => {
  try {
    const client = await getClient()
    const auth = await getAuth(client)
    const user = await getSoapUser(client, auth, userId)
    console.log(user);
    const formatted = formatSoapUser(user)
    console.log(formatted);
    return formatted
  } catch (error) {
    throw "Utilisateur non trouvé sur la base de donnée du CAF"
  }
}
