import { capitalize } from "$utils/capitalize"

export const printName = (obj) => {
  let firstName = capitalize(obj.firstName)
  let lastName = obj.lastName.toUpperCase()
  return `${firstName} ${lastName}`
}
