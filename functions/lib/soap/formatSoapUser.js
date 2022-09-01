module.exports = (soapUser) => {
  try {
    //const usr = soapUser.verifierUnAdherentReturn
    const usr = soapUser.return
    //console.log('TEST TEST TEST');
    //console.log(JSON.stringify(usr))
    return {
      exists: usr.existe.$value === 1,
      signupDate: usr.inscription.$value,
      lastName: usr.nom.$value,
      firstName: usr.prenom.$value,
    }
  } catch (error) {
    console.error("Error formating soap user")
    console.error(error);
  }
}
