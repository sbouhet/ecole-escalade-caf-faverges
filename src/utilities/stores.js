import { writable } from "svelte/store"
import { subscriptionReset } from "$utils/subscriptionReset"

export const currentSeason = writable(null)
export const currentDay = writable(null)
export const subscription = writable(subscriptionReset("reset"))
export const ageStatus = writable(null)
export const loggedin = writable(false)
export const admin = writable(false)
export const error = writable(null)
export const fatal = writable(false)
export const students = writable([])
export const subscriptionStatus = writable(null)
