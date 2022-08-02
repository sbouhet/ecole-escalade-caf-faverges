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
      default:
        return english
    }
  } catch (error) {
    throw new BError("$utils/TRANSLATE => translate()", error)
  }
}

export const getHeaderInfo = (header) => {
  try {
    if (!header) throw "No header"
    switch (header) {
      case "dateOfNoRestriction":
        return "Date à laquelle tout le monde peut s'inscrire (pas seulement les anciens)"
      case "deadline":
        return "Date à laquelle les élèves doivent avoir remplit leur dossier (paiment, licence, ceritf) sinon leur place est proposée à la liste d'attente"
      case "declarationLink":
        return "Lien vers l'attestation sur l'honneur qui remplace le certificat medical"
      case "resubscriptionDate":
        return "Date d'ouverture des réinscriptions"
      case "name":
        return "Nom de la saison, il s'affiche sur la page d'inscription"
      case "nbOfSessions":
        return "Nombre de cours pour cette saison. Utilisé pour calculer le prix par cours"
      case "max":
        return "Age maximum"
      case "min":
        return "Age minimum"
      case "price":
        return "Prix pour les cours d'escalade seulement. N'inclus pas la coût de la licence"
      case "ageGroupIndex":
        return "Index du groupe d'age. Voir tableau AgeGroups ci-dessus"
      case "endTime":
        return "Heure de fin du cours"
      case "firstDay":
        return "Date du premier cours"
      case "lastDay":
        return "Date du dernier cours"
      case "nbMaxOfStudents":
        return "Nombre d'élèves maximum pour ce cours"
      case "startTime":
        return "Heure de début du cours"
      case "teacher":
        return "Nom du moniteur"
      case "weekday":
        return "Jour de la semaine"
      default:
        return
    }
  } catch (error) {
    throw new BError("$utils/TRANSLATE => getHeaderInfo()", error)
  }
}


