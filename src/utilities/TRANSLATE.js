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
    throw new BError("$utils/TRANSLATE => translateRole()", error)
  }
}

export const translateStatus = (english) => {
  try {
    if (!english) throw "No english"
    switch (english) {
      case "yes":
        return "Inscrit·e"
      case "no":
        return "Pré‑inscrit·e"
      case "waiting":
        return "En attente de validation"
    }
  } catch (error) {
    throw new BError("$utils/TRANSLATE => translateStatus()", error)
  }
}
