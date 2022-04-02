

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
              "meta": {},
              "id": "_default_prive_inscription_index_md",
              "name": "index",
              "module": () => import('../src/routes/prive/inscription/index.md'),
              "file": {
                "path": "src/routes/prive/inscription/index.md",
                "dir": "src/routes/prive/inscription",
                "base": "index.md",
                "ext": ".md",
                "name": "index"
              },
              "children": []
            }
          ]
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
      "id": "_default_test_md",
      "name": "test",
      "module": () => import('../src/routes/test.md'),
      "file": {
        "path": "src/routes/test.md",
        "dir": "src/routes",
        "base": "test.md",
        "ext": ".md",
        "name": "test"
      },
      "children": []
    }
  ]
}

import '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'