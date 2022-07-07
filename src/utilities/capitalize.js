import { BError } from "berror"

export const capitalize = (string) => {
  try {
    if (!string) throw "No string"
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
  } catch (error) {
    const e = new BError("$utils/capitalize => capitalize()", error)
    e.log()
    return "??????"
  }
}
