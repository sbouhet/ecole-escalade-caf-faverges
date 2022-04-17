import { BError } from "berror"

export const translateRole = (english) => {
  try {
    if (!english) throw "No english"
    switch (english) {
      case "mother":
        return "Mère"
      case "father":
        return "Père"
      case "other":
        return "Autre"
    }
  } catch (error) {
    throw new BError("Function $utils/TRANSLATE => translateRole()", error)
  }
}

export const translateStatus = (english) => {
  try {
    if (!english) throw "No english"
    switch (english) {
      case "yes":
        return "Inscrit(e)"
      case "No":
        return "Pas inscrit(e)"
      case "waiting":
        return "Pré‑inscrit(e)"
    }
  } catch (error) {
    throw new BError("Function $utils/TRANSLATE => translateStatus()", error)
  }
}
