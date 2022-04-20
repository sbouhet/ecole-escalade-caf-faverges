const axios = require("axios").default

module.exports = async (token, userPayments, slug) => {
  let url = `https://api.helloasso.com/v5/organizations/caf-de-faverges/forms/Membership/${slug}/payments?pageSize=100`

  const response = await axios({
    url,
    method: "get",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const allPayments = response.data.data
  const ids = userPayments.map((x) => x.id)
  const filtered = allPayments.filter((x) => ids.includes(x.id))
  const receipts = filtered.map((x) => x.paymentReceiptUrl)
  return receipts
}
