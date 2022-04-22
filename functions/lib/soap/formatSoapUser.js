module.exports = (soapUser) => {
  const usr = soapUser.verifierUnAdherentReturn
  return {
    exists: usr.existe.$value === 1,
    signupDate: usr.inscription.$value,
    lastName: usr.nom.$value,
    firstName: usr.prenom.$value,
  }
}
