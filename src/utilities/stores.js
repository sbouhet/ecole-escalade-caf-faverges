import { writable } from "svelte/store"
export const currentUser = writable(null)
export const loggedin = writable(false)
export const verified = writable(false)
export const admin = writable(false)
