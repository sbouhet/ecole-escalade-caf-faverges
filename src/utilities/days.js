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

import { seasons } from "$utils/seasons"
import { capitalize } from "$utils/capitalize"
import { getAgeGroupName } from "$utils/ageGroups"

export const getDayName = (day, withEndTime = false) => {
  //console.log(`Trying to read name from ${day}`)
  if (!day) return undefined
  let weekday = day.weekday
  //let weekday = capitalize(day.weekday)
  let endTimeString = withEndTime ? `‑${day.endTime}` : ""
  return `${weekday} ${day.startTime}` + endTimeString
}

export const getDayUrl = (day) => {
  return `${day.weekday}-${day.startTime}`
}

export const getWarningMessage = (minYear) => {
  let currentYear = dayjs().year()
  const minAge = currentYear - minYear
  if (minAge >= 18) return "Ce créneaux est reservé aux adultes."
  return `Ce créneau est reservé aux enfants nés en ${
    currentYear - minAge
  } ou avant.`
}

export const getMinYear = (day, ageGroups) => {
  let currentYear = dayjs().year()
  const ageGroup = ageGroups[day.ageGroupIndex]
  const minAge = ageGroup.min
  return currentYear - minAge
}

export const getDayFromUrl = (url, days) => {
  return days.filter((day) => getDayUrl(day) === url)[0]
}

export const getDayFromName = (name, days) => {
  return days.filter((day) => getDayName(day) === name)[0]
}

export const isDayForAdults = (day, ageGroups) => {
  if (!day) throw "No day to check"
  const ageGroup = ageGroups[day.ageGroupIndex]
  return ageGroup.min === 18
}

const getDuration = (day) => {
  return timeStringToNumber(day.endTime) - timeStringToNumber(day.startTime)
}

const timeStringToNumber = (timeString) => {
  const hours = parseInt(timeString.split("h")[0])
  let minuteString = timeString.split("h")[1]
  if (minuteString === "") minuteString = "00"
  const minutes = parseInt(minuteString) / 60
  return hours + minutes
}

export const getDayInfo = (day, season, students) => {
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
}
