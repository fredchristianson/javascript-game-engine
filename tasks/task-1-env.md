This task is to create a module that loads environment JSON.  
Details of the module are in browser/modules/env.js.
An example of it's use are in browser/app/index.html.

The basics of this module is to collect environment variables from

- url
- env.json (/browser/env.json - kept in github)
- env-local.json (not in github - override env.json for dev)
- games-specific env.json
