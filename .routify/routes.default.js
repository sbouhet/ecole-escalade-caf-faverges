

export default {
  "meta": {},
  "id": "_default",
  "file": {
    "path": "src/routes",
    "dir": "src",
    "base": "routes",
    "ext": "",
    "name": "routes"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
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
          "id": "_default_prive_inscriptionlol",
          "name": "inscriptionlol",
          "module": false,
          "file": {
            "path": "src/routes/prive/inscriptionlol",
            "dir": "src/routes/prive",
            "base": "inscriptionlol",
            "ext": "",
            "name": "inscriptionlol"
          },
          "children": [
            {
              "meta": {},
              "id": "_default_prive_inscriptionlol_index_md",
              "name": "index",
              "module": () => import('../src/routes/prive/inscriptionlol/index.md'),
              "file": {
                "path": "src/routes/prive/inscriptionlol/index.md",
                "dir": "src/routes/prive/inscriptionlol",
                "base": "index.md",
                "ext": ".md",
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