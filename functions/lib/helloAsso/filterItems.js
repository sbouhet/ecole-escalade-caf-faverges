const normalize = require("../normalize")
module.exports = (items, firstName, lastName) => {
  if (!items) throw "No items"
  if (!firstName) throw "No firstName"
  if (!lastName) throw "No lastName"
  firstName = normalize(firstName)
  lastName = normalize(lastName)

  const filtered = items.filter(
    (item) =>
      normalize(item.user.firstName) === firstName &&
      normalize(item.user.lastName) === lastName
  )
  return filtered
}
