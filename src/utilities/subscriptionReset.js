import { seasons } from "$utils/seasons"

export const subscriptionReset = () => {
  return {
    publicInfo: {
      firstName: null,
      lastName: null,
      seasons: { [seasons().current]: { day: null, status: null } },
    },
    privateInfo: {
      tel: null,
      email: null,
      dateOfBirth: null,
      parents: [{}],
    },
  }
}
