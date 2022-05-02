import { seasons } from "$utils/seasons"
import { getDayUrl } from "$utils/days"
import { BError } from "berror"

export const subscriptionReset = (season) => {
  console.log("RESETTING")
  try {
    if (!season) throw "No season"
    let name, day
    if (season === "reset") {
      name = seasons().current
      day = "default"
    } else {
      name = season.name
      day = null
    }
    return {
      publicInfo: {
        firstName: null,
        lastName: null,
        seasons: {
          [name]: {
            adult: false,
            day,
            status: "no",
            payment: "no",
            licence: "no",
            medicalCertificate: "no",
            licenceNb: null,
          },
        },
      },
      privateInfo: {
        tel: null,
        accidentTel: null,
        email: null,
        dateOfBirth: null,
        helloAssoId: null,
        parents: [{}],
        medicalCertificateLink: null,
        medicalCertificateTimestamp: null,
        receipts: [],
      },
    }
  } catch (error) {
    throw new BError("$utils/subscriptionReset => subscriptionReset()", error)
  }
}
