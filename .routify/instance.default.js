import { Routify, Router } from '@roxi/routify'
import routes from './routes.default.js'

export const router = new Routify({routes})
export { Router, routes, router }


import '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'