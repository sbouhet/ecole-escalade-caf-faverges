import { capitalize } from "$utils/capitalize"

export const printName = (obj) => {
  if (!obj) return
  let firstName = capitalize(obj.firstName)
  let lastName = obj.lastName.toUpperCase()
  return `${firstName} ${lastName}`
}
