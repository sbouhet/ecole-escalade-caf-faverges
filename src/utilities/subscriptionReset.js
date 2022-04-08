import { seasons } from "$utils/seasons"

export const subscriptionReset = (season) => {
  //console.log("RESETTING SUBSCRIPTION")
  if (!season) throw "no season"
  if (season === "reset") {
    season = {
      name: seasons().current,
      days: ["default"],
    }
  }
  return {
    publicInfo: {
      firstName: null,
      lastName: null,
      seasons: { [season.name]: { day: season.days[0], status: null } },
    },
    privateInfo: {
      tel: null,
      email: null,
      dateOfBirth: null,
      parents: [{}],
    },
  }
}
