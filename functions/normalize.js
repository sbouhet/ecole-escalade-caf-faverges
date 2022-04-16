export const normalize = (string) => {
  try {
    if (!string) throw "No string"
    return string
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase()
  } catch (error) {
    throw error
  }
}
