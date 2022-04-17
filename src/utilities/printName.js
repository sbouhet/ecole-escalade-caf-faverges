import { capitalize } from "$utils/capitalize"
import { BError } from "berror"

export const printName = (obj) => {
  try {
    if (!obj) throw "No object"
    if (!obj.firstName) throw "No firstName"
    if (!obj.lastName) throw "No lastName"
    let firstName = capitalize(obj.firstName)
    let lastName = obj.lastName.toUpperCase()
    return `${firstName} ${lastName}`
  } catch (error) {
    throw new BError("Function $utils/printName => printName()", error)
  }
}
