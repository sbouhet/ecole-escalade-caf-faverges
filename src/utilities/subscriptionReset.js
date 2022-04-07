import { seasons } from "$utils/seasons"

export const subscriptionReset = (season) => {
  return {
    publicInfo: {
      firstName: null,
      lastName: null,
      seasons: { [season.name]: { day: null, status: null } },
    },
    privateInfo: {
      tel: null,
      email: null,
      dateOfBirth: null,
      parents: [{}],
    },
  }
}
