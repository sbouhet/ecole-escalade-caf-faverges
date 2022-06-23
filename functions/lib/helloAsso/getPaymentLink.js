const axios = require("axios").default
const dayjs = require("dayjs")

module.exports = async (
  token,
  totalAmount,
  studentId,
  payer,
  payInThree = false
) => {
  console.log("Trying to get link from HelloAsso")

  try {
    if (!token) throw "No token"
    if (!totalAmount) throw "No totalAmount"
    if (!studentId) throw "No studentId"
    if (!payer) throw "No payer"

    let initialAmount, terms

    // if user wants to pay in thee payments
    if (payInThree) {
      // divide total by 3 (rounded up) and multiply by 100 to get cents
      let amount = Math.ceil((totalAmount * 100) / 3)
      totalAmount = 3 * amount

      // make first payment
      initialAmount = amount

      const currentYear = parseInt(dayjs().format("YYYY"))

      // make 2 other payments in november and march
      terms = [
        {
          amount,
          date: `${currentYear}-11-01T00:00:00+02:00`,
        },
        {
          amount,
          date: `${currentYear + 1}-03-01T00:00:00+02:00`,
        },
      ]
    } else {
      // if user wants to pay everything now
      // multiply by 100 to get cents
      totalAmount = totalAmount * 100
      initialAmount = totalAmount
      terms = []
    }

    const response = await axios({
      url: "https://api.helloasso.com/v5/organizations/caf-de-faverges/checkout-intents",
      method: "post",
      headers: {
        authorization: `Bearer ${token}`,
      },
      // This will urlencode the data correctly:
      data: {
        totalAmount,
        initialAmount,
        terms,
        itemName: "Cours d'escalade'",
        backUrl: `https://ee22.netlify.app/prive/mon-compte/${studentId}`,
        errorUrl: "https://ee22.netlify.app/prive/mon-compte/erreur",
        returnUrl: `https://ee22.netlify.app/prive/mon-compte/${studentId}/checkPayment`,
        containsDonation: false,

        payer: {
          firstName: payer.firstName,
          lastName: payer.lastName,
          email: payer.email,
        },
        metadata: {
          studentId: 98765,
        },
      },
    })
    return response.data
  } catch (error) {
    console.log(error)
    throw "Could not get payment link from helloAsso"
  }
}
