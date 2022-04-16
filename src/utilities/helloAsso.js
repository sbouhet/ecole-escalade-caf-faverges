import { BError } from "berror"
import { getFunctions, httpsCallable } from "firebase/functions"
import { getApp } from "firebase/app"
import { normalize } from "$utils/normalize"
const functions = getFunctions(getApp())

const getItemsFromHelloAsso = httpsCallable(functions, "getItemsFromHelloAsso")

export const getUsersFromHelloAsso = async (slug) => {
  const response = await getItemsFromHelloAsso({ slug })
  const items = response.data
  const users = items.map((item) => {
    let firstName = normalize(item.user.firstName)
    let lastName = normalize(item.user.lastName)
    return `${firstName}_${lastName}`
  })
  return users
}

export const isUserInHelloAsso = async (firstName, lastName, slug) => {
  try {
    if (!firstName) throw "No first name"
    if (!lastName) throw "No last name"
    const normalized = `${normalize(firstName)}_${normalize(lastName)}`
    const users = await getUsersFromHelloAsso(slug)
    return users.includes(normalized)
  } catch (error) {
    throw new BError("Error in isUserInHelloAsso function", error)
  }
}
