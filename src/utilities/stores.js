import { writable } from "svelte/store"
import { subscriptionReset } from "$utils/subscriptionReset"

export const currentSeason = writable(null)
export const currentDay = writable(null)
export const subscription = writable(null)
export const ageStatus = writable(null)
export const loggedin = writable(false)
