import { seasons } from "$utils/seasons"

export const subscriptionReset = (seasonName) => {
  console.log("RESETTING SUBSCRIPTION")
  return {
    publicInfo: {
      firstName: null,
      lastName: null,
      seasons: { [seasonName]: { day: null, status: null } },
    },
    privateInfo: {
      tel: null,
      email: null,
      dateOfBirth: null,
      parents: [{}],
    },
  }
}
