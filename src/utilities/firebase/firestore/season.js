import { _getDoc } from "$firestore/basics"
import { seasons } from "$utils/seasons"
import { BError } from "berror"

export const getSeasonFromFirestore = async (name) => {
  try {
    if (!name) throw "No name"
    return await _getDoc("seasons", name)
  } catch (error) {
    console.error(`Could not find season ${name} in seasons`)
    throw new BError("function getSeasonFromFirestore not working", error).log()
  }
}

export const getSeason = async (time = "current") => {
  try {
    const name = seasons()[time]
    return await getSeasonFromFirestore(name)
  } catch (error) {
    throw new BError("function getSeason not working", error).log()
  }
}

//TODO FIX INEVITABLE BUGS
