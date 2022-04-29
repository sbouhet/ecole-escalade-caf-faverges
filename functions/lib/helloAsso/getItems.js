const axios = require("axios").default

module.exports = async (slug, token) => {
  try {
    if (!slug) throw "No slug"
    if (!token) throw "No token"

    const url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/items?pageSize=100`

    const response = await axios({
      url,
      method: "get",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    let items = response.data.data
    return items
  } catch (error) {
    console.log(error)
    throw `Could not get items from hello asso with slug: ${slug}`
  }
}
