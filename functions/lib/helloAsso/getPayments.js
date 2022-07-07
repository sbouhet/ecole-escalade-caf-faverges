const axios = require("axios").default

module.exports = async (token, search) => {
  try {
    if (!token) throw "No token"

    let searchString = ''
    if (search) searchString = `&userSearchKey=${search}`
    const url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/payments?pageSize=100${searchString}`


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
    throw error
  }
}
