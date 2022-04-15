import * as soap from "soap"

export const getClient = async () => {
  var url = "https://extranet-clubalpin.com/app/soap/extranet_pro.wsdl"
  return new Promise((resolve, reject) => {
    soap.createClient(url, (err, client) => {
      if (err) {
        return reject(err)
      }
      resolve(client)
    })
  })
}

export const getAuth = async (client) => {
  return new Promise((resolve, reject) => {
    client.auth(null, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve({
        ...result,
        utilisateur: process.env.SOAP_USER,
        motdepasse: process.env.SOAP_PASSWORD,
      })
    })
  })
}

export const getUsers = async (client, auth, clubId) => {
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

export const getUser = async (client, auth, userId) => {
  return new Promise((resolve, reject) => {
    client.extractionAdherent({ connect: auth, id: userId }, (err, result) => {
      if (err) {
        console.log("get user error", err)
        return reject(err)
      }
      resolve(result.extractionAdherentReturn)
    })
  })
}

export const getClub = async (client, auth, clubId) => {
  return new Promise((resolve, reject) => {
    client.extractionClub({ connect: auth, idclub: clubId }, (err, result) => {
      if (err) {
        console.log("get club error", err)
        return reject(err)
      }
      const club = result.extractionClubReturn
      resolve(club)
    })
  })
}

export const getEvents = async (client, auth, clubId) => {
  return new Promise((resolve, reject) => {
    client.extractionSortiesClub(
      { connect: auth, idclub: clubId },
      (err, result) => {
        if (err) {
          console.log("get events error", err)
          return reject(err)
        }
        const events = result
        resolve(events)
      }
    )
  })
}
