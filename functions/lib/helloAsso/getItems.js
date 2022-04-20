const axios = require("axios").default

module.exports = async (slug, token) => {
  let url
  if (slug) {
    url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/items?pageSize=100`
  } else {
    url =
      "https://api.helloasso.com/v5/organizations/caf-de-faverges/items?pageSize=100"
  }
  const response = await axios({
    url,
    method: "get",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  let items = response.data.data
  return items
}
