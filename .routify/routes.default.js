

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
      "id": "_default_UNUSED_inscriptions_en_cours_svelte",
      "name": "UNUSED_inscriptions-en-cours",
      "module": () => import('../src/routes/UNUSED_inscriptions-en-cours.svelte'),
      "file": {
        "path": "src/routes/UNUSED_inscriptions-en-cours.svelte",
        "dir": "src/routes",
        "base": "UNUSED_inscriptions-en-cours.svelte",
        "ext": ".svelte",
        "name": "UNUSED_inscriptions-en-cours"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_admin",
      "name": "admin",
      "module": () => import('../src/routes/admin/_module.svelte'),
      "file": {
        "path": "src/routes/admin/_module.svelte",
        "dir": "src/routes/admin",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_admin_allStudents_svelte",
          "name": "allStudents",
          "module": () => import('../src/routes/admin/allStudents.svelte'),
          "file": {
            "path": "src/routes/admin/allStudents.svelte",
            "dir": "src/routes/admin",
            "base": "allStudents.svelte",
            "ext": ".svelte",
            "name": "allStudents"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin_copySeason_svelte",
          "name": "copySeason",
          "module": () => import('../src/routes/admin/copySeason.svelte'),
          "file": {
            "path": "src/routes/admin/copySeason.svelte",
            "dir": "src/routes/admin",
            "base": "copySeason.svelte",
            "ext": ".svelte",
            "name": "copySeason"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin_index_svelte",
          "name": "index",
          "module": () => import('../src/routes/admin/index.svelte'),
          "file": {
            "path": "src/routes/admin/index.svelte",
            "dir": "src/routes/admin",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin_manageAdmins_svelte",
          "name": "manageAdmins",
          "module": () => import('../src/routes/admin/manageAdmins.svelte'),
          "file": {
            "path": "src/routes/admin/manageAdmins.svelte",
            "dir": "src/routes/admin",
            "base": "manageAdmins.svelte",
            "ext": ".svelte",
            "name": "manageAdmins"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_admin_test_svelte",
          "name": "test",
          "module": () => import('../src/routes/admin/test.svelte'),
          "file": {
            "path": "src/routes/admin/test.svelte",
            "dir": "src/routes/admin",
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
          "id": "_default_prive_inscription_svelte",
          "name": "inscription",
          "module": () => import('../src/routes/prive/inscription.svelte'),
          "file": {
            "path": "src/routes/prive/inscription.svelte",
            "dir": "src/routes/prive",
            "base": "inscription.svelte",
            "ext": ".svelte",
            "name": "inscription"
          },
          "children": []
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
              "id": "_default_prive_mon_compte__id__svelte",
              "name": "[id]",
              "module": () => import('../src/routes/prive/mon-compte/[id].svelte'),
              "file": {
                "path": "src/routes/prive/mon-compte/[id].svelte",
                "dir": "src/routes/prive/mon-compte",
                "base": "[id].svelte",
                "ext": ".svelte",
                "name": "[id]"
              },
              "children": []
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