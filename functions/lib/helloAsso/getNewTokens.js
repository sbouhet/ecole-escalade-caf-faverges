const axios = require("axios").default

module.exports = async () => {
  try {
    const HELLOASSO_ID = process.env.HELLOASSO_ID
    const HELLOASSO_PASSWORD = process.env.HELLOASSO_PASSWORD

    const response = await axios({
      url: "https://api.helloasso.com/oauth2/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // This will urlencode the data correctly:
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: HELLOASSO_ID,
        client_secret: HELLOASSO_PASSWORD,
      }),
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw "Could not get token from helloAsso API"
  }
}
