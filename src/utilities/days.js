/* export const DAYS = [
  {
    weekday: "lundi",
    startTime: "17h",
    endTime: "18h30",
    ageGroupIndex: 1,
    nbMaxOfStudents: 10,
    teacher: "Jules",
  },
  {
    weekday: "mardi",
    startTime: "17h",
    endTime: "18h30",
    ageGroupIndex: 2,
    nbMaxOfStudents: 12,
    teacher: "Jules",
  },
  {
    weekday: "mardi",
    startTime: "18h30",
    endTime: "20h",
    ageGroupIndex: 3,
    nbMaxOfStudents: 12,
    teacher: "Jules",
  },
  {
    weekday: "mardi",
    startTime: "20h",
    endTime: "22h",
    ageGroupIndex: 4,
    nbMaxOfStudents: 14,
    teacher: "Jules",
  },
  {
    weekday: "mercredi",
    startTime: "15h",
    endTime: "16h",
    ageGroupIndex: 0,
    nbMaxOfStudents: 9,
    teacher: "Jelena",
  },
  {
    weekday: "mercredi",
    startTime: "16h",
    endTime: "17h30",
    ageGroupIndex: 1,
    nbMaxOfStudents: 10,
    teacher: "Jelena",
  },
  {
    weekday: "Jeudi",
    startTime: "17h",
    endTime: "18h30",
    ageGroupIndex: 1,
    nbMaxOfStudents: 10,
    teacher: "Jelena",
  },
  {
    weekday: "Jeudi",
    startTime: "18h30",
    endTime: "20h",
    ageGroupIndex: 2,
    nbMaxOfStudents: 12,
    teacher: "Jelena",
  },
] */

import { getAgeGroupName } from "$utils/ageGroups"
import { BError } from "berror"

export const getDayName = (day, withEndTime = false) => {
  try {
    if (!day) throw "No day"
    let weekday = day.weekday
    let endTimeString = withEndTime ? `‑${day.endTime}` : ""
    return `${weekday} ${day.startTime}` + endTimeString
  } catch (error) {
    throw new BError("function getDayName not working", error).log()
  }
}

export const getDayUrl = (day) => {
  try {
    if (!day) throw "No day"
    return `${day.weekday}-${day.startTime}`
  } catch (error) {
    throw new BError("function getDayUrl not working", error).log()
  }
}

export const getWarningMessage = (minYear) => {
  try {
    if (!minYear) throw "No minYear"
    let currentYear = dayjs().year()
    const minAge = currentYear - minYear
    if (minAge >= 18) return "Ce créneaux est reservé aux adultes."
    return `Ce créneau est reservé aux enfants nés en ${
      currentYear - minAge
    } ou avant.`
  } catch (error) {
    throw new BError("function getWarningMessage not working", error).log()
  }
}

export const getMinYear = (day, ageGroups) => {
  try {
    if (!day) throw "No day"
    if (!ageGroups) throw "No ageGroups"
    let currentYear = dayjs().year()
    const ageGroup = ageGroups[day.ageGroupIndex]
    const minAge = ageGroup.min
    return currentYear - minAge
  } catch (error) {
    throw new BError("function days/getMinYear not working", error).log()
  }
}

export const getDayFromUrl = (url, days) => {
  try {
    if (!url) throw "No url"
    if (!days) throw "No days"
    return days.filter((day) => getDayUrl(day) === url)[0]
  } catch (error) {
    throw new BError("function getDayFromUrl not working", error).log()
  }
}

export const getDayFromName = (name, days) => {
  try {
    if (!name) throw "No name"
    if (!days) throw "No days"
    return days.filter((day) => getDayName(day) === name)[0]
  } catch (error) {
    throw new BError("function getDayFromName not working", error).log()
  }
}

export const isDayForAdults = (day, ageGroups) => {
  try {
    if (!day) throw "No day"
    if (!ageGroups) throw "No ageGroups"
    const ageGroup = ageGroups[day.ageGroupIndex]
    return ageGroup.min === 18
  } catch (error) {
    throw new BError("function isDayForAdults not working", error).log()
  }
}

const getDuration = (day) => {
  try {
    if (!day) throw "No day"
    return timeStringToNumber(day.endTime) - timeStringToNumber(day.startTime)
  } catch (error) {
    throw new BError("function getDuration not working", error).log()
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
    throw new BError("function timeStringToNumber not working", error).log()
  }
}

export const getDayInfo = (day, season, students) => {
  try {
    if (!day) throw "No day"
    if (!season) throw "No season"
    if (!students) throw "No students"
    const subscribedStudents = students.filter(
      (student) => student.seasons[season.name].day == getDayUrl(day)
    )
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
      ages: `${minAge}‑${maxAge} ans`,
      url: getDayUrl(day),
      nbMaxOfStudents: day.nbMaxOfStudents,
      subscribedStudents,
      nbOfSubscibedStudents: subscribedStudents.length,
      spotsLeft: day.nbMaxOfStudents - subscribedStudents.length,
      teacher: day.teacher,
      times: `${day.startTime}‑${day.endTime}`,
      firstDay: season.firstDay,
      lastDay: season.lastDay,
      price: ageGroup.price,
      nbOfSessions: season.nbOfSessions,
      duration: getDuration(day),
    }
  } catch (error) {
    throw new BError("function getDayInfo not working", error).log()
  }
}
