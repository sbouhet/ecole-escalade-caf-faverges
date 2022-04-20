module.exports = (soapUser) => {
  console.log(soapUser)
  const usr = soapUser.verifierUnAdherentReturn
  console.log(usr)
  return {
    exists: usr.existe.$value === 1,
    signupDate: usr.inscription.$value,
    lastName: usr.nom.$value,
    firstName: usr.prenom.$value,
  }
}
