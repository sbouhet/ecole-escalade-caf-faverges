import { BError } from "berror"

export const translate = (english) => {
  try {
    if (!english) throw "No english"
    switch (english) {
      case "check":
        return "chèque(s)"
      case "cash":
        return "espèces"
      case "hollidayCheck":
        return "chèque vacances"
      case "yes":
        return "Inscrit·e"
      case "no":
        return "Pré‑inscrit·e"
      case "waiting":
        return "En attente de validation"
      case "mother":
        return "Mère"
      case "father":
        return "Père"
      case "other":
        return "Autre"
    }
  } catch (error) {
    throw new BError("$utils/TRANSLATE => translate()", error)
  }
}


