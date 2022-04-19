import { seasons } from "$utils/seasons"
import { getDayUrl } from "$utils/days"
import { BError } from "berror"

export const subscriptionReset = (season) => {
  try {
    if (!season) throw "No season"
    let name, day
    if (season === "reset") {
      name = seasons().current
      day = "default"
    } else {
      name = season.name
      day = getDayUrl(season.days[0])
    }
    return {
      publicInfo: {
        firstName: null,
        lastName: null,
        seasons: {
          [name]: {
            day,
            status: "no",
            payment: "no",
            licence: "no",
            medicalCertificate: "no",
            receipts: [],
            licenceNb: null,
            helloAssoId: null,
          },
        },
      },
      privateInfo: {
        tel: null,
        email: null,
        dateOfBirth: null,
        parents: [{}],
        medicalCertificateLink: null,
        medicalCertificateTimestamp: null,
      },
    }
  } catch (error) {
    throw new BError("$utils/subscriptionReset => subscriptionReset()", error)
  }
}
