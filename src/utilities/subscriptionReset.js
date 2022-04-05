import { seasons } from "$utils/seasons"

export const subscriptionReset = () => {
  return {
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    parents: [{}],
    seasons: { [seasons().current]: { day: null, status: null } },
  }
}
