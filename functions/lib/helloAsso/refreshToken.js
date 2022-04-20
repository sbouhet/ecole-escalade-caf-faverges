const axios = require("axios").default

module.exports = async (id, refresh_token) => {
  console.log("REFRESHING TOKENS")
  console.log(id)
  console.log(refresh_token)
  const response = await axios({
    url: "https://api.helloasso.com/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // This will urlencode the data correctly:
    data: new URLSearchParams({
      client_id: id,
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
  })
  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    duration: response.data.expires_in,
  }
}
