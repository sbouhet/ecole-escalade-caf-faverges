import { BError } from "berror"
import { getMinYear, getAge } from "$utils/ageGroups"

export const getMinAndMaxDate = (day, season) => {
  const firstDay = dayjs(day.firstDay)
  const ageGroup = season.ageGroups[day.ageGroupIndex]
  let maxDate, minDate

  //If adult
  if (!ageGroup.max) {
    maxDate = firstDay.subtract(18, "year").format("YYYY-MM-DD")
    minDate = null

    //if children
  } else {
    maxDate = `${getMinYear(ageGroup)}-12-31`
    minDate = firstDay.subtract(parseInt(ageGroup.max) + 1, "year").format("YYYY-MM-DD")
  }
  return { maxDate, minDate }
}

export const validateDateOfBirth = (dateOfBirth, day, season) => {
  let tooOld, tooYoung, valid, msg
  const ageGroup = season.ageGroups[day.ageGroupIndex]
  const minYear = getMinYear(ageGroup)
  const firstDay = dayjs(day.firstDay)
  const { maxDate, minDate } = getMinAndMaxDate(day, season)
  const ageOnFirstDay = getAge(dateOfBirth, false, firstDay)

  // How much older than the limit a student is
  // If it's positive, student is too old
  if (minDate) tooOld = dayjs(minDate).diff(dayjs(dateOfBirth)) >= 0

  // How much younger than the limit a student is
  // If it's positive, student is too young
  tooYoung = dayjs(dateOfBirth).diff(dayjs(maxDate)) > 0

  // If student is too young
  if (tooYoung) {
    valid = false
    if (ageGroup.max) {
      msg = `Votre enfant est né après ${minYear}, il est trop jeune pour ce groupe.`
    } else {
      msg = "Il faut être majeur à la date du premier cours pour s'inscrire."
    }
  }
  // If student is too old, display warning
  else if (tooOld) {
    valid = false
    msg = `Votre enfant aura ${ageOnFirstDay} ans au premier cours, il est trop agé pour ce groupe.`
  }
  // If student is right age, display success and update subscription
  else {
    valid = true
    msg = "Date de naissance valide."
  }
  return { valid, msg }
}
