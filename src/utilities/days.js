import { getAgeGroupName } from "$utils/ageGroups"
import { BError } from "berror"
import { printName } from "$utils/printName"

export const getDayName = (day, withEndTime = false) => {
  try {
    if (!day) throw "No day"
    let weekday = day.weekday
    let endTimeString = withEndTime ? `‑${day.endTime}` : ""
    return `${weekday} ${day.startTime}` + endTimeString
  } catch (error) {
    throw new BError("$utils/days => getDayName()", error)
  }
}

export const getDayUrl = (day) => {
  try {
    if (!day) throw "No day"
    return `${day.weekday}-${day.startTime}`
  } catch (error) {
    throw new BError("$utils/days => getDayUrl()", error)
  }
}

/* export const getWarningMessage = (minYear) => {
  try {
    if (!minYear) throw "No minYear"
    let currentYear = dayjs().year()
    const minAge = currentYear - minYear
    if (minAge >= 18) return "Ce créneaux est reservé aux adultes."
    return `Ce créneau est reservé aux enfants nés en ${
      currentYear - minAge
    } ou avant.`
  } catch (error) {
    throw new BError("$utils/days => getWarningMessage()", error)
  }
} */

export const getMinYear = (day, ageGroups) => {
  try {
    if (!day) throw "No day"
    if (!ageGroups) throw "No ageGroups"
    let currentYear = dayjs().year()
    const ageGroup = ageGroups[day.ageGroupIndex]
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError("$utils/days => getMinYear()", error)
  }
}

export const getDayFromUrl = (url, days) => {
  try {
    if (!url) throw "No url"
    if (!days) throw "No days"
    const filtered = days.filter((day) => getDayUrl(day) === url)
    if (filtered.length === 1) return filtered[0]
    if (filtered.length > 1) throw new Error("Too many matches for this url")
    if (filtered.length < 1) throw new Error("No matches for this url")
  } catch (error) {
    throw new BError("$utils/days => getDayFromUrl()", error)
  }
}

export const getDayFromName = (name, days) => {
  try {
    if (!name) throw "No name"
    if (!days) throw "No days"
    return days.filter((day) => getDayName(day) === name)[0]
  } catch (error) {
    throw new BError("$utils/days => getDayFromName()", error)
  }
}

export const isDayForAdults = (day, ageGroups) => {
  try {
    if (!day) throw "No day"
    if (!ageGroups) throw "No ageGroups"
    const ageGroup = ageGroups[day.ageGroupIndex]
    return ageGroup.min === 18
  } catch (error) {
    throw new BError("$utils/days => isDayForAdults()", error)
  }
}

const getDuration = (day) => {
  try {
    if (!day) throw "No day"
    return timeStringToNumber(day.endTime) - timeStringToNumber(day.startTime)
  } catch (error) {
    throw new BError("$utils/days => getDuration()", error)
  }
}

const timeStringToNumber = (timeString) => {
  try {
    if (!timeString) throw "No timestring"
    const hours = parseInt(timeString.split("h")[0])
    let minuteString = timeString.split("h")[1]
    if (minuteString === "") minuteString = "00"
    const minutes = parseInt(minuteString) / 60
    return hours + minutes
  } catch (error) {
    throw new BError("$utils/days => timeStringToNumber()", error)
  }
}

export const getDayInfo = (day, season, students) => {
  try {
    if (!day) throw "No day"
    if (!season) throw "No season"
    if (!students) throw "No students"
    const subscribedStudents = students.filter(
      (student) => student.data().seasons[season.name].day == getDayUrl(day)
    )
    const studentList = subscribedStudents.map((x) => printName(x.data()))
    const ageGroup = season.ageGroups[day.ageGroupIndex]
    const adult = ageGroup.min === 18
    const minYear = getMinYear(day, season.ageGroups)
    const minAge = ageGroup.min
    const maxAge = ageGroup.max
    return {
      name: getDayName(day, false),
      tooltip: adult
        ? "Vous devez être majeur pour vous inscrire"
        : `Année de naissance maximum : ${minYear}`,
      ageGroupName: getAgeGroupName(season.ageGroups[day.ageGroupIndex]),
      minAge,
      minYear,
      maxAge,
      ages: maxAge ? `${minAge}‑${maxAge} ans` : "adultes",
      url: getDayUrl(day),
      nbMaxOfStudents: day.nbMaxOfStudents,
      subscribedStudents,
      nbOfSubscibedStudents: subscribedStudents.length,
      spotsLeft: day.nbMaxOfStudents - subscribedStudents.length,
      teacher: day.teacher,
      times: `${day.startTime}‑${day.endTime}`,
      firstDay: day.firstDay,
      lastDay: day.lastDay,
      price: ageGroup.price,
      nbOfSessions: season.nbOfSessions,
      duration: getDuration(day),
      studentList,
    }
  } catch (error) {
    throw new BError("$utils/days => getDayInfo()", error)
  }
}
