const functions = require("firebase-functions")
/* const admin = require("firebase-admin")
admin.initializeApp() */

exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = "lol"
  response.send(number)
})

exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name
  return `Hello lolilol ${name}`
})
