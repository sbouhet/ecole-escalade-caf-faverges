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
