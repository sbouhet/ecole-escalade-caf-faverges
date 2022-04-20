module.exports = async (client, auth, clubId = 7421) => {
  return new Promise((resolve, reject) => {
    client.extractionAdherents(
      { connect: auth, idclub: clubId },
      (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.extractionAdherentsReturn.collection.item)
      }
    )
  })
}
