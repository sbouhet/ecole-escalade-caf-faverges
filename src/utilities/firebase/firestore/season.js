import { _getDoc } from "$firestore/basics"
import { seasons } from "$utils/seasons"

export const getSeasonFromFirestore = async (name) => {
  if (!name) throw "No name"
  try {
    return await _getDoc("seasons", name)
  } catch (error) {
    console.error(`Could not find season ${name} in seasons`)
    throw error
  }
}

export const getSeason = async (time = "current") => {
  try {
    const name = seasons()[time]
    return await getSeason(name)
  } catch (error) {
    throw error
  }
}

//TODO FIX INEVITABLE BUGS
