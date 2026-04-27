# Zero UI — Module Route Index

> Entry point. Source repo: `$MXT_ZERO/zero-ui/`

## Activation

Load when the task targets zero-ui frontend development, page creation, form/list configuration, component usage, or any React code importing from `ux`, `ex`, `ei`, `web`, `oi`, `ui`, `lang`, `skin`, `entity`.

## Route Table

| Task touches... | Read first | Then |
|---|---|---|
| Import boundary / alias map | `architecture.md` | task-specific doc |
| Framework module dependency / reverse imports / `zero.module.dependency.js` | `module-dependency.md` | `architecture.md` |
| `Ux.ajax*` / `Ux.micro*` | `ux-ajax.md` | `ux-callback.md` |
| `Ux.message*` / `Ux.ajax2*` / `Ux.ajaxEager` | `ux-callback.md` | — |
| `Ux.async*` / `Ux.callback` / `Ux.responser` | `ux-async.md` | — |
| `Ux.sockOn` / `Ux.notify*` | `ux-websocket.md` | — |
| `Ux.is*` (type checks) | `ux-type.md` | — |
| `Ux.clone` / `Ux.assign` / `Ux.it*` (iterators) | `ux-data.md` | — |
| `Ux.value*` / `Ux.to*` (converters) | `ux-value.md` | — |
| `Ux.amb*` / `Ux.yoHistory` | `ux-ambient.md` | — |
| `Ux.element*` | `ux-element.md` | — |
| `Ux.dg*` / `Ux.rxDatum` / `Ux.rxAssist` | `ux-debug.md` | — |
| `Ux.toRoute` / `Ux.isRoute` / `Ux.toLogout` | `ux-nav.md` | — |
| `Ux.form*` / `Ux.valueRequest` / `Ux.v4*` | `ux-form.md` | `config-driven.md` |
| `Ux.acl*` / `Ux.digit*` / `Ux.encrypt*` / `Ux.decrypt*` | `ux-acl.md` | `auth-acl.md` |
| `Ux.format*` / `Ux.html*` | `ux-format.md` | — |
| `Ux.math*` / `Ux.sorter*` / `Ux.random*` | `ux-math.md` | — |
| `Ux.store*` / `Ux.write*` / `Ux.dataIn` / `Ux.dataOut` | `ux-store.md` | `redux-state.md` |
| `Ux.tree*` / `Ux.toTree*` | `ux-tree.md` | — |
| `Ux.plugin*` | `ux-plugin.md` | — |
| `Ux.toForm` / `Ux.toFormUi` / `Ux.itField` / `Ux.valueExpr` | `ux-connect.md` | `ux-plugin.md` |
| `Ux.connectId` / `Ux.connectItem` / `Ux.dataIo` | `ux-connect.md` | — |
| `Ux.writeLinker` / `Ux.writeImpact` | `ux-connect.md` | `ux-store.md` |
| `Ux.xt*` (xweb helpers) | `ux-xweb.md` | — |
| `Ux.dnd*` / `Ux.rx*Batch` / `Ux.sex*` / `Ux.g6*` / `Ux.g2*` | `ux-dnd-batch.md` | — |
| `Ex.I.*` (business API) | `ex-api.md` | `ex-channel.md` |
| `Ex.yi*` / `Ex.yo*` / `Ex.yl*` / `Ex.yu*` / `Ex.xui*` | `ex-channel.md` | — |
| `Ex.et*` / `Ex.rxChannel` / `Ex.acCriteria` | `ex-event.md` | — |
| `ExForm` / `ExListComplex` / `ExAdmin` / `ExLogin*` | `ei-form-list.md` | `ei-admin.md` |
| `ExArbor` / `ExCategory` / `ExTabular` / `ExRecord` | `ei-data.md` | — |
| `ExDeploy` / `ExGraphicEditor` / `ExAuthority` / `ExHistory` | `ei-business.md` | — |
| `TxPortal` / `TxPage` / `TxQRun` / `TxQDone` | `ei-workflow.md` | — |
| `G2Bar` / `G2Pie` / `FBookView` / `DxAdmin` | `ei-chart-finance.md` | — |
| `OxForm` / `OxCard` / `OxAdmin` | `oi-components.md` | `ex-api.md` |
| `PageCard` / `DialogButton` / `FileUpload` | `web-layout.md` | `web-form.md` |
| `aiInput` / `aiSelect` / `aiDatePicker` | `web-render.md` | `ux-form.md` |
| `Ui.smartForm` / `Ui.smartList` | `ui-toolkit.md` | `ux-form.md` |
| `Dsl.*` / `Ux.rxEtat` / `@Ux.zero` | `entity-dsl.md` | — |
| `Lg()` / `fromPath` / `cab/` resources | `i18n.md` | — |
| `Sk.mix` / `Z_CSS_*` | `skin-styling.md` | — |
| URL convention / Container-Component split | `routing.md` | `architecture.md` |
| Store shape / epics / combiner | `redux-state.md` | `ux-store.md` |
| `Z_*` env vars / `.env` | `environment.md` | — |
| Login flow / ACL / token (frontend) | `auth-acl.md` | `ux-acl.md` |
| `_assist` / `_magic` / Cab.json form configs | `config-driven.md` | `ux-form.md` |
| `zero/` `zion/` `zodiac/` `zone/` (debug only) | `internal-modules.md` | `module-dependency.md` |
| `ai sync` / new app creation | `new-app-checklist.md` | `architecture.md` |
| Error codes / top 10 AI mistakes | `errors-pitfalls.md` | — |

## New Session Reading Order

1. `architecture.md` — three-tier boundary + alias map
2. `errors-pitfalls.md` — top 10 mistakes to avoid
3. `module-dependency.md` — framework module order + reverse dependency rules
4. Task-specific doc from table above
