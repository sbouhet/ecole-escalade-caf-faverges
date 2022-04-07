import { writable } from "svelte/store"
import { subscriptionReset } from "$utils/subscriptionReset"
import { seasons } from "$utils/seasons"

export const currentSeason = writable(null)
export const currentDay = writable(null)
export const subscription = writable(subscriptionReset(seasons().current))
export const ageStatus = writable(null)
export const loggedin = writable(false)
