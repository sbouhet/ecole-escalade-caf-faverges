import { seasons } from "$utils/seasons"
import { getDayUrl } from "$utils/days"

export const subscriptionReset = (season) => {
  //console.log("RESETTING SUBSCRIPTION")
  if (!season) throw "no season"
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
        [name]: { day, status: null },
      },
    },
    privateInfo: {
      tel: null,
      email: null,
      dateOfBirth: null,
      parents: [{}],
      medicalCertificateLink: null,
    },
  }
}
