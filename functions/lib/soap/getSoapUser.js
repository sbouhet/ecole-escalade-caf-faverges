module.exports = async (client, auth, id) => {
  return new Promise((resolve, reject) => {
    client.verifierUnAdherent({ connect: auth, id: id }, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
