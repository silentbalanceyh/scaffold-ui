# Ex — Business API (Ex.I)

> Source: `src/extension/library/interface.ajax.js`
> Import: `import Ex from 'ex';`

## Ex.I — Core Business Methods

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `Ex.I.application()` | GET | `/api/app` | Secure app config |
| `Ex.I.app(name)` | GET | `/api/name/:name` | Public app info |
| `Ex.I.attributes(appId)` | GET | `/api/app/:appId/attrs` | App attributes |
| `Ex.I.inited()` | GET | `/api/app` + `/api/menus` | Post-login initialization |
| `Ex.I.isInit()` | GET | `/api/app` | Check init status |
| `Ex.I.menus()` | GET | `/api/menus` | Menu tree |
| `Ex.I.module(appId)` | GET | `/api/app/:appId/module` | Module config |

## Ex.I — Auth

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `Ex.I.login(params)` | POST | `/oauth/login` | Login |
| `Ex.I.authorize(params)` | POST | `/oauth/authorize` | OAuth2 authorize |
| `Ex.I.token(params)` | POST | `/oauth/token` | Token exchange |
| `Ex.I.logout()` | POST | `/api/logout` | Logout |

## Ex.I — UI Config

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `Ex.I.form(code)` | GET | `/api/ui/form/:code` | Form metadata |
| `Ex.I.forms(appId)` | GET | `/api/app/:appId/forms` | All forms |
| `Ex.I.lists(appId)` | GET | `/api/app/:appId/lists` | All list configs |
| `Ex.I.action(code)` | GET | `/api/ui/action/:code` | Action config |
| `Ex.I.tabular(sigma)` | GET | `/api/ui/tabular` | Tabular/dict data |
| `Ex.I.category(sigma)` | GET | `/api/ui/category` | Category tree |
| `Ex.I.forest(sigma)` | GET | `/api/ui/forest` | Forest tree |

## Ex.I — User & Data

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `Ex.I.user()` | GET | `/api/user` | Current user |
| `Ex.I.company()` | GET | `/api/company` | Company info |
| `Ex.I.password(params)` | PUT | `/api/user/password` | Change password |
| `Ex.I.profile(params)` | PUT | `/api/user/profile` | Update profile |
| `Ex.I.page(params)` | POST | `/api/ui/page` | Paginated data |
| `Ex.I.control(params)` | POST | `/api/ui/control` | UI control data |
| `Ex.I.visitor(params)` | POST | `/api/ui/visitor` | Visitor data |
| `Ex.I.ops(params)` | POST | `/api/ui/ops` | Operation permissions |

## Ex.I — Jobs & Custom

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `Ex.I.todo(params)` | POST | `/api/todo/search` | Todo list |
| `Ex.I.mission(params)` | POST | `/api/mission/search` | Mission list |
| `Ex.I.jobs(appId)` | GET | `/api/app/:appId/jobs` | Job list |
| `Ex.I.jobStart(jobId)` | POST | `/api/job/:jobId/start` | Start job |
| `Ex.I.jobStop(jobId)` | POST | `/api/job/:jobId/stop` | Stop job |
| `Ex.I.jobResume(jobId)` | POST | `/api/job/:jobId/resume` | Resume job |
| `Ex.I.relation(params)` | GET | `/api/ui/relation` | Relation data |
| `Ex.I.relationSave(params)` | POST | `/api/ui/relation` | Save relation |
| `Ex.I.relationDelete(params)` | DELETE | `/api/ui/relation` | Delete relation |
| `Ex.I.apis(appId)` | GET | `/api/app/:appId/apis` | API list |
| `Ex.I.uri(path)` | GET | custom | Custom URI GET |
| `Ex.I.jaxGet(uri, params)` | GET | custom | Custom secure GET |
| `Ex.I.jaxPost(uri, params)` | POST | custom | Custom secure POST |
| `Ex.I.jaxPut(uri, params)` | PUT | custom | Custom secure PUT |

## @ox Annotation

`Ex.ox` is the config-driven counterpart of `@Ux.zero`. Ox components read configuration from backend API rather than local Cab.json.

## Dock / Workflow

| Function | Purpose |
|----------|---------|
| `dock(component, config)` | Dock component into layout slot |
| `wf(reference, node)` | Workflow engine connector |
