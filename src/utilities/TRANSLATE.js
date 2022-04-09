export const translateRole = (english) => {
  switch (english) {
    case "mother":
      return "Mère"
    case "father":
      return "Père"
    case "other":
      return "Autre"
    default:
      console.error("No english to translate")
      return ""
  }
}

export const translateStatus = (english) => {
  switch (english) {
    case "yes":
      return "Inscrit(e)"
    case "No":
      return "Pas inscrit(e)"
    case "waiting":
      return "Pré‑inscrit(e)"
    default:
      console.error("No english to translate")
      return ""
  }
}
