import { BError } from "berror"

export const capitalize = (string) => {
  try {
    if (!string) throw "No string"
    return string.charAt(0).toUpperCase() + string.slice(1)
  } catch (error) {
    throw new BError("Function $utils/capitalize => capitalize()", error)
  }
}
