

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
      "id": "_default_admin_md",
      "name": "admin",
      "module": () => import('../src/routes/admin.md'),
      "file": {
        "path": "src/routes/admin.md",
        "dir": "src/routes",
        "base": "admin.md",
        "ext": ".md",
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
      "id": "_default_index_md",
      "name": "index",
      "module": () => import('../src/routes/index.md'),
      "file": {
        "path": "src/routes/index.md",
        "dir": "src/routes",
        "base": "index.md",
        "ext": ".md",
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
          "id": "_default_prive_inscription_md",
          "name": "inscription",
          "module": () => import('../src/routes/prive/inscription.md'),
          "file": {
            "path": "src/routes/prive/inscription.md",
            "dir": "src/routes/prive",
            "base": "inscription.md",
            "ext": ".md",
            "name": "inscription"
          },
          "children": []
        },
        {
          "meta": {},
          "id": "_default_prive_mon_compte_md",
          "name": "mon-compte",
          "module": () => import('../src/routes/prive/mon-compte.md'),
          "file": {
            "path": "src/routes/prive/mon-compte.md",
            "dir": "src/routes/prive",
            "base": "mon-compte.md",
            "ext": ".md",
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