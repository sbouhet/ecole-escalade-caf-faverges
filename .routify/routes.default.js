

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
              "meta": {
                "dynamic": true
              },
              "id": "_default_prive_admin__id__svelte",
              "name": "[id]",
              "module": () => import('../src/routes/prive/admin/[id].svelte'),
              "file": {
                "path": "src/routes/prive/admin/[id].svelte",
                "dir": "src/routes/prive/admin",
                "base": "[id].svelte",
                "ext": ".svelte",
                "name": "[id]"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_allStudents_svelte",
              "name": "allStudents",
              "module": () => import('../src/routes/prive/admin/allStudents.svelte'),
              "file": {
                "path": "src/routes/prive/admin/allStudents.svelte",
                "dir": "src/routes/prive/admin",
                "base": "allStudents.svelte",
                "ext": ".svelte",
                "name": "allStudents"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_checkMedicalCertificate_svelte",
              "name": "checkMedicalCertificate",
              "module": () => import('../src/routes/prive/admin/checkMedicalCertificate.svelte'),
              "file": {
                "path": "src/routes/prive/admin/checkMedicalCertificate.svelte",
                "dir": "src/routes/prive/admin",
                "base": "checkMedicalCertificate.svelte",
                "ext": ".svelte",
                "name": "checkMedicalCertificate"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_copySeason_svelte",
              "name": "copySeason",
              "module": () => import('../src/routes/prive/admin/copySeason.svelte'),
              "file": {
                "path": "src/routes/prive/admin/copySeason.svelte",
                "dir": "src/routes/prive/admin",
                "base": "copySeason.svelte",
                "ext": ".svelte",
                "name": "copySeason"
              },
              "children": []
            },
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
              "id": "_default_prive_admin_modifyStudent_svelte",
              "name": "modifyStudent",
              "module": () => import('../src/routes/prive/admin/modifyStudent.svelte'),
              "file": {
                "path": "src/routes/prive/admin/modifyStudent.svelte",
                "dir": "src/routes/prive/admin",
                "base": "modifyStudent.svelte",
                "ext": ".svelte",
                "name": "modifyStudent"
              },
              "children": []
            },
            {
              "meta": {},
              "id": "_default_prive_admin_payments_svelte",
              "name": "payments",
              "module": () => import('../src/routes/prive/admin/payments.svelte'),
              "file": {
                "path": "src/routes/prive/admin/payments.svelte",
                "dir": "src/routes/prive/admin",
                "base": "payments.svelte",
                "ext": ".svelte",
                "name": "payments"
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
            },
            {
              "meta": {},
              "id": "_default_prive_admin_test2_svelte",
              "name": "test2",
              "module": () => import('../src/routes/prive/admin/test2.svelte'),
              "file": {
                "path": "src/routes/prive/admin/test2.svelte",
                "dir": "src/routes/prive/admin",
                "base": "test2.svelte",
                "ext": ".svelte",
                "name": "test2"
              },
              "children": []
            }
          ]
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