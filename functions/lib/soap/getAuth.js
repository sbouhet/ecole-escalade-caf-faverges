module.exports = async (client) => {
  const SOAP_ID = process.env.SOAP_ID
  const SOAP_PASSWORD = process.env.SOAP_PASSWORD
  return new Promise((resolve, reject) => {
    client.auth(null, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve({
        ...result,
        utilisateur: SOAP_ID,
        motdepasse: SOAP_PASSWORD,
      })
    })
  })
}
