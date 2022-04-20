const soap = require("soap")

module.exports = async () => {
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
