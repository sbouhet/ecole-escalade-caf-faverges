import { _getDoc } from "$firestore/basics"
import { seasons } from "$utils/seasons"
import { BError } from "berror"

export const getSeasonFromFirestore = async (name) => {
  try {
    if (!name) throw "No name"
    return await _getDoc("seasons", name)
  } catch (error) {
    //console.error(`Could not find season ${name} in seasons`)
    const e = new BError(
      `Could not find season ${name} in seasons`,
      error
    ).log()
    throw new BError("function getSeasonFromFirestore not working", error)
  }
}

export const getSeason = async (time = "current") => {
  try {
    const name = seasons()[time]
    return await getSeasonFromFirestore(name)
  } catch (error) {
    throw new BError("function getSeason not working", error)
  }
}

//TODO FIX INEVITABLE BUGS
