

export default {
  "meta": {},
  "id": "_default",
  "module": () => import('../src/routes/_module.svelte'),
  "file": {
    "path": "src/routes/_module.svelte",
    "dir": "src/routes",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_changerDeMotDePasse_svelte",
      "name": "changerDeMotDePasse",
      "module": () => import('../src/routes/changerDeMotDePasse.svelte'),
      "file": {
        "path": "src/routes/changerDeMotDePasse.svelte",
        "dir": "src/routes",
        "base": "changerDeMotDePasse.svelte",
        "ext": ".svelte",
        "name": "changerDeMotDePasse"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_countdown_svelte",
      "name": "countdown",
      "module": () => import('../src/routes/countdown.svelte'),
      "file": {
        "path": "src/routes/countdown.svelte",
        "dir": "src/routes",
        "base": "countdown.svelte",
        "ext": ".svelte",
        "name": "countdown"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_creneaux",
      "name": "creneaux",
      "module": false,
      "file": {
        "path": "src/routes/creneaux",
        "dir": "src/routes",
        "base": "creneaux",
        "ext": "",
        "name": "creneaux"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "id": "_default_creneaux__day__svelte",
          "name": "[day]",
          "module": () => import('../src/routes/creneaux/[day].svelte'),
          "file": {
            "path": "src/routes/creneaux/[day].svelte",
            "dir": "src/routes/creneaux",
            "base": "[day].svelte",
            "ext": ".svelte",
            "name": "[day]"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_creneaux_index_svelte",
          "name": "index",
          "module": () => import('../src/routes/creneaux/index.svelte'),
          "file": {
            "path": "src/routes/creneaux/index.svelte",
            "dir": "src/routes/creneaux",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_erreur_svelte",
      "name": "erreur",
      "module": () => import('../src/routes/erreur.svelte'),
      "file": {
        "path": "src/routes/erreur.svelte",
        "dir": "src/routes",
        "base": "erreur.svelte",
        "ext": ".svelte",
        "name": "erreur"
      },
      "children": []
    },
    {
      "meta": {
        "reset": true
      },
      "id": "_default_events",
      "name": "events",
      "module": () => import('../src/routes/events/_module.svelte'),
      "file": {
        "path": "src/routes/events/_module.svelte",
        "dir": "src/routes/events",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "id": "_default_events__eventId_",
          "name": "[eventId]",
          "module": false,
          "file": {
            "path": "src/routes/events/[eventId]",
            "dir": "src/routes/events",
            "base": "[eventId]",
            "ext": "",
            "name": "[eventId]"
          },
          "children": [
            {
              "meta": {
                "dynamic": true
              },
              "id": "_default_events__eventId___categorie_",
              "name": "[categorie]",
              "module": false,
              "file": {
                "path": "src/routes/events/[eventId]/[categorie]",
                "dir": "src/routes/events/[eventId]",
                "base": "[categorie]",
                "ext": "",
                "name": "[categorie]"
              },
              "children": [
                {
                  "meta": {},
                  "id": "_default_events__eventId___categorie__index_svelte",
                  "name": "index",
                  "module": () => import('../src/routes/events/[eventId]/[categorie]/index.svelte'),
                  "file": {
                    "path": "src/routes/events/[eventId]/[categorie]/index.svelte",
                    "dir": "src/routes/events/[eventId]/[categorie]",
                    "base": "index.svelte",
                    "ext": ".svelte",
                    "name": "index"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_events__eventId___categorie__points_svelte",
                  "name": "points",
                  "module": () => import('../src/routes/events/[eventId]/[categorie]/points.svelte'),
                  "file": {
                    "path": "src/routes/events/[eventId]/[categorie]/points.svelte",
                    "dir": "src/routes/events/[eventId]/[categorie]",
                    "base": "points.svelte",
                    "ext": ".svelte",
                    "name": "points"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_events__eventId___categorie__routes_svelte",
                  "name": "routes",
                  "module": () => import('../src/routes/events/[eventId]/[categorie]/routes.svelte'),
                  "file": {
                    "path": "src/routes/events/[eventId]/[categorie]/routes.svelte",
                    "dir": "src/routes/events/[eventId]/[categorie]",
                    "base": "routes.svelte",
                    "ext": ".svelte",
                    "name": "routes"
                  },
                  "children": []
                }
              ]
            },
            {
              "meta": {},
              "id": "_default_events__eventId__index_svelte",
              "name": "index",
              "module": () => import('../src/routes/events/[eventId]/index.svelte'),
              "file": {
                "path": "src/routes/events/[eventId]/index.svelte",
                "dir": "src/routes/events/[eventId]",
                "base": "index.svelte",
                "ext": ".svelte",
                "name": "index"
              },
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_events_index_svelte",
          "name": "index",
          "module": () => import('../src/routes/events/index.svelte'),
          "file": {
            "path": "src/routes/events/index.svelte",
            "dir": "src/routes/events",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_events_OLD_svelte",
      "name": "events_OLD",
      "module": () => import('../src/routes/events_OLD.svelte'),
      "file": {
        "path": "src/routes/events_OLD.svelte",
        "dir": "src/routes",
        "base": "events_OLD.svelte",
        "ext": ".svelte",
        "name": "events_OLD"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_index_svelte",
      "name": "index",
      "module": () => import('../src/routes/index.svelte'),
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_prive",
      "name": "prive",
      "module": () => import('../src/routes/prive/_module.svelte'),
      "file": {
        "path": "src/routes/prive/_module.svelte",
        "dir": "src/routes/prive",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_prive_admin",
          "name": "admin",
          "module": () => import('../src/routes/prive/admin/_module.svelte'),
          "file": {
            "path": "src/routes/prive/admin/_module.svelte",
            "dir": "src/routes/prive/admin",
            "base": "_module.svelte",
            "ext": ".svelte",
            "name": "_module"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_prive_admin_index_svelte",
              "name": "index",
              "module": () => import('../src/routes/prive/admin/index.svelte'),
              "file": {
                "path": "src/routes/prive/admin/index.svelte",
                "dir": "src/routes/prive/admin",
                "base": "index.svelte",
                "ext": ".svelte",
                "name": "index"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_manageAdmins_svelte",
              "name": "manageAdmins",
              "module": () => import('../src/routes/prive/admin/manageAdmins.svelte'),
              "file": {
                "path": "src/routes/prive/admin/manageAdmins.svelte",
                "dir": "src/routes/prive/admin",
                "base": "manageAdmins.svelte",
                "ext": ".svelte",
                "name": "manageAdmins"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_test_svelte",
              "name": "test",
              "module": () => import('../src/routes/prive/admin/test.svelte'),
              "file": {
                "path": "src/routes/prive/admin/test.svelte",
                "dir": "src/routes/prive/admin",
                "base": "test.svelte",
                "ext": ".svelte",
                "name": "test"
              },
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_prive_index_svelte",
          "name": "index",
          "module": () => import('../src/routes/prive/index.svelte'),
          "file": {
            "path": "src/routes/prive/index.svelte",
            "dir": "src/routes/prive",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_prive_inscription",
          "name": "inscription",
          "module": false,
          "file": {
            "path": "src/routes/prive/inscription",
            "dir": "src/routes/prive",
            "base": "inscription",
            "ext": "",
            "name": "inscription"
          },
          "children": [
            {
              "meta": {
                "dynamic": true
              },
              "id": "_default_prive_inscription__dayUrl__svelte",
              "name": "[dayUrl]",
              "module": () => import('../src/routes/prive/inscription/[dayUrl].svelte'),
              "file": {
                "path": "src/routes/prive/inscription/[dayUrl].svelte",
                "dir": "src/routes/prive/inscription",
                "base": "[dayUrl].svelte",
                "ext": ".svelte",
                "name": "[dayUrl]"
              },
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_prive_mod",
          "name": "mod",
          "module": () => import('../src/routes/prive/mod/_module.svelte'),
          "file": {
            "path": "src/routes/prive/mod/_module.svelte",
            "dir": "src/routes/prive/mod",
            "base": "_module.svelte",
            "ext": ".svelte",
            "name": "_module"
          },
          "children": [
            {
              "meta": {
                "dynamic": true
              },
              "id": "_default_prive_mod__id__svelte",
              "name": "[id]",
              "module": () => import('../src/routes/prive/mod/[id].svelte'),
              "file": {
                "path": "src/routes/prive/mod/[id].svelte",
                "dir": "src/routes/prive/mod",
                "base": "[id].svelte",
                "ext": ".svelte",
                "name": "[id]"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_accident_svelte",
              "name": "accident",
              "module": () => import('../src/routes/prive/mod/accident.svelte'),
              "file": {
                "path": "src/routes/prive/mod/accident.svelte",
                "dir": "src/routes/prive/mod",
                "base": "accident.svelte",
                "ext": ".svelte",
                "name": "accident"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_allStudents_svelte",
              "name": "allStudents",
              "module": () => import('../src/routes/prive/mod/allStudents.svelte'),
              "file": {
                "path": "src/routes/prive/mod/allStudents.svelte",
                "dir": "src/routes/prive/mod",
                "base": "allStudents.svelte",
                "ext": ".svelte",
                "name": "allStudents"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_allowStudents_svelte",
              "name": "allowStudents",
              "module": () => import('../src/routes/prive/mod/allowStudents.svelte'),
              "file": {
                "path": "src/routes/prive/mod/allowStudents.svelte",
                "dir": "src/routes/prive/mod",
                "base": "allowStudents.svelte",
                "ext": ".svelte",
                "name": "allowStudents"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_checkMedicalCertificate_svelte",
              "name": "checkMedicalCertificate",
              "module": () => import('../src/routes/prive/mod/checkMedicalCertificate.svelte'),
              "file": {
                "path": "src/routes/prive/mod/checkMedicalCertificate.svelte",
                "dir": "src/routes/prive/mod",
                "base": "checkMedicalCertificate.svelte",
                "ext": ".svelte",
                "name": "checkMedicalCertificate"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_createSeason_svelte",
              "name": "createSeason",
              "module": () => import('../src/routes/prive/mod/createSeason.svelte'),
              "file": {
                "path": "src/routes/prive/mod/createSeason.svelte",
                "dir": "src/routes/prive/mod",
                "base": "createSeason.svelte",
                "ext": ".svelte",
                "name": "createSeason"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_downloadMedicalCertificates_svelte",
              "name": "downloadMedicalCertificates",
              "module": () => import('../src/routes/prive/mod/downloadMedicalCertificates.svelte'),
              "file": {
                "path": "src/routes/prive/mod/downloadMedicalCertificates.svelte",
                "dir": "src/routes/prive/mod",
                "base": "downloadMedicalCertificates.svelte",
                "ext": ".svelte",
                "name": "downloadMedicalCertificates"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_emailHistory_svelte",
              "name": "emailHistory",
              "module": () => import('../src/routes/prive/mod/emailHistory.svelte'),
              "file": {
                "path": "src/routes/prive/mod/emailHistory.svelte",
                "dir": "src/routes/prive/mod",
                "base": "emailHistory.svelte",
                "ext": ".svelte",
                "name": "emailHistory"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_helloAssoAPI_svelte",
              "name": "helloAssoAPI",
              "module": () => import('../src/routes/prive/mod/helloAssoAPI.svelte'),
              "file": {
                "path": "src/routes/prive/mod/helloAssoAPI.svelte",
                "dir": "src/routes/prive/mod",
                "base": "helloAssoAPI.svelte",
                "ext": ".svelte",
                "name": "helloAssoAPI"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_index_svelte",
              "name": "index",
              "module": () => import('../src/routes/prive/mod/index.svelte'),
              "file": {
                "path": "src/routes/prive/mod/index.svelte",
                "dir": "src/routes/prive/mod",
                "base": "index.svelte",
                "ext": ".svelte",
                "name": "index"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_logs_svelte",
              "name": "logs",
              "module": () => import('../src/routes/prive/mod/logs.svelte'),
              "file": {
                "path": "src/routes/prive/mod/logs.svelte",
                "dir": "src/routes/prive/mod",
                "base": "logs.svelte",
                "ext": ".svelte",
                "name": "logs"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_modifyStudent_svelte",
              "name": "modifyStudent",
              "module": () => import('../src/routes/prive/mod/modifyStudent.svelte'),
              "file": {
                "path": "src/routes/prive/mod/modifyStudent.svelte",
                "dir": "src/routes/prive/mod",
                "base": "modifyStudent.svelte",
                "ext": ".svelte",
                "name": "modifyStudent"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_noel",
              "name": "noel",
              "module": false,
              "file": {
                "path": "src/routes/prive/mod/noel",
                "dir": "src/routes/prive/mod",
                "base": "noel",
                "ext": "",
                "name": "noel"
              },
              "children": [
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_addRoute_svelte",
                  "name": "addRoute",
                  "module": () => import('../src/routes/prive/mod/noel/addRoute.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/addRoute.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "addRoute.svelte",
                    "ext": ".svelte",
                    "name": "addRoute"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_addRun_svelte",
                  "name": "addRun",
                  "module": () => import('../src/routes/prive/mod/noel/addRun.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/addRun.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "addRun.svelte",
                    "ext": ".svelte",
                    "name": "addRun"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_components",
                  "name": "components",
                  "module": false,
                  "file": {
                    "path": "src/routes/prive/mod/noel/components",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "components",
                    "ext": "",
                    "name": "components"
                  },
                  "children": [
                    {
                      "meta": {},
                      "id": "_default_prive_mod_noel_components_Canvas_svelte",
                      "name": "Canvas",
                      "module": () => import('../src/routes/prive/mod/noel/components/Canvas.svelte'),
                      "file": {
                        "path": "src/routes/prive/mod/noel/components/Canvas.svelte",
                        "dir": "src/routes/prive/mod/noel/components",
                        "base": "Canvas.svelte",
                        "ext": ".svelte",
                        "name": "Canvas"
                      },
                      "children": []
                    },
                    {
                      "meta": {},
                      "id": "_default_prive_mod_noel_components_Route_svelte",
                      "name": "Route",
                      "module": () => import('../src/routes/prive/mod/noel/components/Route.svelte'),
                      "file": {
                        "path": "src/routes/prive/mod/noel/components/Route.svelte",
                        "dir": "src/routes/prive/mod/noel/components",
                        "base": "Route.svelte",
                        "ext": ".svelte",
                        "name": "Route"
                      },
                      "children": []
                    },
                    {
                      "meta": {},
                      "id": "_default_prive_mod_noel_components_Routes_svelte",
                      "name": "Routes",
                      "module": () => import('../src/routes/prive/mod/noel/components/Routes.svelte'),
                      "file": {
                        "path": "src/routes/prive/mod/noel/components/Routes.svelte",
                        "dir": "src/routes/prive/mod/noel/components",
                        "base": "Routes.svelte",
                        "ext": ".svelte",
                        "name": "Routes"
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_createEvent_svelte",
                  "name": "createEvent",
                  "module": () => import('../src/routes/prive/mod/noel/createEvent.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/createEvent.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "createEvent.svelte",
                    "ext": ".svelte",
                    "name": "createEvent"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_createGym_svelte",
                  "name": "createGym",
                  "module": () => import('../src/routes/prive/mod/noel/createGym.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/createGym.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "createGym.svelte",
                    "ext": ".svelte",
                    "name": "createGym"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_deleteRun_svelte",
                  "name": "deleteRun",
                  "module": () => import('../src/routes/prive/mod/noel/deleteRun.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/deleteRun.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "deleteRun.svelte",
                    "ext": ".svelte",
                    "name": "deleteRun"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_editEventPax_svelte",
                  "name": "editEventPax",
                  "module": () => import('../src/routes/prive/mod/noel/editEventPax.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/editEventPax.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "editEventPax.svelte",
                    "ext": ".svelte",
                    "name": "editEventPax"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_editEventRoutes_svelte",
                  "name": "editEventRoutes",
                  "module": () => import('../src/routes/prive/mod/noel/editEventRoutes.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/editEventRoutes.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "editEventRoutes.svelte",
                    "ext": ".svelte",
                    "name": "editEventRoutes"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_event_svelte",
                  "name": "event",
                  "module": () => import('../src/routes/prive/mod/noel/event.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/event.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "event.svelte",
                    "ext": ".svelte",
                    "name": "event"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_events_svelte",
                  "name": "events",
                  "module": () => import('../src/routes/prive/mod/noel/events.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/events.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "events.svelte",
                    "ext": ".svelte",
                    "name": "events"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_index_svelte",
                  "name": "index",
                  "module": () => import('../src/routes/prive/mod/noel/index.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/index.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "index.svelte",
                    "ext": ".svelte",
                    "name": "index"
                  },
                  "children": []
                },
                {
                  "meta": {},
                  "id": "_default_prive_mod_noel_routes_svelte",
                  "name": "routes",
                  "module": () => import('../src/routes/prive/mod/noel/routes.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/routes.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "routes.svelte",
                    "ext": ".svelte",
                    "name": "routes"
                  },
                  "children": []
                },
                {
                  "meta": {
                    "reset": true
                  },
                  "id": "_default_prive_mod_noel_scores_svelte",
                  "name": "scores",
                  "module": () => import('../src/routes/prive/mod/noel/scores.svelte'),
                  "file": {
                    "path": "src/routes/prive/mod/noel/scores.svelte",
                    "dir": "src/routes/prive/mod/noel",
                    "base": "scores.svelte",
                    "ext": ".svelte",
                    "name": "scores"
                  },
                  "children": []
                }
              ]
            },
            {
              "meta": {},
              "id": "_default_prive_mod_searchStudent_svelte",
              "name": "searchStudent",
              "module": () => import('../src/routes/prive/mod/searchStudent.svelte'),
              "file": {
                "path": "src/routes/prive/mod/searchStudent.svelte",
                "dir": "src/routes/prive/mod",
                "base": "searchStudent.svelte",
                "ext": ".svelte",
                "name": "searchStudent"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_sendEmail_svelte",
              "name": "sendEmail",
              "module": () => import('../src/routes/prive/mod/sendEmail.svelte'),
              "file": {
                "path": "src/routes/prive/mod/sendEmail.svelte",
                "dir": "src/routes/prive/mod",
                "base": "sendEmail.svelte",
                "ext": ".svelte",
                "name": "sendEmail"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_mod_waitlist_svelte",
              "name": "waitlist",
              "module": () => import('../src/routes/prive/mod/waitlist.svelte'),
              "file": {
                "path": "src/routes/prive/mod/waitlist.svelte",
                "dir": "src/routes/prive/mod",
                "base": "waitlist.svelte",
                "ext": ".svelte",
                "name": "waitlist"
              },
              "children": []
            }
          ]
        },
        {
          "meta": {},
          "id": "_default_prive_mon_compte",
          "name": "mon-compte",
          "module": false,
          "file": {
            "path": "src/routes/prive/mon-compte",
            "dir": "src/routes/prive",
            "base": "mon-compte",
            "ext": "",
            "name": "mon-compte"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_prive_mon_compte_TMP_contact_md",
              "name": "TMP_contact",
              "module": () => import('../src/routes/prive/mon-compte/TMP_contact.md'),
              "file": {
                "path": "src/routes/prive/mon-compte/TMP_contact.md",
                "dir": "src/routes/prive/mon-compte",
                "base": "TMP_contact.md",
                "ext": ".md",
                "name": "TMP_contact"
              },
              "children": []
            },
            {
              "meta": {
                "dynamic": true
              },
              "id": "_default_prive_mon_compte__id_",
              "name": "[id]",
              "module": false,
              "file": {
                "path": "src/routes/prive/mon-compte/[id]",
                "dir": "src/routes/prive/mon-compte",
                "base": "[id]",
                "ext": "",
                "name": "[id]"
              },
              "children": [
                {
                  "meta": {},
                  "id": "_default_prive_mon_compte__id__index_svelte",
                  "name": "index",
                  "module": () => import('../src/routes/prive/mon-compte/[id]/index.svelte'),
                  "file": {
                    "path": "src/routes/prive/mon-compte/[id]/index.svelte",
                    "dir": "src/routes/prive/mon-compte/[id]",
                    "base": "index.svelte",
                    "ext": ".svelte",
                    "name": "index"
                  },
                  "children": []
                }
              ]
            },
            {
              "meta": {},
              "id": "_default_prive_mon_compte_index_svelte",
              "name": "index",
              "module": () => import('../src/routes/prive/mon-compte/index.svelte'),
              "file": {
                "path": "src/routes/prive/mon-compte/index.svelte",
                "dir": "src/routes/prive/mon-compte",
                "base": "index.svelte",
                "ext": ".svelte",
                "name": "index"
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

import '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'