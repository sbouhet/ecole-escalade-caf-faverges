

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
      "id": "_default_admin_svelte",
      "name": "admin",
      "module": () => import('../src/routes/admin.svelte'),
      "file": {
        "path": "src/routes/admin.svelte",
        "dir": "src/routes",
        "base": "admin.svelte",
        "ext": ".svelte",
        "name": "admin"
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
          "id": "_default_creneaux__day__md",
          "name": "[day]",
          "module": () => import('../src/routes/creneaux/[day].md'),
          "file": {
            "path": "src/routes/creneaux/[day].md",
            "dir": "src/routes/creneaux",
            "base": "[day].md",
            "ext": ".md",
            "name": "[day]"
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
      "id": "_default_inscriptions_en_cours_svelte",
      "name": "inscriptions-en-cours",
      "module": () => import('../src/routes/inscriptions-en-cours.svelte'),
      "file": {
        "path": "src/routes/inscriptions-en-cours.svelte",
        "dir": "src/routes",
        "base": "inscriptions-en-cours.svelte",
        "ext": ".svelte",
        "name": "inscriptions-en-cours"
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
          "id": "_default_prive_mon_compte_svelte",
          "name": "mon-compte",
          "module": () => import('../src/routes/prive/mon-compte.svelte'),
          "file": {
            "path": "src/routes/prive/mon-compte.svelte",
            "dir": "src/routes/prive",
            "base": "mon-compte.svelte",
            "ext": ".svelte",
            "name": "mon-compte"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_test_svelte",
      "name": "test",
      "module": () => import('../src/routes/test.svelte'),
      "file": {
        "path": "src/routes/test.svelte",
        "dir": "src/routes",
        "base": "test.svelte",
        "ext": ".svelte",
        "name": "test"
      },
      "children": []
    }
  ]
}

import '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'