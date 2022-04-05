import { capitalize } from "$utils/capitalize"

export const printName = (obj) => {
  if (!obj.firstName || !obj.lastName) throw "No firstName or lastName to print"
  let firstName = capitalize(obj.firstName)
  let lastName = obj.lastName.toUpperCase()
  return `${firstName} ${lastName}`
}
