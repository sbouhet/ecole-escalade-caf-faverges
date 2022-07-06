module.exports = (string) => {
  try {
    if (!string) throw "No string"
    return string.charAt(0).toUpperCase() + string.slice(1)
  } catch (error) {
    throw error
  }
}

