/* export const days = [
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

export const getDayName = (day) => {
  let weekday = capitalizeFirstLetter(day.weekday)
  return `${weekday} ${day.startTime}`
}

export const getDayUrl = (day) => {
  return `${day.weekday}-${day.startTime}`
}
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
