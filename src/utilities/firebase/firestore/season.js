import { _getDoc } from "$firestore/basics"
import { seasons } from "$utils/seasons"
import { BError } from "berror"

export const getSeasonFromFirestore = async (name) => {
  try {
    if (!name) throw "No name"
    return await _getDoc("seasons", name)
  } catch (error) {
    throw new BError("$firestore/season => getSeasonFromFirestore()", error, {
      name,
    })
  }
}

export const getSeason = async (time = "current") => {
  try {
    const name = seasons()[time]
    return await getSeasonFromFirestore(name)
  } catch (error) {
    throw new BError("$firestore/season => getSeason()", error)
  }
}

//TODO FIX INEVITABLE BUGS
