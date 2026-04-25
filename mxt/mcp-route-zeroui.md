# MCP Route — Zero UI Frontend Framework

## 1. Activation

Activate when the request is about:

- zero-ui frontend page creation or modification
- React component development using Ux/Ex/Ei/Web/Oi APIs
- Form/list configuration (Cab.json, ExForm, ExListComplex, smartForm, smartList)
- Frontend API calls (ajaxGet, ajaxPost, Ex.I.*)
- i18n, ACL, routing, skin, new app scaffolding
- Any `import` from `ux`, `ex`, `ei`, `web`, `oi`, `ui`, `lang`, `skin`, `entity`

Regex: `(?i)\b(zero-ui|zeroui|scaffold-ui|@Ux\.zero|rxEtat|smartForm|smartList|ExForm|ExListComplex|Ex\.I\.|Ux\.ajax|Ux\.acl|Cab\.json|fromPath|PageCard|ExAdmin|OxForm|ai sync|frontend.*zero)\b`

## 2. Mandatory Reading Set

1. **`mxt-zeroui/index.md`** — Routing table to find the right module doc
2. **`mxt-zeroui/architecture.md`** — Three-tier import boundary (MUST read first)
3. **`mxt-zeroui/errors-pitfalls.md`** — Top 10 AI mistakes to avoid
4. Task-specific doc from the routing table

Additional: `frontend-client-integration.md`, `mxt-sync-rules.md`

## 3. Execution Contract

1. Read `mxt-zeroui/index.md` to find the right module doc
2. Read `mxt-zeroui/architecture.md` for the three-tier boundary
3. Never import from internal modules — always use `Ux`, `Ex`, `Ui`, `web`, `ei`, `oi`
4. Follow Container/Component split
5. Use Cab.json-driven configuration for forms and lists
6. Respect the three-tier architecture

## 4. Priority Rule

Beats: generic React/TS rules when zero-ui specific, `frontend-client-integration.md` for page/component creation.
Combines with: `mcp-route-zero-ecotope-handshake.md` for fullstack tasks.

## 5. New App Scaffolding

Full checklist: `mxt-zeroui/new-app-checklist.md`.

## 6. Do Not Do

- Do not import from `zone`, `zi`, `zo`, `zme`, `zmr`, `zs` — use `Ux`
- Do not use axios — native Fetch API only
- Do not create forms in JSX — use Cab.json + ExForm/smartForm
- Do not hardcode menus — backend-driven via `Ex.I.menus()`
- Do not skip i18n — always use `@Ux.zero` with `.cab()` and `Lg()`
- Do not import `Ex` from plugin code — circular dependency
- Do not forget `.to()` at the end of `Ux.rxEtat()` builder

## 7. Reading Order

```text
mxt-zeroui/index.md → mxt-zeroui/architecture.md → task-specific doc → Cab.json → component source → internals (debug only)
```
