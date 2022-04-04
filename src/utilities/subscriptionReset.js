import { seasons } from "$utils/seasons"

export const subscriptionReset = () => {
  return {
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    ageChecksOut: null,
    parents: [{}],
    status: null,
    years: { [seasons().current]: null },
  }
}
