

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
      "id": "_default_inscription",
      "name": "inscription",
      "module": () => import('../src/routes/inscription/_module.svelte'),
      "file": {
        "path": "src/routes/inscription/_module.svelte",
        "dir": "src/routes/inscription",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_inscription_index_md",
          "name": "index",
          "module": () => import('../src/routes/inscription/index.md'),
          "file": {
            "path": "src/routes/inscription/index.md",
            "dir": "src/routes/inscription",
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

import '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'